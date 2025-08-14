// 点当平台 - 平台管理后台数据模型
const platformAdminData = {
    // 页面标题映射
    pageTitles: {
        'dashboard': '平台概览',
        'orders': '订单调度',
        'merchants': '商家管理',
        'dispatch': '派单系统',
        'analytics': '数据分析',
        'settings': '平台配置'
    },
    
    // 订单状态映射
    statusMap: {
        'pending': '待分配',
        'assigned': '已分配',
        'confirmed': '商家确认',
        'preparing': '制作中',
        'ready': '待配送',
        'delivering': '配送中',
        'completed': '已完成',
        'cancelled': '已取消',
        'refunded': '已退款'
    },
    
    // 图标映射
    iconMap: {
        'pending': 'fas fa-clock',
        'assigned': 'fas fa-store',
        'confirmed': 'fas fa-check',
        'preparing': 'fas fa-utensils',
        'ready': 'fas fa-motorcycle',
        'delivering': 'fas fa-truck',
        'completed': 'fas fa-check-circle',
        'cancelled': 'fas fa-times-circle',
        'refunded': 'fas fa-undo'
    },
    
    // 平台统计数据
    platformStats: {
        today: {
            totalOrders: 1258,
            totalRevenue: 89650.0,
            activeUsers: 2890,
            onlineMerchants: 156,
            avgDeliveryTime: 32,
            successRate: 98.5
        },
        realtime: {
            pendingOrders: 45,
            deliveringOrders: 89,
            systemLoad: 0.65,
            serverStatus: 'healthy'
        }
    },
    
    // 配送员数据
    deliveryData: {
        online: 89,
        busy: 67,
        idle: 22,
        avgRating: 4.7,
        totalDeliveries: 2456
    },
    
    // 系统配置
    systemConfig: {
        maxDeliveryDistance: 5,
        platformFeeRate: 0.03,
        minPlatformFee: 1.0,
        baseDeliveryFee: 5.0,
        peakHourMultiplier: 1.2,
        autoAssignmentEnabled: true,
        maxAssignmentRetries: 3
    }
};

// 平台管理工具函数
const platformAdminUtils = {
    // 格式化金额
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: 'CNY'
        }).format(amount);
    },
    
    // 格式化百分比
    formatPercent: (value) => {
        return (value * 100).toFixed(1) + '%';
    },
    
    // 计算时间差
    getTimeDiff: (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diff = Math.floor((now - date) / 1000 / 60); // 分钟
        
        if (diff < 60) {
            return diff + '分钟前';
        } else if (diff < 1440) {
            return Math.floor(diff / 60) + '小时前';
        } else {
            return Math.floor(diff / 1440) + '天前';
        }
    },
    
    // 获取订单优先级
    getOrderPriority: (order) => {
        const orderTime = new Date(order.orderTime);
        const now = new Date();
        const waitTime = (now - orderTime) / 1000 / 60; // 分钟
        
        if (waitTime > 60) return 'urgent';
        if (waitTime > 30) return 'high';
        if (waitTime > 15) return 'normal';
        return 'low';
    }
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { platformAdminData, platformAdminUtils };
} else if (typeof window !== 'undefined') {
    window.platformAdminData = platformAdminData;
    window.platformAdminUtils = platformAdminUtils;
}