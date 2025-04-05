# 移动销售系统

基于 uni-app + Vue3 + TypeScript 开发的移动销售记录管理系统。

## 项目特点

- 跨平台：一套代码，多端运行（iOS、Android、H5、小程序等）
- 技术栈：Vue3 + TypeScript + Pinia + uni-ui
- 功能模块：用户管理、销售记录、数据统计等

## 目录结构

```
mobile_project/
├── mobile_uniapp/           # uni-app项目目录
│   ├── src/                 # 源代码
│   │   ├── api/            # API接口
│   │   ├── components/     # 组件
│   │   ├── pages/          # 页面
│   │   ├── static/         # 静态资源
│   │   ├── store/          # 状态管理
│   │   ├── utils/          # 工具函数
│   │   ├── App.vue         # 应用入口
│   │   ├── main.ts         # 主入口
│   │   ├── manifest.json   # 配置文件
│   │   └── pages.json      # 页面配置
│   ├── package.json        # 依赖配置
│   └── tsconfig.json       # TypeScript配置
└── README.md               # 项目说明
```

## 功能模块

- **用户管理**：登录、注册、个人信息
- **销售记录**：记录添加、查询、管理
- **产品管理**：产品信息、库存管理
- **统计分析**：销售数据统计、图表展示

## 安装与运行

### 环境要求

- Node.js 14.0+
- HBuilderX

### 安装依赖

```bash
cd mobile_uniapp
npm install
```

### 运行项目

```bash
# 运行到H5
npm run dev:h5

# 运行到微信小程序
npm run dev:mp-weixin
```

### 构建项目

```bash
# 构建H5
npm run build:h5

# 构建微信小程序
npm run build:mp-weixin
```

## 主要依赖

- Vue 3
- uni-app
- TypeScript
- Pinia
- uni-ui
- dayjs
- lodash-es

## 开发规范

- 遵循 Vue3 组合式 API 的使用规范
- TypeScript 类型定义规范
- 组件化开发，提高代码复用性
- 统一的接口请求封装和错误处理

## 版本信息

当前版本：v1.0.0
