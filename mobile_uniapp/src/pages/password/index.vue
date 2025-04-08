<template>
  <view class="password-container">
    <view class="password-header">
      <view class="header-title">修改密码</view>
    </view>
    
    <view class="password-form">
      <view class="form-item">
        <view class="form-label">原密码</view>
        <view class="input-group">
          <input 
            type="safe-password"
            password
            class="form-input" 
            v-model="form.old_password" 
            placeholder="请输入原密码"
            placeholder-style="color: #999999;"
          />
        </view>
      </view>
      
      <view class="form-item">
        <view class="form-label">新密码</view>
        <view class="input-group">
          <input 
            type="safe-password"
            password
            class="form-input" 
            v-model="form.new_password" 
            placeholder="请输入新密码"
            placeholder-style="color: #999999;"
          />
        </view>
      </view>
      
      <view class="form-item">
        <view class="form-label">确认密码</view>
        <view class="input-group">
          <input 
            type="safe-password"
            password
            class="form-input" 
            v-model="form.confirm_password" 
            placeholder="请再次输入新密码"
            placeholder-style="color: #999999;"
          />
        </view>
      </view>
    </view>
    
    <view class="password-tips">
      <text class="tips-text">密码长度至少6位，包含字母和数字</text>
    </view>
    
    <view class="password-action">
      <button class="action-btn" @click="submitForm" :disabled="submitting">确认修改</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { updatePassword } from '@/api/user'

// 表单数据
const form = reactive({
  old_password: '',
  new_password: '',
  confirm_password: ''
})

// 提交状态
const submitting = ref(false)

// 表单验证
const validateForm = () => {
  if (!form.old_password.trim()) {
    uni.showToast({
      title: '请输入原密码',
      icon: 'none'
    })
    return false
  }
  
  if (!form.new_password.trim()) {
    uni.showToast({
      title: '请输入新密码',
      icon: 'none'
    })
    return false
  }
  
  if (!form.confirm_password.trim()) {
    uni.showToast({
      title: '请输入确认密码',
      icon: 'none'
    })
    return false
  }
  
  // 验证密码格式
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
  if (!passwordRegex.test(form.new_password)) {
    uni.showToast({
      title: '新密码必须包含字母和数字，且长度至少6位',
      icon: 'none',
      duration: 2000
    })
    return false
  }
  
  if (form.new_password !== form.confirm_password) {
    uni.showToast({
      title: '两次输入的密码不一致',
      icon: 'none'
    })
    return false
  }
  
  return true
}

// 提交表单
const submitForm = async () => {
  // 防止重复提交
  if (submitting.value) return
  
  // 表单验证
  if (!validateForm()) return
  
  submitting.value = true
  uni.showLoading({
    title: '提交中...'
  })
  
  try {
    const res = await updatePassword(form)
    
    if (res.code === 0) {
      uni.showToast({
        title: res.msg || '密码修改成功',
        icon: 'success'
      })
      
      // 清除登录状态
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
      
      // 延迟跳转到登录页
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/login/index'
        })
      }, 1500)
    } else {
      uni.showToast({
        title: res.msg || '密码修改失败',
        icon: 'none'
      })
    }
  } catch (error: any) {
    console.error('修改密码失败:', error)
    uni.showToast({
      title: error.msg || '修改失败，请稍后重试',
      icon: 'none'
    })
  } finally {
    uni.hideLoading()
    submitting.value = false
  }
}

// 检查登录状态
const token = uni.getStorageSync('token')
if (!token) {
  uni.showToast({
    title: '请先登录',
    icon: 'none',
    duration: 2000
  })
  
  // 跳转到登录页
  setTimeout(() => {
    uni.redirectTo({
      url: '/pages/login/index'
    })
  }, 1500)
}
</script>

<style lang="scss">
.password-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.password-header {
  background-color: #2979ff;
  padding: 20rpx 30rpx;
}

.header-title {
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
}

.password-form {
  background-color: #fff;
  margin-top: 20rpx;
  padding: 0 30rpx;
}

.form-item {
  padding: 30rpx 0;
  border-bottom: 1rpx solid #eee;
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  color: #666;
  font-size: 30rpx;
  margin-bottom: 20rpx;
}

.input-group {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 10rpx;
}

.form-input {
  flex: 1;
  height: 80rpx;
  font-size: 30rpx;
  color: #333;
  padding: 0 20rpx;
  background-color: transparent;
}

.password-tips {
  padding: 20rpx 30rpx;
}

.tips-text {
  font-size: 26rpx;
  color: #999;
}

.password-action {
  margin-top: 40rpx;
  padding: 0 30rpx;
}

.action-btn {
  background-color: #2979ff;
  color: #fff;
  border-radius: 8rpx;
  font-size: 30rpx;
  height: 90rpx;
  line-height: 90rpx;
}
</style> 