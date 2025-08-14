// 点当平台 - 商家端配置数据
const merchantConfig = {
    // 页面标题映射
    pageTitles: {
        'dashboard': '仪表盘',
        'orders': '订单管理',
        'menu-management': '菜单管理',
        'inventory': '库存管理',
        'customers': '客户管理',
        'analytics': '数据分析',
        'settings': '设置'
    },
    
    // 订单状态配置
    statusConfig: {
        'pending': {
            text: '待处理',
            color: '#ff9500',
            icon: 'fas fa-clock',
            bgColor: '#fff3cd',
            actions: ['accept', 'reject']
        },
        'preparing': {
            text: '制作中',
            color: '#007aff',
            icon: 'fas fa-utensils',
            bgColor: '#cce5ff',
            actions: ['complete', 'delay']
        },
        'ready': {
            text: '待取餐',
            color: '#34c759',
            icon: 'fas fa-bell',
            bgColor: '#d4edda',
            actions: ['pickup']
        },
        'completed': {
            text: '已完成',
            color: '#28a745',
            icon: 'fas fa-check-circle',
            bgColor: '#d4edda',
            actions: []
        },
        'cancelled': {
            text: '已取消',
            color: '#dc3545',
            icon: 'fas fa-times-circle',
            bgColor: '#f8d7da',
            actions: []
        }
    },
    
    // 模态框内容配置
    modalContents: {
        'inventory-low': {
            title: '库存预警',
            content: '以下商品库存不足，请及时补充',
            type: 'warning'
        },
        'new-order': {
            title: '新订单',
            content: '您有新的订单需要处理',
            type: 'info'
        },
        'system-maintenance': {
            title: '系统维护',
            content: '系统将在今晚2:00-4:00进行维护',
            type: 'info'
        }
    },
    
    // 图标映射
    iconConfig: {
        'dashboard': 'fas fa-chart-line',
        'orders': 'fas fa-shopping-bag',
        'menu-management': 'fas fa-utensils',
        'inventory': 'fas fa-boxes',
        'customers': 'fas fa-users',
        'analytics': 'fas fa-chart-bar',
        'settings': 'fas fa-cogs',
        'notification': 'fas fa-bell',
        'user': 'fas fa-user',
        'logout': 'fas fa-sign-out-alt'
    },
    
    // 键盘快捷键配置
    keyboardShortcuts: {
        '1': 'dashboard',
        '2': 'orders',
        '3': 'menu-management',
        '4': 'inventory',
        '5': 'customers',
        '6': 'analytics',
        '7': 'settings'
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = merchantConfig;
} else if (typeof window !== 'undefined') {
    window.merchantConfig = merchantConfig;
}