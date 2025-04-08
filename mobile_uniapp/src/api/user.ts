/**
 * 用户相关接口
 */
import { get, post, put } from '@/utils/request';
import type { ApiResponse } from '@/api/types';

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

// 修改密码参数接口
interface UpdatePasswordParams {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

/**
 * 修改密码
 * @param params 密码参数
 */
export const updatePassword = (params: UpdatePasswordParams): Promise<ApiResponse> => {
  return put('/api/salesperson/password', params);
};

// 个人信息更新参数接口
interface UpdateProfileParams {
  name: string;
  phone: string;
}

/**
 * 更新销售员个人信息
 * @param params 个人信息参数
 */
export const updateProfile = (params: UpdateProfileParams): Promise<ApiResponse> => {
  return put('/api/salesperson/update_profile', params);
};

export default {
  login,
  register,
  getUserInfo,
  changePassword,
  updateUserInfo,
  updatePassword,
  updateProfile
}; 