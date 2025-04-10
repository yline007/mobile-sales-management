import router from '@/router/index'
import { getToken } from '@/composables/auth'
import { showMessage } from '@/composables/util'
import store from '@/store'
import { showPageLoading, hidePageLoading } from '@/composables/util'


// 全局前置守卫
router.beforeEach(async (to, from, next) => {
    // 显示页面加载状态
    showPageLoading()
    
    const token = getToken()

    // 如果用户已登录，且没有用户信息，则获取用户信息
    if (token && !store.state.user.id) {
        try {
            await store.dispatch('getAdminInfo')
        } catch (error) {
            // Token可能已过期，清除登录状态并重定向到登录页
            store.dispatch('logout')
            showMessage('登录状态已过期，请重新登录', 'warning')
            next({ path: '/login' })
            hidePageLoading()
            return
        }
    }

    // 未登录，强制跳转登录页（除了登录页面本身）
    if (!token && to.path !== '/login') {
        showMessage('请先登录', 'warning')
        next({ path: '/login'})
        hidePageLoading()
        return
    }

    // 防止重复登录
    if (token && to.path === '/login') {
        next({ path: '/admin' })
        hidePageLoading()
        return
    }

    next()
})

router.afterEach((to, from) => {
    // 设置页面标题
    let title = (to.meta.title ? to.meta.title : '') + ' - 终端销售出库管理系统'
    document.title = title

    hidePageLoading()
})
