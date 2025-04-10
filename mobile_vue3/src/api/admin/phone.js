import axios from "@/axios"

/**
 * 获取手机品牌列表
 * @param {number} page - 页码
 * @param {number} limit - 每页条数
 * @param {string} keyword - 搜索关键词
 * @returns {Promise} 返回品牌列表数据，包含：
 * - total: 总记录数
 * - list: 品牌列表数组
 */
export function getPhoneBrandList(page = 1, limit = 10, keyword = '') {
    return axios.get('/api/admin/phone_brands', {
        params: {
            page,
            limit,
            keyword
        }
    })
}

/**
 * 获取手机型号列表
 * @param {number} page - 页码
 * @param {number} limit - 每页条数
 * @param {string} keyword - 搜索关键词
 * @param {number} brand_id - 品牌ID
 * @returns {Promise} 返回型号列表数据，包含：
 * - total: 总记录数
 * - list: 型号列表数组，每个型号包含：
 *   - id: 型号ID
 *   - brand_name: 品牌名称
 *   - name: 型号名称
 *   - price: 参考价格
 *   - status: 状态（1在售，0停售）
 *   - create_time: 创建时间
 *   - description: 描述
 */
export function getPhoneModelList(page = 1, limit = 10, keyword = '', brand_id = null) {
    return axios.get('/api/admin/phone_models', {
        params: {
            page,
            limit,
            keyword,
            brand_id
        }
    })
}

/**
 * 创建手机型号
 * @param {object} data - 型号数据
 */
export function createPhoneModel(data) {
    return axios.post('/api/admin/phone_model', data)
}

/**
 * 更新手机型号
 * @param {number} id - 型号ID
 * @param {object} data - 型号数据
 */
export function updatePhoneModel(id, data) {
    return axios.put(`/api/admin/phone_model/${id}`, data)
}

/**
 * 删除手机型号
 * @param {number} id - 型号ID
 */
export function deletePhoneModel(id) {
    return axios.delete(`/api/admin/phone_model/${id}`)
}

/**
 * 更新型号状态
 * @param {number} id - 型号ID
 * @param {number} status - 状态：1-启用 0-禁用
 */
export function updatePhoneModelStatus(id, status) {
    return axios.put(`/api/admin/phone_model/${id}/status`, { status })
}

export default {
    getPhoneBrandList,
    getPhoneModelList,
    createPhoneModel,
    updatePhoneModel,
    deletePhoneModel,
    updatePhoneModelStatus
} 