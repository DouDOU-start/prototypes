// Mall商城项目路由处理

const path = require('path');

// Mall商城路由配置
const mallConfig = {
    name: 'Mall商城',
    basePath: '/mall',
    projectDir: 'mall',
    endpoints: {
        '/mall/miniprogram': {
            redirect: '/mall/miniprogram/',
            indexFile: 'miniprogram/index.html'
        },
        '/mall/miniprogram/': {
            indexFile: 'miniprogram/index.html'
        },
        '/mall/admin': {
            redirect: '/mall/admin/'
        },
        '/mall/admin/': {
            indexFile: 'admin/index.html'
        }
    }
};

// 处理Mall商城路由
async function handle(pathname, req, res, serveFile, generate404Page) {
    const config = mallConfig;
    
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
    } else if (pathname.startsWith('/mall/miniprogram/')) {
        // 小程序子路径
        const subPath = pathname.replace('/mall/miniprogram/', '');
        filePath = path.join(__dirname, '..', config.projectDir, 'miniprogram', subPath);
    } else if (pathname.startsWith('/mall/admin/')) {
        // 管理员后台子路径
        const subPath = pathname.replace('/mall/admin/', '');
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
    config: mallConfig
};