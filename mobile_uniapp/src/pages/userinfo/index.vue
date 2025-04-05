<template>
  <view class="userinfo-container">
    <view class="userinfo-header">
      <view class="header-title">个人信息</view>
    </view>
    
    <view class="userinfo-form">
      <view class="form-item">
        <view class="form-label">
          <uni-icons type="person" size="20" color="#2979ff"></uni-icons>
          <text class="label-text">姓名</text>
        </view>
        <input class="form-input" v-model="userInfo.name" placeholder="请输入姓名" :disabled="!isEdit" />
      </view>
      
      <view class="form-item">
        <view class="form-label">
          <uni-icons type="phone" size="20" color="#2979ff"></uni-icons>
          <text class="label-text">手机号</text>
        </view>
        <input class="form-input" v-model="userInfo.phone" placeholder="请输入手机号" :disabled="!isEdit" />
      </view>
      
      <view class="form-item">
        <view class="form-label">
          <uni-icons type="mail" size="20" color="#2979ff"></uni-icons>
          <text class="label-text">邮箱</text>
        </view>
        <input class="form-input" v-model="userInfo.email" placeholder="请输入邮箱" :disabled="!isEdit" />
      </view>
    </view>
    
    <view class="userinfo-actions">
      <button v-if="!isEdit" class="edit-btn" @click="startEdit">
        <uni-icons type="compose" size="18" color="#ffffff"></uni-icons>
        <text style="margin-left: 6rpx;">编辑资料</text>
      </button>
      <button v-else class="save-btn" @click="saveUserInfo">
        <uni-icons type="checkmarkempty" size="18" color="#ffffff"></uni-icons>
        <text style="margin-left: 6rpx;">保存资料</text>
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        username: '',
        role: '',
        phone: '',
        email: ''
      },
      isEdit: false
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
    
    // 获取用户信息
    this.loadUserInfo();
  },
  methods: {
    loadUserInfo() {
      // 从本地存储获取用户信息
      const userInfoString = uni.getStorageSync('userInfo');
      if (userInfoString) {
        this.userInfo = JSON.parse(userInfoString);
      } else {
        // 模拟用户数据
        this.userInfo = {
          username: '测试用户',
          role: '销售员',
          phone: '13800138000',
          email: 'test@example.com'
        };
        
        // 保存到本地存储
        uni.setStorageSync('userInfo', JSON.stringify(this.userInfo));
      }
    },
    startEdit() {
      this.isEdit = true;
    },
    saveUserInfo() {
      // 表单验证
      if (!this.userInfo.name.trim()) {
        uni.showToast({
          title: '请输入姓名',
          icon: 'none'
        });
        return;
      }
      
      if (!this.userInfo.phone.trim()) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        });
        return;
      }
      
      // 显示加载提示
      uni.showLoading({
        title: '保存中...'
      });
      
      // 模拟提交
      setTimeout(() => {
        uni.hideLoading();
        
        // 更新本地存储
        try {
          const userInfoStr = uni.getStorageSync('userInfo');
          if (userInfoStr) {
            const oldUserInfo = JSON.parse(userInfoStr);
            const newUserInfo = {
              ...oldUserInfo,
              name: this.userInfo.name,
              phone: this.userInfo.phone,
              email: this.userInfo.email
            };
            uni.setStorageSync('userInfo', JSON.stringify(newUserInfo));
          }
        } catch (e) {
          console.error('保存用户信息失败', e);
        }
        
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        });
        
        this.isEdit = false;
      }, 1000);
    }
  }
}
</script>

<style lang="scss">
.userinfo-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.userinfo-header {
  background-color: #2979ff;
  padding: 20rpx 30rpx;
}

.header-title {
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
}

.userinfo-form {
  background-color: #fff;
  margin-top: 20rpx;
  padding: 0 30rpx;
}

.form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #eee;
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.label-text {
  margin-left: 10rpx;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.form-value {
  color: #333;
  font-size: 30rpx;
}

.userinfo-actions {
  margin-top: 50rpx;
  padding: 0 20rpx;
}

.edit-btn, .save-btn {
  width: 100%;
  height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10rpx;
  font-size: 32rpx;
}

.edit-btn {
  background-color: #2979ff;
  color: #fff;
}

.save-btn {
  background-color: #07c160;
  color: #fff;
}

.form-input {
  height: 80rpx;
  background-color: #f9f9f9;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}
</style> 