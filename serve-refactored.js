// 重构后的服务器文件 - 模块化架构

const http = require('http');
const url = require('url');
const { handleRoute } = require('./routes');
const { generateStartupInfo, setupGracefulShutdown, formatRequestLog } = require('./utils/serverUtils');

// 项目配置
const projectsConfig = [
    {
        name: '点当餐厅',
        endpoints: [
            { name: '小程序端', path: '/diandang/miniprogram/' },
            { name: '商家后台', path: '/diandang/merchant/' }
        ]
    },
    {
        name: 'Mall商城',
        endpoints: [
            { name: '小程序端', path: '/mall/miniprogram/' },
            { name: '管理员后台', path: '/mall/admin/' }
        ]
    },
    {
        name: '餐厅点单',
        endpoints: [
            { name: '用户端', path: '/restaurant-ordering/customer-app/' },
            { name: '商家端', path: '/restaurant-ordering/merchant-dashboard/' }
        ]
    }
];

// 创建 HTTP 服务器
const server = http.createServer(async (req, res) => {
    const startTime = Date.now();
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    try {
        // 处理路由
        await handleRoute(req, res, pathname);
        
    } catch (error) {
        console.error('服务器错误:', error);
        
        if (!res.headersSent) {
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
    } finally {
        // 输出请求日志
        if (process.env.NODE_ENV !== 'production') {
            console.log(formatRequestLog(req, res, startTime));
        }
    }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
    generateStartupInfo(PORT, projectsConfig);
});

// 设置优雅关闭
setupGracefulShutdown(server);

// 错误处理
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ 端口 ${PORT} 已被占用，请尝试其他端口`);
        process.exit(1);
    } else {
        console.error('服务器错误:', error);
    }
});

// 未捕获的异常处理
process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝:', reason);
    // 在生产环境中可能需要退出进程
    // process.exit(1);
});

module.exports = server;