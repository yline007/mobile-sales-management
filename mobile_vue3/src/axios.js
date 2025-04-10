import axios from "axios";
import { notification, showMessage } from '@/composables/util'
import { getToken } from '@/composables/auth'
import store from "@/store";
import { refreshToken } from '@/api/admin/user'

// 添加调试日志
console.log('env Config:', import.meta.env)

const instance = axios.create({
    // 优先使用运行时配置的baseApi，如果没有则使用环境变量中的配置
    baseURL: window.globalConfig?.baseApi || import.meta.env.VITE_API_BASE_URL,
    timeout: 7000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 是否正在刷新token
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const token = getToken()
    
    // 添加时间戳参数，避免缓存
    config.params = {
        ...config.params,
        _t: new Date().getTime()
    }
    
    // 统一添加请求头 Token
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token
    }
    
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response.data;
}, function (error) {
    // 对响应错误做点什么
    if (error.response) {
        let status = error.response.status
        console.log('错误响应状态码：' + status)
        
        // 认证失败(token过期等情况)
        if (status === 401) {
            const config = error.config
            
            if (!isRefreshing) {
                isRefreshing = true
                
                return refreshToken().then(res => {
                    // 刷新token成功，重新发起请求
                    const token = getToken()
                    config.headers['Authorization'] = 'Bearer ' + token
                    
                    // 执行队列中的请求
                    requests.forEach(cb => cb(token))
                    // 清空队列
                    requests = []
                    
                    // 重新发起当前请求
                    return instance(config)
                }).catch(err => {
                    console.log('刷新token失败', err)
                    // 刷新token失败，需要重新登录
                    store.dispatch('logout').finally(() => {
                        location.reload()
                    })
                    return Promise.reject(error)
                }).finally(() => {
                    isRefreshing = false
                })
            } else {
                // 正在刷新token，将请求加入队列
                return new Promise((resolve) => {
                    requests.push(() => {
                        // token刷新后重新发起请求
                        resolve(instance(config))
                    })
                })
            }
        } else if (status === 403) {
            // 权限不足
            showMessage('您没有权限执行此操作', 'error')
        } else {
            let message = error.response.data?.msg || '请求失败'
            console.log('错误信息：' + message)
            
            // 显示错误消息
            showMessage(message, 'error')
        }
    } else {
        showMessage('网络请求失败，请检查网络连接', 'error')
    }

    return Promise.reject(error);
});

// 暴露
export default instance