<template>
  <view class="record-container">
    <view class="record-header">
      <view class="header-title">今日销售记录</view>
      <view class="header-count" v-if="total > 0">共 {{ total }} 条</view>
    </view>
    
    <view class="record-empty" v-if="recordList.length === 0">
      <image src="/static/empty.png" mode="aspectFit" class="empty-image"></image>
      <text class="empty-text">暂无销售记录</text>
    </view>
    
    <view class="record-list" v-else>
      <view class="record-item" v-for="(item, index) in recordList" :key="item.id">
        <view class="record-info">
          <view class="record-title">
            <text class="store-name">{{ item.store_name }}</text>
            <text class="record-time">{{ item.create_time }}</text>
          </view>
          <view class="record-phone">
            <text class="phone-model">{{ item.phone_brand_name }} {{ item.phone_model_name }}</text>
            <text class="phone-imei">IMEI: {{ item.imei }}</text>
          </view>
          <view class="record-customer">
            <text class="customer-info">{{ item.customer_name }} {{ item.customer_phone }}</text>
            <view class="photo-count" v-if="item.photo_url && item.photo_url.length">
              <uni-icons type="image" size="14"></uni-icons>
              <text>{{ item.photo_url.length }}</text>
            </view>
          </view>
          <view class="record-remark" v-if="item.remark">
            <text class="remark-text">备注：{{ item.remark }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getTodaySales } from '@/api/record'

export default {
  onPullDownRefresh() {
    this.loadRecordData(true);
  },
  data() {
    return {
      recordList: [],
      total: 0,
      loading: false
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
      
      setTimeout(() => {
        uni.redirectTo({
          url: '/pages/login/index'
        });
      }, 1500);
      return;
    }
    
    this.loadRecordData();
  },
  methods: {
    async loadRecordData(isPullDown = false) {
      if (this.loading) return;
      
      this.loading = true;
      
      // 只在非下拉刷新时显示loading
      if (!isPullDown) {
        uni.showLoading({
          title: '加载中...'
        });
      }
      
      try {
        const res = await getTodaySales();
        
        if (res.code === 0 && res.data) {
          this.recordList = res.data.list;
          this.total = res.data.total;
          
          if (isPullDown) {
            uni.showToast({
              title: '刷新成功',
              icon: 'success',
              duration: 1000
            });
          }
        } else {
          uni.showToast({
            title: res.msg || '获取记录失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('获取销售记录失败:', error);
        uni.showToast({
          title: '获取记录失败，请稍后重试',
          icon: 'none'
        });
      } finally {
        this.loading = false;
        if (!isPullDown) {
          uni.hideLoading();
        }
        // 停止下拉刷新动画
        if (isPullDown) {
          uni.stopPullDownRefresh();
        }
      }
    }
  }
}
</script>

<style lang="scss">
.record-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 30rpx;
}

.record-header {
  background-color: #2979ff;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
}

.header-count {
  color: rgba(255, 255, 255, 0.9);
  font-size: 24rpx;
}

.record-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 100rpx;
}

.empty-image {
  width: 240rpx;
  height: 240rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  color: #999;
  font-size: 28rpx;
}

.record-list {
  padding: 20rpx;
}

.record-item {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.record-info {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.record-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.store-name {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.record-time {
  font-size: 24rpx;
  color: #999;
}

.record-phone {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.phone-model {
  font-size: 28rpx;
  color: #666;
}

.phone-imei {
  font-size: 24rpx;
  color: #999;
}

.record-customer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8rpx;
}

.customer-info {
  font-size: 26rpx;
  color: #666;
}

.photo-count {
  display: flex;
  align-items: center;
  gap: 4rpx;
  color: #2979ff;
  font-size: 24rpx;
}

.record-remark {
  margin-top: 8rpx;
  padding-top: 8rpx;
  border-top: 1rpx solid #eee;
}

.remark-text {
  font-size: 24rpx;
  color: #999;
}
</style> 