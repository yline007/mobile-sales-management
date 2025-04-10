import axios from "@/axios"

/**
 * 获取销售员列表
 * @param {number} page - 页码
 * @param {number} limit - 每页条数
 * @param {string} keyword - 搜索关键词
 * @param {number} store_id - 门店ID
 */
export function getSalespersonList(page = 1, limit = 10, keyword = '', store_id = null) {
    return axios.get('/api/admin/salespersons', {
        params: {
            page,
            limit,
            keyword,
            store_id
        }
    })
}

/**
 * 创建销售员
 * @param {object} data - 销售员数据
 */
export function createSalesperson(data) {
    return axios.post('/api/admin/salesperson', data)
}

/**
 * 更新销售员
 * @param {number} id - 销售员ID
 * @param {object} data - 销售员数据
 */
export function updateSalesperson(id, data) {
    return axios.put(`/api/admin/salesperson/${id}`, data)
}

/**
 * 删除销售员
 * @param {number} id - 销售员ID
 */
export function deleteSalesperson(id) {
    return axios.delete(`/api/admin/salesperson/${id}`)
}

/**
 * 更新销售员状态
 * @param {number} id - 销售员ID
 * @param {number} status - 状态：1-启用 0-禁用
 */
export function updateSalespersonStatus(id, status) {
    return axios.put(`/api/admin/salesperson/${id}/status`, { status })
}

export default {
    getSalespersonList,
    createSalesperson,
    updateSalesperson,
    deleteSalesperson,
    updateSalespersonStatus
} 