<template>
    <el-affix :offset="0">
        <div class="header flex text-light-50 top-0 right-0 left-0 items-center">
            <!-- 展开、收缩侧边栏 -->
            <el-icon class="icon-btn" @click="$store.commit('HANDLE_MENU_WIDTH')">
                <Fold v-if="$store.state.menuWidth == '250px'" />
                <Expand v-else />
            </el-icon>

            <div class="ml-auto flex justify-center items-center">
                <!-- 消息通知 -->
                <el-popover
                    placement="bottom"
                    :width="350"
                    trigger="click"
                    popper-class="notification-popover"
                >
                    <template #reference>
                        <div class="notification-icon-wrapper">
                            <el-tooltip class="box-item" effect="dark" content="消息通知" placement="bottom">
                                <el-badge :value="$store.state.notifications.unreadCount" :hidden="$store.state.notifications.unreadCount === 0" class="mr-2" :max="99">
                                    <el-icon class="icon-btn">
                                        <Bell />
                                    </el-icon>
                                </el-badge>
                            </el-tooltip>
                        </div>
                    </template>
                    
                    <div class="notification-container">
                        <div class="notification-header flex justify-between items-center p-2 border-b border-gray-200">
                            <span class="font-bold">通知消息</span>
                            <div class="flex space-x-2">
                                <el-button type="primary" link size="small" @click="handleMarkAllRead">全部已读</el-button>
                                <el-button type="danger" link size="small" @click="handleClearAll">清空</el-button>
                            </div>
                        </div>
                        <div class="notification-body max-h-80 overflow-y-auto">
                            <div v-if="$store.state.notifications.messages.length === 0" class="p-4 text-center text-gray-500">
                                暂无消息
                            </div>
                            <div 
                                v-for="message in $store.state.notifications.messages" 
                                :key="message.id" 
                                class="notification-item p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                                :class="{'bg-blue-50': !message.isRead}"
                                @click="handleMessageClick(message)"
                            >
                                <div class="flex justify-between items-start">
                                    <span class="font-bold">{{ message.title }}</span>
                                    <span class="text-xs text-gray-500">{{ message.time }}</span>
                                </div>
                                <div class="text-sm mt-1">{{ message.content }}</div>
                            </div>
                        </div>
                        <div class="notification-footer border-t border-gray-200 p-2 text-center">
                            <el-button type="primary" link @click="goToSalesList">查看全部销售记录</el-button>
                        </div>
                    </div>
                </el-popover>

                <!-- 刷新 -->
                <el-tooltip class="box-item" effect="dark" content="刷新" placement="bottom">
                    <el-icon class="icon-btn" @click="refresh">
                        <Refresh />
                    </el-icon>
                </el-tooltip>

                <!-- 全屏 -->
                <el-tooltip class="box-item" effect="dark" content="全屏" placement="bottom">
                    <el-icon class="icon-btn" @click="toggle">
                        <FullScreen v-if="!isFullscreen" />
                        <Aim v-else />
                    </el-icon>
                </el-tooltip>

                <el-dropdown class="dropdown flex justify-center items-center text-light-50 mx-5" @command="handleCommand">
                    <span class="flex justify-center items-center">
                        <el-avatar 
                            :size="32" 
                            :src="$store.state.user.avatar || defaultAvatar"
                            class="mr-2 admin-avatar" 
                            fit="cover"
                        />
                        {{ $store.state.user.nickname || $store.state.user.username }}
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
                            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </el-affix>


    <!-- 修改密码 -->
    <el-dialog v-model="dialogShow" title="修改密码" width="30%" :show-close="false">
        <el-form ref="formRef" :rules="rules" :model="form" label-position="right">
            <el-form-item label="当前密码" prop="oldPassword" label-width="120px">
                <el-input v-model="form.oldPassword" type="password" autocomplete="off" 
                    placeholder="请输入当前密码" show-password />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword" label-width="120px">
                <el-input v-model="form.newPassword" type="password" autocomplete="off" 
                    placeholder="请输入新密码(6-20字符)" show-password />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword" label-width="120px">
                <el-input v-model="form.confirmPassword" type="password" autocomplete="off" 
                    placeholder="请再次确认新密码" show-password />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="onSubmit" :loading="loading">
                    确认修改
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>



<script setup>
import { showModel, showMessage } from '@/composables/util'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { updateAdminPassword } from '@/api/admin/user'
import { Bell, Refresh, FullScreen, Aim, Fold, Expand } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const { isFullscreen, toggle } = useFullscreen()
const store = useStore()
const router = useRouter()

// WebSocket相关
const ws = ref(null)
const reconnectTimer = ref(null)
const reconnectAttempts = ref(0)
const maxReconnectAttempts = 5

// 设置默认头像
const defaultAvatar = '/static/avatar.png'

// 获取WebSocket服务器地址
const getWsUrl = () => {
  console.log('window.globalConfig:', window.globalConfig); // 打印整个配置对象
  if (window.globalConfig && window.globalConfig.wsUrl) {
    console.log('使用配置文件中的 WebSocket 地址:', window.globalConfig.wsUrl);
    return window.globalConfig.wsUrl;
  }
  // 如果配置未加载，使用默认值
  const defaultUrl = 'ws://' + window.location.hostname + ':8085';
  console.log('使用默认的 WebSocket 地址:', defaultUrl);
  return defaultUrl;
}

// 获取管理员信息
const fetchAdminInfo = async () => {
    // 如果已经有用户信息，直接初始化WebSocket
    if (store.state.user.id) {
        initWebSocket()
        return
    }

    try {
        const res = await store.dispatch('getAdminInfo')
        if (res.code === 0) {
            // 获取到用户信息后初始化WebSocket连接
            initWebSocket()
        }
    } catch (error) {
        console.error('获取用户信息失败:', error)
        showMessage('获取用户信息失败，请刷新页面重试', 'error')
    }
}

// 初始化WebSocket连接
const initWebSocket = () => {
    if (!store.state.user.id) {
        console.error('用户未登录或未获取到用户信息');
        return;
    }

    // 如果已经有连接，先关闭
    if (ws.value && ws.value.readyState !== WebSocket.CLOSED) {
        console.log('关闭现有的WebSocket连接');
        ws.value.close();
    }

    console.log('开始初始化 WebSocket 连接...');
    console.log('当前用户 ID:', store.state.user.id);
    
    const wsUrl = getWsUrl();
    console.log('准备连接到 WebSocket 地址:', wsUrl);

    try {
        console.log('准备连接到 WebSocket 地址:', wsUrl);

        ws.value = new WebSocket(wsUrl);
        console.log('ws', ws)
        // 添加连接超时处理
        const connectionTimeout = setTimeout(() => {
            if (ws.value && ws.value.readyState === WebSocket.CONNECTING) {
                console.error('WebSocket 连接超时');
                ws.value.close();
            }
        }, 5000);

        ws.value.onopen = () => {
            console.log('WebSocket连接成功，当前状态:', ws.value.readyState);
            clearTimeout(connectionTimeout);
            reconnectAttempts.value = 0;
            
            // 发送绑定请求
            const bindData = {
                type: 'bind',
                admin_id: store.state.user.id
            };
            console.log('发送绑定数据:', bindData);
            ws.value.send(JSON.stringify(bindData));

            // 启动心跳检测
            startHeartbeat();
        }

        ws.value.onmessage = (e) => {
            console.log('收到 WebSocket 消息:', e.data);
            try {
                const data = JSON.parse(e.data);
                handleWebSocketMessage(data);
            } catch (error) {
                console.error('WebSocket消息解析错误:', error);
            }
        }

        ws.value.onclose = (event) => {
            clearTimeout(connectionTimeout);
            console.log('WebSocket连接关闭, code:', event.code, '原因:', event.reason);
            stopHeartbeat();
            reconnect();
        }

        ws.value.onerror = (error) => {
            clearTimeout(connectionTimeout);
            console.error('WebSocket错误:', error);
            console.log('WebSocket 当前状态:', ws.value.readyState);
            const states = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
            console.log('WebSocket 状态说明:', states[ws.value.readyState]);
        }
    } catch (error) {
        console.error('WebSocket 初始化失败:', error);
    }
}

// 心跳检测
let heartbeatInterval = null;
const startHeartbeat = () => {
    stopHeartbeat();
    heartbeatInterval = setInterval(() => {
        if (ws.value && ws.value.readyState === WebSocket.OPEN) {
            ws.value.send(JSON.stringify({ type: 'ping' }));
            console.log('发送心跳包');
        }
    }, 30000); // 每30秒发送一次心跳
}

const stopHeartbeat = () => {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }
}

// 重连机制
const reconnect = () => {
    if (reconnectAttempts.value >= maxReconnectAttempts) {
        console.log('达到最大重连次数:', maxReconnectAttempts);
        return;
    }

    reconnectAttempts.value++;
    console.log(`准备第 ${reconnectAttempts.value} 次重连 (最大 ${maxReconnectAttempts} 次)`);

    clearTimeout(reconnectTimer.value);
    reconnectTimer.value = setTimeout(() => {
        console.log('执行重连...');
        initWebSocket();
    }, 3000);
}

// 处理WebSocket消息
const handleWebSocketMessage = (data) => {
    switch (data.type) {
        case 'bind':
            console.log('绑定成功消息:', data);
            break
        case 'new_sale':
            // 新销售记录通知
            handleNewSaleNotification(data.data)
            break
        case 'system':
            // 系统通知
            handleSystemNotification(data)
            break
        default:
            console.log('未知消息类型:', data.type)
    }
}

// 处理新销售记录通知
const handleNewSaleNotification = (data) => {
    const notification = {
        id: Date.now(),
        type: 'sale',
        title: '新销售记录',
        content: `${data.store_name}的${data.salesperson_name}提交了一条新的销售记录`,
        time: new Date().toLocaleString(),
        isRead: false,
        sale_id: data.sale_id
    }
    
    // 添加到通知列表
    store.commit('ADD_NOTIFICATION', notification)
    
    // 播放提示音
    playNotificationSound()
    
    // 显示桌面通知
    showDesktopNotification(notification)
}

// 处理系统通知
const handleSystemNotification = (data) => {
    const notification = {
        id: Date.now(),
        type: 'system',
        title: data.title || '系统通知',
        content: data.content,
        time: new Date().toLocaleString(),
        isRead: false
    }
    
    store.commit('ADD_NOTIFICATION', notification)
    playNotificationSound()
    showDesktopNotification(notification)
}

// 播放提示音
const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3')
    audio.play().catch(() => {
        // 忽略自动播放限制错误
    })
}

// 显示桌面通知
const showDesktopNotification = (notification) => {
    if (window.Notification && Notification.permission === 'granted' && !document.hasFocus()) {
        new Notification(notification.title, {
            body: notification.content,
            icon: '/notification-icon.png'
        })
    }
}

// 生命周期钩子
onMounted(() => {
    fetchAdminInfo()
    // 请求通知权限
    if (window.Notification && Notification.permission !== 'granted') {
        Notification.requestPermission()
    }
})

onUnmounted(() => {
    if (ws.value) {
        ws.value.close()
    }
    if (reconnectTimer.value) {
        clearTimeout(reconnectTimer.value)
    }
})

// 表单相关
const dialogShow = ref(false)
const loading = ref(false)

const form = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

// 表单验证规则
const rules = {
    oldPassword: [
        { required: true, message: '请输入当前密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' }
    ],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== form.newPassword) {
                    callback(new Error('两次输入的密码不一致'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ]
}

const formRef = ref(null)

// 关闭对话框
const closeDialog = () => {
    dialogShow.value = false
    formRef.value?.resetFields()
    form.oldPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
}

// 提交表单
const onSubmit = () => {
    if (!formRef.value) return

    formRef.value.validate(async (valid) => {
        if (!valid) return

        try {
            loading.value = true
            const res = await updateAdminPassword(form)
            
            if (res.code === 0) {
                ElMessage({
                    message: '密码修改成功，请重新登录',
                    type: 'success'
                })
                
                // 关闭对话框
                closeDialog()
                
                // 延迟执行登出操作
                setTimeout(() => {
                    store.dispatch('logout')
                    router.push('/login')
                }, 1500)
            } else {
                ElMessage.error(res.msg || '密码修改失败')
            }
        } catch (error) {
            console.error('修改密码失败:', error)
            ElMessage.error('修改密码失败，请重试')
        } finally {
            loading.value = false
        }
    })
}

// 原有的消息通知相关函数
const handleMarkAllRead = () => {
    store.commit('MARK_ALL_NOTIFICATIONS_READ')
    showMessage('已将所有消息标记为已读', 'success')
}

const handleClearAll = () => {
    showModel('确定要清空所有消息吗？').then(() => {
        store.commit('CLEAR_NOTIFICATIONS')
        showMessage('已清空所有消息', 'success')
    }).catch(() => {})
}

const handleMessageClick = (message) => {
    // 标记消息为已读
    if (!message.isRead) {
        store.commit('MARK_NOTIFICATION_READ', message.id)
    }
    
    // 跳转到相应页面
    if (message.type === 'sale') {
        router.push('/admin/sales/list')
    }
}

const goToSalesList = () => {
    router.push('/admin/sales/list')
}

const handleCommand = (command) => {
    switch (command) {
        case "rePassword":
            dialogShow.value = true
            break
        case "logout":
            logout()
            break
    }
}

// 刷新页面
const refresh = () => location.reload()

async function logout() {
    try {
        await showModel('是否确定要退出登录？')
        
        // 先清除用户状态
        store.dispatch('logout')
        
        // 显示提示消息
        ElMessage({
            message: '退出登录成功',
            type: 'success',
            duration: 2000,
            showClose: true
        })

        // 使用 nextTick 确保在下一个 tick 再执行路由跳转
        await nextTick()
        
        // 延迟一帧后再跳转，确保组件能够正确卸载
        requestAnimationFrame(() => {
            router.replace('/login')
        })
    } catch (error) {
        // 用户取消退出
    }
}
</script>

<style>
.header {
    height: 64px;
    background-color: #fff;
    z-index: 100;
}

.icon-btn {
    @apply flex justify-center items-center;
    width: 42px;
    height: 64px;
    cursor: pointer;
    color: #374151;
}

.icon-btn:hover {
    @apply bg-gray-200;
}

.header .dropdown {
    height: 64px;
    cursor: pointer;
    color: #374151 !important;
}

/* 通知样式 */
.notification-popover {
    padding: 0 !important;
}

.notification-icon-wrapper {
    position: relative;
}

.notification-icon-wrapper .el-badge__content {
    top: 14px !important;
    right: 8px !important;
}

.notification-container {
    display: flex;
    flex-direction: column;
}

.notification-item:hover {
    background-color: #f5f7fa;
}

.notification-body {
    min-height: 100px;
}

/* 添加头像样式 */
.admin-avatar {
    border-radius: 50%;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    overflow: hidden;
}

/* 确保头像图片完全覆盖 */
.admin-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>