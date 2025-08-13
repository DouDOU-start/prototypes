# 路由模块文档

## 概述

这个路由系统采用模块化设计，将原本单一的大文件拆分为多个专门的路由模块，提高了代码的可维护性和可扩展性。

## 文件结构

```
routes/
├── index.js              # 路由主入口，统一管理所有项目路由
├── diandang.js          # 点当餐厅项目路由
├── mall.js              # Mall商城项目路由
├── restaurant-ordering.js # 餐厅点单项目路由
└── README.md            # 本文档
```

## 架构设计

### 1. 主路由控制器 (index.js)

- **功能**: 统一管理所有项目的路由分发
- **职责**: 
  - 请求分发到对应的项目路由模块
  - 生成主页内容
  - 处理公共的404和500错误
  - 提供通用的文件服务功能

### 2. 项目路由模块

每个项目都有独立的路由模块，包含：
- **配置对象**: 定义项目基本信息和端点映射
- **处理函数**: 实现具体的路由逻辑
- **导出接口**: 提供标准化的调用接口

## 添加新项目

### 步骤1: 创建项目路由文件

在 `routes/` 目录下创建新的项目路由文件，例如 `new-project.js`:

```javascript
// 新项目路由处理
const path = require('path');

// 新项目路由配置
const newProjectConfig = {
    name: '新项目名称',
    basePath: '/new-project',
    projectDir: 'new-project',
    endpoints: {
        '/new-project/client': {
            redirect: '/new-project/client/',
            indexFile: 'client/index.html'
        },
        '/new-project/client/': {
            indexFile: 'client/index.html'
        },
        '/new-project/admin': {
            redirect: '/new-project/admin/'
        },
        '/new-project/admin/': {
            indexFile: 'admin/index.html'
        }
    }
};

// 处理新项目路由
async function handle(pathname, req, res, serveFile, generate404Page) {
    const config = newProjectConfig;
    
    // 根路径重定向到首页
    if (pathname === config.basePath + '/' || pathname === config.basePath) {
        res.writeHead(302, { 'Location': '/' });
        res.end();
        return true;
    }

    // 检查是否需要重定向
    const endpoint = config.endpoints[pathname];
    if (endpoint && endpoint.redirect) {
        res.writeHead(301, { 'Location': endpoint.redirect });
        res.end();
        return true;
    }

    // 处理具体路径
    let filePath;
    
    if (endpoint && endpoint.indexFile) {
        // 主页面
        filePath = path.join(__dirname, '..', config.projectDir, endpoint.indexFile);
    } else if (pathname.startsWith('/new-project/client/')) {
        // 客户端子路径
        const subPath = pathname.replace('/new-project/client/', '');
        filePath = path.join(__dirname, '..', config.projectDir, 'client', subPath);
    } else if (pathname.startsWith('/new-project/admin/')) {
        // 管理端子路径
        const subPath = pathname.replace('/new-project/admin/', '');
        filePath = path.join(__dirname, '..', config.projectDir, 'admin', subPath);
    } else if (pathname.startsWith(config.basePath + '/')) {
        // 其他路径
        const relativePath = pathname.replace(config.basePath + '/', '');
        filePath = path.join(__dirname, '..', config.projectDir, relativePath);
    }

    if (filePath) {
        console.log(`${config.name}请求: ${pathname} -> ${filePath}`);
        
        const served = await serveFile(filePath, res);
        if (served) {
            return true;
        } else {
            console.log(`❌ 文件不存在: ${filePath}`);
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(generate404Page(pathname, config.name));
            return true;
        }
    }

    return false;
}

module.exports = {
    handle,
    config: newProjectConfig
};
```

### 步骤2: 注册到主路由

在 `routes/index.js` 中添加新项目：

```javascript
// 导入新项目路由
const newProjectRoutes = require('./new-project');

// 项目路由映射表
const projectRoutes = {
    '/diandang': diandangRoutes,
    '/mall': mallRoutes,
    '/restaurant-ordering': restaurantOrderingRoutes,
    '/new-project': newProjectRoutes  // 添加新项目
};
```

### 步骤3: 更新主页展示

在 `generateIndexPage()` 函数中添加新项目的展示卡片。

### 步骤4: 更新服务器配置

在 `serve-refactored.js` 中添加项目配置：

```javascript
const projectsConfig = [
    // ... 现有项目
    {
        name: '新项目名称',
        endpoints: [
            { name: '客户端', path: '/new-project/client/' },
            { name: '管理端', path: '/new-project/admin/' }
        ]
    }
];
```

## 配置选项

### 项目配置对象

```javascript
{
    name: '项目显示名称',           // 在日志和错误页面中显示
    basePath: '/项目路径前缀',      // URL路径前缀
    projectDir: '项目目录名',       // 文件系统中的目录名
    endpoints: {                   // 端点映射配置
        '/路径': {
            redirect: '/重定向目标',  // 可选：重定向配置
            indexFile: '文件路径'    // 可选：主页文件路径
        }
    }
}
```

## 最佳实践

### 1. 命名规范
- 路由文件名使用小写字母和连字符: `new-project.js`
- 配置对象使用驼峰命名: `newProjectConfig`
- 处理函数统一命名为 `handle`

### 2. 错误处理
- 所有路由模块都应该处理文件不存在的情况
- 使用统一的404页面生成函数
- 记录详细的错误日志

### 3. 性能考虑
- 使用异步文件操作
- 合理设置缓存头
- 避免在路由层做复杂的业务逻辑

### 4. 安全考虑
- 验证文件路径的安全性
- 防止路径遍历攻击
- 设置合适的CORS策略

## 工具函数

路由模块可以使用的工具函数：

- `serveFile(filePath, res)`: 服务静态文件
- `generate404Page(pathname, projectName)`: 生成404页面
- `fileExists(filePath)`: 检查文件是否存在
- `getMimeType(filePath)`: 获取文件MIME类型

## 调试和日志

- 所有请求都会记录到控制台
- 文件不存在时会显示具体路径
- 错误信息包含项目名称和请求路径

## 迁移指南

从旧的单文件路由迁移到新的模块化路由：

1. 将现有的路由逻辑复制到对应的项目路由文件
2. 修改路径处理逻辑使用新的配置格式
3. 测试所有端点是否正常工作
4. 更新文档和配置

这个模块化的路由系统大大简化了添加新项目的过程，提高了代码的可维护性和可读性。