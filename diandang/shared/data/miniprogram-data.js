// 点当平台 - 小程序端数据模型
const miniprogramData = {
    // 用户信息（引用平台数据）
    user: null, // 运行时从 platformData.users[0] 获取
    
    // 购物车数据
    cart: [],
    
    // 当前选择的商家
    currentMerchant: null,
    
    // 菜单分类数据
    menuCategories: [
        {
            id: 'signature',
            name: '招牌川菜',
            icon: '🌶️',
            items: [
                { 
                    id: 1, 
                    name: '宫保鸡丁', 
                    price: 32.0, 
                    originalPrice: 36.0,
                    description: '传统宫保鸡丁，选用优质鸡胸肉，配以花生米，口感鲜嫩爽口', 
                    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=300&fit=crop',
                    rating: 4.8,
                    salesCount: 156,
                    tags: ['招牌', '微辣', '下饭'],
                    spicyLevel: 2,
                    preparationTime: '15分钟'
                },
                { 
                    id: 2, 
                    name: '麻婆豆腐', 
                    price: 26.0, 
                    originalPrice: 28.0,
                    description: '正宗川味麻婆豆腐，嫩滑豆腐配麻辣汤汁，开胃下饭', 
                    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300&h=300&fit=crop',
                    rating: 4.7,
                    salesCount: 134,
                    tags: ['经典', '麻辣', '素食'],
                    spicyLevel: 3,
                    preparationTime: '12分钟'
                },
                { 
                    id: 3, 
                    name: '回锅肉', 
                    price: 38.0, 
                    originalPrice: 42.0,
                    description: '家常回锅肉，五花肉片配青椒豆瓣酱，肥而不腻香辣开胃', 
                    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop',
                    rating: 4.9,
                    salesCount: 128,
                    tags: ['家常', '香辣', '下饭'],
                    spicyLevel: 2,
                    preparationTime: '18分钟'
                },
                { 
                    id: 4, 
                    name: '水煮鱼', 
                    price: 68.0, 
                    originalPrice: 75.0,
                    description: '麻辣水煮鱼，鲜嫩鱼肉配香辣汤底，让人回味无穷', 
                    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=300&fit=crop',
                    rating: 4.8,
                    salesCount: 89,
                    tags: ['麻辣', '鱼肉', '下饭'],
                    spicyLevel: 4,
                    preparationTime: '25分钟'
                }
            ]
        },
        {
            id: 'soup',
            name: '汤品类',
            icon: '🍲',
            items: [
                { 
                    id: 5, 
                    name: '蛋花汤', 
                    price: 15.0,
                    description: '清淡营养的蛋花汤，口感滑嫩', 
                    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=300&fit=crop',
                    rating: 4.3,
                    salesCount: 78,
                    tags: ['清淡', '营养'],
                    spicyLevel: 0,
                    preparationTime: '8分钟'
                },
                { 
                    id: 6, 
                    name: '紫菜蛋花汤', 
                    price: 16.0,
                    description: '营养丰富的紫菜蛋花汤，鲜美可口', 
                    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=300&fit=crop',
                    rating: 4.4,
                    salesCount: 65,
                    tags: ['清淡', '营养', '紫菜'],
                    spicyLevel: 0,
                    preparationTime: '10分钟'
                },
                { 
                    id: 7, 
                    name: '银耳莲子汤', 
                    price: 12.0,
                    description: '润燥养颜的银耳莲子汤，甜润可口', 
                    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop',
                    rating: 4.2,
                    salesCount: 43,
                    tags: ['甜品', '养生'],
                    spicyLevel: 0,
                    preparationTime: '15分钟'
                }
            ]
        },
        {
            id: 'staple',
            name: '主食类',
            icon: '🍚',
            items: [
                { 
                    id: 8, 
                    name: '白米饭', 
                    price: 5.0,
                    description: '优质东北大米，粒粒分明', 
                    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop',
                    rating: 4.0,
                    salesCount: 200,
                    tags: ['主食'],
                    spicyLevel: 0,
                    preparationTime: '5分钟'
                },
                { 
                    id: 9, 
                    name: '小米粥', 
                    price: 8.0,
                    description: '养胃小米粥，温润滋补', 
                    image: 'https://images.unsplash.com/photo-1571197274217-1c86cd50b4de?w=300&h=300&fit=crop',
                    rating: 4.1,
                    salesCount: 67,
                    tags: ['养胃', '粥类'],
                    spicyLevel: 0,
                    preparationTime: '12分钟'
                }
            ]
        },
        {
            id: 'vegetable',
            name: '素食类',
            icon: '🥬',
            items: [
                { 
                    id: 10, 
                    name: '酸辣土豆丝', 
                    price: 18.0,
                    description: '爽脆酸辣土豆丝，开胃下饭', 
                    image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=300&h=300&fit=crop',
                    rating: 4.4,
                    salesCount: 98,
                    tags: ['爽脆', '酸辣', '素食'],
                    spicyLevel: 2,
                    preparationTime: '8分钟'
                },
                { 
                    id: 11, 
                    name: '蒜蓉娃娃菜', 
                    price: 20.0,
                    description: '清香蒜蓉娃娃菜，清淡健康', 
                    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=300&fit=crop',
                    rating: 4.3,
                    salesCount: 76,
                    tags: ['清淡', '蒜香', '素食'],
                    spicyLevel: 1,
                    preparationTime: '10分钟'
                },
                { 
                    id: 12, 
                    name: '时蔬小炒', 
                    price: 22.0,
                    description: '当季时蔬小炒，营养健康', 
                    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop',
                    rating: 4.2,
                    salesCount: 54,
                    tags: ['时蔬', '营养', '素食'],
                    spicyLevel: 1,
                    preparationTime: '12分钟'
                }
            ]
        }
    ],
    
    // 订单历史数据（示例数据，实际从platformData获取）
    orders: []
};

// 页面配置数据
const pageConfig = {
    titles: {
        'splash': '点当外卖',
        'wechat-login': '微信登录',
        'home': '首页',
        'menu': '菜单',
        'detail': '商品详情',
        'cart': '购物车',
        'payment': '订单支付',
        'pay-success': '支付成功',
        'status': '订单状态',
        'orders': '订单历史',
        'profile': '个人中心',
        'auth-confirm': '授权确认',
        'auth-processing': '登录中',
        'order': '订单详情'
    },
    
    statusConfig: {
        'pending': {
            icon: 'fas fa-clock',
            title: '等待分配',
            desc: '您的订单已提交，正在为您分配最佳商家',
            color: '#ff9500'
        },
        'assigned': {
            icon: 'fas fa-store',
            title: '商家已接单',
            desc: '商家已接受您的订单',
            color: '#007aff'
        },
        'confirmed': {
            icon: 'fas fa-check-circle',
            title: '订单已确认',
            desc: '商家已确认订单，正在安排制作',
            color: '#32d74b'
        },
        'preparing': {
            icon: 'fas fa-utensils',
            title: '厨房制作中',
            desc: '厨房正在用心制作您的美食',
            color: '#007aff'
        },
        'ready': {
            icon: 'fas fa-bell',
            title: '制作完成',
            desc: '您的订单已制作完成，请尽快取餐',
            color: '#34c759'
        },
        'picked_up': {
            icon: 'fas fa-motorcycle',
            title: '配送中',
            desc: '配送员正在为您送餐',
            color: '#ff9500'
        },
        'delivered': {
            icon: 'fas fa-check-circle',
            title: '已送达',
            desc: '订单已送达，请确认收货',
            color: '#34c759'
        },
        'completed': {
            icon: 'fas fa-star',
            title: '已完成',
            desc: '订单已完成，感谢您的惠顾',
            color: '#34c759'
        },
        'cancelled': {
            icon: 'fas fa-times-circle',
            title: '已取消',
            desc: '订单已取消',
            color: '#ff3b30'
        },
        'refunded': {
            icon: 'fas fa-undo',
            title: '已退款',
            desc: '订单已退款',
            color: '#ff9500'
        },
        'delayed': {
            icon: 'fas fa-exclamation-triangle',
            title: '制作延迟',
            desc: '制作时间略有延迟，我们正在加急处理',
            color: '#ff9500'
        }
    }
};

// 工具函数
const miniprogramUtils = {
    // 格式化价格
    formatPrice: (price) => {
        return typeof price === 'number' ? price.toFixed(2) : '0.00';
    },
    
    // 计算辣度显示
    getSpicyDisplay: (level) => {
        const spicyIcons = ['不辣', '微辣', '中辣', '辣', '特辣'];
        return spicyIcons[level] || '未知';
    },
    
    // 生成订单ID
    generateOrderId: () => {
        return 'ORD' + Date.now();
    },
    
    // 计算购物车总数
    getCartTotal: (cart) => {
        return cart.reduce((total, item) => total + (item.quantity || 0), 0);
    },
    
    // 计算购物车金额
    getCartAmount: (cart) => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { miniprogramData, pageConfig, miniprogramUtils };
} else if (typeof window !== 'undefined') {
    window.miniprogramData = miniprogramData;
    window.pageConfig = pageConfig;
    window.miniprogramUtils = miniprogramUtils;
}