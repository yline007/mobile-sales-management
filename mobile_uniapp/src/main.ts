import { createSSRApp } from 'vue'
import App from './App.vue'

// 引入uni-ui组件库
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'

// 路由拦截器，用于检查登录状态
function setupRouterInterceptor() {
  // 保存原始导航方法
  const originNavigateTo = uni.navigateTo;
  const originSwitchTab = uni.switchTab;
  const originReLaunch = uni.reLaunch;
  const originRedirectTo = uni.redirectTo;

  // 需要登录的页面列表
  const authPages = [
    '/pages/record/index',
    '/pages/userinfo/index',
    '/pages/password/index',
    '/pages/index/index',
    '/pages/user/index'
  ];

  // 检查是否已登录
  const isLoggedIn = () => {
    return !!uni.getStorageSync('token');
  };

  // 拦截 navigateTo 方法
  uni.navigateTo = (options) => {
    const url = options.url;
    const pageUrl = url.split('?')[0]; // 去掉参数
    
    // 检查是否需要登录
    if (authPages.some(page => pageUrl.includes(page)) && !isLoggedIn()) {
      console.log(`页面 ${pageUrl} 需要登录，跳转到登录页`);
      
      // 如果需要登录但未登录，跳转到登录页
      return originNavigateTo({
        url: '/pages/login/index',
        success: options.success,
        fail: options.fail,
        complete: options.complete
      });
    }
    
    // 正常跳转
    return originNavigateTo(options);
  };

  // 拦截 redirectTo 方法
  uni.redirectTo = (options) => {
    const url = options.url;
    const pageUrl = url.split('?')[0]; // 去掉参数
    
    // 检查是否需要登录
    if (authPages.some(page => pageUrl.includes(page)) && !isLoggedIn()) {
      console.log(`页面 ${pageUrl} 需要登录，重定向到登录页`);
      
      // 如果需要登录但未登录，重定向到登录页
      return originRedirectTo({
        url: '/pages/login/index',
        success: options.success,
        fail: options.fail,
        complete: options.complete
      });
    }
    
    // 正常重定向
    return originRedirectTo(options);
  };

  // 拦截 reLaunch 方法 
  uni.reLaunch = (options) => {
    const url = options.url;
    const pageUrl = url.split('?')[0]; // 去掉参数
    
    // 检查是否需要登录
    if (authPages.some(page => pageUrl.includes(page)) && !isLoggedIn()) {
      console.log(`页面 ${pageUrl} 需要登录，跳转到登录页`);
      
      // 如果需要登录但未登录，重启到登录页
      return originReLaunch({
        url: '/pages/login/index',
        success: options.success,
        fail: options.fail,
        complete: options.complete
      });
    }
    
    // 正常重启
    return originReLaunch(options);
  };

  // 拦截 switchTab 方法
  uni.switchTab = (options) => {
    const url = options.url;
    const pageUrl = url.split('?')[0]; // 去掉参数
    
    // 检查是否需要登录
    if ((pageUrl.includes('/pages/index/index') || pageUrl.includes('/pages/user/index')) && !isLoggedIn()) {
      console.log(`tabBar页面 ${pageUrl} 需要登录，跳转到登录页`);
      
      // 如果是tabBar页面但未登录，跳转到登录页
      return originRedirectTo({
        url: '/pages/login/index',
        success: options.success,
        fail: options.fail,
        complete: options.complete
      });
    }
    
    // 正常切换
    return originSwitchTab(options);
  };

  console.log('路由拦截器已初始化');
}

export function createApp() {
  const app = createSSRApp(App)
  
  // 全局注册uni-icons组件
  app.component('uni-icons', uniIcons)
  
  // 初始化路由拦截器
  setupRouterInterceptor()
  
  return {
    app
  }
} 