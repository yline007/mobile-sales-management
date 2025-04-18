/**
 * 网络请求封装
 */

import { getApiBaseUrl } from './config';

// 导出基础URL
export const BASE_URL = getApiBaseUrl();

// 拦截器配置
uni.addInterceptor('request', {
  invoke(options) {
    // 请求前处理：添加基础URL，设置超时，添加token等
    if (!options.url.startsWith('http')) {
      options.url = `${getApiBaseUrl()}${options.url}`;
    }
    options.timeout = 10000;
    
    // 设置请求头
    const isFileUpload = options.files || options.filePath;
    options.header = {
      ...options.header,
      // 如果是文件上传，不设置Content-Type，让浏览器自动设置
      ...(isFileUpload ? {} : { 'Content-Type': 'application/json' })
    };
    
    // 添加token认证
    const token = uni.getStorageSync('token');
    if (token) {
      options.header = {
        ...options.header,
        'Authorization': token
      };
    }
    
    return options;
  },
  success(res) {
    // 请求成功处理：检查状态码，统一错误处理
    if (res.statusCode === 401 || (res.data && res.data.code === 401)) {
      // 登录过期，清除登录信息并跳转到登录页
      uni.removeStorageSync('token');
      uni.removeStorageSync('userInfo');
      uni.showToast({
        title: '登录状态已过期，请重新登录',
        icon: 'none',
        duration: 2000,
        success: () => {
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/login/index'
            });
          }, 1000);
        }
      });
      return false;
    }
    
    return res;
  },
  fail(err) {
    // 请求失败处理
    uni.showToast({
      title: '网络请求失败，请检查网络连接',
      icon: 'none'
    });
    return err;
  }
});

/**
 * 通用响应类型
 */
export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

/**
 * GET请求
 * @param url 请求地址
 * @param data 请求参数
 * @param options 其他选项
 */
export const get = <T>(url: string, data: any = {}, options: any = {}): Promise<T> => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${getApiBaseUrl()}${url}`,
      data,
      method: 'GET',
      ...options,
      success: (res: UniApp.RequestSuccessCallbackResult) => {
        resolve(res.data as T);
      },
      fail: (err: UniApp.GeneralCallbackResult) => {
        reject(err);
      }
    });
  });
};

/**
 * POST请求
 * @param url 请求地址
 * @param data 请求参数
 * @param options 其他选项
 */
export const post = <T>(url: string, data: any = {}, options: any = {}): Promise<T> => {
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      data,
      method: 'POST',
      ...options,
      success: (res: UniApp.RequestSuccessCallbackResult) => {
        resolve(res.data as T);
      },
      fail: (err: UniApp.GeneralCallbackResult) => {
        reject(err);
      }
    });
  });
};

/**
 * PUT请求
 * @param url 请求地址
 * @param data 请求参数
 * @param options 其他选项
 */
export const put = <T>(url: string, data: any = {}, options: any = {}): Promise<T> => {
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      data,
      method: 'PUT',
      ...options,
      success: (res: UniApp.RequestSuccessCallbackResult) => {
        resolve(res.data as T);
      },
      fail: (err: UniApp.GeneralCallbackResult) => {
        reject(err);
      }
    });
  });
};

/**
 * DELETE请求
 * @param url 请求地址
 * @param data 请求参数
 * @param options 其他选项
 */
export const del = (url: string, data: any = {}, options: any = {}) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      data,
      method: 'DELETE',
      ...options,
      success: (res: UniApp.RequestSuccessCallbackResult) => {
        resolve(res.data);
      },
      fail: (err: UniApp.GeneralCallbackResult) => {
        reject(err);
      }
    });
  });
};

export default {
  get,
  post,
  put,
  del
}; 