<template>
    <div class="login-page">
        <div class="header">
            <img src="@/assets/logo.png" alt="Logo" class="logo" />
        </div>
        <div class="login-container">
            <h2 class="title">系统登录</h2>
            <el-form ref="formRef" :rules="rules" :model="form" class="login-form">
                <el-form-item prop="username">
                    <el-input v-model="form.username" placeholder="用户名" size="large" clearable />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="form.password" type="password" placeholder="密码" show-password size="large" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button round type="primary" @click="onSubmit" :loading="loading" class="login-btn" size="large">
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { login } from '@/api/admin/user';
import { showMessage } from '@/composables/util'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { setToken } from '@/composables/auth'

const router = useRouter()
const store = useStore()

const form = reactive({
    username: '',
    password: '',
})

const rules = {
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '密码不能为空', trigger: 'blur' }
    ]
}

const formRef = ref(null)
const loading = ref(false)

const onSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) return false
        loading.value = true
        login(form.username, form.password).then(async res => {
            if (res.code === 0) {
                setToken(res.data.access_token)
                try {
                    await store.dispatch('getAdminInfo')
                    showMessage('登录成功', 'success')
                    router.push('/admin')
                } catch (error) {
                    showMessage('获取用户信息失败', 'error')
                }
            } else {
                showMessage(res.msg || '用户名或密码错误', 'error')
            }
        }).catch(err => {
            console.error(err)
            showMessage('登录失败，请检查网络连接', 'error')
        }).finally(() => {
            loading.value = false
        })
    })
}

function onKeyUp(e) {
    if (e.key == 'Enter') {
        onSubmit()
    }
}

onMounted(() => {
    document.addEventListener('keyup', onKeyUp)
})

onBeforeUnmount(() => {
    document.removeEventListener('keyup', onKeyUp)
})
</script>

<style scoped>
.login-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    height: 100vh;
    background-color: #f0f2f5;
    background-image: url('@/assets/background_Image.jpg'); /* Set background image */
    background-size: cover;
    background-position: center;
    padding-right: 20%;
}

.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

.logo {
    height: 55px;
}

.login-container {
    width: 400px;
    padding: 40px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    text-align: center;
    margin-top: 80px; /* Add margin to avoid overlap with fixed header */
}

.title {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
}

.login-form {
    width: 100%;
}

.login-btn {
    width: 100%;
}
</style>
  