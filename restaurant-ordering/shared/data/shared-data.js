// Shared data structures and configurations for restaurant ordering system

window.sharedData = {
    // Order statuses with translations
    orderStatuses: {
        pending: { 
            text: '待接单', 
            color: 'orange',
            bgColor: '#fef3c7',
            textColor: '#d97706',
            icon: 'fas fa-clock'
        },
        confirmed: { 
            text: '已接单', 
            color: 'blue',
            bgColor: '#dbeafe',
            textColor: '#2563eb',
            icon: 'fas fa-check'
        },
        preparing: { 
            text: '准备中', 
            color: 'blue',
            bgColor: '#dbeafe',
            textColor: '#2563eb',
            icon: 'fas fa-utensils'
        },
        delivering: { 
            text: '配送中', 
            color: 'green',
            bgColor: '#d1fae5',
            textColor: '#059669',
            icon: 'fas fa-truck'
        },
        completed: { 
            text: '已完成', 
            color: 'gray',
            bgColor: '#f3f4f6',
            textColor: '#6b7280',
            icon: 'fas fa-check-circle'
        },
        cancelled: { 
            text: '已取消', 
            color: 'red',
            bgColor: '#fee2e2',
            textColor: '#dc2626',
            icon: 'fas fa-times-circle'
        }
    },

    // Payment methods
    paymentMethods: {
        alipay: { name: '支付宝', icon: 'fab fa-alipay', color: '#1677ff' },
        wechat: { name: '微信支付', icon: 'fab fa-weixin', color: '#07c160' },
        cash: { name: '现金支付', icon: 'fas fa-money-bill-wave', color: '#10b981' },
        card: { name: '银行卡', icon: 'fas fa-credit-card', color: '#6366f1' }
    },

    // Dish categories shared between customer and merchant
    dishCategories: [
        { id: 1, name: '今日推荐', icon: 'fas fa-fire', color: 'orange' },
        { id: 2, name: '招牌川菜', icon: 'fas fa-pepper-hot', color: 'red' },
        { id: 3, name: '清爽素食', icon: 'fas fa-leaf', color: 'green' },
        { id: 4, name: '饮品甜点', icon: 'fas fa-cocktail', color: 'blue' },
        { id: 5, name: '汤品粥类', icon: 'fas fa-bowl-food', color: 'yellow' },
        { id: 6, name: '特色小菜', icon: 'fas fa-seedling', color: 'purple' }
    ],

    // Spicy levels
    spicyLevels: [
        { level: 0, name: '不辣', icon: '', color: 'text-gray-400' },
        { level: 1, name: '微辣', icon: '🌶️', color: 'text-orange-400' },
        { level: 2, name: '中辣', icon: '🌶️🌶️', color: 'text-red-400' },
        { level: 3, name: '重辣', icon: '🌶️🌶️🌶️', color: 'text-red-600' }
    ],

    // Business hours template
    businessHours: [
        { day: 'monday', name: '周一', isOpen: true, openTime: '09:00', closeTime: '22:00' },
        { day: 'tuesday', name: '周二', isOpen: true, openTime: '09:00', closeTime: '22:00' },
        { day: 'wednesday', name: '周三', isOpen: true, openTime: '09:00', closeTime: '22:00' },
        { day: 'thursday', name: '周四', isOpen: true, openTime: '09:00', closeTime: '22:00' },
        { day: 'friday', name: '周五', isOpen: true, openTime: '09:00', closeTime: '22:00' },
        { day: 'saturday', name: '周六', isOpen: true, openTime: '09:00', closeTime: '23:00' },
        { day: 'sunday', name: '周日', isOpen: true, openTime: '10:00', closeTime: '22:00' }
    ],

    // Restaurant settings template
    restaurantSettings: {
        name: '美味餐厅',
        description: '正宗川菜 · 新鲜食材 · 快速配送',
        phone: '010-12345678',
        address: '北京市朝阳区美食街123号',
        deliveryFee: 5.00,
        minOrder: 20.00,
        deliveryRadius: 5, // km
        avgDeliveryTime: 30, // minutes
        rating: 4.8,
        license: 'JY12345678901234567890'
    },

    // Initialize restaurant settings with business hours
    initRestaurantSettings() {
        return {
            ...this.restaurantSettings,
            businessHours: [...this.businessHours]
        };
    },

    // Notification types
    notificationTypes: {
        newOrder: { 
            title: '新订单', 
            icon: 'fas fa-shopping-cart', 
            color: 'orange',
            sound: true 
        },
        orderCancelled: { 
            title: '订单取消', 
            icon: 'fas fa-times-circle', 
            color: 'red',
            sound: true 
        },
        lowStock: { 
            title: '库存不足', 
            icon: 'fas fa-exclamation-triangle', 
            color: 'yellow',
            sound: false 
        },
        systemUpdate: { 
            title: '系统通知', 
            icon: 'fas fa-info-circle', 
            color: 'blue',
            sound: false 
        }
    },

    // Analytics time ranges
    analyticsRanges: [
        { key: '1d', name: '今天', days: 1 },
        { key: '7d', name: '最近7天', days: 7 },
        { key: '30d', name: '最近30天', days: 30 },
        { key: '90d', name: '最近3个月', days: 90 },
        { key: '365d', name: '最近1年', days: 365 }
    ],

    // Default settings
    defaults: {
        currency: '¥',
        timezone: 'Asia/Shanghai',
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        language: 'zh-CN'
    },

    // API endpoints (for future backend integration)
    apiEndpoints: {
        orders: '/api/orders',
        dishes: '/api/dishes',
        categories: '/api/categories',
        analytics: '/api/analytics',
        settings: '/api/settings',
        notifications: '/api/notifications'
    },

    // Validation rules
    validation: {
        phone: /^1[3-9]\d{9}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        price: /^\d+(\.\d{1,2})?$/,
        dishName: /^[\u4e00-\u9fa5a-zA-Z0-9\s]{2,30}$/,
        address: /^[\u4e00-\u9fa5a-zA-Z0-9\s,，.-]{5,100}$/
    },

    // Common utility functions
    utils: {
        formatPrice(price) {
            return `${sharedData.defaults.currency}${price.toFixed(2)}`;
        },

        formatDateTime(date) {
            return new Date(date).toLocaleString(sharedData.defaults.language);
        },

        formatDate(date) {
            return new Date(date).toLocaleDateString(sharedData.defaults.language);
        },

        formatTime(date) {
            return new Date(date).toLocaleTimeString(sharedData.defaults.language, {
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        generateOrderId() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hour = String(now.getHours()).padStart(2, '0');
            const minute = String(now.getMinutes()).padStart(2, '0');
            const second = String(now.getSeconds()).padStart(2, '0');
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            
            return `${year}${month}${day}${hour}${minute}${second}${random}`;
        },

        calculateDeliveryTime(baseMinutes = 30, orderComplexity = 1) {
            const deliveryTime = baseMinutes * orderComplexity;
            const now = new Date();
            now.setMinutes(now.getMinutes() + deliveryTime);
            return now;
        },

        getOrderPriority(orderTime, totalAmount) {
            const now = new Date();
            const orderDate = new Date(orderTime);
            const minutesPassed = (now - orderDate) / (1000 * 60);
            
            if (minutesPassed > 15) return 'high';
            if (totalAmount > 100) return 'medium';
            return 'normal';
        },

        getStatusColor(status) {
            return sharedData.orderStatuses[status]?.color || 'gray';
        },

        getStatusText(status) {
            return sharedData.orderStatuses[status]?.text || '未知状态';
        },

        validatePhone(phone) {
            return sharedData.validation.phone.test(phone);
        },

        validateEmail(email) {
            return sharedData.validation.email.test(email);
        },

        validatePrice(price) {
            return sharedData.validation.price.test(price.toString());
        }
    },

    // Mock data generators
    generators: {
        generateMockOrder() {
            const statuses = Object.keys(sharedData.orderStatuses);
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            return {
                id: sharedData.utils.generateOrderId(),
                status: randomStatus,
                statusText: sharedData.utils.getStatusText(randomStatus),
                orderTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
                customerName: '客户' + Math.floor(Math.random() * 1000),
                customerPhone: '138****' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
                items: [],
                total: Math.floor(Math.random() * 100) + 20,
                deliveryFee: 5,
                paymentMethod: 'alipay'
            };
        },

        generateMockDish() {
            const categories = sharedData.dishCategories;
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            
            return {
                id: Date.now() + Math.random(),
                name: '菜品' + Math.floor(Math.random() * 1000),
                description: '美味的菜品描述',
                price: Math.floor(Math.random() * 50) + 10,
                category: randomCategory.id,
                categoryName: randomCategory.name,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
                available: Math.random() > 0.1,
                spicy: Math.floor(Math.random() * 4),
                tags: ['招牌', '新品', '热销'].slice(0, Math.floor(Math.random() * 3) + 1)
            };
        }
    },

    // Event types for cross-component communication
    eventTypes: {
        ORDER_CREATED: 'order:created',
        ORDER_UPDATED: 'order:updated',
        ORDER_DELETED: 'order:deleted',
        DISH_CREATED: 'dish:created',
        DISH_UPDATED: 'dish:updated',
        DISH_DELETED: 'dish:deleted',
        NOTIFICATION_RECEIVED: 'notification:received',
        SETTINGS_UPDATED: 'settings:updated'
    }
};