import axios from "@/axios"

// 模拟用户数据
const mockUserInfo = {
    success: true,
    data: {
        id: 1,
        username: 'admin',
        nickname: '管理员',
        avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
        email: 'admin@example.com',
        createTime: '2024-01-01 12:00:00',
        updateTime: '2024-01-01 12:00:00'
    }
}

export function login(username, password) {
    return axios.post("/login", {username, password})
}

export function getAdminInfo() {
    // 返回模拟数据
    return Promise.resolve(mockUserInfo)
}

export function updateAdminPassword(data) {
    return axios.post("/admin/password/update", data)
}

// 获取管理员账号列表
export function getAdminList(page = 1, limit = 10, keyword = '') {
    // 模拟数据
    const mockData = {
        success: true,
        data: {
            list: Array.from({ length: 10 }).map((_, index) => ({
                id: index + 1,
                username: index === 0 ? 'admin' : `user${index}`,
                nickname: index === 0 ? '超级管理员' : `管理员${index}`,
                email: index === 0 ? 'admin@example.com' : `user${index}@example.com`,
                status: Math.random() > 0.2 ? 1 : 0, // 1-启用，0-禁用
                role: index === 0 ? 'super-admin' : 'admin',
                createTime: '2024-01-01 12:00:00'
            })),
            total: 30
        }
    }
    return Promise.resolve(mockData)
}

// 新增管理员账号
export function createAdmin(data) {
    return axios.post("/admin/user", data)
}

// 修改管理员账号
export function updateAdmin(id, data) {
    return axios.put(`/admin/user/${id}`, data)
}

// 删除管理员账号
export function deleteAdmin(id) {
    return axios.delete(`/admin/user/${id}`)
}

// 修改管理员状态
export function updateAdminStatus(id, status) {
    return axios.post(`/admin/user/${id}/status`, { status })
}