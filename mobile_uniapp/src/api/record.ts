/**
 * 销售记录相关接口
 */
import { get, post } from '@/utils/request';

// 模拟数据
const mockRecords = [
  {
    id: '1',
    store: '旗舰店',
    phoneModel: 'iPhone 14 Pro',
    serialNumber: '3522567890',
    customerName: '张三',
    customerPhone: '13911112222',
    salesPerson: '测试用户',
    status: 2,
    photos: ['https://example.com/photo1.jpg'],
    createTime: '2023-04-05 10:23'
  },
  {
    id: '2',
    store: '中心店',
    phoneModel: '华为 Mate 60',
    serialNumber: '8792456781',
    customerName: '李四',
    customerPhone: '13922223333',
    salesPerson: '测试用户',
    status: 1,
    photos: ['https://example.com/photo2.jpg'],
    createTime: '2023-04-05 09:15'
  },
  {
    id: '3',
    store: '西区店',
    phoneModel: '小米 14 Pro',
    serialNumber: '1245789023',
    customerName: '王五',
    customerPhone: '13933334444',
    salesPerson: '测试用户',
    status: 3,
    photos: ['https://example.com/photo3.jpg'],
    createTime: '2023-04-04 16:42'
  }
];

/**
 * 获取销售记录列表
 * @param params 查询参数
 */
export const getRecordList = (params: {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  store?: string;
  status?: number;
}) => {
  // 当后端API准备好后，替换为实际API调用
  // return get('/api/record/list', params);
  
  // 模拟成功响应
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: {
          total: mockRecords.length,
          list: mockRecords,
          page: params.page || 1,
          pageSize: params.pageSize || 10
        }
      });
    }, 500);
  });
};

/**
 * 获取销售统计数据
 */
export const getStatistics = () => {
  // 当后端API准备好后，替换为实际API调用
  // return get('/api/record/statistics');
  
  // 模拟成功响应
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: {
          todayCount: 5,
          totalCount: 128
        }
      });
    }, 300);
  });
};

/**
 * 提交销售记录
 * @param params 销售记录数据
 */
export const submitRecord = (params: {
  store: string;
  salesPerson: string;
  phoneModel: string;
  serialNumber: string;
  customerName: string;
  customerPhone: string;
  photos: string[];
}) => {
  // 当后端API准备好后，替换为实际API调用
  // return post('/api/record/submit', params);
  
  // 模拟成功响应
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '提交成功',
        data: {
          id: `mock-${Date.now()}`,
          ...params,
          status: 1,
          createTime: new Date().toLocaleString()
        }
      });
    }, 800);
  });
};

/**
 * 获取销售记录详情
 * @param id 记录ID
 */
export const getRecordDetail = (id: string) => {
  // 当后端API准备好后，替换为实际API调用
  // return get(`/api/record/detail/${id}`);
  
  // 模拟成功响应
  return new Promise((resolve) => {
    setTimeout(() => {
      const record = mockRecords.find(item => item.id === id) || mockRecords[0];
      resolve({
        code: 200,
        message: 'success',
        data: record
      });
    }, 500);
  });
};

export default {
  getRecordList,
  getStatistics,
  submitRecord,
  getRecordDetail
}; 