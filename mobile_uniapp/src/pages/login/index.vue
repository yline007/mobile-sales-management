<template>
  <view class="login-container">
    <view class="logo-area">
      <view class="logo-icon">
        <uni-icons type="shop" size="80" color="#2979ff"></uni-icons>
      </view>
      <text class="title">销售记录管理系统</text>
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
import { login as userLogin } from '@/api/user';
import { login, isLoggedIn } from '@/utils/auth';

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
  
  // 调用登录API
  userLogin({
    phone: form.phone,
    password: form.password
  }).then((res: any) => {
    uni.hideLoading();
    
    if (res.code === 200) {
      // 登录成功，保存token和用户信息
      login(res.data.token, res.data.userInfo);
      
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
        title: res.message || '登录失败',
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

<style>
.login-container {
  padding: 60rpx 50rpx;
  box-sizing: border-box;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;
  margin-top: 80rpx;
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

input {
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
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

/* 测试账号登录按钮样式 */
.test-login-btn {
  margin-top: 30rpx;
  height: 90rpx;
  line-height: 90rpx;
  font-size: 32rpx;
  background-color: #f0f9ff;
  color: #2979ff;
  border: 1px solid #2979ff;
  border-radius: 10rpx;
}

.options {
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;
  padding: 0 20rpx;
}

.options text {
  font-size: 26rpx;
  color: #2979ff;
}
</style> 