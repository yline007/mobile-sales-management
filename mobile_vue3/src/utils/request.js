import axios from 'axios'

// 创建axios实例
const service = axios.create({
  // 优先使用运行时配置的baseApi，如果没有则使用环境变量中的配置
  baseURL: window.globalConfig.baseApi || import.meta.env.VITE_APP_BASE_API,
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 如果运行时配置了baseApi，则使用运行时配置
    if (window.globalConfig.baseApi) {
      config.baseURL = window.globalConfig.baseApi
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    return res
  },
  error => {
    console.log('err' + error)
    return Promise.reject(error)
  }
)

export default service 