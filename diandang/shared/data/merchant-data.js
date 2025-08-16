// 点当平台 - 商家端统一数据模型
const merchantData = {
    // 订单数据
    orders: [
        {
            id: 'ORD001',
            customer: '张先生',
            phone: '138****8888',
            items: [
                { name: '宫保鸡丁', price: 32.0, quantity: 1, note: '微辣' },
                { name: '麻婆豆腐', price: 26.0, quantity: 1, note: '不要花椒' },
                { name: '白米饭', price: 5.0, quantity: 2, note: '' }
            ],
            amount: 68.0,
            status: 'pending',
            time: '14:25',
            orderTime: '2024-01-15 14:25:30',
            table: 'A03',
            waitTime: '5分钟',
            paymentMethod: '微信支付',
            remark: '加急处理，客人赶时间'
        },
        {
            id: 'ORD002', 
            customer: '李女士',
            phone: '139****6666',
            items: [
                { name: '回锅肉', price: 38.0, quantity: 1, note: '少放辣椒' },
                { name: '酸辣土豆丝', price: 18.0, quantity: 1, note: '' },
                { name: '银耳莲子汤', price: 12.0, quantity: 1, note: '温热' }
            ],
            amount: 68.0,
            status: 'preparing',
            time: '14:18',
            orderTime: '2024-01-15 14:18:15',
            table: 'B06',
            waitTime: '12分钟',
            paymentMethod: '支付宝',
            remark: ''
        },
        {
            id: 'ORD003',
            customer: '王先生',
            phone: '137****9999',
            items: [
                { name: '鱼香肉丝', price: 28.0, quantity: 1, note: '' },
                { name: '蛋花汤', price: 15.0, quantity: 1, note: '多放香菜' },
                { name: '白米饭', price: 5.0, quantity: 2, note: '' }
            ],
            amount: 53.0,
            status: 'ready',
            time: '14:10',
            orderTime: '2024-01-15 14:10:45',
            table: 'C02',
            waitTime: '18分钟',
            paymentMethod: '现金',
            remark: ''
        },
        {
            id: 'ORD004',
            customer: '赵女士',
            phone: '136****5555',
            items: [
                { name: '水煮鱼', price: 68.0, quantity: 1, note: '中辣' },
                { name: '时蔬小炒', price: 22.0, quantity: 1, note: '清淡' },
                { name: '紫菜蛋花汤', price: 16.0, quantity: 1, note: '' }
            ],
            amount: 106.0,
            status: 'completed',
            time: '13:55',
            orderTime: '2024-01-15 13:55:20',
            table: 'A01',
            waitTime: '25分钟',
            paymentMethod: '微信支付',
            remark: '已送达'
        },
        {
            id: 'ORD005',
            customer: '陈先生',
            phone: '135****7777',
            items: [
                { name: '口水鸡', price: 35.0, quantity: 1, note: '多放花生' },
                { name: '酸菜鱼', price: 58.0, quantity: 1, note: '不要太酸' }
            ],
            amount: 93.0,
            status: 'cancelled',
            time: '13:40',
            orderTime: '2024-01-15 13:40:10',
            table: 'B12',
            waitTime: '0分钟',
            paymentMethod: '微信支付',
            remark: '客人临时取消'
        }
    ],

    // 热销商品
    popularItems: [
        { 
            id: 1,
            name: '宫保鸡丁', 
            price: 32.0, 
            sales: 156, 
            rating: 4.8,
            category: 'signature',
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=300&fit=crop',
            description: '传统宫保鸡丁，选用优质鸡胸肉，配以花生米'
        },
        { 
            id: 2,
            name: '麻婆豆腐', 
            price: 26.0, 
            sales: 134, 
            rating: 4.7,
            category: 'signature',
            image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300&h=300&fit=crop',
            description: '正宗川味麻婆豆腐，嫩滑豆腐配麻辣汤汁'
        },
        { 
            id: 3,
            name: '回锅肉', 
            price: 38.0, 
            sales: 127, 
            rating: 4.6,
            category: 'signature',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop',
            description: '家常回锅肉，五花肉片配青椒豆瓣酱'
        },
        { 
            id: 4,
            name: '水煮鱼', 
            price: 68.0, 
            sales: 89, 
            rating: 4.9,
            category: 'signature',
            image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=300&fit=crop',
            description: '麻辣水煮鱼，鲜嫩鱼肉配香辣汤底'
        },
        { 
            id: 5,
            name: '酸菜鱼', 
            price: 58.0, 
            sales: 76, 
            rating: 4.5,
            category: 'signature',
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=300&fit=crop',
            description: '酸辣开胃酸菜鱼，草鱼配酸菜'
        }
    ],

    // 库存数据
    inventory: [
        { 
            id: 'item_001',
            name: '新鲜鸡胸肉', 
            category: '肉类',
            currentStock: 15, 
            minStock: 10, 
            unit: '斤',
            supplier: '蜀香源食材',
            lastUpdated: '2024-01-15 09:30',
            price: 18.5,
            status: 'normal'
        },
        { 
            id: 'item_002',
            name: '优质豆腐', 
            category: '豆制品',
            currentStock: 8, 
            minStock: 12, 
            unit: '块',
            supplier: '川味豆制品厂',
            lastUpdated: '2024-01-15 08:45',
            price: 3.2,
            status: 'low'
        },
        { 
            id: 'item_003',
            name: '新鲜青椒', 
            category: '蔬菜',
            currentStock: 25, 
            minStock: 20, 
            unit: '斤',
            supplier: '绿源蔬菜基地',
            lastUpdated: '2024-01-15 07:20',
            price: 4.5,
            status: 'normal'
        },
        { 
            id: 'item_004',
            name: '草鱼', 
            category: '水产',
            currentStock: 5, 
            minStock: 8, 
            unit: '条',
            supplier: '鲜活水产市场',
            lastUpdated: '2024-01-15 06:00',
            price: 35.0,
            status: 'low'
        },
        { 
            id: 'item_005',
            name: '郫县豆瓣酱', 
            category: '调料',
            currentStock: 50, 
            minStock: 30, 
            unit: '袋',
            supplier: '川香调料批发',
            lastUpdated: '2024-01-14 16:30',
            price: 8.8,
            status: 'sufficient'
        }
    ],

    // 供应商数据
    suppliers: [
        {
            id: 'supplier_001',
            name: '蜀香源食材',
            contact: '李经理',
            phone: '028-6688-9999',
            address: '成都市双流区食材批发市场A区28号',
            rating: 4.8,
            cooperationYears: 3,
            categories: ['肉类', '调料'],
            deliveryDays: ['周一', '周三', '周五'],
            minOrderAmount: 500
        },
        {
            id: 'supplier_002',
            name: '川味豆制品厂',
            contact: '王师傅',
            phone: '028-7799-5566',
            address: '成都市温江区豆制品工业园',
            rating: 4.6,
            cooperationYears: 2,
            categories: ['豆制品'],
            deliveryDays: ['周二', '周四', '周六'],
            minOrderAmount: 200
        },
        {
            id: 'supplier_003',
            name: '绿源蔬菜基地',
            contact: '张农户',
            phone: '028-5544-3322',
            address: '成都市郫都区绿色蔬菜基地',
            rating: 4.5,
            cooperationYears: 1,
            categories: ['蔬菜'],
            deliveryDays: ['每日配送'],
            minOrderAmount: 300
        },
        {
            id: 'supplier_004',
            name: '鲜活水产市场',
            contact: '陈老板',
            phone: '028-8877-6655',
            address: '成都市青白江区水产批发市场',
            rating: 4.7,
            cooperationYears: 4,
            categories: ['水产'],
            deliveryDays: ['周一', '周四'],
            minOrderAmount: 800
        },
        {
            id: 'supplier_005',
            name: '川香调料批发',
            contact: '刘总',
            phone: '028-9966-4433',
            address: '成都市金牛区调料批发中心',
            rating: 4.9,
            cooperationYears: 5,
            categories: ['调料', '干货'],
            deliveryDays: ['周三', '周六'],
            minOrderAmount: 600
        }
    ],

    // 客户数据
    customers: [
        {
            id: 'cust_001',
            name: '张先生',
            phone: '138****8888',
            level: 'VIP',
            totalOrders: 45,
            totalSpent: 2890.0,
            lastVisit: '2024-01-15',
            favoriteItems: ['宫保鸡丁', '麻婆豆腐'],
            notes: '常客，偏爱微辣口味'
        },
        {
            id: 'cust_002',
            name: '李女士',
            phone: '139****6666',
            level: '金卡',
            totalOrders: 32,
            totalSpent: 1950.0,
            lastVisit: '2024-01-15',
            favoriteItems: ['回锅肉', '酸辣土豆丝'],
            notes: '不喜欢太辣，经常要求少放辣椒'
        },
        {
            id: 'cust_003',
            name: '王先生',
            phone: '137****9999',
            level: '普通',
            totalOrders: 18,
            totalSpent: 980.0,
            lastVisit: '2024-01-15',
            favoriteItems: ['鱼香肉丝', '蛋花汤'],
            notes: '口味清淡，经常点汤类'
        },
        {
            id: 'cust_004',
            name: '赵女士',
            phone: '136****5555',
            level: 'VIP',
            totalOrders: 67,
            totalSpent: 4320.0,
            lastVisit: '2024-01-15',
            favoriteItems: ['水煮鱼', '时蔬小炒'],
            notes: '高消费客户，喜欢尝试新菜品'
        },
        {
            id: 'cust_005',
            name: '陈先生',
            phone: '135****7777',
            level: '银卡',
            totalOrders: 28,
            totalSpent: 1680.0,
            lastVisit: '2024-01-14',
            favoriteItems: ['口水鸡', '酸菜鱼'],
            notes: '偶尔取消订单，需要提前确认'
        }
    ],

    // 营业数据统计
    analytics: {
        today: {
            date: '2024-01-15',
            revenue: 3280.0,
            orders: 45,
            avgOrderValue: 72.89,
            peakHours: ['12:00-13:00', '18:00-19:00'],
            popularPayment: '微信支付'
        },
        weekly: {
            totalRevenue: 22960.0,
            totalOrders: 315,
            avgDailyOrders: 45,
            bestDay: '周六',
            improvement: '+12.5%'
        },
        monthly: {
            totalRevenue: 89760.0,
            totalOrders: 1256,
            newCustomers: 67,
            customerRetention: '78%',
            profitMargin: '35.2%'
        }
    },

    // 菜单管理数据
    menu: {
        categories: [
            {
                id: 'signature',
                name: '招牌川菜',
                icon: '🌶️',
                sort: 1,
                status: 'active'
            },
            {
                id: 'cold',
                name: '凉菜系列',
                icon: '🥗',
                sort: 2,
                status: 'active'
            },
            {
                id: 'soup',
                name: '汤品类',
                icon: '🍲',
                sort: 3,
                status: 'active'
            },
            {
                id: 'staple',
                name: '主食类',
                icon: '🍚',
                sort: 4,
                status: 'active'
            },
            {
                id: 'vegetable',
                name: '素食类',
                icon: '🥬',
                sort: 5,
                status: 'active'
            },
            {
                id: 'drink',
                name: '饮品类',
                icon: '🥤',
                sort: 6,
                status: 'active'
            }
        ],
        items: [
            {
                id: 'menu_001',
                name: '宫保鸡丁',
                categoryId: 'signature',
                price: 32.0,
                originalPrice: 36.0,
                description: '传统宫保鸡丁，选用优质鸡胸肉，配以花生米，口感鲜嫩爽口',
                image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop',
                status: 'available',
                spicyLevel: 2,
                preparationTime: 15,
                tags: ['招牌', '微辣', '下饭'],
                nutrition: {
                    calories: 285,
                    protein: 28,
                    carbs: 12,
                    fat: 15
                },
                allergens: ['花生', '大豆'],
                dailyLimit: 50,
                soldToday: 28
            },
            {
                id: 'menu_002',
                name: '麻婆豆腐',
                categoryId: 'signature',
                price: 26.0,
                originalPrice: 28.0,
                description: '正宗川味麻婆豆腐，嫩滑豆腐配麻辣汤汁，开胃下饭',
                image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=400&fit=crop',
                status: 'available',
                spicyLevel: 3,
                preparationTime: 12,
                tags: ['经典', '麻辣', '素食'],
                nutrition: {
                    calories: 195,
                    protein: 15,
                    carbs: 8,
                    fat: 12
                },
                allergens: ['大豆'],
                dailyLimit: 40,
                soldToday: 22
            },
            {
                id: 'menu_003',
                name: '口水鸡',
                categoryId: 'cold',
                price: 35.0,
                originalPrice: 38.0,
                description: '四川经典凉菜，鸡肉嫩滑，麻辣鲜香',
                image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=400&fit=crop',
                status: 'available',
                spicyLevel: 2,
                preparationTime: 20,
                tags: ['凉菜', '麻辣', '开胃'],
                nutrition: {
                    calories: 220,
                    protein: 32,
                    carbs: 5,
                    fat: 9
                },
                allergens: ['芝麻'],
                dailyLimit: 30,
                soldToday: 18
            },
            {
                id: 'menu_004',
                name: '蛋花汤',
                categoryId: 'soup',
                price: 15.0,
                originalPrice: 18.0,
                description: '清淡营养的蛋花汤，汤汁清澈，蛋花朵朵',
                image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop',
                status: 'available',
                spicyLevel: 0,
                preparationTime: 8,
                tags: ['清淡', '营养', '暖胃'],
                nutrition: {
                    calories: 95,
                    protein: 8,
                    carbs: 3,
                    fat: 6
                },
                allergens: ['鸡蛋'],
                dailyLimit: 50,
                soldToday: 31
            },
            {
                id: 'menu_005',
                name: '白米饭',
                categoryId: 'staple',
                price: 5.0,
                originalPrice: 6.0,
                description: '优质东北大米，粒粒饱满，香甜可口',
                image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
                status: 'available',
                spicyLevel: 0,
                preparationTime: 5,
                tags: ['主食', '经典'],
                nutrition: {
                    calories: 130,
                    protein: 3,
                    carbs: 28,
                    fat: 0
                },
                allergens: [],
                dailyLimit: 100,
                soldToday: 68
            },
            {
                id: 'menu_006',
                name: '酸辣土豆丝',
                categoryId: 'vegetable',
                price: 18.0,
                originalPrice: 20.0,
                description: '爽脆酸辣的土豆丝，开胃解腻',
                image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=400&h=400&fit=crop',
                status: 'available',
                spicyLevel: 1,
                preparationTime: 10,
                tags: ['素食', '酸辣', '爽脆'],
                nutrition: {
                    calories: 125,
                    protein: 2,
                    carbs: 25,
                    fat: 3
                },
                allergens: [],
                dailyLimit: 35,
                soldToday: 24
            },
            {
                id: 'menu_007',
                name: '柠檬蜂蜜茶',
                categoryId: 'drink',
                price: 22.0,
                originalPrice: 25.0,
                description: '新鲜柠檬配天然蜂蜜，酸甜解腻',
                image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=400&fit=crop',
                status: 'available',
                spicyLevel: 0,
                preparationTime: 5,
                tags: ['饮品', '清爽', '解腻'],
                nutrition: {
                    calories: 85,
                    protein: 0,
                    carbs: 22,
                    fat: 0
                },
                allergens: [],
                dailyLimit: 25,
                soldToday: 12
            },
            {
                id: 'menu_008',
                name: '回锅肉',
                categoryId: 'signature',
                price: 38.0,
                originalPrice: 42.0,
                description: '经典川菜回锅肉，肥瘦相间，香辣下饭',
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
                status: 'available',
                spicyLevel: 2,
                preparationTime: 18,
                tags: ['招牌', '香辣', '经典'],
                nutrition: {
                    calories: 385,
                    protein: 25,
                    carbs: 8,
                    fat: 28
                },
                allergens: [],
                dailyLimit: 25,
                soldToday: 16
            }
        ]
    },

    // 商家信息
    // 热门菜品数据
    popularItems: [
        { name: '宫保鸡丁', sales: 156, price: 32.0, category: '招牌川菜', rating: 4.8, profit: 18.0 },
        { name: '麻婆豆腐', sales: 134, price: 26.0, category: '招牌川菜', rating: 4.7, profit: 15.0 },
        { name: '回锅肉', sales: 128, price: 38.0, category: '招牌川菜', rating: 4.9, profit: 22.0 },
        { name: '水煮鱼', sales: 95, price: 68.0, category: '招牌川菜', rating: 4.8, profit: 35.0 },
        { name: '鱼香肉丝', sales: 87, price: 28.0, category: '招牌川菜', rating: 4.6, profit: 16.0 },
        { name: '糖醋排骨', sales: 76, price: 42.0, category: '经典家常', rating: 4.7, profit: 24.0 },
        { name: '口水鸡', sales: 65, price: 35.0, category: '凉菜系列', rating: 4.5, profit: 20.0 },
        { name: '酸辣土豆丝', sales: 58, price: 18.0, category: '素菜小炒', rating: 4.4, profit: 12.0 }
    ],
    
    // 系统通知数据
    notifications: [
        {
            title: '库存预警',
            message: '土豆、豆腐、草鱼库存不足，请及时补充',
            time: '10分钟前',
            icon: 'fas fa-exclamation-triangle',
            type: 'warning',
            unread: true
        },
        {
            title: '新订单提醒',
            message: '收到来自C05桌的新订单，金额¥62.0',
            time: '2分钟前',
            icon: 'fas fa-shopping-cart',
            type: 'info',
            unread: true
        },
        {
            title: 'VIP客户光临',
            message: '赵女士（VIP会员）刚刚到店，请优先安排',
            time: '15分钟前',
            icon: 'fas fa-crown',
            type: 'info',
            unread: true
        },
        {
            title: '营业数据',
            message: '今日营业额已达¥2485.0，比昨日同期增长12%',
            time: '30分钟前',
            icon: 'fas fa-chart-line',
            type: 'success',
            unread: false
        },
        {
            title: '系统更新',
            message: '收银系统已更新至V2.1.3版本，新增优惠券功能',
            time: '2小时前',
            icon: 'fas fa-sync-alt',
            type: 'success',
            unread: false
        }
    ],

    merchantInfo: {
        id: 'merchant_001',
        name: '仓和川菜馆',
        owner: '张经理',
        phone: '028-8888-6666',
        address: '成都市锦江区春熙路123号',
        businessHours: {
            open: '10:00',
            close: '22:00'
        },
        status: 'online',
        rating: 4.7,
        monthlyOrders: 1256,
        joinDate: '2023-03-15'
    }
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = merchantData;
} else if (typeof window !== 'undefined') {
    window.merchantData = merchantData;
}