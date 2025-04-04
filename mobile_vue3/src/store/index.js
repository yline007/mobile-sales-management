import { createStore } from 'vuex'
import { getAdminInfo } from '@/api/admin/user'
import { removeToken } from '@/composables/auth'

// 创建一个新的 store 实例
const store = createStore({
    state() {
        return {
            // 用户信息
            user: {},
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
        // 设置全局用户信息
        SET_USERINFO(state, user) {
            state.user = user
        },
        // 展开或缩起侧边栏
        HANDLE_MENU_WIDTH(state) {
            state.menuWidth = state.menuWidth == "250px" ? "64px" : "250px"
        },
        // 清空标签函数
        SET_CLEARTABSFUNCTION(state, payLoad) {
            state.handleClearTabs = payLoad
        },
        // 添加一条新消息
        ADD_NOTIFICATION(state, message) {
            state.notifications.messages.unshift(message);
            state.notifications.unreadCount++;
        },
        // 将消息标记为已读
        MARK_NOTIFICATION_READ(state, messageId) {
            const message = state.notifications.messages.find(item => item.id === messageId);
            if (message && !message.isRead) {
                message.isRead = true;
                state.notifications.unreadCount = Math.max(0, state.notifications.unreadCount - 1);
            }
        },
        // 将所有消息标记为已读
        MARK_ALL_NOTIFICATIONS_READ(state) {
            state.notifications.messages.forEach(message => {
                message.isRead = true;
            });
            state.notifications.unreadCount = 0;
        },
        // 清除所有消息
        CLEAR_NOTIFICATIONS(state) {
            state.notifications.messages = [];
            state.notifications.unreadCount = 0;
        }
    },
    actions: {
        // 获取用户登录信息
        // 入参 commit 相当于 store.commit
        getAdminInfo({ commit }) {
            return new Promise((resolve, reject) => {
                getAdminInfo().then(res => {
                    commit('SET_USERINFO', res.data)
                    // 固定使用格式
                    resolve(res.data)
                }).catch(err => {
                    console.log('获取用户信息失败')
                    reject(err)
                })
            })
        },
        logout({ commit }) {
            removeToken()
            // 删除当前全局的 user 状态
            commit('SET_USERINFO', {})
        },
        // 添加销售记录通知
        addSalesNotification({ commit }, data) {
            const message = {
                id: Date.now(),
                title: '新销售记录',
                content: `${data.storeName}的${data.salesperson}销售了一台${data.phoneModel}`,
                time: new Date().toLocaleString(),
                type: 'sale',
                isRead: false,
                data: data
            };
            commit('ADD_NOTIFICATION', message);
            return message;
        }
    }
})

// 暴露
export default store