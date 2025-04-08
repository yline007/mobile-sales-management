import axios from "@/axios"

/**
 * 获取门店列表
 * @param {number} page - 页码
 * @param {number} limit - 每页条数
 * @param {string} keyword - 搜索关键词
 */
export function getStoreList(page = 1, limit = 10, keyword = '') {
    return axios.get('/admin/stores', {
        params: {
            page,
            limit,
            keyword
        }
    })
}

/**
 * 创建门店
 * @param {object} data - 门店数据
 */
export function createStore(data) {
    return axios.post('/admin/store', data)
}

/**
 * 更新门店
 * @param {number} id - 门店ID
 * @param {object} data - 门店数据
 */
export function updateStore(id, data) {
    return axios.put(`/admin/store/${id}`, data)
}

/**
 * 删除门店
 * @param {number} id - 门店ID
 */
export function deleteStore(id) {
    return axios.delete(`/admin/store/${id}`)
}

/**
 * 更新门店状态
 * @param {number} id - 门店ID
 * @param {number} status - 状态：1-启用 0-禁用
 */
export function updateStoreStatus(id, status) {
    return axios.put(`/admin/store/${id}/status`, { status })
}

export default {
    getStoreList,
    createStore,
    updateStore,
    deleteStore,
    updateStoreStatus
} 