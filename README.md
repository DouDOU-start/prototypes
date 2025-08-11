# 原型展示平台 (Prototype Showcase Platform)

统一管理和展示多个项目原型的平台，支持通过不同路径访问不同项目的不同端点。

## 🎯 项目概述

本平台整合了多个原型项目，提供统一的访问入口和管理界面：

- **点当餐厅** - 完整的餐厅管理系统
- **Mall商城** - 电商购物系统

## 🚀 快速开始

### 环境要求
- Node.js (版本 12 或更高)
- Linux/macOS 或 Windows

### 启动服务器

```bash
# 克隆项目
git clone <your-repo-url>
cd prototypes

# 启动服务器
./start.sh
```

或者直接运行：
```bash
node serve.js
```

## 📱 访问地址

### 本地访问
- **首页**: http://localhost:3000
- **点当餐厅 - 小程序端**: http://localhost:3000/diandang/miniprogram
- **点当餐厅 - 商家后台**: http://localhost:3000/diandang/merchant
- **Mall商城 - 小程序端**: http://localhost:3000/mall/miniprogram
- **Mall商城 - 管理员后台**: http://localhost:3000/mall/admin

### 公网访问
- **首页**: http://106.12.5.203:3000
- **点当餐厅 - 小程序端**: http://106.12.5.203:3000/diandang/miniprogram
- **点当餐厅 - 商家后台**: http://106.12.5.203:3000/diandang/merchant
- **Mall商城 - 小程序端**: http://106.12.5.203:3000/mall/miniprogram
- **Mall商城 - 管理员后台**: http://106.12.5.203:3000/mall/admin

## 📂 项目结构

```
prototypes/
├── serve.js                    # 统一服务器入口
├── start.sh                   # 启动脚本
├── diandang/                  # 点当餐厅项目
│   ├── miniprogram/           # 小程序端
│   ├── merchant-dashboard/    # 商家后台
│   └── ...
├── mall/                      # Mall商城项目
│   ├── miniprogram/           # 小程序端
│   ├── admin/                 # 管理员后台
│   └── ...
└── README.md
```

## 🔧 技术特性

- **统一路由** - 通过路径前缀区分不同项目
- **热重载支持** - 修改文件即时生效
- **跨域支持** - 支持前端开发调试
- **静态资源服务** - 自动处理CSS、JS、图片等资源
- **错误处理** - 友好的404和500错误页面
- **公网访问** - 支持通过公网IP访问

## 🎨 项目详情

### 点当餐厅 (Diandang Restaurant)
完整的餐厅管理系统，包含：
- 顾客端小程序：在线点餐、支付、订单管理
- 商家管理后台：订单处理、菜单管理、数据分析

### Mall商城 (Shopping Mall)
电商购物系统，包含：
- 用户端小程序：商品浏览、购物车、订单管理
- 管理员后台：商品管理、订单处理、数据统计

## 🛠️ 开发说明

### 添加新项目
1. 在根目录创建项目文件夹
2. 在 `serve.js` 中添加对应的路由处理
3. 更新首页展示界面

### 部署配置
- 默认监听端口：3000
- 支持环境变量：`PORT`、`HOST`
- 公网访问需要配置防火墙规则

## 📄 许可证

本项目仅用于技术演示和学习目的。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目。

---

🤖 Generated with [Claude Code](https://claude.ai/code)