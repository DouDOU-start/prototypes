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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>仓和餐厅 - 系统选择</title>
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
            max-width: 800px;
            padding: 40px 20px;
        }

        .logo {
            font-size: 48px;
            margin-bottom: 16px;
        }

        .title {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            background: linear-gradient(45deg, #fff, #f0f8ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .subtitle {
            font-size: 16px;
            opacity: 0.8;
            margin-bottom: 48px;
        }

        .systems {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 32px;
            margin-top: 48px;
        }

        .system-card {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            padding: 40px 24px;
            text-decoration: none;
            color: white;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            position: relative;
            overflow: hidden;
        }

        .system-card::before {
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

        .system-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
        }

        .system-card:hover::before {
            opacity: 1;
        }

        .system-icon {
            font-size: 64px;
            margin-bottom: 24px;
            display: block;
        }

        .system-name {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 12px;
        }

        .system-description {
            font-size: 14px;
            opacity: 0.8;
            line-height: 1.6;
            margin-bottom: 24px;
        }

        .system-features {
            list-style: none;
            text-align: left;
            margin-bottom: 24px;
        }

        .system-features li {
            font-size: 13px;
            opacity: 0.7;
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
        }

        .system-features li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #4ade80;
            font-weight: bold;
        }

        .access-button {
            background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
        }

        .access-button:hover {
            background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%);
            transform: translateY(-2px);
        }

        .footer {
            margin-top: 64px;
            font-size: 14px;
            opacity: 0.6;
        }

        .device-hint {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 8px 16px;
            font-size: 12px;
            margin-top: 16px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .mobile-hint {
            color: #fbbf24;
        }

        .tablet-hint {
            color: #60a5fa;
        }

        @media (max-width: 768px) {
            .systems {
                grid-template-columns: 1fr;
            }
            
            .title {
                font-size: 24px;
            }
            
            .container {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🏪</div>
        <h1 class="title">仓和餐厅管理系统</h1>
        <p class="subtitle">请选择要访问的系统</p>
        
        <div class="systems">
            <!-- 小程序端 -->
            <a href="/miniprogram" class="system-card">
                <i class="fas fa-mobile-alt system-icon"></i>
                <h2 class="system-name">小程序端</h2>
                <p class="system-description">面向顾客的点餐小程序，提供完整的在线点餐体验</p>
                <ul class="system-features">
                    <li>浏览菜单和菜品详情</li>
                    <li>添加菜品到购物车</li>
                    <li>在线下单和支付</li>
                    <li>查看订单状态</li>
                    <li>个人信息管理</li>
                </ul>
                <div class="access-button">
                    <i class="fas fa-arrow-right"></i>
                    进入小程序
                </div>
                <div class="device-hint mobile-hint">
                    📱 建议使用手机访问，获得最佳体验
                </div>
            </a>
            
            <!-- 商家端 -->
            <a href="/merchant" class="system-card">
                <i class="fas fa-chart-line system-icon"></i>
                <h2 class="system-name">商家管理后台</h2>
                <p class="system-description">面向商家的管理后台，提供全面的店铺管理功能</p>
                <ul class="system-features">
                    <li>实时订单管理</li>
                    <li>菜单和库存管理</li>
                    <li>销售数据分析</li>
                    <li>客户信息管理</li>
                    <li>营业状态控制</li>
                </ul>
                <div class="access-button">
                    <i class="fas fa-arrow-right"></i>
                    进入管理后台
                </div>
                <div class="device-hint tablet-hint">
                    📱 建议使用平板访问，获得最佳体验
                </div>
            </a>
        </div>
        
        <div class="footer">
            <p>© 2024 仓和餐厅管理系统 - 技术演示版本</p>
            <p style="margin-top: 8px; font-size: 12px;">
                服务器运行在 <code>http://localhost:3000</code>
            </p>
            <p style="margin-top: 16px;">
                <a href="/clear-cache" style="color: #ffd700; text-decoration: none; font-size: 12px;">
                    🧹 遇到资源加载问题？点击清理缓存
                </a>
            </p>
        </div>
    </div>

    <script>
        // 检测设备类型并给出提示
        function detectDevice() {
            const userAgent = navigator.userAgent.toLowerCase();
            const isMobile = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
            const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent) || 
                            (window.innerWidth >= 768 && window.innerWidth <= 1024);

            // 添加设备类别到body
            if (isMobile) {
                document.body.classList.add('mobile-device');
            } else if (isTablet) {
                document.body.classList.add('tablet-device');
            } else {
                document.body.classList.add('desktop-device');
            }
        }

        // 页面加载完成后执行
        document.addEventListener('DOMContentLoaded', function() {
            detectDevice();
            
            // 添加卡片点击动画
            const cards = document.querySelectorAll('.system-card');
            cards.forEach(card => {
                card.addEventListener('mousedown', function() {
                    this.style.transform = 'translateY(-4px) scale(0.98)';
                });
                
                card.addEventListener('mouseup', function() {
                    this.style.transform = 'translateY(-8px) scale(1)';
                });
                
                card.addEventListener('mouseleave', function() {
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

        // 路由处理
        if (pathname === '/' || pathname === '/index.html') {
            // 首页 - 系统选择页面
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(generateIndexPage());
            
        } else if (pathname === '/clear-cache' || pathname === '/clear-cache.html') {
            // 缓存清理页面
            const clearCacheContent = await readFile(path.join(__dirname, 'clear-cache.html'));
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(clearCacheContent);
            
        } else if (pathname === '/miniprogram' || pathname.startsWith('/miniprogram/')) {
            // 小程序端路由
            let filePath;
            
            if (pathname === '/miniprogram' || pathname === '/miniprogram/') {
                filePath = path.join(__dirname, 'miniprogram', 'index.html');
            } else {
                // 移除 /miniprogram 前缀
                const relativePath = pathname.replace('/miniprogram', '');
                filePath = path.join(__dirname, 'miniprogram', relativePath);
            }
            
            // 调试信息
            console.log(`小程序端请求: ${pathname} -> ${filePath}`);
            
            if (fileExists(filePath)) {
                const data = await readFile(filePath);
                const mimeType = getMimeType(filePath);
                
                // 为文本文件添加UTF-8字符集
                let contentType = mimeType;
                if (mimeType === 'text/css' || mimeType === 'application/javascript' || mimeType === 'text/html') {
                    contentType += '; charset=utf-8';
                }
                
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
                console.log(`✅ 成功加载: ${pathname} (${contentType})`);
            } else {
                console.log(`❌ 文件不存在: ${filePath}`);
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`
                    <div style="text-align: center; padding: 50px; font-family: Arial;">
                        <h2>404 - 页面未找到</h2>
                        <p>小程序文件不存在: ${pathname}</p>
                        <p>尝试访问: ${filePath}</p>
                        <a href="/">返回首页</a>
                    </div>
                `);
            }
            
        } else if (pathname === '/merchant' || pathname.startsWith('/merchant/')) {
            // 商家端路由
            let filePath;
            
            if (pathname === '/merchant' || pathname === '/merchant/') {
                filePath = path.join(__dirname, 'merchant-dashboard', 'index.html');
            } else {
                // 移除 /merchant 前缀
                const relativePath = pathname.replace('/merchant', '');
                filePath = path.join(__dirname, 'merchant-dashboard', relativePath);
            }
            
            // 调试信息
            console.log(`商家端请求: ${pathname} -> ${filePath}`);
            
            if (fileExists(filePath)) {
                const data = await readFile(filePath);
                const mimeType = getMimeType(filePath);
                
                // 为文本文件添加UTF-8字符集
                let contentType = mimeType;
                if (mimeType === 'text/css' || mimeType === 'application/javascript' || mimeType === 'text/html') {
                    contentType += '; charset=utf-8';
                }
                
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
                console.log(`✅ 成功加载: ${pathname} (${contentType})`);
            } else {
                console.log(`❌ 文件不存在: ${filePath}`);
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`
                    <div style="text-align: center; padding: 50px; font-family: Arial;">
                        <h2>404 - 页面未找到</h2>
                        <p>商家端文件不存在: ${pathname}</p>
                        <p>尝试访问: ${filePath}</p>
                        <a href="/">返回首页</a>
                    </div>
                `);
            }
            
        } else {
            // API 路由 (可扩展)
            if (pathname.startsWith('/api/')) {
                // 处理 API 请求
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'API 路由 - 功能开发中',
                    path: pathname,
                    timestamp: new Date().toISOString()
                }));
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
const HOST = process.env.HOST || 'localhost';

server.listen(PORT, HOST, () => {
    console.log('🚀 仓和餐厅管理系统服务器已启动!');
    console.log('');
    console.log('📱 访问地址:');
    console.log(`   主页:        http://${HOST}:${PORT}`);
    console.log(`   小程序端:    http://${HOST}:${PORT}/miniprogram`);
    console.log(`   商家端:      http://${HOST}:${PORT}/merchant`);
    console.log('');
    console.log('💡 使用提示:');
    console.log('   - 小程序端建议用手机访问');
    console.log('   - 商家端建议用平板访问');
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