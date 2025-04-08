import axios from "@/axios"

/**
 * 获取手机品牌列表
 * @param {number} page - 页码
 * @param {number} limit - 每页条数
 * @param {string} keyword - 搜索关键词
 */
export function getPhoneBrandList(page = 1, limit = 10, keyword = '') {
    return axios.get('/admin/phone_brands', {
        params: {
            page,
            limit,
            keyword
        }
    })
}

/**
 * 创建手机品牌
 * @param {object} data - 品牌数据
 */
export function createPhoneBrand(data) {
    return axios.post('/admin/phone_brand', data)
}

/**
 * 更新手机品牌
 * @param {number} id - 品牌ID
 * @param {object} data - 品牌数据
 */
export function updatePhoneBrand(id, data) {
    return axios.put(`/admin/phone_brand/${id}`, data)
}

/**
 * 删除手机品牌
 * @param {number} id - 品牌ID
 */
export function deletePhoneBrand(id) {
    return axios.delete(`/admin/phone_brand/${id}`)
}

/**
 * 更新品牌状态
 * @param {number} id - 品牌ID
 * @param {number} status - 状态：1-启用 0-禁用
 */
export function updatePhoneBrandStatus(id, status) {
    return axios.put(`/admin/phone_brand/${id}/status`, { status })
}

/**
 * 获取手机型号列表
 * @param {number} page - 页码
 * @param {number} limit - 每页条数
 * @param {string} keyword - 搜索关键词
 * @param {number} brand_id - 品牌ID
 */
export function getPhoneModelList(page = 1, limit = 10, keyword = '', brand_id = null) {
    return axios.get('/admin/phone_models', {
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
    return axios.post('/admin/phone_model', data)
}

/**
 * 更新手机型号
 * @param {number} id - 型号ID
 * @param {object} data - 型号数据
 */
export function updatePhoneModel(id, data) {
    return axios.put(`/admin/phone_model/${id}`, data)
}

/**
 * 删除手机型号
 * @param {number} id - 型号ID
 */
export function deletePhoneModel(id) {
    return axios.delete(`/admin/phone_model/${id}`)
}

/**
 * 更新型号状态
 * @param {number} id - 型号ID
 * @param {number} status - 状态：1-启用 0-禁用
 */
export function updatePhoneModelStatus(id, status) {
    return axios.put(`/admin/phone_model/${id}/status`, { status })
}

export default {
    getPhoneBrandList,
    createPhoneBrand,
    updatePhoneBrand,
    deletePhoneBrand,
    updatePhoneBrandStatus,
    getPhoneModelList,
    createPhoneModel,
    updatePhoneModel,
    deletePhoneModel,
    updatePhoneModelStatus
} 