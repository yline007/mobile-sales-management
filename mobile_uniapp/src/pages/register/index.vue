<template>
  <view class="register-container">
    <view class="logo-container">
      <image class="logo-image" src="/static/images/china-mobile-5g.png" mode="aspectFit"></image>
      <view class="logo-title">移动销售管理系统</view>
    </view>
    
    <view class="form-area">
      <view class="input-group">
        <text class="label">姓名</text>
        <view class="input-box">
          <uni-icons type="person" size="20" color="#999"></uni-icons>
          <input type="text" v-model="form.name" placeholder="请输入姓名" />
        </view>
      </view>
      
      <view class="input-group">
        <text class="label">手机号码</text>
        <view class="input-box">
          <uni-icons type="phone" size="20" color="#999"></uni-icons>
          <input type="number" v-model="form.phone" placeholder="请输入手机号码" maxlength="11" />
        </view>
      </view>
      
      <view class="input-group">
        <text class="label">密码</text>
        <view class="input-box">
          <uni-icons type="locked" size="20" color="#999"></uni-icons>
          <input type="password" v-model="form.password" placeholder="请设置密码" password />
        </view>
      </view>
      
      <view class="input-group">
        <text class="label">确认密码</text>
        <view class="input-box">
          <uni-icons type="locked" size="20" color="#999"></uni-icons>
          <input type="password" v-model="form.confirmPassword" placeholder="请再次输入密码" password />
        </view>
      </view>
      
      <button class="submit-btn" @click="handleRegister">注册</button>
      
      <view class="options">
        <text @click="goToLogin">已有账号？立即登录</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { register } from '@/api/salesperson';
import { login } from '@/utils/auth';

// 表单数据
const form = reactive({
  name: '',
  phone: '',
  password: '',
  confirmPassword: ''
});

// 注册处理
const handleRegister = () => {
  // 表单验证
  if (!form.name.trim()) {
    uni.showToast({
      title: '请输入姓名',
      icon: 'none'
    });
    return;
  }
  
  if (!form.phone.trim()) {
    uni.showToast({
      title: '请输入手机号码',
      icon: 'none'
    });
    return;
  }
  
  // 验证手机号格式
  if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    uni.showToast({
      title: '请输入正确的手机号码',
      icon: 'none'
    });
    return;
  }
  
  if (!form.password.trim()) {
    uni.showToast({
      title: '请输入密码',
      icon: 'none'
    });
    return;
  }
  
  if (form.password !== form.confirmPassword) {
    uni.showToast({
      title: '两次输入的密码不一致',
      icon: 'none'
    });
    return;
  }
  
  // 提交注册
  uni.showLoading({
    title: '注册中...'
  });
  
  // 调用注册API
  register({
    name: form.name,
    phone: form.phone,
    password: form.password
  }).then((res: any) => {
    uni.hideLoading();
    
    if (res.code === 0) {
      // 保存token和用户信息
      login(res.data.token, {
        id: res.data.id,
        name: res.data.name,
        phone: res.data.phone
      });
      
      uni.showToast({
        title: '注册成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          // 注册成功后跳转到首页
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/index/index'
            });
          }, 2000);
        }
      });
    } else {
      uni.showToast({
        title: res.msg || '注册失败',
        icon: 'none'
      });
    }
  }).catch(() => {
    uni.hideLoading();
    uni.showToast({
      title: '注册失败，请稍后再试',
      icon: 'none'
    });
  });
};

// 跳转到登录页
const goToLogin = () => {
  uni.navigateTo({
    url: '/pages/login/index'
  });
};
</script>

<style lang="scss" scoped>
.register-container {
  min-height: 100vh;
  padding: 0 60rpx;
  background: linear-gradient(180deg, #ffffff 0%, #f0f7ff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.logo-container {
  width: 100%;
  padding-top: 120rpx;
  padding-bottom: 80rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeInDown 0.8s ease-out;
}

.logo-image {
  width: 500rpx;
  height: 160rpx;
  margin-bottom: 20rpx;
}

.logo-title {
  font-size: 40rpx;
  color: #0066cc;
  font-weight: 600;
  letter-spacing: 4rpx;
  margin-top: 20rpx;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-area {
  width: 100%;
  background-color: #fff;
  border-radius: 24rpx;
  padding: 50rpx 40rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.08);
  margin-bottom: auto;
}

.input-group {
  margin-bottom: 35rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  margin-bottom: 15rpx;
  color: #333;
  font-weight: 500;
}

.input-box {
  display: flex;
  align-items: center;
  width: 100%;
  height: 90rpx;
  background-color: #f8f9fc;
  border-radius: 16rpx;
  padding: 0 30rpx;
  font-size: 30rpx;
  box-sizing: border-box;
  border: 2rpx solid #eef1f8;
}

.input-box input {
  flex: 1;
  height: 90rpx;
  background-color: transparent;
  margin-left: 20rpx;
  padding: 0;
  font-size: 30rpx;
}

.submit-btn {
  margin-top: 50rpx;
  height: 90rpx;
  line-height: 90rpx;
  font-size: 32rpx;
  background: linear-gradient(135deg, #2979ff 0%, #0066cc 100%);
  color: #fff;
  border-radius: 16rpx;
  font-weight: 600;
  letter-spacing: 2rpx;
  box-shadow: 0 8rpx 16rpx rgba(41, 121, 255, 0.2);
}

.submit-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 8rpx rgba(41, 121, 255, 0.2);
}

.options {
  display: flex;
  justify-content: center;
  margin-top: 35rpx;
  padding: 0 20rpx;
}

.options text {
  font-size: 28rpx;
  color: #2979ff;
  padding: 10rpx;
}

.options text:active {
  opacity: 0.8;
}
</style> 