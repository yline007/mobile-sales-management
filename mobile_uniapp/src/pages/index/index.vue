<template>
  <view class="form-container">
    <view class="form-content">
      <!-- 门店 -->
      <view class="form-item">
        <text class="form-label">门店</text>
        <view class="form-input-wrap">
          <input class="form-input" v-model="formData.store_name" placeholder="请输入门店名称" />
        </view>
      </view>
      
      <!-- 销售人员 -->
      <view class="form-item">
        <text class="form-label">销售人员</text>
        <input class="form-input" v-model="formData.salesperson_name" placeholder="销售人员姓名" disabled />
      </view>
      
      <!-- 手机品牌和型号 -->
      <view class="form-item">
        <text class="form-label">手机品牌</text>
        <view class="form-input-wrap">
          <picker mode="selector" :range="phoneBrandList" range-key="name" @change="handleBrandChange" class="form-picker">
            <view class="picker-view">{{ formData.phone_brand_name || '请选择手机品牌' }}</view>
          </picker>
        </view>
      </view>
      
      <view class="form-item">
        <text class="form-label">手机型号</text>
        <view class="form-input-wrap">
          <input v-if="!showModelSelect" class="form-input" v-model="formData.phone_model_name" placeholder="请输入或选择手机型号" />
          <picker v-else mode="selector" :range="phoneModelList" range-key="name" @change="handleModelChange" class="form-picker" :disabled="!formData.phone_brand_name">
            <view class="picker-view">{{ formData.phone_model_name || '请选择手机型号' }}</view>
          </picker>
          <text class="select-toggle" @click="showModelSelect = !showModelSelect">{{ showModelSelect ? '手动' : '选择' }}</text>
        </view>
      </view>
      
      <!-- 串码 -->
      <view class="form-item">
        <text class="form-label">串码</text>
        <view class="form-input-wrap">
          <input class="form-input" v-model="formData.imei" placeholder="请输入手机唯一标识码" />
          <view class="scan-btn" @click="scanSerialNumber">
            <uni-icons type="scan" size="16" color="#2979ff"></uni-icons>
            <text style="margin-left: 4px;">扫码</text>
          </view>
        </view>
      </view>
      
      <!-- 客户姓名 -->
      <view class="form-item">
        <text class="form-label">客户姓名</text>
        <input class="form-input" v-model="formData.customer_name" placeholder="请输入客户姓名" />
      </view>
      
      <!-- 电话 -->
      <view class="form-item">
        <text class="form-label">电话</text>
        <input class="form-input" type="number" maxlength="11" v-model="formData.customer_phone" placeholder="请输入客户联系电话" />
      </view>
      
      <!-- 拍照上传 -->
      <view class="form-item">
        <text class="form-label">手机照片</text>
        <view class="upload-area">
          <view v-if="formData.photo_url.length === 0" class="upload-btn" @click="chooseImage">
            <uni-icons type="camera" size="32" color="#999"></uni-icons>
            <text class="upload-text">添加图片</text>
          </view>
          <view v-else class="image-list">
            <view v-for="(photo, index) in formData.photo_url" :key="index" class="image-item">
              <image :src="photo" mode="aspectFill" class="preview-image" @click="previewImage(index)"></image>
              <text class="delete-btn" @click.stop="deleteImage(index)">×</text>
            </view>
            <view v-if="formData.photo_url.length < 6" class="upload-btn small" @click="chooseImage">
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
import { submitRecord, type SalesRecordSubmitData } from '@/api/record';
import { getStoreList, type Store } from '@/api/store';
import { getBrandList, getModelList, type PhoneBrand, type PhoneModel } from '@/api/phone';
import { BASE_URL } from '@/utils/request';
import { ApiResponse } from '@/api/types';

// 图片压缩配置
const compressConfig = {
  maxWidth: 1280,  // 最大宽度
  maxHeight: 1280, // 最大高度
  quality: 0.8,    // 压缩质量
  maxSize: 1024 * 1024  // 1MB以上的图片进行压缩
};

// 是否显示门店选择器
const showStorePicker = ref(true);

// 表单数据
const formData = reactive({
  store_id: 0,
  store_name: '',
  salesperson_name: '',
  phone_brand_id: 0,
  phone_brand_name: '',
  phone_model_id: 0,
  phone_model_name: '',
  imei: '',
  customer_name: '',
  customer_phone: '',
  photo_url: [] as string[],
  remark: '',
  uploadingCount: 0
});

// 下拉选择相关
const showModelSelect = ref(false);
const storeList = ref<Store[]>([]);
const phoneBrandList = ref<PhoneBrand[]>([]);
const phoneModelList = ref<PhoneModel[]>([]);

// 加载门店列表
const loadStoreList = async () => {
  try {
    const res: ApiResponse<Store[]> = await getStoreList();
    if (res.code === 0) {
      storeList.value = res.data;
    } else {
      uni.showToast({
        title: res.msg || '获取门店列表失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('获取门店列表失败:', error);
    uni.showToast({
      title: '获取门店列表失败',
      icon: 'none'
    });
  }
};

// 加载手机品牌列表
const loadPhoneBrands = async () => {
  try {
    const res = await getBrandList();
    if (res.code === 0) {
      phoneBrandList.value = res.data;
    } else {
      uni.showToast({
        title: res.msg || '获取手机品牌失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('获取手机品牌失败:', error);
    uni.showToast({
      title: '获取手机品牌失败',
      icon: 'none'
    });
  }
};

// 加载手机型号列表
const loadPhoneModels = async (brandId: number) => {
  try {
    const res = await getModelList(brandId);
    if (res.code === 0) {
      phoneModelList.value = res.data;
    } else {
      uni.showToast({
        title: res.msg || '获取手机型号失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('获取手机型号失败:', error);
    uni.showToast({
      title: '获取手机型号失败',
      icon: 'none'
    });
  }
};

// 处理门店选择
const handleStoreChange = (e: any) => {
  const index = e.detail.value;
  const selectedStore = storeList.value[index];
  formData.store_id = selectedStore.id;
  formData.store_name = selectedStore.name;
};

// 处理品牌选择
const handleBrandChange = async (e: any) => {
  const index = e.detail.value;
  const selectedBrand = phoneBrandList.value[index];
  formData.phone_brand_id = selectedBrand.id;
  formData.phone_brand_name = selectedBrand.name;
  formData.phone_model_id = 0;
  formData.phone_model_name = ''; // 重置手机型号
  showModelSelect.value = false;
  
  // 加载该品牌的手机型号
  await loadPhoneModels(selectedBrand.id);
};

// 处理型号选择
const handleModelChange = (e: any) => {
  const index = e.detail.value;
  const selectedModel = phoneModelList.value[index];
  formData.phone_model_id = selectedModel.id;
  formData.phone_model_name = selectedModel.name;
};

// 扫描串码
const scanSerialNumber = () => {
  // 调用扫码API
  uni.scanCode({
    success: (res) => {
      formData.imei = res.result;
    },
    fail: () => {
      uni.showToast({
        title: '扫码失败',
        icon: 'none'
      });
    }
  });
};

// 压缩图片函数
const compressImage = (tempFilePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // #ifdef H5
    if (tempFilePath.startsWith('blob:')) {
      // H5环境使用canvas压缩
      fetch(tempFilePath)
        .then(response => response.blob())
        .then(blob => {
          // 检查文件大小，小于阈值不压缩
          if (blob.size <= compressConfig.maxSize) {
            console.log('图片小于阈值，不压缩', blob.size);
            resolve(tempFilePath);
            return;
          }
          
          const img = new Image();
          img.src = tempFilePath;
          img.onload = () => {
            // 计算压缩后的尺寸
            let width = img.width;
            let height = img.height;
            
            if (width > compressConfig.maxWidth || height > compressConfig.maxHeight) {
              const ratio = Math.min(
                compressConfig.maxWidth / width,
                compressConfig.maxHeight / height
              );
              width = Math.floor(width * ratio);
              height = Math.floor(height * ratio);
            }
            
            // 创建canvas并绘制图片
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            // 转换为Blob
            canvas.toBlob((compressedBlob) => {
              if (compressedBlob) {
                console.log('压缩前大小:', blob.size, '压缩后大小:', compressedBlob.size);
                // 创建新的Blob URL
                const compressedUrl = URL.createObjectURL(compressedBlob);
                resolve(compressedUrl);
              } else {
                // 压缩失败，使用原始图片
                console.warn('压缩失败，使用原图');
                resolve(tempFilePath);
              }
            }, 'image/jpeg', compressConfig.quality);
          };
          
          img.onerror = () => {
            console.error('图片加载失败');
            resolve(tempFilePath);
          };
        })
        .catch(err => {
          console.error('压缩过程出错', err);
          resolve(tempFilePath);
        });
      return;
    }
    // #endif
    
    // #ifdef MP
    // 小程序环境使用uni.compressImage
    uni.getFileInfo({
      filePath: tempFilePath,
      success: (res) => {
        if (res.size <= compressConfig.maxSize) {
          console.log('图片小于阈值，不压缩', res.size);
          resolve(tempFilePath);
          return;
        }
        
        // 使用小程序API压缩图片
        uni.compressImage({
          src: tempFilePath,
          quality: compressConfig.quality * 100, // 0-100的整数
          success: (compressRes) => {
            console.log('压缩成功，新路径:', compressRes.tempFilePath);
            resolve(compressRes.tempFilePath);
          },
          fail: (err) => {
            console.error('压缩失败', err);
            resolve(tempFilePath); // 失败时使用原图
          }
        });
      },
      fail: () => {
        // 无法获取文件信息，使用原图
        resolve(tempFilePath);
      }
    });
    // #endif
    
    // #ifndef MP || H5
    // 其他环境暂不处理，直接返回原路径
    resolve(tempFilePath);
    // #endif
  });
};

// 上传单张图片
const uploadImage = async (tempFilePath: string) => {
  formData.uploadingCount++;
  
  try {
    // #ifdef H5
    // H5环境下特殊处理blob URL
    if (tempFilePath.startsWith('blob:')) {
      console.log('H5环境下处理blob URL:', tempFilePath);
      
      // 创建FormData对象（使用不同的变量名避免冲突）
      const formDataH5 = new FormData();
      formDataH5.append('type', 'sales_record');
      
      try {
        // 获取blob对象
        const response = await fetch(tempFilePath);
        const blob = await response.blob();
        
        // 添加到FormData，使用File对象包装blob
        const file = new File([blob], 'image.png', { type: 'image/png' });
        formDataH5.append('images', file);
        
        // 使用fetch API直接上传
        const uploadResponse = await fetch(`${BASE_URL}/api/salesperson/upload_images`, {
          method: 'POST',
          headers: {
            'Authorization': uni.getStorageSync('token')
          },
          body: formDataH5
        });
        
        // 处理响应
        if (uploadResponse.ok) {
          const result = await uploadResponse.json();
          console.log('上传结果：', result);
          
          if (result.code === 0) {
            const newUrls = result.data.urls.map((url: string) => `${BASE_URL}${url}`);
            formData.photo_url = [...formData.photo_url, ...newUrls];
            uni.showToast({
              title: '上传成功',
              icon: 'success'
            });
          } else {
            uni.showToast({
              title: result.msg || '图片上传失败',
              icon: 'none'
            });
          }
        } else {
          uni.showToast({
            title: '图片上传失败: ' + uploadResponse.statusText,
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('H5环境处理blob失败:', error);
        uni.showToast({
          title: '图片上传失败',
          icon: 'none'
        });
      } finally {
        formData.uploadingCount--;
      }
      return;
    }
    // #endif
    
    // 小程序环境或H5非blob的情况
    const uploadTask = uni.uploadFile({
      url: `${BASE_URL}/api/salesperson/upload_images`,
      filePath: tempFilePath,
      name: 'images',
      header: {
        'Authorization': uni.getStorageSync('token')
      },
      formData: {
        type: 'sales_record'
      },
      success: (uploadRes) => {
        try {
          // 修复小程序端响应解析问题
          let result;
          if (typeof uploadRes.data === 'string') {
            // 尝试解析JSON字符串
            try {
              result = JSON.parse(uploadRes.data);
            } catch (parseError) {
              console.error('JSON解析失败:', parseError, uploadRes.data);
              // 检查是否是HTML响应
              if (uploadRes.data.includes('<!DOCTYPE html>')) {
                uni.showToast({
                  title: '服务器返回了HTML页面，请检查后端配置',
                  icon: 'none',
                  duration: 3000
                });
                return;
              }
              
              // 返回的不是有效的JSON，尝试其他方式处理
              result = { code: 500, msg: '响应格式错误', data: {} };
            }
          } else {
            // 已经是对象
            result = uploadRes.data;
          }
          
          console.log('上传结果：', result);
          
          // 检查是否状态码为200但data不是JSON对象情况
          if (uploadRes.statusCode === 200 && result.code === undefined) {
            // 可能返回了一个成功状态但没有正确的JSON格式
            if (formData.photo_url.length < 6) {
              // 直接使用临时路径作为预览
              formData.photo_url.push(tempFilePath);
              uni.showToast({
                title: '上传成功(本地预览)',
                icon: 'success'
              });
            }
            return;
          }
          
          if (result.code === 0) {
            // 将新上传的图片URL添加到现有数组中，而不是替换
            if (result.data && result.data.urls) {
              const newUrls = result.data.urls.map((url: string) => `${BASE_URL}${url}`);
              formData.photo_url = [...formData.photo_url, ...newUrls];
            }
            uni.showToast({
              title: '上传成功',
              icon: 'success'
            });
          } else {
            uni.showToast({
              title: result.msg || '图片上传失败',
              icon: 'none'
            });
          }
        } catch (e) {
          console.error('解析上传结果失败', e, uploadRes);
          // 尝试使用本地路径
          if (formData.photo_url.length < 6) {
            formData.photo_url.push(tempFilePath);
            uni.showToast({
              title: '上传成功(本地预览)',
              icon: 'success'
            });
          } else {
            uni.showToast({
              title: '图片上传失败',
              icon: 'none'
            });
          }
        }
      },
      fail: (error) => {
        console.error('上传失败:', error);
        uni.showToast({
          title: '图片上传失败: ' + error.errMsg,
          icon: 'none',
          duration: 3000
        });
      },
      complete: () => {
        formData.uploadingCount--;
      }
    });
    
    // 监听上传进度
    uploadTask.onProgressUpdate((res) => {
      console.log('上传进度', res.progress);
    });
  } catch (error) {
    console.error('上传图片失败:', error);
    formData.uploadingCount--;
    uni.showToast({
      title: '图片上传失败',
      icon: 'none'
    });
  }
};

// 选择图片
const chooseImage = () => {
  if (formData.uploadingCount > 0) {
    uni.showToast({
      title: '请等待当前图片上传完成',
      icon: 'none'
    });
    return;
  }
  
  uni.chooseImage({
    count: 6 - formData.photo_url.length,
    sizeType: ['compressed'],
    sourceType: ['camera', 'album'],
    success: (res) => {
      console.log('选择图片成功:', res);
      // 确保临时文件路径有效,并转换为数组
      if (res.tempFilePaths && res.tempFilePaths.length > 0) {
        const tempFilePaths = Array.from(res.tempFilePaths);
        console.log('准备上传的图片路径:', tempFilePaths);
        
        // 选择完图片后，先压缩再上传
        tempFilePaths.forEach(async tempFilePath => {
          try {
            // 压缩图片
            const compressedPath = await compressImage(tempFilePath);
            console.log('开始上传压缩后的图片:', compressedPath);
            uploadImage(compressedPath);
          } catch (error) {
            console.error('压缩过程出错，使用原图上传', error);
            uploadImage(tempFilePath);
          }
        });
      } else {
        console.error('没有选择任何图片或临时文件路径无效');
        uni.showToast({
          title: '图片选择失败',
          icon: 'none'
        });
      }
    },
    fail: (error) => {
      console.error('选择图片失败:', error);
      uni.showToast({
        title: '选择图片失败',
        icon: 'none'
      });
    }
  });
};

// 预览图片
const previewImage = (index: number) => {
  uni.previewImage({
    urls: formData.photo_url,
    current: formData.photo_url[index]
  });
};

// 删除图片
const deleteImage = async (index: number) => {
  if (formData.uploadingCount > 0) {
    uni.showToast({
      title: '请等待当前图片上传完成',
      icon: 'none'
    });
    return;
  }
  
  try {
    // 调用删除图片接口
    const res = await uni.request({
      url: '/api/salesperson/delete_image',
      method: 'POST',
      data: {
        url: formData.photo_url[index]
      },
      header: {
        'Authorization': uni.getStorageSync('token')
      }
    });
    
    if (res.statusCode === 200) {
      formData.photo_url.splice(index, 1);
    } else {
      uni.showToast({
        title: '删除图片失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('删除图片失败:', error);
    uni.showToast({
      title: '删除图片失败',
      icon: 'none'
    });
  }
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
  if (!formData.store_name) {
    uni.showToast({
      title: '请选择门店',
      icon: 'none'
    });
    return false;
  }
  
  if (!formData.phone_brand_name) {
    uni.showToast({
      title: '请选择手机品牌',
      icon: 'none'
    });
    return false;
  }
  
  if (!formData.phone_model_name) {
    uni.showToast({
      title: '请输入手机型号',
      icon: 'none'
    });
    return false;
  }
  
  if (!formData.imei.trim()) {
    uni.showToast({
      title: '请输入串码',
      icon: 'none'
    });
    return false;
  }
  
  if (!formData.customer_name.trim()) {
    uni.showToast({
      title: '请输入客户姓名',
      icon: 'none'
    });
    return false;
  }
  
  if (!formData.customer_phone.trim()) {
    uni.showToast({
      title: '请输入客户电话',
      icon: 'none'
    });
    return false;
  }
  
  // 验证手机号格式
  if (!/^1\d{10}$/.test(formData.customer_phone)) {
    uni.showToast({
      title: '手机号格式不正确',
      icon: 'none'
    });
    return false;
  }
  
  // if (formData.photo_url.length === 0) {
  //   uni.showToast({
  //     title: '请至少上传一张手机照片',
  //     icon: 'none'
  //   });
  //   return false;
  // }
  
  return true;
};

// 提交表单
const submitForm = async () => {
  // 检查登录状态
  if (!checkLoginStatus()) {
    return;
  }
  
  // 检查是否有图片正在上传
  if (formData.uploadingCount > 0) {
    uni.showToast({
      title: '请等待图片上传完成',
      icon: 'none'
    });
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
  
  try {
    // 调用提交API
    const submitData: SalesRecordSubmitData = {
      store_id: formData.store_id,
      store_name: formData.store_name,
      phone_brand_id: formData.phone_brand_id,
      phone_brand_name: formData.phone_brand_name,
      phone_model_id: formData.phone_model_id,
      phone_model_name: formData.phone_model_name,
      imei: formData.imei,
      customer_name: formData.customer_name,
      customer_phone: formData.customer_phone,
      photo_url: formData.photo_url,
      remark: formData.remark
    };
    
    const res = await submitRecord(submitData);
    
    uni.hideLoading();
    
    if (res.code === 0) {
      uni.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000
      });
      
      // 提交成功后重置表单
      setTimeout(() => {
        resetForm();
      }, 2000);
    } else {
      uni.showToast({
        title: res.msg || '提交失败',
        icon: 'none',
        duration: 2000
      });
    }
  } catch (error: any) {
    console.error('提交销售记录失败:', error);
    uni.hideLoading();
    uni.showToast({
      title: error.msg || '提交失败，请稍后再试',
      icon: 'none',
      duration: 2000
    });
  }
};

// 重置表单
const resetForm = () => {
  const salesperson_name = formData.salesperson_name;
  formData.store_id = 0;
  formData.store_name = '';
  formData.phone_brand_id = 0;
  formData.phone_brand_name = '';
  formData.phone_model_id = 0;
  formData.phone_model_name = '';
  formData.imei = '';
  formData.customer_name = '';
  formData.customer_phone = '';
  formData.photo_url = [];
  formData.remark = '';
  formData.salesperson_name = salesperson_name;
  showModelSelect.value = false;
};

// 初始化用户信息（如果已登录）
const initUserInfo = () => {
  if (isLoggedIn()) {
    const userInfo = uni.getStorageSync('userInfo');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        formData.salesperson_name = user.name || '';
      } catch (e) {
        console.error('解析用户信息失败', e);
      }
    }
  }
};

// 页面挂载时
onMounted(async () => {
  initUserInfo();
  await Promise.all([
    loadStoreList(),
    loadPhoneBrands()
  ]);
});

// 页面显示时
onShow(() => {
  // 检查登录状态
  const token = uni.getStorageSync('token');
  if (!token) {
    uni.redirectTo({
      url: '/pages/login/index'
    });
    return;
  }
  
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
  
  // 加载门店列表
  loadStoreList();
});
</script>

<style lang="scss" scoped>
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
  gap: 20rpx;
}

.form-input-wrap .form-input, 
.form-input-wrap .form-picker {
  flex: 1;
  height: 80rpx;
  background-color: #f9f9f9;
  border-radius: 10rpx;
}

.select-toggle {
  font-size: 24rpx;
  color: #007AFF;
  padding: 10rpx 20rpx;
  background-color: #f0f9ff;
  border-radius: 10rpx;
  white-space: nowrap;
}

.scan-btn {
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

.form-picker {
  width: 100%;
  height: 100%;
}

.picker-view {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  color: #333;
  padding: 0 20rpx;
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
