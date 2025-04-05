<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";

// 页面需要登录验证的列表
const authPages = [
  'pages/record/index',
  'pages/userinfo/index',
  'pages/password/index',
  'pages/index/index',
  'pages/user/index'
];

// 检查登录状态
const checkLoginStatus = (): boolean => {
  const token = uni.getStorageSync('token');
  return !!token;
};

// 应用启动时
onLaunch(() => {
  console.log("App Launch");
  
  // 检查登录状态
  const isLoggedIn = checkLoginStatus();
  
  // 获取当前页面路径（启动页）
  const pages = getCurrentPages();
  let currentPage = '';
  
  // 通过启动参数或当前页面获取路径
  if (pages && pages.length > 0) {
    currentPage = pages[0].route || '';
  }
  
  // 如果当前页需要鉴权但未登录，则跳转到登录页
  if (currentPage && authPages.some(page => currentPage.includes(page)) && !isLoggedIn) {
    console.log('当前页需要登录，重定向到登录页');
    
    // 使用setTimeout确保重定向在页面加载完成后执行
    setTimeout(() => {
      uni.redirectTo({
        url: '/pages/login/index'
      });
    }, 100);
  }
});

// 每次显示应用时
onShow(() => {
  console.log("App Show");
  
  // 在应用重新显示时也检查登录状态
  const isLoggedIn = checkLoginStatus();
  const pages = getCurrentPages();
  
  // 如果有当前页面
  if (pages && pages.length > 0) {
    const currentPage = pages[pages.length - 1].route || '';
    
    // 如果当前页需要鉴权但未登录，则跳转到登录页
    if (currentPage && authPages.some(page => currentPage.includes(page)) && !isLoggedIn) {
      console.log('当前页需要登录，重定向到登录页');
      
      // 使用setTimeout确保重定向在页面加载完成后执行
      setTimeout(() => {
        uni.redirectTo({
          url: '/pages/login/index'
        });
      }, 100);
    }
  }
});

// 应用隐藏时
onHide(() => {
  console.log("App Hide");
});
</script>

<style lang="scss">
/* 导入所有外部样式表 */

@import './static/icons.css';
@import './static/iconfont.css';

/* 设置全局样式 */
page {
  font-size: 28rpx;
  color: #333;
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.5;
  /* height: 100%; */
  /* overflow: hidden; */
}

/* uni-icons字体定义 */
@font-face {
  font-family: uniicons;
  src: url('/static/uniicons.ttf') format('truetype');
}

/* uni-icons基础样式 */
.uni-icons {
  font-family: uniicons;
  font-size: 24px;
  font-weight: normal;
  font-style: normal;
  line-height: 1;
  display: inline-block;
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
}

/* 图标样式（后面可以替换为真实的图标字体文件） */
.iconfont {
  font-family: 'iconfont';
}
.icon-record:before {
  content: '\e607';
}
.icon-user:before {
  content: '\e7ae';
}
.icon-lock:before {
  content: '\e709';
}
.icon-arrow-right:before {
  content: '\e743';
}

/* 通用样式 */
.flex {
  display: flex;
}
.flex-column {
  flex-direction: column;
}
.justify-between {
  justify-content: space-between;
}
.align-center {
  align-items: center;
}
.text-center {
  text-align: center;
}
.mt-10 {
  margin-top: 10rpx;
}
.mt-20 {
  margin-top: 20rpx;
}
.mt-30 {
  margin-top: 30rpx;
}
.mb-10 {
  margin-bottom: 10rpx;
}
.mb-20 {
  margin-bottom: 20rpx;
}
.mb-30 {
  margin-bottom: 30rpx;
}
</style>
