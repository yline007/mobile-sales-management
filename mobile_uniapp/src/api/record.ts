/**
 * 销售记录相关接口
 */
import request from '@/utils/request';
import type { ApiResponse } from '@/api/types';

// 销售记录提交参数接口
export interface SalesRecordSubmitData {
  store_id?: number;        // 门店ID
  store_name: string;       // 门店名称
  phone_brand_id?: number;  // 手机品牌ID
  phone_brand_name: string; // 手机品牌名称
  phone_model_id?: number;  // 手机型号ID
  phone_model_name: string; // 手机型号名称
  imei: string;            // 串码(IMEI)
  customer_name: string;    // 客户姓名
  customer_phone: string;   // 客户电话
  photo_url: string[];     // 图片URL数组
  remark?: string;         // 备注（可选）
}

// 销售记录列表项接口
export interface SalesRecord {
  id: number;
  store: {
    id: number;
    name: string;
  };
  phone_brand: {
    id: number;
    name: string;
  };
  phone_model: {
    id: number;
    name: string;
  };
  imei: string;
  customer_name: string;
  customer_phone: string;
  photo_url: string[];
  remark: string;
  create_time: string;
}

// 今日销售记录响应数据接口
export interface TodaySalesResponse {
  total: number;
  list: SalesRecord[];
}

// 提交销售记录
export const submitRecord = (data: SalesRecordSubmitData) => {
  return request.post<ApiResponse>('/api/salesperson/sales_submit', data);
};

/**
 * 获取销售记录详情
 * @param id 记录ID
 */
export const getRecordDetail = (id: string) => {
  return request.get<ApiResponse>(`/api/salesperson/sales_detail/${id}`);
};

/**
 * 获取今日销售记录列表
 */
export const getTodaySales = () => {
  return request.get<ApiResponse<TodaySalesResponse>>('/api/salesperson/today_sales');
};

export default {
  submitRecord,
  getRecordDetail,
  getTodaySales
}; 