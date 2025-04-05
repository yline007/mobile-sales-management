/**
 * 网络请求封装
 */

// 开发环境API地址
const BASE_URL = 'http://localhost:3000';

// 拦截器配置
uni.addInterceptor('request', {
  invoke(options) {
    // 请求前处理：添加基础URL，设置超时，添加token等
    options.url = `${BASE_URL}${options.url}`;
    options.timeout = 10000;
    
    const token = uni.getStorageSync('token');
    if (token) {
      options.header = {
        ...options.header,
        'Authorization': `Bearer ${token}`
      };
    }
    
    return options;
  },
  success(res) {
    // 请求成功处理：检查状态码，统一错误处理
    if (res.statusCode === 401) {
      // 登录过期，清除登录信息并跳转到登录页
      uni.removeStorageSync('token');
      uni.removeStorageSync('userInfo');
      uni.showToast({
        title: '登录状态已过期，请重新登录',
        icon: 'none',
        duration: 2000,
        success: () => {
          setTimeout(() => {
            uni.navigateTo({
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
 * GET请求
 * @param url 请求地址
 * @param data 请求参数
 * @param options 其他选项
 */
export const get = (url: string, data: any = {}, options: any = {}) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      data,
      method: 'GET',
      ...options,
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
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
export const post = (url: string, data: any = {}, options: any = {}) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      data,
      method: 'POST',
      ...options,
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
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
export const put = (url: string, data: any = {}, options: any = {}) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      data,
      method: 'PUT',
      ...options,
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
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
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
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