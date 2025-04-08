import axios from "@/axios"
import { setToken } from '@/composables/auth'

// 模拟用户数据
// const mockUserInfo = {
//     success: true,
//     data: {
//         id: 1,
//         username: 'admin',
//         nickname: '管理员',
//         avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
//         email: 'admin@example.com',
//         createTime: '2024-01-01 12:00:00',
//         updateTime: '2024-01-01 12:00:00'
//     }
// }

export function login(username, password) {
    return axios.post("/admin/login", {username, password})
}

export function getAdminInfo() {
    return axios.get("/admin/info")
}

export function updateAdminPassword(data) {
    return axios.post("/admin/password/update", {
        old_password: data.oldPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword
    })
}

// 获取管理员账号列表
export function getAdminList(page = 1, limit = 10, keyword = '') {
    // 使用实际接口
    return axios.get("/admin/admins", {
        params: {
            page,
            limit,
            keyword
        }
    })
}

// 新增管理员账号
export function createAdmin(data) {
    return axios.post("/admin/admin", data)
}

// 修改管理员账号
export function updateAdmin(id, data) {
    return axios.put(`/admin/admin/${id}`, data)
}

// 删除管理员账号
export function deleteAdmin(id) {
    return axios.delete(`/admin/admin/${id}`)
}

// 修改管理员状态
export function updateAdminStatus(id, status) {
    return axios.put(`/admin/admin/${id}/status`, { status })
}

// 刷新token
export function refreshToken() {
    return axios.post("/admin/refresh_token").then(res => {
        if(res.code === 0 && res.data.access_token) {
            setToken(res.data.access_token)
        }
        return res
    })
}

// 获取销售员列表
export function getSalespersonList(params) {
    return axios.get("/admin/salespersons", {
        params
    })
}

// 更新销售员状态
export function updateSalespersonStatus(id, status) {
    return axios.put(`/admin/salesperson/${id}/status`, { status })
}