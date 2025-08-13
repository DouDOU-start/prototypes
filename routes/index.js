// 路由入口文件 - 统一管理所有项目路由

const path = require('path');
const { fileExists, readFile, getMimeType } = require('../utils/fileUtils');

// 导入各个项目的路由配置
const diandangRoutes = require('./diandang');
const mallRoutes = require('./mall');
const restaurantOrderingRoutes = require('./restaurant-ordering');

// 项目路由映射表
const projectRoutes = {
    '/diandang': diandangRoutes,
    '/mall': mallRoutes,
    '/restaurant-ordering': restaurantOrderingRoutes
};

// 主页生成函数
function generateIndexPage() {
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>原型展示 - Prototype Showcase</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }

        .container {
            text-align: center;
            max-width: 1000px;
            padding: 40px 20px;
        }

        .logo {
            font-size: 48px;
            margin-bottom: 16px;
        }

        .title {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 8px;
            background: linear-gradient(45deg, #fff, #f0f8ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .subtitle {
            font-size: 18px;
            opacity: 0.8;
            margin-bottom: 48px;
        }

        .projects {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 40px;
            margin-top: 48px;
        }

        .project {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 32px;
            backdrop-filter: blur(10px);
            position: relative;
            overflow: hidden;
        }

        .project::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .project:hover::before {
            opacity: 1;
        }

        .project-header {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24px;
        }

        .project-icon {
            font-size: 48px;
            margin-right: 16px;
        }

        .project-name {
            font-size: 28px;
            font-weight: 600;
        }

        .project-description {
            font-size: 16px;
            opacity: 0.8;
            line-height: 1.6;
            margin-bottom: 32px;
        }

        .endpoints {
            display: grid;
            gap: 16px;
        }

        .endpoint {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 20px;
            text-decoration: none;
            color: white;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .endpoint:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
            background: rgba(255, 255, 255, 0.15);
        }

        .endpoint-info {
            display: flex;
            align-items: center;
        }

        .endpoint-icon {
            font-size: 24px;
            margin-right: 16px;
            opacity: 0.8;
        }

        .endpoint-details h3 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .endpoint-details p {
            font-size: 14px;
            opacity: 0.7;
        }

        .endpoint-arrow {
            font-size: 20px;
            opacity: 0.6;
            transition: all 0.3s ease;
        }

        .endpoint:hover .endpoint-arrow {
            opacity: 1;
            transform: translateX(4px);
        }

        .footer {
            margin-top: 64px;
            font-size: 14px;
            opacity: 0.6;
        }

        @media (max-width: 768px) {
            .projects {
                grid-template-columns: 1fr;
            }
            
            .title {
                font-size: 28px;
            }
            
            .container {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🎨</div>
        <h1 class="title">原型展示平台</h1>
        <p class="subtitle">Prototype Showcase Platform</p>
        
        <div class="projects">
            <!-- 点当餐厅管理系统 -->
            <div class="project">
                <div class="project-header">
                    <div class="project-icon">🏪</div>
                    <div class="project-name">点当餐厅</div>
                </div>
                <p class="project-description">完整的餐厅管理系统，包含顾客端小程序和商家管理后台</p>
                <div class="endpoints">
                    <a href="/diandang/miniprogram/" class="endpoint">
                        <div class="endpoint-info">
                            <i class="fas fa-mobile-alt endpoint-icon"></i>
                            <div class="endpoint-details">
                                <h3>小程序端</h3>
                                <p>顾客点餐系统</p>
                            </div>
                        </div>
                        <i class="fas fa-arrow-right endpoint-arrow"></i>
                    </a>
                    <a href="/diandang/merchant/" class="endpoint">
                        <div class="endpoint-info">
                            <i class="fas fa-chart-line endpoint-icon"></i>
                            <div class="endpoint-details">
                                <h3>商家后台</h3>
                                <p>店铺管理系统</p>
                            </div>
                        </div>
                        <i class="fas fa-arrow-right endpoint-arrow"></i>
                    </a>
                </div>
            </div>

            <!-- Mall 商城系统 -->
            <div class="project">
                <div class="project-header">
                    <div class="project-icon">🛒</div>
                    <div class="project-name">Mall 商城</div>
                </div>
                <p class="project-description">电商商城系统，支持小程序购物和管理员后台</p>
                <div class="endpoints">
                    <a href="/mall/miniprogram/" class="endpoint">
                        <div class="endpoint-info">
                            <i class="fas fa-mobile-alt endpoint-icon"></i>
                            <div class="endpoint-details">
                                <h3>小程序端</h3>
                                <p>用户购物界面</p>
                            </div>
                        </div>
                        <i class="fas fa-arrow-right endpoint-arrow"></i>
                    </a>
                    <a href="/mall/admin/" class="endpoint">
                        <div class="endpoint-info">
                            <i class="fas fa-cog endpoint-icon"></i>
                            <div class="endpoint-details">
                                <h3>管理员后台</h3>
                                <p>商城管理系统</p>
                            </div>
                        </div>
                        <i class="fas fa-arrow-right endpoint-arrow"></i>
                    </a>
                </div>
            </div>

            <!-- 餐厅点单系统 -->
            <div class="project">
                <div class="project-header">
                    <div class="project-icon">🍽️</div>
                    <div class="project-name">餐厅点单</div>
                </div>
                <p class="project-description">全新的餐厅在线点餐系统，包含用户点餐端和商家管理后台</p>
                <div class="endpoints">
                    <a href="/restaurant-ordering/customer-app/" class="endpoint">
                        <div class="endpoint-info">
                            <i class="fas fa-mobile-alt endpoint-icon"></i>
                            <div class="endpoint-details">
                                <h3>用户点餐端</h3>
                                <p>在线点餐小程序</p>
                            </div>
                        </div>
                        <i class="fas fa-arrow-right endpoint-arrow"></i>
                    </a>
                    <a href="/restaurant-ordering/merchant-dashboard/" class="endpoint">
                        <div class="endpoint-info">
                            <i class="fas fa-chart-line endpoint-icon"></i>
                            <div class="endpoint-details">
                                <h3>商家管理后台</h3>
                                <p>订单管理系统</p>
                            </div>
                        </div>
                        <i class="fas fa-arrow-right endpoint-arrow"></i>
                    </a>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>© 2024 原型展示平台 - 技术演示版本</p>
            <p style="margin-top: 8px; font-size: 12px;">
                服务器运行在 <code>http://localhost:3000</code>
            </p>
        </div>
    </div>

    <script>
        // 添加卡片点击动画
        document.addEventListener('DOMContentLoaded', function() {
            const endpoints = document.querySelectorAll('.endpoint');
            endpoints.forEach(endpoint => {
                endpoint.addEventListener('mousedown', function() {
                    this.style.transform = 'translateY(-2px) scale(0.98)';
                });
                
                endpoint.addEventListener('mouseup', function() {
                    this.style.transform = 'translateY(-4px) scale(1)';
                });
                
                endpoint.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });
        });
    </script>
</body>
</html>
    `;
}

// 通用文件服务函数
async function serveFile(filePath, res) {
    try {
        if (fileExists(filePath)) {
            const data = await readFile(filePath);
            const mimeType = getMimeType(filePath);
            
            let contentType = mimeType;
            if (mimeType === 'text/css' || mimeType === 'application/javascript' || mimeType === 'text/html') {
                contentType += '; charset=utf-8';
            }
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
            console.log(`✅ 成功加载: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`❌ 加载文件错误: ${filePath}`, error);
        return false;
    }
}

// 生成404页面
function generate404Page(pathname, projectName = '') {
    return `
        <div style="text-align: center; padding: 50px; font-family: Arial;">
            <h2>404 - 页面未找到</h2>
            <p>${projectName}文件不存在: ${pathname}</p>
            <a href="/">返回首页</a>
        </div>
    `;
}

// 主路由处理函数
async function handleRoute(req, res, pathname) {
    try {
        // 设置响应头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        console.log(`请求: ${pathname}`);

        // 处理首页
        if (pathname === '/' || pathname === '/index.html') {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(generateIndexPage());
            return;
        }

        // 遍历项目路由
        for (const [prefix, routeHandler] of Object.entries(projectRoutes)) {
            if (pathname.startsWith(prefix)) {
                const handled = await routeHandler.handle(pathname, req, res, serveFile, generate404Page);
                if (handled) return;
                break;
            }
        }

        // 404 页面
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(generate404Page(pathname));

    } catch (error) {
        console.error('路由处理错误:', error);
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <div style="text-align: center; padding: 50px; font-family: Arial;">
                <h2>500 - 服务器内部错误</h2>
                <p>请稍后再试</p>
                <details style="margin-top: 20px; text-align: left;">
                    <summary>错误详情</summary>
                    <pre style="background: #f5f5f5; padding: 10px; margin-top: 10px;">${error.message}</pre>
                </details>
                <a href="/">返回首页</a>
            </div>
        `);
    }
}

module.exports = {
    handleRoute,
    generateIndexPage,
    serveFile,
    generate404Page
};