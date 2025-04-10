import axios from "@/axios"
import { setToken } from '@/composables/auth'

export function login(username, password) {
    return axios.post("/api/admin/login", {username, password})
}

export function getAdminInfo() {
    return axios.get("/api/admin/info")
}

export function updateAdminPassword(data) {
    return axios.post("/api/admin/password/update", {
        old_password: data.oldPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword
    })
}

// 获取管理员账号列表
export function getAdminList(page = 1, limit = 10, keyword = '') {
    // 使用实际接口
    return axios.get("/api/admin/admins", {
        params: {
            page,
            limit,
            keyword
        }
    })
}

// 新增管理员账号
export function createAdmin(data) {
    return axios.post("/api/admin/admin", data)
}

// 修改管理员账号
export function updateAdmin(id, data) {
    return axios.put(`/api/admin/admin/${id}`, data)
}

// 删除管理员账号
export function deleteAdmin(id) {
    return axios.delete(`/api/admin/admin/${id}`)
}

// 修改管理员状态
export function updateAdminStatus(id, status) {
    return axios.put(`/api/admin/admin/${id}/status`, { status })
}

// 刷新token
export function refreshToken() {
    return axios.post("/api/admin/refresh_token").then(res => {
        if(res.code === 0 && res.data.access_token) {
            setToken(res.data.access_token)
        }
        return res
    })
}

// 获取销售员列表
export function getSalespersonList(params) {
    return axios.get("/api/admin/salespersons", {
        params
    })
}

// 更新销售员状态
export function updateSalespersonStatus(id, status) {
    return axios.put(`/api/admin/salesperson/${id}/status`, { status })
}