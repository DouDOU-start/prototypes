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
                id: 'soup',
                name: '汤品类',
                icon: '🍲',
                sort: 2,
                status: 'active'
            },
            {
                id: 'staple',
                name: '主食类',
                icon: '🍚',
                sort: 3,
                status: 'active'
            },
            {
                id: 'vegetable',
                name: '素食类',
                icon: '🥬',
                sort: 4,
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
            }
        ]
    },

    // 商家信息
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