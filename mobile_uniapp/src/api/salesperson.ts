/**
 * 销售员相关接口
 */
import { get, post } from '@/utils/request';

/**
 * 销售员登录
 * @param params 登录参数
 */
export const login = (params: {
  phone: string;
  password: string;
}) => {
  return post('/api/salesperson/login', params);
};

/**
 * 销售员注册
 * @param params 注册参数
 */
export const register = (params: {
  name: string;
  phone: string;
  password: string;
}) => {
  return post('/api/salesperson/register', params);
};

export default {
  login,
  register
}; 