<template>
  <view class="register-container">
    <view class="logo-area">
      <view class="logo-icon">
        <uni-icons type="shop" size="80" color="#2979ff"></uni-icons>
      </view>
      <text class="title">销售记录管理系统</text>
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
          <input type="text" v-model="form.phone" placeholder="请输入手机号码" maxlength="11" />
        </view>
      </view>
      
      <view class="input-group">
        <text class="label">验证码</text>
        <view class="code-input-box">
          <view class="input-box code-input">
            <uni-icons type="locked" size="20" color="#999"></uni-icons>
            <input type="text" v-model="form.code" placeholder="请输入验证码" maxlength="6" />
          </view>
          <button class="code-btn" :disabled="codeCountdown > 0" @click="sendCode">
            {{codeCountdown > 0 ? `${codeCountdown}秒后重发` : '获取验证码'}}
          </button>
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
      
      <view class="login-link">
        <text>已有账号？</text>
        <text class="link" @click="goToLogin">去登录</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { register } from '@/api/user';

// 表单数据
const form = reactive({
  name: '',
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
});

// 验证码倒计时
const codeCountdown = ref(0);

// 发送验证码
const sendCode = () => {
  if (!form.phone.trim()) {
    uni.showToast({
      title: '请输入手机号码',
      icon: 'none'
    });
    return;
  }
  
  if (!/^1\d{10}$/.test(form.phone)) {
    uni.showToast({
      title: '手机号格式不正确',
      icon: 'none'
    });
    return;
  }
  
  // 开始倒计时
  codeCountdown.value = 60;
  
  // 模拟发送验证码
  uni.showToast({
    title: '验证码已发送',
    icon: 'success'
  });
  
  // 倒计时
  const timer = setInterval(() => {
    codeCountdown.value--;
    if (codeCountdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

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
  
  if (!form.code.trim()) {
    uni.showToast({
      title: '请输入验证码',
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
  
  // 模拟注册请求，正常应该调用API
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({
      title: '注册成功',
      icon: 'success',
      duration: 2000,
      success: () => {
        // 注册成功后跳转到登录页
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/login/index'
          });
        }, 2000);
      }
    });
  }, 1500);
};

// 跳转到登录页
const goToLogin = () => {
  uni.navigateTo({
    url: '/pages/login/index'
  });
};
</script>

<style>
.register-container {
  padding: 60rpx 50rpx;
  height: 100vh;
  box-sizing: border-box;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
  margin-top: 20rpx;
}

.logo-icon {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border-radius: 80rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.form-area {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 30rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  margin-bottom: 15rpx;
  color: #333;
}

.input-box {
  display: flex;
  align-items: center;
  width: 100%;
  height: 80rpx;
  background-color: #f9f9f9;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.input-box input {
  flex: 1;
  height: 80rpx;
  background-color: transparent;
  margin-left: 15rpx;
  padding: 0;
}

.code-input-box {
  display: flex;
  align-items: center;
}

.code-input {
  flex: 1;
  margin-right: 20rpx;
}

.code-btn {
  width: 220rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 26rpx;
  background-color: #2979ff;
  color: #fff;
  border-radius: 10rpx;
  padding: 0;
  margin: 0;
}

.code-btn[disabled] {
  background-color: #cccccc;
  color: #ffffff;
}

.submit-btn {
  margin-top: 50rpx;
  height: 90rpx;
  line-height: 90rpx;
  font-size: 32rpx;
  background-color: #2979ff;
  color: #fff;
  border-radius: 10rpx;
}

.login-link {
  display: flex;
  justify-content: center;
  margin-top: 30rpx;
  font-size: 26rpx;
  color: #666;
}

.link {
  color: #2979ff;
  margin-left: 10rpx;
}
</style> 