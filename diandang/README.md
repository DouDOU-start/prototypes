# 🏪 仓和餐厅管理系统

一个完整的餐厅管理解决方案，包含小程序端和商家端，使用 HTML、CSS 和 JavaScript 构建。

## 📱 系统概览

### 🛍️ 小程序端 (客户端)
- **目标用户**: 顾客
- **访问方式**: 手机端优化
- **主要功能**:
  - 浏览菜单和菜品详情
  - 添加菜品到购物车
  - 在线下单和支付流程
  - 查看订单状态和历史
  - 个人信息管理

### 🏪 商家管理后台
- **目标用户**: 餐厅工作人员
- **访问方式**: 平板端优化 (768px-1024px)
- **主要功能**:
  - 实时订单管理和状态更新
  - 菜单和库存管理
  - 销售数据分析和图表
  - 客户信息管理
  - 营业状态控制
  - 数据导出和报表

## 🚀 快速启动

### 前提条件
- Node.js 12+ (推荐 LTS 版本)
- 现代浏览器 (Chrome、Safari、Firefox、Edge)

### 启动服务器

#### 方法一：使用脚本 (推荐)

**macOS/Linux:**
```bash
chmod +x start-server.sh
./start-server.sh
```

**Windows:**
```cmd
start-server.bat
```

#### 方法二：使用 npm 命令
```bash
npm start
# 或者
npm run dev
# 或者
npm run serve
```

#### 方法三：直接启动
```bash
node server.js
```

### 访问系统
服务器启动后，在浏览器中访问：

- **首页选择**: http://localhost:3000
- **小程序端**: http://localhost:3000/miniprogram
- **商家端**: http://localhost:3000/merchant

## 📂 项目结构

```
UI/
├── server.js                 # Node.js 服务器
├── package.json             # 项目配置
├── start-server.sh          # macOS/Linux 启动脚本
├── start-server.bat         # Windows 启动脚本
├── README.md               # 项目文档
│
├── miniprogram/            # 小程序端 (客户端)
│   ├── index.html          # 主页
│   ├── assets/
│   │   ├── app.js          # 主应用逻辑
│   │   └── styles.css      # 样式文件
│   └── pages/              # 页面文件
│       ├── home.html
│       ├── menu.html
│       ├── cart.html
│       ├── order.html
│       ├── payment.html
│       └── profile.html
│
└── merchant-dashboard/     # 商家管理后台
    ├── index.html          # 主页
    ├── assets/
    │   ├── merchant-app.js # 主应用逻辑
    │   └── merchant-styles.css # 样式文件
    └── pages/              # 页面文件
        ├── dashboard.html
        ├── orders.html
        ├── menu-management.html
        ├── inventory.html
        ├── customers.html
        ├── analytics.html
        └── settings.html
```

## 🎨 技术特性

### 小程序端特性
- **移动端优化**: 专为手机使用设计
- **触摸友好**: 44px 最小触控目标
- **流畅动画**: CSS3 过渡效果
- **响应式设计**: 适配各种手机屏幕
- **模拟支付**: 微信支付流程演示

### 商家端特性
- **平板优化**: 专为平板设备设计
- **实时数据**: 模拟实时订单更新
- **数据可视化**: 图表和统计面板
- **批量操作**: 订单和菜品批量管理
- **触摸手势**: 支持滑动、长按等手势
- **专业界面**: 商务风格的 UI 设计

### 技术栈
- **前端**: HTML5, CSS3, JavaScript ES6+
- **后端**: Node.js 原生 HTTP 服务器
- **样式**: CSS Grid, Flexbox, CSS Variables
- **图标**: Font Awesome 6.4.0
- **字体**: 系统默认字体栈

## 🌟 功能详情

### 小程序端功能
- **首页展示**: 推荐菜品、活动信息
- **菜单浏览**: 分类展示、搜索筛选
- **购物车**: 添加删除、数量调整
- **下单流程**: 选择桌号、备注信息
- **支付集成**: 模拟微信支付流程
- **订单管理**: 查看历史、追踪状态
- **用户中心**: 个人信息、设置选项

### 商家端功能
- **实时仪表盘**: 关键指标、订单流
- **订单管理**: 状态更新、批量操作
- **菜单管理**: 添加编辑、分类管理
- **库存管理**: 库存追踪、低库存提醒
- **数据分析**: 销售图表、趋势分析
- **客户管理**: 客户信息、消费统计
- **营业控制**: 营业状态、通知设置

## 🎯 设备建议

### 📱 小程序端
- **最佳设备**: iPhone、Android 手机
- **屏幕尺寸**: 320px - 414px 宽度
- **浏览器**: 移动端 Safari、Chrome
- **方向**: 竖屏使用

### 📱 商家端
- **最佳设备**: iPad、Android 平板
- **屏幕尺寸**: 768px - 1024px 宽度
- **浏览器**: Safari、Chrome、Edge
- **方向**: 横屏或竖屏均可

## 🔧 自定义配置

### 修改端口
在 `server.js` 中修改端口号：
```javascript
const PORT = process.env.PORT || 3000; // 改为您需要的端口
```

或者设置环境变量：
```bash
export PORT=8080
node server.js
```

### 修改主机地址
```javascript
const HOST = process.env.HOST || 'localhost'; // 改为您的主机地址
```

## 🛠️ 开发说明

### 添加新页面
1. 在对应目录的 `pages/` 文件夹中创建 HTML 文件
2. 在 `assets/app.js` 或 `assets/merchant-app.js` 中添加页面到 `pagesToLoad` 数组
3. 实现页面特定的 JavaScript 逻辑

### 修改样式
- 小程序端样式：`miniprogram/assets/styles.css`
- 商家端样式：`merchant-dashboard/assets/merchant-styles.css`

### 添加 API 接口
在 `server.js` 中的 API 路由部分添加新的接口处理逻辑。

## 🐛 故障排除

### 常见问题

**1. 端口被占用**
```bash
# 查看占用端口的进程
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# 终止进程
kill -9 [PID]  # macOS/Linux
taskkill /F /PID [PID]  # Windows
```

**2. Node.js 版本过低**
- 升级到 Node.js 12 或更高版本
- 使用 nvm 管理多个 Node.js 版本

**3. 静态文件无法加载**
- 检查文件路径是否正确
- 确保文件权限正确
- 检查 MIME 类型配置

**4. 样式或脚本错误**
- 打开浏览器开发者工具查看控制台错误
- 检查网络选项卡确认资源加载状态

## 📄 许可证

MIT License - 详见项目中的 LICENSE 文件

## 👨‍💻 开发者

仓和餐厅开发团队

---

**🎉 享受使用仓和餐厅管理系统！**

如有问题或建议，欢迎提交 Issue 或联系开发团队。