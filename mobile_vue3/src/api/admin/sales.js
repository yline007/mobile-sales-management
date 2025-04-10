import axios from "@/axios"

/**
 * 获取销售记录列表
 * @param {number} page - 页码
 * @param {number} limit - 每页条数 
 * @param {string} keyword - 搜索关键词
 * @param {number} store_id - 门店ID
 * @param {string} start_date - 开始日期
 * @param {string} end_date - 结束日期
 */
export function getSalesList(page = 1, limit = 10, { keyword = '', store_id = null, start_date = '', end_date = '' } = {}) {
    return axios.get('/api/admin/sales', {
        params: {
            page,
            limit,
            keyword,
            store_id,
            start_date,
            end_date
        }
    })
}

/**
 * 创建销售记录
 * @param {object} data - 销售记录数据
 */
export function createSales(data) {
    return axios.post('/api/admin/sales', data)
}

/**
 * 更新销售记录
 * @param {number} id - 记录ID
 * @param {object} data - 销售记录数据
 */
export function updateSales(id, data) {
    return axios.put(`/api/admin/sales/${id}`, data)
}

/**
 * 删除销售记录
 * @param {number} id - 记录ID
 */
export function deleteSales(id) {
    return axios.delete(`/api/admin/sales/${id}`)
}

/**
 * 获取销售记录详情
 * @param {number} id - 记录ID
 */
export function getSalesDetail(id) {
    return axios.get(`/api/admin/sales/${id}`)
}

export default {
    getSalesList,
    createSales,
    updateSales,
    deleteSales,
    getSalesDetail
} 