# 手机销售记录管理系统 - 管理后台

基于 Vue 3 + Vite + Element Plus 开发的手机销售记录管理系统后台。

## 技术栈

- Vue 3 - 渐进式 JavaScript 框架
- Vite - 下一代前端开发构建工具
- Element Plus - 基于 Vue 3 的组件库
- Tailwind CSS - 原子化 CSS 框架
- TypeScript - JavaScript 的超集
- Axios - HTTP 请求库

## 开发环境要求

- Node.js >= 16
- npm >= 8

## 安装

```bash
# 克隆项目
git clone [项目地址]

# 进入项目目录
cd mobile_vue3

# 安装依赖
npm install
```

## 开发

```bash
# 启动开发服务器
npm run dev
```

## 构建

```bash
# 构建测试环境
npm run build:test

# 构建生产环境
npm run build
```

## 环境变量配置

- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置

## 目录结构

```
mobile_vue3
├── public/          # 静态资源
├── src/             # 源代码
│   ├── api/         # API接口
│   ├── assets/      # 资源文件
│   ├── components/  # 公共组件
│   ├── layouts/     # 布局组件
│   ├── router/      # 路由配置
│   ├── store/       # 状态管理
│   ├── styles/      # 样式文件
│   ├── utils/       # 工具函数
│   └── views/       # 页面组件
├── .env.development # 开发环境变量
├── .env.production  # 生产环境变量
├── index.html       # HTML模板
├── package.json     # 项目配置
├── vite.config.js   # Vite配置
└── tailwind.config.js # Tailwind配置
```

## 功能特性

- 响应式布局，支持移动端和桌面端
- 基于角色的权限控制
- 销售记录管理
- 门店管理
- 销售员管理
- 手机品牌和型号管理
- 数据统计和分析
- WebSocket 实时通知

## 部署说明

1. 构建项目
```bash
npm run build
```

2. 部署配置
- 将 `dist` 目录下的文件部署到 Web 服务器
- 配置 nginx 反向代理（示例配置）：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://your-api-server;
    }
}
```

## 注意事项

1. 开发环境配置文件 `.env.development` 中可以修改 API 地址
2. 生产环境部署时注意修改 `.env.production` 中的配置
3. 确保服务器已启用 HTTPS（如果需要）
4. 定期备份数据库

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 许可证

[MIT License](LICENSE)
