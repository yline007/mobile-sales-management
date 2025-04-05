/**
 * 认证相关工具函数
 */

// Token的存储键名
const TOKEN_KEY = 'token';
// 用户信息的存储键名
const USER_INFO_KEY = 'userInfo';

/**
 * 设置用户Token
 * @param token Token字符串
 */
export const setToken = (token: string) => {
  uni.setStorageSync(TOKEN_KEY, token);
};

/**
 * 获取用户Token
 * @returns Token字符串或空字符串
 */
export const getToken = (): string => {
  return uni.getStorageSync(TOKEN_KEY) || '';
};

/**
 * 移除用户Token
 */
export const removeToken = () => {
  uni.removeStorageSync(TOKEN_KEY);
};

/**
 * 设置用户信息
 * @param userInfo 用户信息对象
 */
export const setUserInfo = (userInfo: any) => {
  uni.setStorageSync(USER_INFO_KEY, JSON.stringify(userInfo));
};

/**
 * 获取用户信息
 * @returns 用户信息对象或null
 */
export const getUserInfo = () => {
  const userInfoStr = uni.getStorageSync(USER_INFO_KEY);
  if (userInfoStr) {
    try {
      return JSON.parse(userInfoStr);
    } catch (e) {
      console.error('解析用户信息失败', e);
      return null;
    }
  }
  return null;
};

/**
 * 移除用户信息
 */
export const removeUserInfo = () => {
  uni.removeStorageSync(USER_INFO_KEY);
};

/**
 * 检查用户是否已登录
 * @returns 是否已登录
 */
export const isLoggedIn = (): boolean => {
  return !!getToken();
};

/**
 * 用户登录
 * @param token 用户Token
 * @param userInfo 用户信息
 */
export const login = (token: string, userInfo: any) => {
  setToken(token);
  setUserInfo(userInfo);
};

/**
 * 用户登出
 */
export const logout = () => {
  removeToken();
  removeUserInfo();
};

/**
 * 检查页面是否需要登录
 * @param pagePath 页面路径
 * @returns 是否需要登录
 */
export const requiresAuth = (pagePath: string): boolean => {
  // 需要登录的页面列表
  const authPages = [
    'pages/record/index',
    'pages/userinfo/index',
    'pages/password/index',
    'pages/index/index',
    'pages/user/index'
  ];
  
  return authPages.some(page => pagePath.includes(page));
};

export default {
  setToken,
  getToken,
  removeToken,
  setUserInfo,
  getUserInfo,
  removeUserInfo,
  isLoggedIn,
  login,
  logout,
  requiresAuth
}; 