// 点当餐厅项目路由处理

const path = require('path');

// 点当餐厅路由配置
const diandangConfig = {
    name: '点当餐厅',
    basePath: '/diandang',
    projectDir: 'diandang',
    endpoints: {
        '/diandang/miniprogram': {
            redirect: '/diandang/miniprogram/',
            indexFile: 'miniprogram/index.html'
        },
        '/diandang/miniprogram/': {
            indexFile: 'miniprogram/index.html'
        },
        '/diandang/merchant-dashboard': {
            redirect: '/diandang/merchant-dashboard/'
        },
        '/diandang/merchant-dashboard/': {
            indexFile: 'merchant-dashboard/index.html'
        },
        '/diandang/merchant': {
            redirect: '/diandang/merchant/'
        },
        '/diandang/merchant/': {
            indexFile: 'merchant-dashboard/index.html'
        }
    }
};

// 处理点当餐厅路由
async function handle(pathname, req, res, serveFile, generate404Page) {
    const config = diandangConfig;
    
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
    } else if (pathname.startsWith('/diandang/miniprogram/')) {
        // 小程序子路径
        const subPath = pathname.replace('/diandang/miniprogram/', '');
        filePath = path.join(__dirname, '..', config.projectDir, 'miniprogram', subPath);
    } else if (pathname.startsWith('/diandang/merchant-dashboard/')) {
        // 商家后台子路径
        const subPath = pathname.replace('/diandang/merchant-dashboard/', '');
        filePath = path.join(__dirname, '..', config.projectDir, 'merchant-dashboard', subPath);
    } else if (pathname.startsWith('/diandang/merchant/')) {
        // 商家后台别名子路径
        const subPath = pathname.replace('/diandang/merchant/', '');
        filePath = path.join(__dirname, '..', config.projectDir, 'merchant-dashboard', subPath);
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
    config: diandangConfig
};