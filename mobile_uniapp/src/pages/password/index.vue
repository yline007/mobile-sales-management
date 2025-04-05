<template>
  <view class="password-container">
    <view class="password-header">
      <view class="header-title">修改密码</view>
    </view>
    
    <view class="password-form">
      <view class="form-item">
        <view class="form-label">原密码</view>
        <input type="password" class="form-input" v-model="form.oldPassword" placeholder="请输入原密码" />
      </view>
      
      <view class="form-item">
        <view class="form-label">新密码</view>
        <input type="password" class="form-input" v-model="form.newPassword" placeholder="请输入新密码" />
      </view>
      
      <view class="form-item">
        <view class="form-label">确认密码</view>
        <input type="password" class="form-input" v-model="form.confirmPassword" placeholder="请再次输入新密码" />
      </view>
    </view>
    
    <view class="password-tips">
      <text class="tips-text">密码长度至少6位，包含字母和数字</text>
    </view>
    
    <view class="password-action">
      <button class="action-btn" @click="submitForm">确认修改</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 表单数据
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    // 提交表单
    submitForm() {
      // 表单验证
      if (!this.form.oldPassword.trim()) {
        uni.showToast({
          title: '请输入旧密码',
          icon: 'none'
        });
        return;
      }
      
      if (!this.form.newPassword.trim()) {
        uni.showToast({
          title: '请输入新密码',
          icon: 'none'
        });
        return;
      }
      
      if (!this.form.confirmPassword.trim()) {
        uni.showToast({
          title: '请输入确认密码',
          icon: 'none'
        });
        return;
      }
      
      if (this.form.newPassword !== this.form.confirmPassword) {
        uni.showToast({
          title: '两次输入的密码不一致',
          icon: 'none'
        });
        return;
      }
      
      // 提交到后端
      uni.showLoading({
        title: '提交中...'
      });
      
      // 模拟提交
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '密码修改成功',
          icon: 'success'
        });
        
        // 成功后返回
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }, 1000);
    }
  },
  onLoad() {
    // 检查登录状态
    const token = uni.getStorageSync('token');
    if (!token) {
      uni.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      });
      
      // 跳转到登录页
      setTimeout(() => {
        uni.redirectTo({
          url: '/pages/login/index'
        });
      }, 1500);
      return;
    }
  }
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

.form-input {
  height: 80rpx;
  font-size: 30rpx;
  color: #333;
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