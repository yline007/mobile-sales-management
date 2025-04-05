/**
 * 用户相关接口
 */
import { get, post } from '@/utils/request';

/**
 * 用户登录
 * @param params 登录参数
 */
export const login = (params: {
  phone: string;
  password: string;
}) => {
  return post('/api/user/login', params);
};

/**
 * 用户注册
 * @param params 注册参数
 */
export const register = (params: {
  name: string;
  phone: string;
  password: string;
}) => {
  return post('/api/user/register', params);
};

/**
 * 获取当前用户信息
 */
export const getUserInfo = () => {
  return get('/api/user/info');
};

/**
 * 修改用户密码
 * @param params 密码修改参数
 */
export const changePassword = (params: {
  oldPassword: string;
  newPassword: string;
}) => {
  return post('/api/user/change-password', params);
};

/**
 * 更新用户个人信息
 * @param params 用户信息参数
 */
export const updateUserInfo = (params: {
  name?: string;
  avatar?: string;
  [key: string]: any;
}) => {
  return post('/api/user/update-info', params);
};

export default {
  login,
  register,
  getUserInfo,
  changePassword,
  updateUserInfo
}; 