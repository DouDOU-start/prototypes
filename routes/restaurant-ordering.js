// 餐厅点单项目路由处理

const path = require('path');

// 餐厅点单路由配置
const restaurantOrderingConfig = {
    name: '餐厅点单',
    basePath: '/restaurant-ordering',
    projectDir: 'restaurant-ordering',
    endpoints: {
        '/restaurant-ordering/customer-app': {
            redirect: '/restaurant-ordering/customer-app/',
            indexFile: 'customer-app/index.html'
        },
        '/restaurant-ordering/customer-app/': {
            indexFile: 'customer-app/index.html'
        },
        '/restaurant-ordering/merchant-dashboard': {
            redirect: '/restaurant-ordering/merchant-dashboard/'
        },
        '/restaurant-ordering/merchant-dashboard/': {
            indexFile: 'merchant-dashboard/index.html'
        },
        '/restaurant-ordering/merchant-dashboard/login': {
            redirect: '/restaurant-ordering/merchant-dashboard/login.html'
        },
        '/restaurant-ordering/merchant-dashboard/login.html': {
            indexFile: 'merchant-dashboard/login.html'
        }
    }
};

// 处理餐厅点单路由
async function handle(pathname, req, res, serveFile, generate404Page) {
    const config = restaurantOrderingConfig;
    
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
    } else if (pathname.startsWith('/restaurant-ordering/customer-app/')) {
        // 用户端子路径
        const subPath = pathname.replace('/restaurant-ordering/customer-app/', '');
        filePath = path.join(__dirname, '..', config.projectDir, 'customer-app', subPath);
    } else if (pathname.startsWith('/restaurant-ordering/merchant-dashboard/')) {
        // 商家后台子路径
        const subPath = pathname.replace('/restaurant-ordering/merchant-dashboard/', '');
        filePath = path.join(__dirname, '..', config.projectDir, 'merchant-dashboard', subPath);
    } else if (pathname.startsWith('/restaurant-ordering/shared/')) {
        // 共享资源子路径
        const subPath = pathname.replace('/restaurant-ordering/shared/', '');
        filePath = path.join(__dirname, '..', config.projectDir, 'shared', subPath);
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
    config: restaurantOrderingConfig
};