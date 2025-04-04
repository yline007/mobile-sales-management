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

    // 如果用户已登录，则自动获取用户信息，并使用全局状态管理
    if (token) {
        await store.dispatch('getAdminInfo')
    }

    // 未登录，强制跳转登录页（除了登录页面本身）
    if (!token && to.path !== '/login') {
        showMessage('请先登录', 'warning')
        next({ path: '/login'})
        return
    }

    // 防止重复登录
    if (token && to.path === '/login') {
        next({ path: '/admin' })
        return
    }

    next()
})

router.afterEach((to, from) => {
    // 设置页面标题
    let title = (to.meta.title ? to.meta.title : '') + ' - 手机销售记录管理系统'
    document.title = title

    hidePageLoading()
})
