/**
 * 手机相关接口
 */
import { get } from '@/utils/request';
import type { ApiResponse } from '@/api/types';

/**
 * 手机品牌接口
 */
export interface PhoneBrand {
  id: number;
  name: string;
  status?: number;
}

/**
 * 手机型号接口
 */
export interface PhoneModel {
  id: number;
  brand_id: number;
  name: string;
  status?: number;
}

/**
 * 获取手机品牌列表
 */
export const getBrandList = () => {
  return get<ApiResponse<PhoneBrand[]>>('/api/salesperson/phone_brands');
};

/**
 * 获取手机型号列表
 * @param brandId 品牌ID
 */
export const getModelList = (brandId: number) => {
  return get<ApiResponse<PhoneModel[]>>('/api/salesperson/phone_models', { brand_id: brandId });
};

export default {
  getBrandList,
  getModelList
}; 