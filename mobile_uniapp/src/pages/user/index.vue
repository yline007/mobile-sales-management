<template>
  <view class="user-container">
    <!-- 用户信息头部 -->
    <view class="user-header" :class="{'not-login': !isLogin}" @click="!isLogin && navigateTo('/pages/login/index')">
      <view class="avatar-box">
        <image src="/static/avatar.png" mode="aspectFill" class="avatar-image"></image>
      </view>
      <view class="user-info">
        <view class="username">{{ userInfo.username || '未登录' }}</view>
        <view class="user-role">{{ userInfo.role || '普通用户' }}</view>
      </view>
    </view>
    
    <!-- 菜单列表 -->
    <view class="menu-list">
      <view class="menu-item" @click="navigateTo('/pages/record/index')" v-if="isLogin">
        <view class="menu-left">
          <uni-icons type="flag" size="22" color="#2979ff"></uni-icons>
          <text class="menu-text">销售记录</text>
        </view>
        <uni-icons type="right" size="18" color="#ccc"></uni-icons>
      </view>
      
      <view class="menu-item" @click="navigateTo('/pages/userinfo/index')" v-if="isLogin">
        <view class="menu-left">
          <uni-icons type="person" size="22" color="#2979ff"></uni-icons>
          <text class="menu-text">个人信息</text>
        </view>
        <uni-icons type="right" size="18" color="#ccc"></uni-icons>
      </view>
      
      <view class="menu-item" @click="navigateTo('/pages/password/index')" v-if="isLogin">
        <view class="menu-left">
          <uni-icons type="locked" size="22" color="#2979ff"></uni-icons>
          <text class="menu-text">修改密码</text>
        </view>
        <uni-icons type="right" size="18" color="#ccc"></uni-icons>
      </view>
    </view>
    
    <!-- 退出登录按钮 -->
    <view class="logout-btn" @click="logout" v-if="isLogin">
      退出登录
    </view>
    
    <!-- 底部占位，防止内容被TabBar遮挡 -->
    <view style="height: 120rpx;"></view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        isLogin: false,
        userInfo: {
          username: '',
          role: ''
        }
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
      
      this.checkLoginStatus();
    },
    onShow() {
      this.checkLoginStatus();
    },
    methods: {
      checkLoginStatus() {
        const token = uni.getStorageSync('token');
        this.isLogin = !!token;
        
        if (this.isLogin) {
          // 从本地缓存获取用户信息
          const userInfoString = uni.getStorageSync('userInfo');
          if (userInfoString) {
            try {
              const userInfo = JSON.parse(userInfoString);
              this.userInfo = {
                username: userInfo.name || userInfo.username || '用户',
                role: userInfo.role || '普通用户'
              };
            } catch (e) {
              console.error('解析用户信息失败', e);
            }
          }
        } else {
          this.userInfo = {
            username: '',
            role: ''
          };
        }
      },
      navigateTo(url) {
        // 对需要登录的页面进行处理
        if ((url.includes('/pages/record/') || 
            url.includes('/pages/userinfo/') || 
            url.includes('/pages/password/')) && 
            !this.isLogin) {
          // 如果未登录且访问需要权限的页面，先跳转到登录页
          uni.navigateTo({
            url: '/pages/login/index'
          });
          return;
        }

        uni.navigateTo({
          url
        });
      },
      logout() {
        uni.showModal({
          title: '提示',
          content: '确定要退出登录吗？',
          success: (res) => {
            if (res.confirm) {
              // 清除用户信息和登录状态
              uni.removeStorageSync('token');
              uni.removeStorageSync('userInfo');
              this.isLogin = false;
              this.userInfo = {
                username: '',
                role: ''
              };
              uni.showToast({
                title: '已退出登录',
                icon: 'success'
              });
              
              // 直接跳转到登录页面
              setTimeout(() => {
                uni.redirectTo({
                  url: '/pages/login/index'
                });
              }, 500);
            }
          }
        });
      }
    }
  }
</script>

<style lang="scss">
  .user-container {
    // min-height: 100vh;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
  }
  
  .user-header {
    background-color: #2979ff;
    padding: 30rpx;
    display: flex;
    align-items: center;
    position: relative;
  }
  
  .avatar-box {
    width: 120rpx;
    height: 120rpx;
    border-radius: 60rpx;
    background-color: #fff;
    overflow: hidden;
    margin-right: 30rpx;
  }
  
  .avatar-image {
    width: 100%;
    height: 100%;
  }
  
  .user-info {
    color: #fff;
  }
  
  .username {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
  }
  
  .user-role {
    font-size: 28rpx;
    opacity: 0.9;
  }
  
  .menu-list {
    background-color: #fff;
    margin: 30rpx 0;
    border-radius: 12rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  }
  
  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 36rpx 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
  }
  
  .menu-left {
    display: flex;
    align-items: center;
  }
  
  .menu-text {
    font-size: 32rpx;
    margin-left: 26rpx;
    color: #333;
  }
  
  .logout-btn {
    background-color: #fff;
    text-align: center;
    color: #ff5252;
    font-size: 32rpx;
    padding: 36rpx 0;
    margin: 30rpx 0;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  }
  
  .user-header.not-login {
    cursor: pointer;
  }
  
  .user-header.not-login:active {
    opacity: 0.9;
  }
</style> 