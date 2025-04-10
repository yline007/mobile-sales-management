import axios from "@/axios"

/**
 * 获取系统设置
 */
export function getSystemSettings() {
    return axios.get('/api/admin/settings')
}

/**
 * 更新系统设置
 * @param {object} data - 设置数据(键值对对象)
 */
export function updateSystemSettings(data) {
    return axios.post('/api/admin/settings', data)
}

export default {
    getSystemSettings,
    updateSystemSettings
} 