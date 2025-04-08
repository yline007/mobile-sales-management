/**
 * 门店相关接口
 */
import { get } from '@/utils/request';
import type { ApiResponse } from '@/api/types';

/**
 * 门店信息接口
 */
export interface Store {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  status?: number;
  create_time?: string;
}

/**
 * 获取门店列表
 * @returns Promise<ApiResponse<Store[]>>
 */
export const getStoreList = () => {
  return get<ApiResponse<Store[]>>('/api/salesperson/stores');
};

export default {
  getStoreList
}; 