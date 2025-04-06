<template>
  <view class="form-container">
    <view class="form-content">
      <!-- 门店 -->
      <view class="form-item">
        <text class="form-label">门店</text>
        <view class="form-input-wrap">
          <input v-if="!showStoreSelect" class="form-input" v-model="formData.store" placeholder="请输入或选择门店" />
          <picker v-else mode="selector" :range="storeList" @change="handleStoreChange" class="form-picker">
            <view class="picker-view">{{ formData.store || '请选择门店' }}</view>
          </picker>
          <text class="select-toggle" @click="showStoreSelect = !showStoreSelect">{{ showStoreSelect ? '手动' : '选择' }}</text>
        </view>
      </view>
      
      <!-- 销售人 -->
      <view class="form-item">
        <text class="form-label">销售人</text>
        <input class="form-input" v-model="formData.salesPerson" placeholder="请输入销售员姓名" disabled />
      </view>
      
      <!-- 手机品牌和型号 -->
      <view class="form-item">
        <text class="form-label">手机品牌</text>
        <view class="form-input-wrap">
          <picker mode="selector" :range="phoneBrandList" @change="handleBrandChange" class="form-picker">
            <view class="picker-view">{{ formData.phoneBrand || '请选择手机品牌' }}</view>
          </picker>
        </view>
      </view>
      
      <view class="form-item">
        <text class="form-label">手机型号</text>
        <view class="form-input-wrap">
          <input v-if="!showModelSelect" class="form-input" v-model="formData.phoneModel" placeholder="请输入或选择手机型号" />
          <picker v-else mode="selector" :range="filteredPhoneModels" @change="handleModelChange" class="form-picker">
            <view class="picker-view">{{ formData.phoneModel || '请选择手机型号' }}</view>
          </picker>
          <text class="select-toggle" @click="showModelSelect = !showModelSelect">{{ showModelSelect ? '手动' : '选择' }}</text>
        </view>
      </view>
      
      <!-- 串码 -->
      <view class="form-item">
        <text class="form-label">串码</text>
        <view class="form-input-wrap">
          <input class="form-input" v-model="formData.serialNumber" placeholder="请输入手机唯一标识码" />
          <view class="scan-btn" @click="scanSerialNumber">
            <uni-icons type="scan" size="16" color="#2979ff"></uni-icons>
            <text style="margin-left: 4px;">扫码</text>
          </view>
        </view>
      </view>
      
      <!-- 客户姓名 -->
      <view class="form-item">
        <text class="form-label">客户姓名</text>
        <input class="form-input" v-model="formData.customerName" placeholder="请输入客户姓名" />
      </view>
      
      <!-- 电话 -->
      <view class="form-item">
        <text class="form-label">电话</text>
        <input class="form-input" type="number" maxlength="11" v-model="formData.customerPhone" placeholder="请输入客户联系电话" />
      </view>
      
      <!-- 拍照上传 -->
      <view class="form-item">
        <text class="form-label">手机照片</text>
        <view class="upload-area">
          <view v-if="formData.photos.length === 0" class="upload-btn" @click="chooseImage">
            <uni-icons type="camera" size="32" color="#999"></uni-icons>
            <text class="upload-text">添加图片</text>
          </view>
          <view v-else class="image-list">
            <view v-for="(photo, index) in formData.photos" :key="index" class="image-item">
              <image :src="photo" mode="aspectFill" class="preview-image" @click="previewImage(index)"></image>
              <text class="delete-btn" @click.stop="deleteImage(index)">×</text>
            </view>
            <view v-if="formData.photos.length < 6" class="upload-btn small" @click="chooseImage">
              <uni-icons type="camera" size="24" color="#999"></uni-icons>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <view class="form-actions">
      <button class="submit-btn" @click="submitForm">提交销售记录</button>
      <button class="reset-btn" @click="resetForm">重置表单</button>
    </view>
    
    <!-- 底部占位，防止内容被TabBar遮挡 -->
    <view style="height: 120rpx;"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { onShow, onLoad } from '@dcloudio/uni-app';
import { isLoggedIn } from '@/utils/auth';
import { submitRecord } from '@/api/record';

// 表单数据
const formData = reactive({
  store: '',
  salesPerson: '',
  phoneBrand: '',
  phoneModel: '',
  serialNumber: '',
  customerName: '',
  customerPhone: '',
  photos: [] as string[]
});

// 下拉选择相关
const showStoreSelect = ref(false);
const showModelSelect = ref(false);
const storeList = ref(['旗舰店', '中心店', '西区店', '南区店', '北区店']);
const phoneBrandList = ref(['Apple', '华为', '小米', 'OPPO', 'vivo', '其他']);

// 按品牌分类的手机型号
const phoneModelMap = {
  'Apple': ['iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14', 'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone SE'],
  '华为': ['Mate 60 Pro', 'Mate 60', 'P60 Pro', 'P60', 'Nova 12 Pro', 'Nova 12', 'Mate X5'],
  '小米': ['小米 14 Ultra', '小米 14 Pro', '小米 14', '小米 Civi 3', 'Redmi K70 Pro', 'Redmi K70', 'Redmi Note 13 Pro'],
  'OPPO': ['Find X7 Ultra', 'Find X7', 'Find X6 Pro', 'Reno 11 Pro', 'Reno 11', 'K12 Pro', 'K12'],
  'vivo': ['X100 Pro', 'X100', 'S18 Pro', 'S18', 'iQOO 12 Pro', 'iQOO 12', 'Y100'],
  '其他': ['三星 Galaxy S23 Ultra', '三星 Galaxy S23', 'Google Pixel 8 Pro', 'Google Pixel 8', '一加 12', '魅族 21 Pro']
};

const phoneModelList = ref(Object.values(phoneModelMap).flat());

// 当前选择的品牌对应的型号列表
const filteredPhoneModels = computed(() => {
  if (!formData.phoneBrand) return [];
  return phoneModelMap[formData.phoneBrand as keyof typeof phoneModelMap] || [];
});

// 处理门店选择
const handleStoreChange = (e: any) => {
  const index = e.detail.value;
  formData.store = storeList.value[index];
};

// 处理品牌选择
const handleBrandChange = (e: any) => {
  const index = e.detail.value;
  formData.phoneBrand = phoneBrandList.value[index];
  // 重置手机型号
  formData.phoneModel = '';
  // 自动切换到选择模式
  showModelSelect.value = true;
};

// 处理型号选择
const handleModelChange = (e: any) => {
  const index = e.detail.value;
  formData.phoneModel = filteredPhoneModels.value[index];
};

// 扫描串码
const scanSerialNumber = () => {
  // 调用扫码API
  uni.scanCode({
    success: (res) => {
      formData.serialNumber = res.result;
    },
    fail: () => {
      uni.showToast({
        title: '扫码失败',
        icon: 'none'
      });
    }
  });
};

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 6 - formData.photos.length,
    sizeType: ['compressed'],
    sourceType: ['camera', 'album'],
    success: (res) => {
      // 将选择的图片添加到数组中
      formData.photos = [...formData.photos, ...res.tempFilePaths];
    }
  });
};

// 预览图片
const previewImage = (index: number) => {
  uni.previewImage({
    urls: formData.photos,
    current: formData.photos[index]
  });
};

// 删除图片
const deleteImage = (index: number) => {
  formData.photos.splice(index, 1);
};

// 检查用户登录状态
const checkLoginStatus = () => {
  if (!isLoggedIn()) {
    uni.showModal({
      title: '提示',
      content: '请先登录后再提交销售记录',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({
            url: '/pages/login/index'
          });
        }
      }
    });
    return false;
  }
  return true;
};

// 表单验证
const validateForm = () => {
  if (!formData.store.trim()) {
    uni.showToast({
      title: '请输入门店',
      icon: 'none'
    });
    return false;
  }
  
  if (!formData.salesPerson.trim()) {
    uni.showToast({
      title: '请输入销售人',
      icon: 'none'
    });
    return false;
  }
  
  if (!formData.phoneBrand.trim()) {
    uni.showToast({
      title: '请选择手机品牌',
      icon: 'none'
    });
    return false;
  }
  
  if (!formData.phoneModel.trim()) {
    uni.showToast({
      title: '请输入手机型号',
      icon: 'none'
    });
    return false;
  }
  
  if (!formData.serialNumber.trim()) {
    uni.showToast({
      title: '请输入串码',
      icon: 'none'
    });
    return false;
  }
  
  if (!formData.customerName.trim()) {
    uni.showToast({
      title: '请输入客户姓名',
      icon: 'none'
    });
    return false;
  }
  
  if (!formData.customerPhone.trim()) {
    uni.showToast({
      title: '请输入客户电话',
      icon: 'none'
    });
    return false;
  }
  
  // 验证手机号格式
  if (!/^1\d{10}$/.test(formData.customerPhone)) {
    uni.showToast({
      title: '手机号格式不正确',
      icon: 'none'
    });
    return false;
  }
  
  if (formData.photos.length === 0) {
    uni.showToast({
      title: '请至少上传一张手机照片',
      icon: 'none'
    });
    return false;
  }
  
  return true;
};

// 提交表单
const submitForm = () => {
  // 检查登录状态
  if (!checkLoginStatus()) {
    return;
  }
  
  // 表单验证
  if (!validateForm()) {
    return;
  }
  
  // 显示加载提示
  uni.showLoading({
    title: '提交中...'
  });
  
  // 调用提交API
  submitRecord(formData).then((res: any) => {
    uni.hideLoading();
    
    if (res.code === 200) {
      uni.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          // 提交成功后重置表单
          setTimeout(() => {
            resetForm();
          }, 2000);
        }
      });
    } else {
      uni.showToast({
        title: res.message || '提交失败',
        icon: 'none'
      });
    }
  }).catch(() => {
    uni.hideLoading();
    uni.showToast({
      title: '提交失败，请稍后再试',
      icon: 'none'
    });
  });
};

// 重置表单
const resetForm = () => {
  formData.store = '';
  formData.salesPerson = '';
  formData.phoneBrand = '';
  formData.phoneModel = '';
  formData.serialNumber = '';
  formData.customerName = '';
  formData.customerPhone = '';
  formData.photos = [];
  showStoreSelect.value = false;
  showModelSelect.value = false;
};

// 初始化用户姓名（如果已登录）
const initUserInfo = () => {
  if (isLoggedIn()) {
    const userInfo = uni.getStorageSync('userInfo');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        formData.salesPerson = user.name || '';
      } catch (e) {
        console.error('解析用户信息失败', e);
      }
    }
  }
};

// 页面挂载时
onMounted(() => {
  initUserInfo();
});

// 页面显示时
onShow(() => {
  initUserInfo();
});

// 页面加载时
onLoad(() => {
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
});
</script>

<style>
.form-container {
  padding: 30rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.form-title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40rpx;
  color: #333;
}

.form-content {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 15rpx;
  font-weight: bold;
}

.form-input {
  width: 100%;
  height: 80rpx;
  background-color: #f9f9f9;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.form-input-wrap {
  display: flex;
  align-items: center;
}

.form-input-wrap .form-input, 
.form-input-wrap .form-picker {
  flex: 1;
}

.picker-view {
  width: 100%;
  height: 80rpx;
  background-color: #f9f9f9;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  line-height: 80rpx;
  color: #333;
}

.select-toggle, .scan-btn {
  margin-left: 20rpx;
  font-size: 26rpx;
  color: #2979ff;
  padding: 10rpx 20rpx;
  background-color: #f0f9ff;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  flex-direction: row;
}

.upload-area {
  width: 100%;
}

.upload-btn {
  width: 200rpx;
  height: 200rpx;
  background-color: #f9f9f9;
  border-radius: 10rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px dashed #ddd;
}

.upload-btn.small {
  width: 150rpx;
  height: 150rpx;
}

.upload-icon {
  font-size: 60rpx;
  color: #999;
  margin-bottom: 10rpx;
}

.upload-text {
  font-size: 26rpx;
  color: #999;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
}

.image-item {
  width: 150rpx;
  height: 150rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  position: relative;
}

.preview-image {
  width: 100%;
  height: 100%;
  border-radius: 10rpx;
}

.delete-btn {
  position: absolute;
  top: -20rpx;
  right: -20rpx;
  width: 40rpx;
  height: 40rpx;
  line-height: 36rpx;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 50%;
  font-size: 30rpx;
}

.form-actions {
  margin-top: 60rpx;
}

.submit-btn {
  height: 90rpx;
  line-height: 90rpx;
  background-color: #2979ff;
  color: #fff;
  font-size: 32rpx;
  margin-bottom: 30rpx;
}

.reset-btn {
  height: 90rpx;
  line-height: 90rpx;
  background-color: #fff;
  color: #666;
  font-size: 32rpx;
  border: 1px solid #ddd;
}
</style>
