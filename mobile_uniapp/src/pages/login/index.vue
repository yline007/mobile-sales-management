<template>
  <view class="login-container">
    <view class="logo-container">
      <image class="logo-image" src="/static/images/china-mobile-5g.png" mode="aspectFit"></image>
      <view class="logo-title">移动销售管理系统</view>
    </view>
    
    <view class="form-area">
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
          <input type="password" v-model="form.password" placeholder="请输入密码" password />
        </view>
      </view>
      
      <button class="submit-btn" @click="handleLogin">登录</button>
      
      <!-- 测试账号快捷登录按钮 -->
      <button class="test-login-btn" @click="handleTestLogin">测试账号登录</button>
      
      <view class="options">
        <text @click="goToRegister">注册账号</text>
        <text @click="goToForget">忘记密码</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { login as salespersonLogin } from '@/api/salesperson';
import { login } from '@/utils/auth';

// 表单数据
const form = reactive({
  phone: '',
  password: ''
});

// 登录处理
const handleLogin = () => {
  // 表单验证
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
  
  // 发送登录请求
  uni.showLoading({
    title: '登录中...'
  });
  
  // 调用销售员登录API
  salespersonLogin({
    phone: form.phone,
    password: form.password
  }).then((res: any) => {
    uni.hideLoading();
    
    if (res.code === 0) {
      // 登录成功，保存token和用户信息
      login(res.data.token, {
        id: res.data.id,
        name: res.data.name,
        phone: res.data.phone,
        store_id: res.data.store_id,
        employee_id: res.data.employee_id
      });
      
      uni.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          // 登录成功后跳转到首页
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/index/index'
            });
          }, 1500);
        }
      });
    } else {
      // 登录失败
      uni.showToast({
        title: res.msg || '登录失败',
        icon: 'none'
      });
    }
  }).catch(() => {
    uni.hideLoading();
    uni.showToast({
      title: '登录失败，请稍后再试',
      icon: 'none'
    });
  });
};

// 使用测试账号登录
const handleTestLogin = () => {
  // 设置测试账号
  form.phone = '13800138000';
  form.password = '123456';
  
  // 模拟登录过程
  uni.showLoading({
    title: '登录中...'
  });
  
  // 使用模拟数据
  setTimeout(() => {
    uni.hideLoading();
    
    // 模拟用户数据
    const mockToken = 'mock-token-123456';
    const mockUserInfo = {
      id: 'test001',
      name: '测试用户',
      phone: '13800138000'
    };
    
    // 保存登录状态
    login(mockToken, mockUserInfo);
    
    uni.showToast({
      title: '测试账号登录成功',
      icon: 'success',
      duration: 1500,
      success: () => {
        // 登录成功后跳转到首页
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/index/index'
          });
        }, 1500);
      }
    });
  }, 800);
};

// 跳转到注册页
const goToRegister = () => {
  uni.navigateTo({
    url: '/pages/register/index'
  });
};

// 跳转到忘记密码页
const goToForget = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  });
};

// 页面加载时检查是否已登录
onLoad(() => {
  const token = uni.getStorageSync('token');
  if (token) {
    uni.switchTab({
      url: '/pages/index/index'
    });
  }
});
</script>

<style lang="scss" scoped>
.login-container {
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

/* 测试账号登录按钮样式 */
.test-login-btn {
  margin-top: 25rpx;
  height: 90rpx;
  line-height: 90rpx;
  font-size: 32rpx;
  background-color: #f0f7ff;
  color: #2979ff;
  border: 2rpx solid #2979ff;
  border-radius: 16rpx;
  font-weight: 500;
}

.test-login-btn:active {
  background-color: #e5f0ff;
}

.options {
  display: flex;
  justify-content: space-between;
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