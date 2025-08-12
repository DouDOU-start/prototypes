# 可扩展原型开发平台 (Scalable Prototype Development Platform)

一个强大的可扩展原型开发平台，支持**无限项目**和**多客户端**的统一管理和展示。适用于任何业务领域的app/小程序原型设计和开发。

## 🎯 平台概述

这是一个**专业级原型开发平台**，支持任意规模的项目和客户端组合：

### 📊 当前项目组合：
- **点当餐厅** - 完整的餐厅管理系统（用户端 + 商家后台）
- **Mall商城** - 电商购物系统（用户端 + 管理员后台）

### 🚀 平台能力：
- 🏥 **任意业务领域**：健康医疗、教育培训、金融理财、社交娱乐、智能工具等
- 📱 **多客户端类型**：用户app、管理后台、商家面板、员工工具等
- 🎨 **专业设计标准**：Tailwind CSS + FontAwesome + 响应式设计
- ⚡ **快速开发**：无需构建，修改即生效、热重载支持

## 🚀 快速开始

### 环境要求
- Node.js (版本 12 或更高)
- Linux/macOS 或 Windows

### 启动服务器

```bash
# 克隆项目
git clone <your-repo-url>
cd prototypes

# 启动服务器（后台运行）
./start.sh

# 停止服务器
./stop.sh

# 重启服务器
./stop.sh && ./start.sh
```

**管理命令：**
```bash
# 查看服务状态
./status.sh

# 查看服务器日志
tail -f server.log

# 直接运行（前台，调试用）
node serve.js
```

**服务器管理：**
- 服务器运行在后台，不会阻塞终端
- PID文件：`server.pid` - 存储服务器进程ID
- 日志文件：`server.log` - 记录服务器运行日志
- 状态脚本：`./status.sh` - 查看详细的服务状态
- 支持重复启动检测和优雅关闭

## 🌐 访问地址

### 💻 本地开发访问
- **首页**: http://localhost:3000 → 一个美观的项目展示页，自动收录所有可用项目

### 📋 当前可用项目：
**点当餐厅系统**
- 用户端: http://localhost:3000/diandang/miniprogram/
- 商家后台: http://localhost:3000/diandang/merchant/

**Mall商城系统**
- 用户端: http://localhost:3000/mall/miniprogram/
- 管理员后台: http://localhost:3000/mall/admin/

### 🌍 公网访问
**统一入口**: http://106.12.5.203:3000
- 所有项目都可以通过公网IP访问
- URL模式: `http://106.12.5.203:3000/{project-name}/{client-type}/`

### 🔮 未来项目示例
可以支持无限扩展，例如：
```
# 健身项目
http://localhost:3000/fitness/user-app/     # 用户健身 app
http://localhost:3000/fitness/trainer-panel/ # 教练管理后台

# 教育项目  
http://localhost:3000/education/student-app/  # 学生学习 app
http://localhost:3000/education/teacher-panel/ # 老师管理后台

# 医疗项目
http://localhost:3000/healthcare/patient-app/ # 患者端 app
http://localhost:3000/healthcare/doctor-panel/ # 医生工作台
```

## 📁 平台结构

### 🏢 当前项目结构
```
prototypes/
├── serve.js                    # 核心服务器（支持任意扩展）
├── start.sh/stop.sh/status.sh # 服务器管理脚本
├── CLAUDE.md                  # AI 助手指导文档
├── README.md                  # 项目说明文档
│
├── diandang/                  # 点当餐厅项目
│   ├── miniprogram/           # 用户端（在线点餐）
│   └── merchant-dashboard/    # 商家后台（订单管理）
│
└── mall/                      # Mall商城项目
    ├── miniprogram/           # 用户端（购物体验）
    └── admin/                 # 管理员后台（商品管理）
```

### 🚀 标准项目结构模板
```
/{project-name}/
├── user-app/                  # 用户端/客户端
│   ├── index.html
│   └── assets/
│       ├── styles/            # 样式文件
│       ├── scripts/           # 脚本文件
│       └── data/              # 模拟数据
├── admin-panel/               # 管理员后台
└── shared/                    # 共享资源（可选）
```

## ⚙️ 核心技术特性

### 🚀 开发体验
- **热重载支持** - 修改代码即时生效，无需刷新
- **无构建流程** - 纯静态文件服务，开发更快速
- **跨域支持** - CORS 全支持，方便前端调试
- **智能路由** - 自动识别项目和客户端类型

### 🎨 设计标准
- **Tailwind CSS** - 原子化CSS框架，快速构建美观界面
- **FontAwesome** - 丰富的图标库，提升用户体验
- **响应式设计** - 移动优先，适配所有设备
- **Unsplash 高质量图片** - 专业级视觉效果

### 🛠️ 平台能力
- **无限扩展** - 支持任意数量的项目和客户端
- **自动发现** - 新项目自动出现在首页展示
- **统一管理** - 一个服务器管理所有原型
- **完美隔离** - 每个项目独立，不相互影响

### 📊 管理功能
- **智能日志** - 详细的访问日志和错误跟踪
- **进程管理** - 安全的启停操作和状态监控
- **端口管理** - 自动检测和解决端口冲突
- **公网访问** - 支持本地和公网IP同时访问

## 🎨 项目详情

### 点当餐厅 (Diandang Restaurant)
完整的餐厅管理系统，包含：
- 顾客端小程序：在线点餐、支付、订单管理
- 商家管理后台：订单处理、菜单管理、数据分析

### Mall商城 (Shopping Mall)
电商购物系统，包含：
- 用户端小程序：商品浏览、购物车、订单管理
- 管理员后台：商品管理、订单处理、数据统计

## 🛠️ 开发指南

### 🎆 快速添加新项目

**1️⃣ 创建项目结构**
```bash
# 例如创建一个健身项目
mkdir -p fitness/user-app/assets/{styles,scripts,data}
mkdir -p fitness/trainer-panel/assets/{styles,scripts,data}
mkdir -p fitness/shared/{styles,scripts,data}
```

**2️⃣ 添加服务器路由**
在 `serve.js` 的约 495 行添加：
```javascript
else if (pathname.startsWith('/fitness/')) {
    // 按照现有模式处理路由逻辑
}
```

**3️⃣ 更新首页展示**
在 `generateIndexPage()` 函数中添加新项目卡片

**4️⃣ 遵循标准结构**
- 使用 Tailwind CSS + FontAwesome
- 遵循文件组织规范
- 实现移动优先设计

### 📊 部署和维护
- **端口配置**: 默认 3000，可通过 `PORT` 环境变量修改
- **主机配置**: 支持 `HOST` 环境变量
- **公网访问**: 需配置防火墙 3000 端口
- **日志监控**: `tail -f server.log` 查看实时日志
- **性能优化**: 高流量项目可考虑静态资源CDN

### 🔍 常用命令
```bash
# 查看所有项目状态
./status.sh

# 实时监控日志
tail -f server.log

# 重启服务（常用于更新后）
./stop.sh && ./start.sh

# 查看端口占用
lsof -i :3000
```

## 📄 许可证

本项目仅用于技术演示和学习目的。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目。

---

🤖 Generated with [Claude Code](https://claude.ai/code)