# 手机销售记录管理系统 - 移动端APP

基于 uni-app + Vue 3 + TypeScript 开发的手机销售记录管理系统移动端应用。

## 技术栈

- uni-app - 跨平台应用开发框架
- Vue 3 - 渐进式 JavaScript 框架
- TypeScript - JavaScript 的超集
- Vite - 下一代前端开发构建工具
- uni-ui - uni-app 扩展组件库
- Sass - CSS 预处理器

## 开发环境要求

- Node.js >= 16
- npm >= 8
- HBuilderX（推荐）

## 安装

```bash
# 克隆项目
git clone [项目地址]

# 进入项目目录
cd mobile_uniapp

# 安装依赖
npm install
```

## 开发

```bash
# 启动开发服务器
npm run dev

# 开发不同平台
npm run dev:h5          # H5
npm run dev:mp-weixin   # 微信小程序
npm run dev:app         # APP
```

## 构建

```bash
# 构建H5版本
npm run build:h5

# 构建微信小程序版本
npm run build:mp-weixin

# 构建APP版本（需要HBuilderX）
npm run build:app
```

## 目录结构

```
mobile_uniapp
├── src/             # 源代码
│   ├── api/         # API接口
│   ├── components/  # 公共组件
│   ├── pages/       # 页面文件
│   ├── static/      # 静态资源
│   ├── store/       # 状态管理
│   ├── styles/      # 样式文件
│   └── utils/       # 工具函数
├── public/          # 公共文件
├── dist/           # 打包文件
├── index.html      # 入口HTML
├── package.json    # 项目配置
├── vite.config.ts  # Vite配置
└── tsconfig.json   # TypeScript配置
```

## 功能特性

- 销售员登录/注销
- 个人信息管理
- 销售记录提交
  - 门店选择
  - 手机品牌/型号选择
  - IMEI扫码录入
  - 多图片上传
  - 客户信息录入
- 销售记录管理
  - 今日销售记录查看
  - 销售记录详情
  - 记录状态跟踪
- 实时通知
  - 新销售提醒
  - 系统消息通知
  - 消息管理

## 跨平台支持

- H5
- 微信小程序
- Android APP
- iOS APP

## 部署说明

### H5版本部署

1. 构建项目
```bash
npm run build:h5
```

2. Nginx配置示例
```nginx
server {
    listen 80;
    server_name m.your-domain.com;

    location / {
        root /path/to/dist/build/h5;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 配置文件路径
    location /config {
        alias /path/to/config;
    }
}
```

### 小程序部署
1. 构建小程序版本
```bash
npm run build:mp-weixin
```
2. 使用微信开发者工具导入 dist/build/mp-weixin 目录
3. 提交审核并发布

### APP打包
1. 使用HBuilderX导入项目
2. 配置应用标识等信息
3. 执行打包操作（云打包或本地打包）

## 注意事项

1. 开发时注意配置 config.js 中的接口地址
2. 生产环境部署时确保配置文件放置正确
3. 注意小程序相关配置的合规性
4. APP打包时注意签名证书的配置

## 兼容性支持

- Android 5.0+
- iOS 10.0+
- 微信 7.0+
- 主流浏览器最新版

## 许可证

[MIT License](LICENSE)
