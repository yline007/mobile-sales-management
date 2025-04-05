<template>
  <view class="record-container">
    <view class="record-header">
      <view class="header-title">销售记录</view>
    </view>
    
    <view class="record-empty" v-if="recordList.length === 0">
      <image src="/static/empty.png" mode="aspectFit" class="empty-image"></image>
      <text class="empty-text">暂无销售记录</text>
    </view>
    
    <view class="record-list" v-else>
      <view class="record-item" v-for="(item, index) in recordList" :key="index">
        <view class="record-info">
          <view class="record-title">订单号：{{ item.orderNo }}</view>
          <view class="record-time">{{ item.createTime }}</view>
        </view>
        <view class="record-amount">¥{{ item.amount }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      recordList: []
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
    
    // 初始化数据
    this.initData();
  },
  methods: {
    initData() {
      // 模拟加载销售记录数据
      setTimeout(() => {
        this.loadRecordData();
      }, 500);
    },
    loadRecordData() {
      // 这里只是模拟数据，实际应该从API获取
      this.recordList = [
        { orderNo: 'SO20230001', amount: '1280.00', createTime: '2023-08-15 15:30:45' },
        { orderNo: 'SO20230002', amount: '980.50', createTime: '2023-08-20 10:15:22' },
        { orderNo: 'SO20230003', amount: '2460.00', createTime: '2023-09-05 16:45:30' }
      ];
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
}

.header-title {
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
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
  border-radius: 10rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-title {
  font-size: 30rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.record-time {
  font-size: 24rpx;
  color: #999;
}

.record-amount {
  font-size: 36rpx;
  color: #f56c6c;
  font-weight: bold;
}
</style> 