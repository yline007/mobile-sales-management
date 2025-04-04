import { createRouter, createWebHashHistory } from 'vue-router';
import AdminIndex from '@/pages/admin/index.vue';
import NotFound from '@/pages/404.vue';
import AdminLogin from '@/pages/admin/login.vue';
import Admin from '@/layouts/admin.vue'

// 销售记录管理系统的路由
import SalesList from '@/pages/admin/sales/list.vue'
import StoreList from '@/pages/admin/store/list.vue'
import SalespersonList from '@/pages/admin/salesperson/list.vue'
import PhoneList from '@/pages/admin/phone/list.vue'
import SystemSetting from '@/pages/admin/system/setting.vue'
import ManagerList from '@/pages/admin/manager/list.vue'

const routes = [
    {
        // 指定访问路径
        path: '/admin',
        component: Admin,
        // 使用到 admin.vue 布局的，都需要放置在其子路由下面
        children: [{
            path: '/admin',
            component: AdminIndex,
            meta: {
                title: '仪表盘'
            }
        }, {
            path: '/admin/sales/list',
            component: SalesList,
            meta: {
                title: '销售记录'
            }
        }, {
            path: '/admin/store/list',
            component: StoreList,
            meta: {
                title: '门店管理'
            }
        }, {
            path: '/admin/salesperson/list',
            component: SalespersonList,
            meta: {
                title: '销售员管理'
            }
        }, {
            path: '/admin/phone/list',
            component: PhoneList,
            meta: {
                title: '手机型号'
            }
        }, {
            path: '/admin/manager/list',
            component: ManagerList,
            meta: {
                title: '管理员账号'
            }
        }, {
            path: '/admin/system/setting',
            component: SystemSetting,
            meta: {
                title: '系统设置'
            }
        }]

    },
    // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    },
    {
        path: '/login',
        component: AdminLogin,
        meta: {
            title: '登录页'
        }
    },
    {
        path: '/',
        redirect: '/login'
    }
]

const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

// ES6 模块导出语句，它用于将 router 对象导出，以便其他文件可以导入和使用这个对象
export default router