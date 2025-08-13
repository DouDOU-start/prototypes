// 服务器工具函数

const os = require('os');

// 获取本机IP地址
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    
    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            // 跳过内部和非IPv4地址
            if (interface.family === 'IPv4' && !interface.internal) {
                addresses.push(interface.address);
            }
        }
    }
    
    return addresses;
}

// 获取服务器信息
function getServerInfo() {
    return {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        cpus: os.cpus().length,
        totalMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024) + 'GB',
        freeMemory: Math.round(os.freemem() / 1024 / 1024 / 1024) + 'GB',
        uptime: Math.round(os.uptime() / 3600) + 'h',
        loadAverage: os.loadavg()
    };
}

// 生成服务器启动信息
function generateStartupInfo(PORT, projects = []) {
    const localIPs = getLocalIP();
    const primaryIP = localIPs[0] || 'localhost';
    
    console.log('🎨 原型展示平台服务器已启动!');
    console.log('');
    console.log('📱 访问地址:');
    console.log(`   本地访问:`);
    console.log(`     首页:                    http://localhost:${PORT}`);
    
    // 显示所有项目的访问地址
    projects.forEach(project => {
        project.endpoints.forEach(endpoint => {
            console.log(`     ${project.name} - ${endpoint.name}:${' '.repeat(Math.max(1, 15 - endpoint.name.length))}http://localhost:${PORT}${endpoint.path}`);
        });
    });
    
    console.log('');
    console.log(`   公网访问:`);
    console.log(`     首页:                    http://${primaryIP}:${PORT}`);
    
    projects.forEach(project => {
        project.endpoints.forEach(endpoint => {
            console.log(`     ${project.name} - ${endpoint.name}:${' '.repeat(Math.max(1, 15 - endpoint.name.length))}http://${primaryIP}:${PORT}${endpoint.path}`);
        });
    });
    
    if (localIPs.length > 1) {
        console.log('');
        console.log(`   其他网络地址:`);
        localIPs.slice(1).forEach(ip => {
            console.log(`     http://${ip}:${PORT}`);
        });
    }
    
    console.log('');
    console.log('💡 使用提示:');
    console.log('   - 所有原型都已整合到统一平台');
    console.log('   - 可以通过不同路径访问不同项目');
    console.log('   - 按 Ctrl+C 停止服务器');
    console.log('');
    
    const serverInfo = getServerInfo();
    console.log('🔧 服务器状态:');
    console.log(`   - 平台: ${serverInfo.platform} (${serverInfo.arch})`);
    console.log(`   - Node.js: ${serverInfo.nodeVersion}`);
    console.log(`   - 内存: ${serverInfo.freeMemory}/${serverInfo.totalMemory} 可用`);
    console.log(`   - CPU: ${serverInfo.cpus} 核心`);
    console.log('   - 状态: 运行中...');
    console.log('');
}

// 处理优雅关闭
function setupGracefulShutdown(server) {
    const shutdown = (signal) => {
        console.log(`\n🛑 收到 ${signal} 信号，正在关闭服务器...`);
        server.close(() => {
            console.log('✅ 服务器已安全关闭');
            process.exit(0);
        });

        // 强制关闭超时
        setTimeout(() => {
            console.log('❌ 强制关闭服务器');
            process.exit(1);
        }, 5000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
}

// 请求日志格式化
function formatRequestLog(req, res, startTime) {
    const duration = Date.now() - startTime;
    const method = req.method;
    const url = req.url;
    const status = res.statusCode;
    const userAgent = req.headers['user-agent'] || '-';
    const ip = req.connection.remoteAddress || req.socket.remoteAddress || '-';
    
    // 根据状态码设置颜色
    let statusColor = '';
    if (status >= 200 && status < 300) statusColor = '\x1b[32m'; // 绿色
    else if (status >= 300 && status < 400) statusColor = '\x1b[33m'; // 黄色
    else if (status >= 400) statusColor = '\x1b[31m'; // 红色
    
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, -5);
    
    return `[${timestamp}] ${ip} "${method} ${url}" ${statusColor}${status}\x1b[0m ${duration}ms - ${userAgent.slice(0, 50)}${userAgent.length > 50 ? '...' : ''}`;
}

// 检查端口是否可用
function isPortAvailable(port) {
    return new Promise((resolve) => {
        const server = require('net').createServer();
        
        server.listen(port, () => {
            server.close(() => resolve(true));
        });
        
        server.on('error', () => resolve(false));
    });
}

// 查找可用端口
async function findAvailablePort(startPort = 3000, maxTries = 10) {
    for (let i = 0; i < maxTries; i++) {
        const port = startPort + i;
        if (await isPortAvailable(port)) {
            return port;
        }
    }
    throw new Error('没有找到可用端口');
}

// 生成错误页面
function generateErrorPage(error, statusCode = 500) {
    const errorMessages = {
        400: '400 - 错误的请求',
        404: '404 - 页面未找到',
        500: '500 - 服务器内部错误',
        503: '503 - 服务不可用'
    };
    
    const title = errorMessages[statusCode] || `${statusCode} - 未知错误`;
    
    return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                margin: 0;
                padding: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .error-container {
                text-align: center;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 20px;
                padding: 40px;
                backdrop-filter: blur(10px);
                max-width: 500px;
                width: 90%;
            }
            .error-code {
                font-size: 72px;
                font-weight: bold;
                margin-bottom: 20px;
                opacity: 0.8;
            }
            .error-title {
                font-size: 24px;
                margin-bottom: 15px;
            }
            .error-message {
                font-size: 16px;
                opacity: 0.8;
                margin-bottom: 30px;
                line-height: 1.6;
            }
            .back-link {
                display: inline-block;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 25px;
                font-weight: 500;
                transition: all 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }
            .back-link:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-2px);
            }
            .error-details {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.2);
            }
            .error-details summary {
                cursor: pointer;
                opacity: 0.7;
                margin-bottom: 10px;
            }
            .error-details pre {
                background: rgba(0, 0, 0, 0.3);
                padding: 15px;
                border-radius: 8px;
                text-align: left;
                overflow-x: auto;
                font-size: 12px;
                opacity: 0.8;
            }
        </style>
    </head>
    <body>
        <div class="error-container">
            <div class="error-code">${statusCode}</div>
            <div class="error-title">${title}</div>
            <div class="error-message">
                ${statusCode === 404 ? '您访问的页面不存在，请检查URL是否正确。' : 
                  statusCode === 500 ? '服务器遇到了一个错误，请稍后再试。' : 
                  '请求无法完成，请稍后再试。'}
            </div>
            <a href="/" class="back-link">返回首页</a>
            ${error && statusCode === 500 ? `
                <div class="error-details">
                    <details>
                        <summary>错误详情</summary>
                        <pre>${error.stack || error.message || error}</pre>
                    </details>
                </div>
            ` : ''}
        </div>
    </body>
    </html>
    `;
}

module.exports = {
    getLocalIP,
    getServerInfo,
    generateStartupInfo,
    setupGracefulShutdown,
    formatRequestLog,
    isPortAvailable,
    findAvailablePort,
    generateErrorPage
};