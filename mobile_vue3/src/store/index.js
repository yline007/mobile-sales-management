import { createStore } from 'vuex'
import { getAdminInfo } from '@/api/admin/user'
import { removeToken } from '@/composables/auth'

// 创建一个新的 store 实例
const store = createStore({
    state() {
        return {
            // 用户信息
            user: {},
            // 用户信息加载状态
            userInfoLoading: false,
            // 用户信息请求Promise
            userInfoPromise: null,
            menuWidth: "250px",
            // 通知消息
            notifications: {
                // 未读消息数量
                unreadCount: 0,
                // 消息列表
                messages: []
            }
        }
    },
    mutations: {
        // 添加通知
        ADD_NOTIFICATION(state, notification) {
            state.notifications.messages.unshift(notification)
            if (!notification.isRead) {
                state.notifications.unreadCount++
            }
            // 限制消息数量
            if (state.notifications.messages.length > 100) {
                state.notifications.messages.pop()
            }
        },
        
        // 标记单个通知为已读
        MARK_NOTIFICATION_READ(state, notificationId) {
            const notification = state.notifications.messages.find(n => n.id === notificationId)
            if (notification && !notification.isRead) {
                notification.isRead = true
                state.notifications.unreadCount = Math.max(0, state.notifications.unreadCount - 1)
            }
        },
        
        // 标记所有通知为已读
        MARK_ALL_NOTIFICATIONS_READ(state) {
            state.notifications.messages.forEach(notification => {
                notification.isRead = true
            })
            state.notifications.unreadCount = 0
        },
        
        // 清空所有通知
        CLEAR_NOTIFICATIONS(state) {
            state.notifications.messages = []
            state.notifications.unreadCount = 0
        },
        
        // 处理菜单宽度
        HANDLE_MENU_WIDTH(state) {
            state.menuWidth = state.menuWidth == '250px' ? '64px' : '250px'
        },
        
        // 设置用户信息
        SET_USERINFO(state, user) {
            state.user = user
        },
        
        // 设置用户信息加载状态
        SET_USER_LOADING(state, status) {
            state.userInfoLoading = status
        },

        // 设置用户信息Promise
        SET_USER_PROMISE(state, promise) {
            state.userInfoPromise = promise
        }
    },
    actions: {
        // 获取用户信息
        getAdminInfo({ commit, state }) {
            // 如果已经在加载中，直接返回现有的 Promise
            if (state.userInfoPromise) {
                return state.userInfoPromise
            }

            // 创建新的 Promise
            const promise = new Promise((resolve, reject) => {
                commit('SET_USER_LOADING', true)
                getAdminInfo().then(res => {
                    if (res.code === 0) {
                        commit('SET_USERINFO', res.data)
                        resolve(res)
                    } else {
                        reject(new Error(res.msg || '获取用户信息失败'))
                    }
                }).catch(err => {
                    reject(err)
                }).finally(() => {
                    commit('SET_USER_LOADING', false)
                    // 清除 Promise
                    commit('SET_USER_PROMISE', null)
                })
            })

            // 保存 Promise
            commit('SET_USER_PROMISE', promise)
            return promise
        },
        // 退出登录
        logout({ commit }) {
            // 移除token
            removeToken()
            // 清除当前用户状态
            commit('SET_USERINFO', {})
        },
        // 添加销售通知
        addSalesNotification({ commit }, data) {
            const notification = {
                id: Date.now(),
                type: 'sale',
                title: '新销售记录',
                content: `${data.storeName}的${data.salesperson}销售了一台${data.phoneModel}给${data.customerName}(${data.phone})`,
                time: new Date().toLocaleString(),
                isRead: false
            }
            commit('ADD_NOTIFICATION', notification)
        }
    }
})

// 暴露
export default store