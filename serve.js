const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// MIME 类型映射
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

// 获取文件的 MIME 类型
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'text/plain';
}

// 读取文件内容
function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// 检查文件是否存在
function fileExists(filePath) {
    return fs.existsSync(filePath);
}

// 生成首页 HTML
function generateIndexPage() {
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="原型展示">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="theme-color" content="#667eea">
    <title>原型展示 - Prototype Showcase</title>
    <link rel="apple-touch-icon" href="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=180&h=180&fit=crop&crop=center">
    <link rel="shortcut icon" href="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=32&h=32&fit=crop&crop=center">
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

        /* Fullscreen support for all devices */
        @supports (padding: max(0px)) {
            body {
                padding-left: env(safe-area-inset-left);
                padding-right: env(safe-area-inset-right);
                padding-top: env(safe-area-inset-top);
                padding-bottom: env(safe-area-inset-bottom);
            }
            
            .container {
                margin-left: calc(0px - env(safe-area-inset-left));
                margin-right: calc(0px - env(safe-area-inset-right));
                margin-top: calc(0px - env(safe-area-inset-top));
                margin-bottom: calc(0px - env(safe-area-inset-bottom));
                padding-left: calc(32px + env(safe-area-inset-left));
                padding-right: calc(32px + env(safe-area-inset-right));
                padding-top: calc(32px + env(safe-area-inset-top));
                padding-bottom: calc(32px + env(safe-area-inset-bottom));
            }
        }

        /* iPad Pro fullscreen optimization */
        @media screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (-webkit-min-device-pixel-ratio: 2) {
            body {
                background-attachment: fixed;
            }
            
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 48px;
            }
            
            .projects {
                grid-template-columns: repeat(2, 1fr);
                gap: 32px;
            }
            
            .project {
                padding: 32px;
            }
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
                    <div class="project-icon">🚀</div>
                    <div class="project-name">点当外卖平台</div>
                </div>
                <p class="project-description">完整的多商家聚合外卖平台，支持智能派单、配送管理和平台运营</p>
                <div class="endpoints">
                    <a href="/diandang/miniprogram/" class="endpoint">
                        <div class="endpoint-info">
                            <i class="fas fa-mobile-alt endpoint-icon"></i>
                            <div class="endpoint-details">
                                <h3>用户端</h3>
                                <p>多商家下单系统</p>
                            </div>
                        </div>
                        <i class="fas fa-arrow-right endpoint-arrow"></i>
                    </a>
                    <a href="/diandang/merchant/" class="endpoint">
                        <div class="endpoint-info">
                            <i class="fas fa-store endpoint-icon"></i>
                            <div class="endpoint-details">
                                <h3>商家端</h3>
                                <p>接单管理系统</p>
                            </div>
                        </div>
                        <i class="fas fa-arrow-right endpoint-arrow"></i>
                    </a>
                    <a href="/diandang/platform-admin/" class="endpoint">
                        <div class="endpoint-info">
                            <i class="fas fa-layer-group endpoint-icon"></i>
                            <div class="endpoint-details">
                                <h3>平台管理</h3>
                                <p>订单派发与运营</p>
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
                    <a href="/restaurant-ordering/merchant-dashboard/login.html" class="endpoint">
                        <div class="endpoint-info">
                            <i class="fas fa-chart-line endpoint-icon"></i>
                            <div class="endpoint-details">
                                <h3>商家管理后台</h3>
                                <p>订单管理系统（需要登录）</p>
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

// 创建 HTTP 服务器
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    try {
        // 设置 CORS 头和缓存控制
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        // 禁用缓存以避免404错误被缓存
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        console.log(`请求: ${pathname}`);

        // 路由处理
        if (pathname === '/' || pathname === '/index.html') {
            // 首页 - 项目选择页面
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(generateIndexPage());
            
        } else if (pathname.startsWith('/diandang/')) {
            // 点当餐厅系统路由
            let filePath;
            const relativePath = pathname.replace('/diandang/', '');
            
            if (pathname === '/diandang/' || pathname === '/diandang') {
                // 重定向到首页，让用户选择具体端点
                res.writeHead(302, { 'Location': '/' });
                res.end();
                return;
            } else if (pathname === '/diandang/miniprogram') {
                // 重定向到以斜杠结尾的URL，确保相对路径正确解析
                res.writeHead(301, { 'Location': '/diandang/miniprogram/' });
                res.end();
                return;
            } else if (pathname === '/diandang/miniprogram/') {
                filePath = path.join(__dirname, 'diandang', 'miniprogram', 'index.html');
            } else if (pathname === '/diandang/merchant-dashboard') {
                // 重定向到以斜杠结尾的URL，确保相对路径正确解析
                res.writeHead(301, { 'Location': '/diandang/merchant-dashboard/' });
                res.end();
                return;
            } else if (pathname === '/diandang/merchant-dashboard/') {
                filePath = path.join(__dirname, 'diandang', 'merchant-dashboard', 'index.html');
            } else if (pathname === '/diandang/merchant') {
                // 重定向到以斜杠结尾的URL，确保相对路径正确解析
                res.writeHead(301, { 'Location': '/diandang/merchant/' });
                res.end();
                return;
            } else if (pathname === '/diandang/merchant/') {
                filePath = path.join(__dirname, 'diandang', 'merchant-dashboard', 'index.html');
            } else if (pathname === '/diandang/platform-admin') {
                // 重定向到以斜杠结尾的URL，确保相对路径正确解析
                res.writeHead(301, { 'Location': '/diandang/platform-admin/' });
                res.end();
                return;
            } else if (pathname === '/diandang/platform-admin/') {
                filePath = path.join(__dirname, 'diandang', 'platform-admin', 'index.html');
            } else if (pathname.startsWith('/diandang/miniprogram/')) {
                const subPath = pathname.replace('/diandang/miniprogram/', '');
                filePath = path.join(__dirname, 'diandang', 'miniprogram', subPath);
            } else if (pathname.startsWith('/diandang/merchant-dashboard/')) {
                const subPath = pathname.replace('/diandang/merchant-dashboard/', '');
                filePath = path.join(__dirname, 'diandang', 'merchant-dashboard', subPath);
            } else if (pathname.startsWith('/diandang/merchant/')) {
                const subPath = pathname.replace('/diandang/merchant/', '');
                filePath = path.join(__dirname, 'diandang', 'merchant-dashboard', subPath);
            } else if (pathname.startsWith('/diandang/platform-admin/')) {
                const subPath = pathname.replace('/diandang/platform-admin/', '');
                filePath = path.join(__dirname, 'diandang', 'platform-admin', subPath);
            } else if (pathname.startsWith('/diandang/shared/')) {
                const subPath = pathname.replace('/diandang/shared/', '');
                filePath = path.join(__dirname, 'diandang', 'shared', subPath);
            } else {
                // 其他 diandang 路径，如 clear-cache
                filePath = path.join(__dirname, 'diandang', relativePath);
            }
            
            console.log(`点当餐厅请求: ${pathname} -> ${filePath}`);
            
            if (fileExists(filePath)) {
                const data = await readFile(filePath);
                const mimeType = getMimeType(filePath);
                
                let contentType = mimeType;
                if (mimeType === 'text/css' || mimeType === 'application/javascript' || mimeType === 'text/html') {
                    contentType += '; charset=utf-8';
                }
                
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
                console.log(`✅ 成功加载: ${pathname}`);
            } else {
                console.log(`❌ 文件不存在: ${filePath}`);
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`
                    <div style="text-align: center; padding: 50px; font-family: Arial;">
                        <h2>404 - 页面未找到</h2>
                        <p>点当餐厅文件不存在: ${pathname}</p>
                        <a href="/">返回首页</a>
                    </div>
                `);
            }
            
        } else if (pathname.startsWith('/mall/')) {
            // Mall 商城系统路由
            let filePath;
            
            if (pathname === '/mall/' || pathname === '/mall') {
                // 重定向到首页，让用户选择具体端点
                res.writeHead(302, { 'Location': '/' });
                res.end();
                return;
            } else if (pathname === '/mall/miniprogram') {
                // 重定向到以斜杠结尾的URL，确保相对路径正确解析
                res.writeHead(301, { 'Location': '/mall/miniprogram/' });
                res.end();
                return;
            } else if (pathname === '/mall/miniprogram/') {
                filePath = path.join(__dirname, 'mall', 'miniprogram', 'index.html');
            } else if (pathname === '/mall/admin') {
                // 重定向到以斜杠结尾的URL，确保相对路径正确解析
                res.writeHead(301, { 'Location': '/mall/admin/' });
                res.end();
                return;
            } else if (pathname === '/mall/admin/') {
                filePath = path.join(__dirname, 'mall', 'admin', 'index.html');
            } else if (pathname.startsWith('/mall/miniprogram/')) {
                const subPath = pathname.replace('/mall/miniprogram/', '');
                filePath = path.join(__dirname, 'mall', 'miniprogram', subPath);
            } else if (pathname.startsWith('/mall/admin/')) {
                const subPath = pathname.replace('/mall/admin/', '');
                filePath = path.join(__dirname, 'mall', 'admin', subPath);
            } else {
                // 其他 mall 路径
                const relativePath = pathname.replace('/mall/', '');
                filePath = path.join(__dirname, 'mall', relativePath);
            }
            
            console.log(`Mall商城请求: ${pathname} -> ${filePath}`);
            
            if (fileExists(filePath)) {
                const data = await readFile(filePath);
                const mimeType = getMimeType(filePath);
                
                let contentType = mimeType;
                if (mimeType === 'text/css' || mimeType === 'application/javascript' || mimeType === 'text/html') {
                    contentType += '; charset=utf-8';
                }
                
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
                console.log(`✅ 成功加载: ${pathname}`);
            } else {
                console.log(`❌ 文件不存在: ${filePath}`);
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`
                    <div style="text-align: center; padding: 50px; font-family: Arial;">
                        <h2>404 - 页面未找到</h2>
                        <p>Mall商城文件不存在: ${pathname}</p>
                        <a href="/">返回首页</a>
                    </div>
                `);
            }
            
        } else if (pathname.startsWith('/restaurant-ordering/')) {
            // 餐厅点单系统路由
            let filePath;
            
            if (pathname === '/restaurant-ordering/' || pathname === '/restaurant-ordering') {
                // 重定向到首页，让用户选择具体端点
                res.writeHead(302, { 'Location': '/' });
                res.end();
                return;
            } else if (pathname === '/restaurant-ordering/customer-app') {
                // 重定向到以斜杠结尾的URL，确保相对路径正确解析
                res.writeHead(301, { 'Location': '/restaurant-ordering/customer-app/' });
                res.end();
                return;
            } else if (pathname === '/restaurant-ordering/customer-app/') {
                filePath = path.join(__dirname, 'restaurant-ordering', 'customer-app', 'index.html');
            } else if (pathname === '/restaurant-ordering/merchant-dashboard') {
                // 重定向到以斜杠结尾的URL，确保相对路径正确解析
                res.writeHead(301, { 'Location': '/restaurant-ordering/merchant-dashboard/' });
                res.end();
                return;
            } else if (pathname === '/restaurant-ordering/merchant-dashboard/') {
                filePath = path.join(__dirname, 'restaurant-ordering', 'merchant-dashboard', 'index.html');
            } else if (pathname.startsWith('/restaurant-ordering/customer-app/')) {
                const subPath = pathname.replace('/restaurant-ordering/customer-app/', '');
                filePath = path.join(__dirname, 'restaurant-ordering', 'customer-app', subPath);
            } else if (pathname.startsWith('/restaurant-ordering/merchant-dashboard/')) {
                const subPath = pathname.replace('/restaurant-ordering/merchant-dashboard/', '');
                filePath = path.join(__dirname, 'restaurant-ordering', 'merchant-dashboard', subPath);
            } else if (pathname.startsWith('/restaurant-ordering/shared/')) {
                const subPath = pathname.replace('/restaurant-ordering/shared/', '');
                filePath = path.join(__dirname, 'restaurant-ordering', 'shared', subPath);
            } else {
                // 其他 restaurant-ordering 路径
                const relativePath = pathname.replace('/restaurant-ordering/', '');
                filePath = path.join(__dirname, 'restaurant-ordering', relativePath);
            }
            
            console.log(`餐厅点单请求: ${pathname} -> ${filePath}`);
            
            if (fileExists(filePath)) {
                const data = await readFile(filePath);
                const mimeType = getMimeType(filePath);
                
                let contentType = mimeType;
                if (mimeType === 'text/css' || mimeType === 'application/javascript' || mimeType === 'text/html') {
                    contentType += '; charset=utf-8';
                }
                
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
                console.log(`✅ 成功加载: ${pathname}`);
            } else {
                console.log(`❌ 文件不存在: ${filePath}`);
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`
                    <div style="text-align: center; padding: 50px; font-family: Arial;">
                        <h2>404 - 页面未找到</h2>
                        <p>餐厅点单文件不存在: ${pathname}</p>
                        <a href="/">返回首页</a>
                    </div>
                `);
            }
            
        } else {
            // 404 页面
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
                <div style="text-align: center; padding: 50px; font-family: Arial;">
                    <h2>404 - 页面未找到</h2>
                    <p>请求的路径不存在: ${pathname}</p>
                    <a href="/">返回首页</a>
                </div>
            `);
        }
        
    } catch (error) {
        console.error('服务器错误:', error);
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
});

// 启动服务器
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
    console.log('🎨 原型展示平台服务器已启动!');
    console.log('');
    console.log('📱 访问地址:');
    console.log(`   本地访问:`);
    console.log(`     首页:                    http://localhost:${PORT}`);
    console.log(`     点当外卖 - 用户端:       http://localhost:${PORT}/diandang/miniprogram/`);
    console.log(`     点当外卖 - 商家端:       http://localhost:${PORT}/diandang/merchant/`);
    console.log(`     点当外卖 - 平台管理:     http://localhost:${PORT}/diandang/platform-admin/`);
    console.log(`     Mall商城 - 小程序端:     http://localhost:${PORT}/mall/miniprogram/`);
    console.log(`     Mall商城 - 管理员后台:   http://localhost:${PORT}/mall/admin/`);
    console.log(`     餐厅点单 - 用户端:       http://localhost:${PORT}/restaurant-ordering/customer-app/`);
    console.log(`     餐厅点单 - 商家端:       http://localhost:${PORT}/restaurant-ordering/merchant-dashboard/`);
    console.log('');
    console.log(`   公网访问:`);
    console.log(`     首页:                    http://106.12.5.203:${PORT}`);
    console.log(`     点当外卖 - 用户端:       http://106.12.5.203:${PORT}/diandang/miniprogram/`);
    console.log(`     点当外卖 - 商家端:       http://106.12.5.203:${PORT}/diandang/merchant/`);
    console.log(`     点当外卖 - 平台管理:     http://106.12.5.203:${PORT}/diandang/platform-admin/`);
    console.log(`     Mall商城 - 小程序端:     http://106.12.5.203:${PORT}/mall/miniprogram/`);
    console.log(`     Mall商城 - 管理员后台:   http://106.12.5.203:${PORT}/mall/admin/`);
    console.log(`     餐厅点单 - 用户端:       http://106.12.5.203:${PORT}/restaurant-ordering/customer-app/`);
    console.log(`     餐厅点单 - 商家端:       http://106.12.5.203:${PORT}/restaurant-ordering/merchant-dashboard/`);
    console.log('');
    console.log('💡 使用提示:');
    console.log('   - 所有原型都已整合到统一平台');
    console.log('   - 可以通过不同路径访问不同项目');
    console.log('   - 按 Ctrl+C 停止服务器');
    console.log('');
    console.log('🔧 服务器状态: 运行中...');
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n🛑 正在关闭服务器...');
    server.close(() => {
        console.log('✅ 服务器已安全关闭');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 收到终止信号，正在关闭服务器...');
    server.close(() => {
        console.log('✅ 服务器已安全关闭');
        process.exit(0);
    });
});