<template>
    <div class="meun shadow-md fixed bg-light-50 transition-all duration-300" :style="{ width: $store.state.menuWidth }">
        <div class="flex items-center justify-center h-[64px]">
            <div v-if="$store.state.menuWidth == '250px'" class="text-white text-xl font-bold">终端销售出库管理系统</div>
            <div v-else class="text-white text-xl font-bold">销售</div>
        </div>

        <el-menu :collapse="isCollapse"  class="border-0 admin-el-menu"
        :default-active="defaultActive"
        :collapse-transition="false"
        unique-opened
         @select="handleSelect">
            <template v-for="(item, index) in menus" :index="index">
                <el-menu-item :index="item.path" class="admin-el-menu-item">
                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{ item.name }}</span>
                </el-menu-item>
            </template>

        </el-menu>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

const router = useRouter()
const route = useRoute()
const store = useStore()

const defaultActive = ref(route.path)

// 是否折叠
const isCollapse = computed(() =>  !(store.state.menuWidth == '250px'))

const menus = [{
    'name': '仪表盘',
    'icon': 'Monitor',
    'path': '/admin',
    'child': []
},
{
    'name': '销售记录',
    'icon': 'Document',
    'path': '/admin/sales/list',
    'child': []
},
// {
//     'name': '门店管理',
//     'icon': 'Shop',
//     'path': '/admin/store/list',
//     'child': []
// },
{
    'name': '销售员管理',
    'icon': 'User',
    'path': '/admin/salesperson/list',
    'child': []
},
{
    'name': '手机型号',
    'icon': 'Cellphone',
    'path': '/admin/phone/list',
    'child': []
},
{
    'name': '管理员账号',
    'icon': 'UserFilled',
    'path': '/admin/manager/list',
    'child': []
},
// {
//     'name': '系统设置',
//     'icon': 'Setting',
//     'path': '/admin/system/setting',
//     'child': []
// }
]

const handleSelect = (index) => {
    defaultActive.value = index
    router.push(index)
    
    // 根据不同路由触发不同刷新事件
    if (index === '/admin') {
        // 触发仪表盘刷新事件
        window.dispatchEvent(new CustomEvent('dashboard-refresh'))
    } else if (index === '/admin/sales/list') {
        // 触发销售记录刷新事件
        window.dispatchEvent(new CustomEvent('reload-sales-data'))
    } else if (index === '/admin/salesperson/list') {
        // 触发销售员管理刷新事件
        window.dispatchEvent(new CustomEvent('salesperson-refresh'))
    } else if (index === '/admin/phone/list') {
        // 触发手机型号刷新事件
        window.dispatchEvent(new CustomEvent('phone-refresh'))
    } else if (index === '/admin/manager/list') {
        // 触发管理员账号刷新事件
        window.dispatchEvent(new CustomEvent('manager-refresh'))
    }
}
</script>

<style>
.meun {
    transition: all 0.3s;
    width: 250px;
    top: 0;
    bottom: 0;
    left: 0;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #001428!important;
}

.admin-el-menu {
    background-color: #001428!important;
    border-right: 0;
}

.admin-el-menu-item {
    color: #c0c4cc!important;
}

.el-menu-item.is-active {
    background-color: #ffffff10!important;
}

.el-menu-item.is-active:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 100%;
    background-color: var(--el-color-primary);
}

.el-menu-item:hover {
    background-color: #ffffff10;
}

.meun::-webkit-scrollbar {
    width: 0;
}

.logo {
    height: 64px;
    background-color: #001428;
    color: #fff;
    @apply flex justify-center items-center text-xl font-thin;
}

</style>