// 全局变量
let currentPage = 'dashboard';
let pageHistory = [];
let businessStatus = 'online';
let notificationCount = 0;
let currentMerchantId = 'merchant_001'; // 当前商家ID
let platformOrderPolling = null;

// 页面列表
const pagesToLoad = [
    'dashboard',
    'orders', 
    'menu-management',
    'inventory',
    'customers',
    'analytics',
    'settings'
];

// 使用 shared 数据
const mockData = (typeof merchantData !== 'undefined' ? merchantData : null) || {
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
                { name: '干煸四季豆', price: 25.0, quantity: 1, note: '' },
                { name: '小米粥', price: 8.0, quantity: 2, note: '温热' }
            ],
            amount: 76.0,
            status: 'preparing',
            time: '14:30',
            orderTime: '2024-01-15 14:30:10',
            table: 'B08',
            waitTime: '3分钟',
            paymentMethod: '微信支付',
            remark: '会员客户'
        },
        {
            id: 'ORD006',
            customer: '刘小姐',
            phone: '134****3333',
            items: [
                { name: '糖醋排骨', price: 42.0, quantity: 1, note: '' },
                { name: '蒜蓉娃娃菜', price: 20.0, quantity: 1, note: '蒜蓉多一点' }
            ],
            amount: 62.0,
            status: 'pending',
            time: '14:33',
            orderTime: '2024-01-15 14:33:25',
            table: 'C05',
            waitTime: '刚下单',
            paymentMethod: '支付宝',
            remark: ''
        }
    ],
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
    menuCategories: [
        {
            id: 'signature',
            name: '招牌川菜',
            items: [
                { id: 1, name: '宫保鸡丁', price: 32.0, cost: 14.0, description: '传统宫保鸡丁，鲜嫩爽口', image: '', status: 'available', stock: 50 },
                { id: 2, name: '麻婆豆腐', price: 26.0, cost: 11.0, description: '正宗川味麻婆豆腐', image: '', status: 'available', stock: 30 },
                { id: 3, name: '回锅肉', price: 38.0, cost: 16.0, description: '家常回锅肉，肥而不腻', image: '', status: 'available', stock: 25 },
                { id: 4, name: '水煮鱼', price: 68.0, cost: 33.0, description: '麻辣鲜香水煮鱼', image: '', status: 'available', stock: 15 },
                { id: 5, name: '鱼香肉丝', price: 28.0, cost: 12.0, description: '经典鱼香肉丝', image: '', status: 'available', stock: 40 }
            ]
        },
        {
            id: 'homestyle',
            name: '经典家常',
            items: [
                { id: 6, name: '糖醋排骨', price: 42.0, cost: 18.0, description: '酸甜可口糖醋排骨', image: '', status: 'available', stock: 20 },
                { id: 7, name: '红烧肉', price: 45.0, cost: 20.0, description: '肥瘦相间红烧肉', image: '', status: 'available', stock: 18 },
                { id: 8, name: '蒸蛋羹', price: 16.0, cost: 6.0, description: '嫩滑蒸蛋羹', image: '', status: 'available', stock: 35 }
            ]
        },
        {
            id: 'cold',
            name: '凉菜系列',
            items: [
                { id: 9, name: '口水鸡', price: 35.0, cost: 15.0, description: '麻辣口水鸡', image: '', status: 'available', stock: 22 },
                { id: 10, name: '凉拌黄瓜', price: 12.0, cost: 4.0, description: '爽脆凉拌黄瓜', image: '', status: 'available', stock: 50 },
                { id: 11, name: '夫妻肺片', price: 28.0, cost: 12.0, description: '经典夫妻肺片', image: '', status: 'low_stock', stock: 3 }
            ]
        },
        {
            id: 'vegetable',
            name: '素菜小炒',
            items: [
                { id: 12, name: '酸辣土豆丝', price: 18.0, cost: 6.0, description: '爽脆酸辣土豆丝', image: '', status: 'available', stock: 45 },
                { id: 13, name: '蒜蓉娃娃菜', price: 20.0, cost: 8.0, description: '清香蒜蓉娃娃菜', image: '', status: 'available', stock: 30 },
                { id: 14, name: '干煸四季豆', price: 25.0, cost: 10.0, description: '香辣干煸四季豆', image: '', status: 'out_of_stock', stock: 0 },
                { id: 15, name: '时蔬小炒', price: 22.0, cost: 8.0, description: '当季时蔬小炒', image: '', status: 'available', stock: 25 }
            ]
        },
        {
            id: 'soup',
            name: '汤品粥类',
            items: [
                { id: 16, name: '蛋花汤', price: 15.0, cost: 5.0, description: '清淡蛋花汤', image: '', status: 'available', stock: 60 },
                { id: 17, name: '紫菜蛋花汤', price: 16.0, cost: 6.0, description: '营养紫菜蛋花汤', image: '', status: 'available', stock: 55 },
                { id: 18, name: '银耳莲子汤', price: 12.0, cost: 4.0, description: '润燥银耳莲子汤', image: '', status: 'available', stock: 40 },
                { id: 19, name: '小米粥', price: 8.0, cost: 2.0, description: '养胃小米粥', image: '', status: 'available', stock: 80 },
                { id: 20, name: '白米饭', price: 5.0, cost: 1.0, description: '优质东北大米', image: '', status: 'available', stock: 100 }
            ]
        }
    ],
    customers: [
        { 
            id: 1, 
            name: '张先生', 
            phone: '138****8888', 
            visits: 23, 
            totalSpent: 1580.5, 
            avgSpent: 68.7,
            level: 'VIP', 
            lastVisit: '2024-01-15', 
            preference: '川菜',
            notes: 'VIP客户，喜欢微辣口味'
        },
        { 
            id: 2, 
            name: '李女士', 
            phone: '139****6666', 
            visits: 18, 
            totalSpent: 980.0, 
            avgSpent: 54.4,
            level: '会员', 
            lastVisit: '2024-01-15', 
            preference: '清淡',
            notes: '偏爱清淡口味，对辣椒过敏'
        },
        { 
            id: 3, 
            name: '王先生', 
            phone: '137****9999', 
            visits: 12, 
            totalSpent: 650.0, 
            avgSpent: 54.2,
            level: '会员', 
            lastVisit: '2024-01-15', 
            preference: '家常菜',
            notes: ''
        },
        { 
            id: 4, 
            name: '赵女士', 
            phone: '136****5555', 
            visits: 35, 
            totalSpent: 2280.0, 
            avgSpent: 65.1,
            level: 'VIP', 
            lastVisit: '2024-01-14', 
            preference: '川菜',
            notes: '老客户，经常带朋友聚餐'
        },
        { 
            id: 5, 
            name: '陈先生', 
            phone: '135****7777', 
            visits: 8, 
            totalSpent: 420.0, 
            avgSpent: 52.5,
            level: '普通', 
            lastVisit: '2024-01-13', 
            preference: '凉菜',
            notes: ''
        },
        { 
            id: 6, 
            name: '刘小姐', 
            phone: '134****3333', 
            visits: 15, 
            totalSpent: 780.0, 
            avgSpent: 52.0,
            level: '会员', 
            lastVisit: '2024-01-15', 
            preference: '家常菜',
            notes: '喜欢清爽口味，不吃太油腻的菜'
        },
        { 
            id: 7, 
            name: '孙女士', 
            phone: '133****1111', 
            visits: 6, 
            totalSpent: 320.0, 
            avgSpent: 53.3,
            level: '普通', 
            lastVisit: '2024-01-12', 
            preference: '素食',
            notes: '素食主义者，只点素菜'
        }
    ],
    inventory: [
        { id: 1, name: '土豆', unit: '斤', stock: 8, minStock: 10, supplier: '新鲜蔬菜供应商', price: 3.5, status: 'low_stock' },
        { id: 2, name: '豆腐', unit: '块', stock: 15, minStock: 20, supplier: '老豆腐坊', price: 2.8, status: 'low_stock' },
        { id: 3, name: '鸡胸肉', unit: '斤', stock: 25, minStock: 15, supplier: '优质肉类供应商', price: 18.0, status: 'available' },
        { id: 4, name: '草鱼', unit: '条', stock: 5, minStock: 8, supplier: '鲜活水产', price: 35.0, status: 'low_stock' },
        { id: 5, name: '排骨', unit: '斤', stock: 12, minStock: 10, supplier: '优质肉类供应商', price: 28.0, status: 'available' },
        { id: 6, name: '大米', unit: '袋', stock: 8, minStock: 5, supplier: '东北粮油', price: 85.0, status: 'available' },
        { id: 7, name: '食用油', unit: '桶', stock: 3, minStock: 3, supplier: '金龙鱼供应商', price: 68.0, status: 'normal' }
    ],
    todayStats: {
        orders: 28,
        revenue: 2485.0,
        customers: 45,
        avgOrderValue: 88.75,
        peakHour: '12:00-13:00',
        topDish: '宫保鸡丁',
        tablesOccupied: 8,
        totalTables: 15,
        waitingQueue: 3,
        avgWaitTime: 15,
        completionRate: 95,
        customerSatisfaction: 4.7
    },
    weeklyStats: {
        totalRevenue: 16580.0,
        totalOrders: 186,
        avgDailyRevenue: 2368.57,
        avgDailyOrders: 26.57,
        bestDay: '周六',
        worstDay: '周二',
        growthRate: 8.5,
        repeatCustomerRate: 65
    },
    monthlyStats: {
        totalRevenue: 68420.0,
        totalOrders: 742,
        newCustomers: 89,
        returningCustomers: 156,
        avgMonthlyGrowth: 12.3,
        profitMargin: 35.8
    },
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
    recentActivity: [
        { time: '14:33', action: '新订单', detail: 'C05桌刘小姐下单，金额¥62.0' },
        { time: '14:30', action: '订单更新', detail: 'B08桌陈先生订单开始制作' },
        { time: '14:25', action: '库存预警', detail: '土豆库存不足10斤，请补充' },
        { time: '14:20', action: '客户到店', detail: '赵女士（VIP）到店用餐' },
        { time: '14:15', action: '订单完成', detail: 'A01桌赵女士订单制作完成' }
    ],
    tables: [
        { id: 'A01', capacity: 4, status: 'available', customer: null, orderTime: null, waitTime: 0 },
        { id: 'A02', capacity: 4, status: 'available', customer: null, orderTime: null, waitTime: 0 },
        { id: 'A03', capacity: 4, status: 'occupied', customer: '张先生', orderTime: '14:25', waitTime: 8, orderId: 'ORD001' },
        { id: 'A04', capacity: 6, status: 'available', customer: null, orderTime: null, waitTime: 0 },
        { id: 'A05', capacity: 2, status: 'occupied', customer: '孙女士', orderTime: '14:20', waitTime: 13, orderId: 'ORD007' },
        { id: 'B01', capacity: 4, status: 'reserved', customer: '预订-周先生', orderTime: '15:00', waitTime: 0 },
        { id: 'B02', capacity: 4, status: 'available', customer: null, orderTime: null, waitTime: 0 },
        { id: 'B03', capacity: 4, status: 'cleaning', customer: null, orderTime: null, waitTime: 0 },
        { id: 'B04', capacity: 6, status: 'occupied', customer: '林先生', orderTime: '13:45', waitTime: 48, orderId: 'ORD008' },
        { id: 'B05', capacity: 4, status: 'available', customer: null, orderTime: null, waitTime: 0 },
        { id: 'B06', capacity: 4, status: 'occupied', customer: '李女士', orderTime: '14:18', waitTime: 15, orderId: 'ORD002' },
        { id: 'B07', capacity: 2, status: 'available', customer: null, orderTime: null, waitTime: 0 },
        { id: 'B08', capacity: 4, status: 'occupied', customer: '陈先生', orderTime: '14:30', waitTime: 3, orderId: 'ORD005' },
        { id: 'C01', capacity: 8, status: 'available', customer: null, orderTime: null, waitTime: 0 },
        { id: 'C02', capacity: 4, status: 'occupied', customer: '王先生', orderTime: '14:10', waitTime: 23, orderId: 'ORD003' },
        { id: 'C03', capacity: 4, status: 'available', customer: null, orderTime: null, waitTime: 0 },
        { id: 'C04', capacity: 6, status: 'reserved', customer: '预订-郑女士', orderTime: '15:30', waitTime: 0 },
        { id: 'C05', capacity: 4, status: 'occupied', customer: '刘小姐', orderTime: '14:33', waitTime: 0, orderId: 'ORD006' }
    ],
    staff: [
        { 
            id: 1, 
            name: '张经理', 
            role: '店长', 
            shift: 'all_day', 
            status: 'active',
            phone: '138****1234',
            joinDate: '2023-03-15',
            performance: 96,
            todayTasks: ['巡店检查', '处理客诉', '营收分析'],
            avatar: 'fas fa-user-tie'
        },
        { 
            id: 2, 
            name: '小李', 
            role: '服务员', 
            shift: 'morning', 
            status: 'active',
            phone: '139****5678',
            joinDate: '2023-08-20',
            performance: 88,
            todayTasks: ['A区域服务', '收银台值班'],
            avatar: 'fas fa-user'
        },
        { 
            id: 3, 
            name: '小王', 
            role: '服务员', 
            shift: 'afternoon', 
            status: 'active',
            phone: '137****9876',
            joinDate: '2023-09-10',
            performance: 92,
            todayTasks: ['B区域服务', '清洁维护'],
            avatar: 'fas fa-user'
        },
        { 
            id: 4, 
            name: '大厨老陈', 
            role: '主厨', 
            shift: 'all_day', 
            status: 'active',
            phone: '136****4321',
            joinDate: '2022-12-01',
            performance: 94,
            todayTasks: ['菜品质控', '厨房管理', '新品开发'],
            avatar: 'fas fa-utensils'
        },
        { 
            id: 5, 
            name: '小刘', 
            role: '后厨', 
            shift: 'morning', 
            status: 'active',
            phone: '135****8765',
            joinDate: '2023-10-05',
            performance: 85,
            todayTasks: ['食材准备', '协助主厨'],
            avatar: 'fas fa-user-chef'
        },
        { 
            id: 6, 
            name: '小赵', 
            role: '收银员', 
            shift: 'afternoon', 
            status: 'break',
            phone: '134****2468',
            joinDate: '2023-07-15',
            performance: 91,
            todayTasks: ['收银服务', '会员管理'],
            avatar: 'fas fa-cash-register'
        }
    ],
    suppliers: [
        {
            id: 1,
            name: '新鲜蔬菜供应商',
            contact: '王总',
            phone: '138****0001',
            address: '成都市双流区蔬菜批发市场',
            products: ['土豆', '黄瓜', '娃娃菜', '四季豆'],
            rating: 4.5,
            cooperation: '2年',
            lastDelivery: '2024-01-14',
            creditLevel: 'A',
            paymentTerms: '货到付款'
        },
        {
            id: 2,
            name: '优质肉类供应商',
            contact: '李经理',
            phone: '139****0002',
            address: '成都市新都区食品工业园',
            products: ['鸡胸肉', '排骨', '牛肉', '猪肉'],
            rating: 4.8,
            cooperation: '3年',
            lastDelivery: '2024-01-15',
            creditLevel: 'A+',
            paymentTerms: '月结30天'
        },
        {
            id: 3,
            name: '鲜活水产',
            contact: '张老板',
            phone: '137****0003',
            address: '成都市彭州市水产市场',
            products: ['草鱼', '鲤鱼', '虾类', '蟹类'],
            rating: 4.3,
            cooperation: '1年',
            lastDelivery: '2024-01-13',
            creditLevel: 'B+',
            paymentTerms: '现金交易'
        },
        {
            id: 4,
            name: '老豆腐坊',
            contact: '老陈',
            phone: '136****0004',
            address: '成都市武侯区传统豆制品工坊',
            products: ['豆腐', '豆皮', '豆干', '豆浆'],
            rating: 4.7,
            cooperation: '4年',
            lastDelivery: '2024-01-15',
            creditLevel: 'A',
            paymentTerms: '周结账'
        }
    ],
    reviews: [
        {
            id: 1,
            customerName: '张先生',
            rating: 5,
            content: '宫保鸡丁做得特别正宗，鸡肉嫩滑，花生脆香，辣度刚好。服务态度也很好，会再来的！',
            time: '2024-01-15 13:30',
            dishes: ['宫保鸡丁', '白米饭'],
            helpful: 12,
            images: 2
        },
        {
            id: 2,
            customerName: '李女士',
            rating: 4,
            content: '回锅肉味道不错，就是稍微有点咸。整体环境干净整洁，服务员很热情。',
            time: '2024-01-14 19:20',
            dishes: ['回锅肉', '酸辣土豆丝'],
            helpful: 8,
            images: 1
        },
        {
            id: 3,
            customerName: '王先生',
            rating: 5,
            content: '水煮鱼麻辣鲜香，鱼片嫩滑，汤底浓郁。配菜新鲜，分量足够。价格合理，性价比很高。',
            time: '2024-01-14 18:45',
            dishes: ['水煮鱼', '时蔬小炒'],
            helpful: 15,
            images: 3
        },
        {
            id: 4,
            customerName: '赵女士',
            rating: 4,
            content: '口水鸡很正宗，麻辣适中，配菜丰富。就是等餐时间稍长，希望能改进。',
            time: '2024-01-13 20:10',
            dishes: ['口水鸡', '凉拌黄瓜'],
            helpful: 6,
            images: 1
        },
        {
            id: 5,
            customerName: '陈先生',
            rating: 5,
            content: '糖醋排骨酸甜可口，小孩很喜欢。服务员小李态度特别好，推荐菜品很用心。',
            time: '2024-01-13 12:15',
            dishes: ['糖醋排骨', '蛋花汤'],
            helpful: 9,
            images: 2
        },
        {
            id: 4,
            customer: '本地人老王',
            rating: 4,
            comment: '家常菜做得很地道，麻婆豆腐麻辣适中，豆腐嫩滑。就是上菜速度可以再快一点。',
            date: '2024-01-13',
            dish: '麻婆豆腐',
            helpful: 6,
            images: 0
        },
        {
            id: 5,
            customer: '游客小陈',
            rating: 3,
            comment: '口水鸡味道一般，花生不够脆，调料偏淡。不过服务还可以，环境也算干净。',
            date: '2024-01-13',
            dish: '口水鸡',
            helpful: 4,
            images: 1
        }
    ],
    promotions: [
        {
            id: 1,
            name: '工作日午餐特惠',
            type: 'discount',
            description: '周一至周五11:30-14:00，主菜+汤+米饭套餐8.5折',
            discount: 15,
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            status: 'active',
            usageCount: 156,
            targetRevenue: 5000
        },
        {
            id: 2,
            name: '会员专享菜品',
            type: 'member_only',
            description: 'VIP会员专享精品菜单，包含招牌水煮鱼等',
            discount: 20,
            startDate: '2024-01-10',
            endDate: '2024-02-10',
            status: 'active',
            usageCount: 23,
            targetRevenue: 3000
        },
        {
            id: 3,
            name: '满额赠饮',
            type: 'gift',
            description: '单桌消费满128元赠送银耳莲子汤一份',
            discount: 0,
            startDate: '2024-01-15',
            endDate: '2024-01-25',
            status: 'active',
            usageCount: 8,
            targetRevenue: 1200
        }
    ],
    expenses: [
        {
            id: 1,
            category: '食材采购',
            amount: 1250.00,
            description: '本周蔬菜、肉类采购',
            date: '2024-01-15',
            supplier: '新鲜蔬菜供应商',
            receipt: 'RECEIPT_001.jpg',
            status: 'paid'
        },
        {
            id: 2,
            category: '水电费',
            amount: 680.00,
            description: '12月份水电费账单',
            date: '2024-01-10',
            supplier: '国家电网',
            receipt: 'BILL_002.pdf',
            status: 'paid'
        },
        {
            id: 3,
            category: '设备维护',
            amount: 350.00,
            description: '空调清洗保养费用',
            date: '2024-01-08',
            supplier: '家电维修服务中心',
            receipt: 'RECEIPT_003.jpg',
            status: 'paid'
        },
        {
            id: 4,
            category: '员工工资',
            amount: 15800.00,
            description: '12月份员工薪资发放',
            date: '2024-01-05',
            supplier: '内部',
            receipt: 'PAYROLL_004.xlsx',
            status: 'paid'
        },
        {
            id: 5,
            category: '房租',
            amount: 8000.00,
            description: '1月份店铺租金',
            date: '2024-01-01',
            supplier: '物业管理公司',
            receipt: 'RENT_005.pdf',
            status: 'pending'
        }
    ]
};

// 强制隐藏所有模态框
function forceHideAllModals() {
    // 隐藏主模态框
    const mainModal = document.getElementById('modalOverlay');
    if (mainModal) {
        mainModal.classList.remove('active');
        mainModal.style.display = 'none';
    }
    
    // 隐藏库存模态框
    const inventoryModal = document.getElementById('inventory-modal');
    if (inventoryModal) {
        inventoryModal.style.display = 'none';
    }
    
    // 隐藏所有可能的模态框
    document.querySelectorAll('.modal-overlay, .inventory-modal-overlay').forEach(modal => {
        modal.classList.remove('active');
        modal.style.display = 'none';
    });
}

// 初始化应用
document.addEventListener('DOMContentLoaded', async function() {
    // 强制隐藏所有模态框
    forceHideAllModals();
    
    await loadPages();
    
    // 页面加载完成后再次确保模态框隐藏
    setTimeout(() => {
        forceHideAllModals();
    }, 100);
    
    initializeApp();
    startRealTimeUpdates();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // 初始化平板交互功能
    initializeDragAndDrop();
    addDragAnimationCSS();
});

// 加载页面
async function loadPages() {
    const container = document.querySelector('.page-container');
    
    for (const pageId of pagesToLoad) {
        try {
            const response = await fetch(`./pages/${pageId}.html`);
            if (response.ok) {
                const html = await response.text();
                container.insertAdjacentHTML('beforeend', html);
            } else {
                console.warn(`无法加载页面: ${pageId}`);
            }
        } catch (error) {
            console.error(`加载页面失败 ${pageId}:`, error);
        }
    }
}

// 验证数据完整性
function validateMockData() {
    
    if (!mockData) {
        console.error('mockData 未定义');
        return false;
    }
    
    const requiredFields = ['orders', 'popularItems', 'notifications'];
    const missingFields = requiredFields.filter(field => {
        const missing = !mockData[field] || !Array.isArray(mockData[field]);
        if (missing) {
            console.error(`mockData.${field} 缺失或不是数组:`, mockData[field]);
        }
        return missing;
    });
    
    if (missingFields.length > 0) {
        console.error('缺失的数据字段:', missingFields);
        return false;
    }
    
    return true;
}

// 初始化应用
function initializeApp() {
    // 验证数据完整性
    if (!validateMockData()) {
        console.error('数据验证失败，使用默认数据');
    }
    
    // 显示默认页面
    showPage('dashboard');
    
    // 更新统计数据
    updateDashboardStats();
    
    // 渲染实时订单
    renderOrderStream();
    
    // 渲染热门菜品
    renderPopularItems();
    
    // 渲染系统通知
    renderSystemNotifications();
    
    // 设置通知计数
    updateNotificationBadge();
    
    // 渲染订单摘要
    renderOrderSummary();
}

// 移动端菜单切换
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const isOpen = sidebar.classList.contains('mobile-open');
    
    if (isOpen) {
        sidebar.classList.remove('mobile-open');
        document.body.classList.remove('mobile-menu-open');
    } else {
        sidebar.classList.add('mobile-open');
        document.body.classList.add('mobile-menu-open');
    }
}

// 页面导航
function navigateToPage(pageId, navElement) {
    // 更新导航状态
    if (navElement) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        navElement.classList.add('active');
    }
    
    // 显示页面
    showPage(pageId);
    
    // 更新面包屑和标题
    updatePageHeader(pageId);
    
    // 在移动端导航后关闭菜单
    if (window.innerWidth <= 767) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar.classList.contains('mobile-open')) {
            toggleMobileMenu();
        }
    }
}

// 显示页面
function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.style.display = 'block';
        
        // 添加页面历史
        if (currentPage !== pageId) {
            pageHistory.push(currentPage);
        }
        currentPage = pageId;
        
        
        // 页面特定的初始化
        initializePage(pageId);
    }
}

// 页面特定初始化
function initializePage(pageId) {
    switch (pageId) {
        case 'dashboard':
            updateDashboardStats();
            renderOrderStream();
            break;
        case 'orders':
            if (typeof renderOrdersPage === 'function') {
                renderOrdersPage();
            }
            break;
        case 'menu-management':
            if (typeof initMenuManagement === 'function') {
                initMenuManagement();
            }
            break;
        case 'inventory':
            if (typeof initInventoryPage === 'function') {
                initInventoryPage();
            }
            break;
        case 'customers':
            if (typeof initCustomersPage === 'function') {
                initCustomersPage();
            } else {
                console.log('initCustomersPage函数不存在');
            }
            break;
        case 'analytics':
            if (typeof initAnalyticsPage === 'function') {
                initAnalyticsPage();
            }
            break;
        case 'settings':
            if (typeof initSettingsPage === 'function') {
                initSettingsPage();
            }
            break;
    }
}

// 更新页面标题和面包屑
function updatePageHeader(pageId) {
    const pageTitle = document.querySelector('.page-title');
    const breadcrumb = document.querySelector('.breadcrumb .current');
    
    const pageTitles = merchantConfig?.pageTitles || {
        'dashboard': '仪表盘',
        'orders': '订单管理',
        'menu-management': '菜单管理',
        'inventory': '库存管理',
        'customers': '客户管理',
        'analytics': '数据分析',
        'settings': '设置'
    };
    
    if (pageTitle && breadcrumb) {
        const title = pageTitles[pageId] || '未知页面';
        pageTitle.textContent = title;
        breadcrumb.textContent = title;
    }
}

// 更新仪表盘统计数据
function updateDashboardStats() {
    // 更新今日订单统计
    const todayOrders = document.getElementById('today-orders');
    if (todayOrders) {
        animateCountUp(todayOrders, 28);
    }
    
    // 更新今日营收统计
    const todayRevenue = document.getElementById('today-revenue');
    if (todayRevenue) {
        todayRevenue.textContent = '¥2,485';
    }
    
    // 更新今日客户统计
    const todayCustomers = document.getElementById('today-customers');
    if (todayCustomers) {
        animateCountUp(todayCustomers, 45);
    }
    
    // 更新低库存商品统计
    const lowStockItems = document.getElementById('low-stock-items');
    if (lowStockItems) {
        animateCountUp(lowStockItems, 2);
    }
    
    // 更新实时营业状态卡片
    updateBusinessStatusCard();
    
    // 更新快速统计卡片
    updateQuickStats();
}

// 更新营业状态卡片
function updateBusinessStatusCard() {
    const businessHours = document.querySelector('.business-hours');
    if (businessHours) {
        const isOpen = businessStatus === 'online';
        businessHours.className = `business-hours ${isOpen ? '' : 'closed'}`;
        businessHours.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px;">
                <i class="fas fa-${isOpen ? 'clock' : 'times-circle'}" style="font-size: 24px;"></i>
                <h3 style="margin: 0; color: white;">${isOpen ? '营业中' : '暂停营业'}</h3>
            </div>
            <div style="color: rgba(255, 255, 255, 0.9); font-size: 14px; text-align: center;">
                ${isOpen ? '正在接受订单' : '暂不接受新订单'}
            </div>
        `;
    }
}

// 更新快速统计
function updateQuickStats() {
    const quickStats = document.querySelector('.quick-stats');
    if (quickStats) {
        quickStats.innerHTML = `
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon primary">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i> +12%
                    </div>
                </div>
                <div class="stat-value" id="today-orders">28</div>
                <div class="stat-label">今日订单</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon success">
                        <i class="fas fa-coins"></i>
                    </div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i> +8%
                    </div>
                </div>
                <div class="stat-value" id="today-revenue">¥2,485</div>
                <div class="stat-label">今日营收</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon primary">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i> +15%
                    </div>
                </div>
                <div class="stat-value" id="today-customers">45</div>
                <div class="stat-label">今日客户</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon warning">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="stat-change negative">
                        <i class="fas fa-arrow-down"></i> -2
                    </div>
                </div>
                <div class="stat-value" id="low-stock-items">2</div>
                <div class="stat-label">低库存商品</div>
            </div>
        `;
    }
}

// 渲染订单摘要
function renderOrderSummary() {
    const orderSummary = document.querySelector('.order-summary');
    if (!orderSummary) return;
    
    // 防护措施：确保 orders 数据存在
    if (!mockData || !mockData.orders || !Array.isArray(mockData.orders)) {
        console.warn('订单数据不存在，跳过渲染订单摘要');
        orderSummary.innerHTML = '<div style="text-align: center; color: var(--gray-color); padding: 20px;">暂无订单数据</div>';
        return;
    }
    
    const pendingOrders = mockData.orders.filter(order => order.status === 'pending').length;
    const preparingOrders = mockData.orders.filter(order => order.status === 'preparing').length;
    const readyOrders = mockData.orders.filter(order => order.status === 'ready').length;
    const completedOrders = mockData.orders.filter(order => order.status === 'completed').length;
    
    orderSummary.innerHTML = `
        <div class="summary-item">
            <div class="summary-value" style="color: var(--warning-color);">${pendingOrders}</div>
            <div class="summary-label">待确认</div>
        </div>
        <div class="summary-item">
            <div class="summary-value" style="color: var(--info-color);">${preparingOrders}</div>
            <div class="summary-label">制作中</div>
        </div>
        <div class="summary-item">
            <div class="summary-value" style="color: var(--success-color);">${readyOrders}</div>
            <div class="summary-label">已完成</div>
        </div>
        <div class="summary-item">
            <div class="summary-value" style="color: var(--gray-color);">${completedOrders}</div>
            <div class="summary-label">已送达</div>
        </div>
    `;
}

// 数字动画效果
function animateCountUp(element, targetValue) {
    let currentValue = 0;
    const increment = Math.ceil(targetValue / 20);
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        element.textContent = currentValue;
    }, 50);
}

// 渲染订单流 - 现代化设计
function renderOrderStream() {
    const orderStream = document.getElementById('orderStream');
    if (!orderStream) return;
    
    // 防护措施：确保 orders 数据存在
    if (!mockData || !mockData.orders || !Array.isArray(mockData.orders)) {
        console.warn('订单数据不存在，跳过渲染');
        orderStream.innerHTML = '<div style="text-align: center; color: var(--gray-color); padding: 20px;">暂无订单</div>';
        return;
    }
    
    const statusText = {
        'pending': '待确认',
        'preparing': '制作中', 
        'ready': '已完成',
        'completed': '已完成',
        'cancelled': '已取消'
    };
    
    const statusIcons = {
        'pending': 'fas fa-clock',
        'preparing': 'fas fa-utensils',
        'ready': 'fas fa-check-circle',
        'completed': 'fas fa-check-double',
        'cancelled': 'fas fa-times-circle'
    };
    
    const ordersHtml = mockData.orders.map(order => {
        const itemNames = order.items.map(item => item.name).join(', ');
        const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
        const statusClass = order.status;
        
        return `
            <div class="order-item draggable ${statusClass}" 
                 data-order-id="${order.id}" 
                 onclick="showOrderDetails('${order.id}')"
                 style="transition: var(--transition); cursor: pointer;">
                <div class="order-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div class="order-id-section" style="display: flex; align-items: center; gap: 12px;">
                        <div class="table-badge" style="
                            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                            color: white;
                            padding: 6px 12px;
                            border-radius: 20px;
                            font-weight: 600;
                            font-size: 12px;
                        ">${order.table}</div>
                        <div class="order-number" style="font-weight: 600; color: var(--dark-color);">${order.id}</div>
                    </div>
                    <div class="order-status" style="
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        padding: 4px 12px;
                        border-radius: 16px;
                        font-size: 12px;
                        font-weight: 500;
                        background: rgba(102, 126, 234, 0.1);
                        color: var(--primary-color);
                    ">
                        <i class="${statusIcons[statusClass]}"></i>
                        ${statusText[statusClass]}
                    </div>
                </div>
                
                <div class="order-customer" style="
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: var(--dark-color);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                ">
                    <i class="fas fa-user" style="color: var(--gray-color);"></i>
                    ${order.customer}
                </div>
                
                <div class="order-details" style="
                    margin-bottom: 10px;
                    color: var(--gray-color);
                    font-size: 13px;
                    line-height: 1.4;
                ">${itemNames} (${itemCount}项)</div>
                
                <div class="order-footer" style="display: flex; justify-content: space-between; align-items: center;">
                    <div class="order-time" style="
                        font-size: 12px;
                        color: var(--gray-color);
                        display: flex;
                        align-items: center;
                        gap: 4px;
                    ">
                        <i class="fas fa-clock"></i>
                        ${order.time} | 等待${order.waitTime}
                    </div>
                    <div class="order-amount" style="
                        font-size: 18px;
                        font-weight: 700;
                        background: linear-gradient(135deg, var(--success-color), #40c057);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    ">¥${order.amount.toFixed(2)}</div>
                </div>
                
                ${order.remark ? `
                <div class="order-remark" style="
                    margin-top: 10px;
                    padding: 8px 12px;
                    background: rgba(255, 212, 59, 0.1);
                    border-radius: 8px;
                    font-size: 12px;
                    color: var(--warning-color);
                    border-left: 3px solid var(--warning-color);
                ">
                    <i class="fas fa-exclamation-circle"></i> ${order.remark}
                </div>
                ` : ''}
            </div>
        `;
    }).join('');
    
    orderStream.innerHTML = ordersHtml;
}

// 渲染热门菜品 - 现代化设计
function renderPopularItems() {
    const popularItems = document.getElementById('popularItems');
    if (!popularItems) return;
    
    // 防护措施：确保 popularItems 数据存在
    if (!mockData || !mockData.popularItems || !Array.isArray(mockData.popularItems)) {
        console.warn('热门菜品数据不存在，跳过渲染');
        popularItems.innerHTML = '<div style="text-align: center; color: var(--gray-color); padding: 20px;">暂无热门菜品</div>';
        return;
    }
    
    const itemsHtml = mockData.popularItems.map((item, index) => {
        const rankColors = {
            0: 'linear-gradient(135deg, #ffd700, #ffed4e)', // 金色
            1: 'linear-gradient(135deg, #c0c0c0, #e6e6e6)', // 银色
            2: 'linear-gradient(135deg, #cd7f32, #deb887)'  // 铜色
        };
        
        const rankColor = rankColors[index] || 'linear-gradient(135deg, var(--gray-color), var(--gray-medium))';
        const rankIcon = index < 3 ? 'fas fa-crown' : 'fas fa-star';
        
        return `
            <div class="popular-item" style="
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                border-radius: var(--border-radius);
                padding: 16px;
                margin-bottom: 12px;
                box-shadow: var(--shadow-sm);
                transition: var(--transition);
                cursor: pointer;
                border: 1px solid rgba(255, 255, 255, 0.3);
            " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='var(--shadow)'" 
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)'">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="item-rank" style="
                            background: ${rankColor};
                            color: white;
                            width: 32px;
                            height: 32px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: 700;
                            font-size: 14px;
                            box-shadow: var(--shadow-sm);
                        ">
                            ${index < 3 ? `<i class="${rankIcon}"></i>` : index + 1}
                        </div>
                        <div class="item-details">
                            <div class="item-name" style="
                                font-weight: 600;
                                color: var(--dark-color);
                                margin-bottom: 4px;
                                font-size: 15px;
                            ">${item.name}</div>
                            <div style="display: flex; align-items: center; gap: 16px; font-size: 12px; color: var(--gray-color);">
                                <span style="display: flex; align-items: center; gap: 4px;">
                                    <i class="fas fa-shopping-cart"></i>
                                    销量: ${item.sales}
                                </span>
                                <span style="display: flex; align-items: center; gap: 4px;">
                                    <i class="fas fa-star" style="color: #ffc107;"></i>
                                    ${item.rating}
                                </span>
                                <span style="display: flex; align-items: center; gap: 4px;">
                                    <i class="fas fa-chart-line" style="color: var(--success-color);"></i>
                                    利润: ¥${item.profit}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="item-price" style="
                        font-size: 18px;
                        font-weight: 700;
                        background: linear-gradient(135deg, var(--success-color), #40c057);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    ">¥${item.price.toFixed(2)}</div>
                </div>
            </div>
        `;
    }).join('');
    
    popularItems.innerHTML = itemsHtml;
}

// 渲染系统通知 - 现代化设计
function renderSystemNotifications() {
    const systemNotifications = document.getElementById('systemNotifications');
    if (!systemNotifications) return;
    
    // 防护措施：确保 notifications 数据存在
    if (!mockData || !mockData.notifications || !Array.isArray(mockData.notifications)) {
        console.warn('通知数据不存在，跳过渲染');
        systemNotifications.innerHTML = '<div style="text-align: center; color: var(--gray-color); padding: 20px;">暂无通知</div>';
        return;
    }
    
    const typeColors = {
        'warning': 'var(--warning-color)',
        'info': 'var(--info-color)',
        'success': 'var(--success-color)',
        'error': 'var(--danger-color)'
    };
    
    const typeBackgrounds = {
        'warning': 'rgba(255, 212, 59, 0.1)',
        'info': 'rgba(51, 154, 240, 0.1)',
        'success': 'rgba(81, 207, 102, 0.1)',
        'error': 'rgba(255, 107, 107, 0.1)'
    };
    
    const notificationsHtml = mockData.notifications.map(notification => `
        <div class="notification-item ${notification.unread ? 'unread' : ''}" 
             onclick="markNotificationRead(this)"
             style="
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                border-radius: var(--border-radius);
                padding: 16px;
                margin-bottom: 12px;
                box-shadow: var(--shadow-sm);
                transition: var(--transition);
                cursor: pointer;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-left: 4px solid ${typeColors[notification.type]};
                ${notification.unread ? 'box-shadow: var(--shadow); transform: translateY(-2px);' : ''}
             "
             onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='var(--shadow)'" 
             onmouseout="this.style.transform='${notification.unread ? 'translateY(-2px)' : 'translateY(0)'}'; this.style.boxShadow='${notification.unread ? 'var(--shadow)' : 'var(--shadow-sm)'}'">
            <div style="display: flex; align-items: flex-start; gap: 12px;">
                <div class="notification-icon" style="
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: ${typeBackgrounds[notification.type]};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: ${typeColors[notification.type]};
                    font-size: 16px;
                    flex-shrink: 0;
                    box-shadow: var(--shadow-sm);
                ">
                    <i class="${notification.icon}"></i>
                </div>
                <div class="notification-content" style="flex: 1;">
                    <div class="notification-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                        <div class="notification-title" style="
                            font-weight: 600;
                            color: var(--dark-color);
                            font-size: 14px;
                            line-height: 1.3;
                        ">${notification.title}</div>
                        ${notification.unread ? `
                            <div style="
                                width: 8px;
                                height: 8px;
                                background: ${typeColors[notification.type]};
                                border-radius: 50%;
                                flex-shrink: 0;
                                margin-top: 2px;
                                margin-left: 8px;
                            "></div>
                        ` : ''}
                    </div>
                    <div class="notification-message" style="
                        color: var(--gray-color);
                        font-size: 13px;
                        line-height: 1.4;
                        margin-bottom: 6px;
                    ">${notification.message}</div>
                    <div class="notification-time" style="
                        font-size: 11px;
                        color: var(--gray-color);
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        opacity: 0.8;
                    ">
                        <i class="fas fa-clock"></i>
                        ${notification.time}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    systemNotifications.innerHTML = notificationsHtml;
}

// 更新通知徽章
function updateNotificationBadge() {
    // 防护措施：确保 notifications 数据存在
    if (!mockData || !mockData.notifications || !Array.isArray(mockData.notifications)) {
        console.warn('通知数据不存在，跳过更新徽章');
        return;
    }
    
    const unreadCount = mockData.notifications.filter(n => n.unread).length;
    const badge = document.getElementById('pending-orders');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'inline' : 'none';
    }
}

// 刷新数据
function refreshData() {
    const refreshBtn = document.querySelector('.btn-refresh i');
    if (refreshBtn) {
        refreshBtn.style.animation = 'spin 1s linear';
        setTimeout(() => {
            refreshBtn.style.animation = '';
        }, 1000);
    }
    
    // 模拟数据刷新
    setTimeout(() => {
        updateDashboardStats();
        renderOrderStream();
        showNotification('数据已更新', '所有数据已刷新至最新状态', 'success');
    }, 1000);
}

// 刷新订单
function refreshOrders() {
    renderOrderStream();
    showNotification('订单已刷新', '订单列表已更新', 'success');
}

// 切换营业状态
function toggleBusinessStatus() {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusDot = document.querySelector('.status-dot');
    const toggleBtn = document.querySelector('[onclick="toggleBusinessStatus()"]');
    
    if (businessStatus === 'online') {
        businessStatus = 'offline';
        statusIndicator.innerHTML = '<span class="status-dot offline"></span>暂停营业';
        statusIndicator.className = 'status-indicator offline';
        toggleBtn.innerHTML = '<i class="fas fa-power-off"></i>开始营业';
        toggleBtn.className = 'btn btn-success btn-sm';
        showNotification('营业状态', '已暂停营业，不再接受新订单', 'warning');
    } else {
        businessStatus = 'online';
        statusIndicator.innerHTML = '<span class="status-dot online"></span>营业中';
        statusIndicator.className = 'status-indicator online';
        toggleBtn.innerHTML = '<i class="fas fa-power-off"></i>暂停营业';
        toggleBtn.className = 'btn btn-warning btn-sm';
        showNotification('营业状态', '已开始营业，可以接受新订单', 'success');
    }
}

// 显示订单详情
function showOrderDetails(orderId) {
    const order = mockData.orders.find(o => o.id === orderId);
    if (!order) return;
    
    const itemsHtml = order.items.map(item => `
        <tr style="border-bottom: 1px solid #f1f3f4;">
            <td style="padding: 8px 0;">${item.name}</td>
            <td style="padding: 8px 0; text-align: center;">¥${item.price.toFixed(2)}</td>
            <td style="padding: 8px 0; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px 0; text-align: right;">¥${(item.price * item.quantity).toFixed(2)}</td>
            <td style="padding: 8px 0; text-align: left; color: var(--gray-color); font-size: 12px;">${item.note || '-'}</td>
        </tr>
    `).join('');
    
    const modalContent = `
        <div style="padding: 24px; min-width: 500px; max-width: 600px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>订单详情 - ${order.id}</h2>
                <button onclick="closeModal()" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <div style="margin-bottom: 12px;"><strong>客户信息</strong></div>
                    <div style="margin-bottom: 8px; color: var(--gray-color);">姓名: ${order.customer}</div>
                    <div style="margin-bottom: 8px; color: var(--gray-color);">电话: ${order.phone}</div>
                    <div style="margin-bottom: 8px; color: var(--gray-color);">桌号: ${order.table}</div>
                </div>
                <div>
                    <div style="margin-bottom: 12px;"><strong>订单信息</strong></div>
                    <div style="margin-bottom: 8px; color: var(--gray-color);">下单时间: ${order.orderTime}</div>
                    <div style="margin-bottom: 8px; color: var(--gray-color);">等待时间: ${order.waitTime}</div>
                    <div style="margin-bottom: 8px; color: var(--gray-color);">支付方式: ${order.paymentMethod}</div>
                </div>
            </div>
            
            ${order.remark ? `
            <div style="margin-bottom: 20px; padding: 12px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px;">
                <strong>备注:</strong> ${order.remark}
            </div>
            ` : ''}
            
            <div style="margin-bottom: 20px;">
                <strong>订单明细</strong>
                <table style="width: 100%; margin-top: 12px; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f8f9fa; border-bottom: 2px solid #e1e8ed;">
                            <th style="padding: 10px 0; text-align: left;">菜品</th>
                            <th style="padding: 10px 0; text-align: center;">单价</th>
                            <th style="padding: 10px 0; text-align: center;">数量</th>
                            <th style="padding: 10px 0; text-align: right;">小计</th>
                            <th style="padding: 10px 0; text-align: left;">备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
            </div>
            
            <div style="margin-bottom: 20px; text-align: right;">
                <strong>总金额: </strong>
                <span style="color: var(--primary-color); font-size: 24px; font-weight: 600;">¥${order.amount.toFixed(2)}</span>
            </div>
            
            <div style="display: flex; gap: 12px; justify-content: center;">
                ${order.status === 'pending' ? `
                <button class="btn btn-success" onclick="updateOrderStatus('${order.id}', 'preparing')">
                    <i class="fas fa-play"></i> 开始制作
                </button>
                ` : ''}
                ${order.status === 'preparing' ? `
                <button class="btn btn-primary" onclick="updateOrderStatus('${order.id}', 'ready')">
                    <i class="fas fa-check"></i> 制作完成
                </button>
                ` : ''}
                ${order.status === 'ready' ? `
                <button class="btn btn-success" onclick="updateOrderStatus('${order.id}', 'completed')">
                    <i class="fas fa-utensils"></i> 已送达
                </button>
                ` : ''}
                <button class="btn btn-outline" onclick="printOrder('${order.id}')">
                    <i class="fas fa-print"></i> 打印小票
                </button>
                ${order.status !== 'completed' ? `
                <button class="btn btn-danger" onclick="updateOrderStatus('${order.id}', 'cancelled')">
                    <i class="fas fa-times"></i> 取消订单
                </button>
                ` : ''}
            </div>
        </div>
    `;
    
    showModal(null, modalContent);
}

// 更新订单状态
function updateOrderStatus(orderId, newStatus) {
    const order = mockData.orders.find(o => o.id === orderId);
    if (order) {
        const oldStatus = order.status;
        order.status = newStatus;
        
        // 更新等待时间
        if (newStatus === 'preparing') {
            order.waitTime = '制作中';
        } else if (newStatus === 'ready') {
            order.waitTime = '已完成';
        } else if (newStatus === 'completed') {
            order.waitTime = '已送达';
        } else if (newStatus === 'cancelled') {
            order.waitTime = '已取消';
        }
        
        renderOrderStream();
        closeModal();
        
        const statusText = {
            'preparing': '制作中',
            'ready': '已完成',
            'completed': '已送达',
            'cancelled': '已取消'
        };
        
        showNotification('订单状态更新', `订单 ${orderId} 已更新为 ${statusText[newStatus]}`, 'success');
        
        // 添加到活动记录
        const currentTime = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        // 确保 recentActivity 数组存在
        if (!mockData.recentActivity) {
            mockData.recentActivity = [];
        }
        mockData.recentActivity.unshift({
            time: currentTime,
            action: '订单更新',
            detail: `${order.table}桌${order.customer}订单状态更新为${statusText[newStatus]}`
        });
        
        // 保持活动记录在合理长度
        if (mockData.recentActivity.length > 10) {
            mockData.recentActivity = mockData.recentActivity.slice(0, 10);
        }
    }
}

// 打印订单小票
function printOrder(orderId) {
    const order = mockData.orders.find(o => o.id === orderId);
    if (!order) return;
    
    // 模拟打印
    showNotification('打印成功', `订单 ${orderId} 小票已发送到厨房打印机`, 'success');
    closeModal();
}

// 显示模态框
function showModal(modalId, customContent = null) {
    const overlay = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');
    
    if (customContent) {
        content.innerHTML = customContent;
    } else {
        // 根据modalId加载对应内容
        const modalContents = {
            'new-menu-item': `
                <div style="padding: 24px; min-width: 400px;">
                    <h2 style="margin-bottom: 20px;">添加新菜品</h2>
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">菜品名称</label>
                        <input type="text" placeholder="输入菜品名称" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">价格</label>
                        <input type="number" placeholder="0.00" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">描述</label>
                        <textarea placeholder="输入菜品描述" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; height: 80px; resize: vertical;"></textarea>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button class="btn btn-primary" onclick="addMenuItem()">
                            <i class="fas fa-plus"></i> 添加菜品
                        </button>
                        <button class="btn btn-outline" onclick="closeModal()">取消</button>
                    </div>
                </div>
            `,
            'inventory-alert': `
                <div style="padding: 24px; min-width: 400px;">
                    <h2 style="margin-bottom: 20px;">库存提醒设置</h2>
                    <p style="margin-bottom: 20px; color: var(--gray-color);">当库存低于设定值时将自动发送提醒</p>
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">提醒阈值</label>
                        <input type="number" value="5" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button class="btn btn-primary" onclick="saveInventorySettings()">
                            <i class="fas fa-save"></i> 保存设置
                        </button>
                        <button class="btn btn-outline" onclick="closeModal()">取消</button>
                    </div>
                </div>
            `,
            'discount': `
                <div style="padding: 24px; min-width: 400px;">
                    <h2 style="margin-bottom: 20px;">设置优惠活动</h2>
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">优惠类型</label>
                        <select style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                            <option value="percentage">百分比折扣</option>
                            <option value="fixed">固定金额减免</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">优惠值</label>
                        <input type="number" placeholder="输入优惠值" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button class="btn btn-primary" onclick="createDiscount()">
                            <i class="fas fa-percentage"></i> 创建优惠
                        </button>
                        <button class="btn btn-outline" onclick="closeModal()">取消</button>
                    </div>
                </div>
            `
        };
        
        content.innerHTML = modalContents[modalId] || '<div style="padding: 24px;">内容加载中...</div>';
    }
    
    overlay.classList.add('active');
}

// 关闭模态框
function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
}

// 点击遮罩关闭模态框
document.addEventListener('click', function(e) {
    if (e.target.id === 'modalOverlay') {
        closeModal();
    }
});

// 显示通知
function showNotification(title, message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const icons = {
        'success': 'fas fa-check-circle',
        'warning': 'fas fa-exclamation-triangle',
        'error': 'fas fa-times-circle',
        'info': 'fas fa-info-circle'
    };
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="${icons[type]}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // 自动移除通知
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// 标记通知为已读
function markNotificationRead(element) {
    element.classList.remove('unread');
    updateNotificationBadge();
}

// 标记所有通知为已读
function markAllNotificationsRead() {
    mockData.notifications.forEach(notification => {
        notification.unread = false;
    });
    renderSystemNotifications();
    updateNotificationBadge();
    showNotification('通知状态', '所有通知已标记为已读', 'success');
}

// 更新当前时间
function updateCurrentTime() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('zh-CN', { hour12: false });
        timeElement.textContent = timeString;
    }
}

// 开始实时更新
function startRealTimeUpdates() {
    // 每30秒模拟新订单
    setInterval(() => {
        if (Math.random() < 0.3 && businessStatus === 'online') { // 30%概率
            simulateNewOrder();
        }
    }, 30000);
    
    // 每5秒更新时间相关显示
    setInterval(() => {
        updateCurrentTime();
    }, 5000);
}

// 模拟新订单
function simulateNewOrder() {
    const itemOptions = [
        [
            { name: '宫保鸡丁', price: 32.0, quantity: 1, note: '' },
            { name: '白米饭', price: 5.0, quantity: 1, note: '' }
        ],
        [
            { name: '麻婆豆腐', price: 26.0, quantity: 1, note: '' },
            { name: '紫菜蛋花汤', price: 16.0, quantity: 1, note: '' }
        ],
        [
            { name: '回锅肉', price: 38.0, quantity: 1, note: '' },
            { name: '酸辣土豆丝', price: 18.0, quantity: 1, note: '' }
        ]
    ];
    
    const selectedItems = itemOptions[Math.floor(Math.random() * itemOptions.length)];
    const totalAmount = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newOrder = {
        id: 'ORD' + String(Date.now()).slice(-3),
        customer: ['王先生', '李女士', '张先生', '赵女士'][Math.floor(Math.random() * 4)],
        phone: ['138****8888', '139****6666', '137****9999', '136****5555'][Math.floor(Math.random() * 4)],
        items: selectedItems,
        amount: totalAmount,
        status: 'pending',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        orderTime: new Date().toLocaleString('zh-CN'),
        table: 'A' + String(Math.floor(Math.random() * 9) + 1).padStart(2, '0'),
        waitTime: '刚下单',
        paymentMethod: '微信支付',
        remark: ''
    };
    
    mockData.orders.unshift(newOrder);
    renderOrderStream();
    
    // 播放新订单提示音（可选）
    showNotification('新订单', `收到来自${newOrder.table}桌的新订单`, 'info');
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // ESC键关闭模态框
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // 数字键快速导航
    if (e.altKey) {
        const keyMap = {
            '1': 'dashboard',
            '2': 'orders',
            '3': 'menu-management',
            '4': 'inventory',
            '5': 'customers',
            '6': 'analytics',
            '7': 'settings'
        };
        
        if (keyMap[e.key]) {
            const navItem = document.querySelector(`[onclick="navigateToPage('${keyMap[e.key]}', this)"]`);
            if (navItem) {
                navigateToPage(keyMap[e.key], navItem);
            }
        }
    }
});

// 增强触摸手势支持（平板专用）
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
let isScrolling = false;

// 页面导航数组
const pageOrder = ['dashboard', 'orders', 'menu-management', 'inventory', 'customers', 'analytics', 'settings'];

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
    isScrolling = false;
}, { passive: true });

document.addEventListener('touchmove', function(e) {
    if (!touchStartX || !touchStartY) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const deltaX = touchX - touchStartX;
    const deltaY = touchY - touchStartY;
    
    // 判断是否为滚动操作
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
        isScrolling = true;
    }
    
    // 如果是水平滑动且不在滚动，显示滑动提示
    if (Math.abs(deltaX) > 50 && !isScrolling) {
        showSwipeIndicator(deltaX > 0 ? 'right' : 'left');
    }
}, { passive: true });

document.addEventListener('touchend', function(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndTime = Date.now();
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const deltaTime = touchEndTime - touchStartTime;
    
    // 隐藏滑动提示
    hideSwipeIndicator();
    
    // 如果是滚动操作，忽略手势
    if (isScrolling) return;
    
    // 水平滑动阈值和速度检测
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 100;
    const isQuickSwipe = deltaTime < 300 && Math.abs(deltaX) > 50;
    
    if (isHorizontalSwipe || isQuickSwipe) {
        const currentIndex = pageOrder.indexOf(currentPage);
        
        if (deltaX > 0) {
            // 向右滑动 - 上一页
            if (currentIndex > 0) {
                const previousPage = pageOrder[currentIndex - 1];
                const navElement = document.querySelector(`[onclick*="${previousPage}"]`);
                navigateToPage(previousPage, navElement);
                showNotification('页面切换', `已切换到${getPageTitle(previousPage)}`, 'info');
            }
        } else {
            // 向左滑动 - 下一页  
            if (currentIndex < pageOrder.length - 1) {
                const nextPage = pageOrder[currentIndex + 1];
                const navElement = document.querySelector(`[onclick*="${nextPage}"]`);
                navigateToPage(nextPage, navElement);
                showNotification('页面切换', `已切换到${getPageTitle(nextPage)}`, 'info');
            }
        }
    }
    
    // 重置触摸状态
    touchStartX = 0;
    touchStartY = 0;
    touchStartTime = 0;
});

// 显示滑动指示器
function showSwipeIndicator(direction) {
    let indicator = document.getElementById('swipeIndicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'swipeIndicator';
        indicator.className = 'swipe-indicator';
        document.body.appendChild(indicator);
    }
    
    const currentIndex = pageOrder.indexOf(currentPage);
    let targetPage = '';
    
    if (direction === 'right' && currentIndex > 0) {
        targetPage = getPageTitle(pageOrder[currentIndex - 1]);
        indicator.innerHTML = `<i class="fas fa-chevron-left"></i> ${targetPage}`;
        indicator.className = 'swipe-indicator left';
    } else if (direction === 'left' && currentIndex < pageOrder.length - 1) {
        targetPage = getPageTitle(pageOrder[currentIndex + 1]);
        indicator.innerHTML = `${targetPage} <i class="fas fa-chevron-right"></i>`;
        indicator.className = 'swipe-indicator right';
    }
    
    if (targetPage) {
        indicator.classList.add('visible');
    }
}

// 隐藏滑动指示器
function hideSwipeIndicator() {
    const indicator = document.getElementById('swipeIndicator');
    if (indicator) {
        indicator.classList.remove('visible');
    }
}

// 获取页面标题
function getPageTitle(pageId) {
    const titles = {
        'dashboard': '仪表盘',
        'orders': '订单管理',
        'menu-management': '菜单管理',
        'inventory': '库存管理',
        'customers': '客户管理',
        'analytics': '数据分析',
        'settings': '设置'
    };
    return titles[pageId] || pageId;
}

// 增强长按操作系统
let longPressTimer;
let longPressTarget;
let hapticFeedbackTimer;

document.addEventListener('touchstart', function(e) {
    // 查找可长按的目标元素
    longPressTarget = e.target.closest('.order-item, .popular-item, .notification-item, .nav-item, .stat-card, .menu-item-card, .card');
    
    if (longPressTarget) {
        // 添加长按视觉反馈
        longPressTarget.classList.add('long-press-preparing');
        
        // 设置触觉反馈（渐进式）
        hapticFeedbackTimer = setTimeout(() => {
            longPressTarget.style.transform = 'scale(0.98)';
        }, 200);
        
        // 设置长按触发
        longPressTimer = setTimeout(() => {
            triggerLongPressAction(e, longPressTarget);
        }, 600);
    }
}, { passive: false });

document.addEventListener('touchend', function(e) {
    // 清理定时器和视觉效果
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
    }
    
    if (hapticFeedbackTimer) {
        clearTimeout(hapticFeedbackTimer);
        hapticFeedbackTimer = null;
    }
    
    if (longPressTarget) {
        longPressTarget.classList.remove('long-press-preparing');
        longPressTarget.style.transform = '';
        longPressTarget = null;
    }
});

document.addEventListener('touchmove', function(e) {
    // 移动超过阈值取消长按
    if (longPressTarget && longPressTimer) {
        const touch = e.touches[0];
        const startTouch = e.target.getBoundingClientRect();
        const distance = Math.sqrt(
            Math.pow(touch.clientX - startTouch.left, 2) + 
            Math.pow(touch.clientY - startTouch.top, 2)
        );
        
        if (distance > 20) {
            clearTimeout(longPressTimer);
            clearTimeout(hapticFeedbackTimer);
            longPressTarget.classList.remove('long-press-preparing');
            longPressTarget.style.transform = '';
            longPressTimer = null;
            longPressTarget = null;
        }
    }
});

// 长按动作触发器
function triggerLongPressAction(event, element) {
    // 添加触觉反馈效果
    element.style.animation = 'longPressSuccess 0.3s ease';
    
    setTimeout(() => {
        element.style.animation = '';
    }, 300);
    
    // 根据元素类型显示对应的上下文菜单
    if (element.classList.contains('order-item')) {
        showOrderContextMenu(event, element);
    } else if (element.classList.contains('nav-item')) {
        showNavContextMenu(event, element);
    } else if (element.classList.contains('stat-card')) {
        showStatContextMenu(event, element);
    } else if (element.classList.contains('menu-item-card')) {
        showMenuItemContextMenu(event, element);
    } else {
        showGenericContextMenu(event, element);
    }
    
    // 显示操作成功通知
    showNotification('长按操作', '已显示快捷菜单', 'info');
}

// 订单项上下文菜单
function showOrderContextMenu(event, element) {
    const orderId = element.dataset.orderId || 'ORD001';
    const menu = createContextMenu([
        { icon: 'fas fa-eye', text: '查看详情', action: () => showOrderDetails(orderId) },
        { icon: 'fas fa-play', text: '开始制作', action: () => updateOrderStatus(orderId, 'preparing') },
        { icon: 'fas fa-check', text: '标记完成', action: () => updateOrderStatus(orderId, 'ready') },
        { icon: 'fas fa-times', text: '取消订单', action: () => updateOrderStatus(orderId, 'cancelled'), danger: true }
    ]);
    
    showContextMenuAt(event, menu);
}

// 导航项上下文菜单
function showNavContextMenu(event, element) {
    const pageId = element.onclick?.toString().match(/'([^']+)'/)?.[1];
    const menu = createContextMenu([
        { icon: 'fas fa-external-link-alt', text: '在新窗口打开', action: () => openPageInModal(pageId) },
        { icon: 'fas fa-star', text: '添加到收藏', action: () => addToFavorites(pageId) },
        { icon: 'fas fa-cog', text: '页面设置', action: () => showPageSettings(pageId) }
    ]);
    
    showContextMenuAt(event, menu);
}

// 统计卡片上下文菜单
function showStatContextMenu(event, element) {
    const menu = createContextMenu([
        { icon: 'fas fa-chart-line', text: '查看详细数据', action: () => navigateToPage('analytics') },
        { icon: 'fas fa-download', text: '导出数据', action: () => exportData('stats') },
        { icon: 'fas fa-refresh', text: '刷新数据', action: () => refreshData() },
        { icon: 'fas fa-bell', text: '设置提醒', action: () => setDataAlert() }
    ]);
    
    showContextMenuAt(event, menu);
}

// 菜单项上下文菜单
function showMenuItemContextMenu(event, element) {
    const itemId = element.dataset.itemId || 'item1';
    const menu = createContextMenu([
        { icon: 'fas fa-edit', text: '编辑菜品', action: () => editMenuItem(itemId) },
        { icon: 'fas fa-copy', text: '复制菜品', action: () => duplicateMenuItem(itemId) },
        { icon: 'fas fa-eye-slash', text: '下架菜品', action: () => toggleMenuItemStatus(itemId) },
        { icon: 'fas fa-trash', text: '删除菜品', action: () => deleteMenuItem(itemId), danger: true }
    ]);
    
    showContextMenuAt(event, menu);
}

// 通用上下文菜单
function showGenericContextMenu(event, element) {
    const menu = createContextMenu([
        { icon: 'fas fa-info-circle', text: '查看信息', action: () => showElementInfo(element) },
        { icon: 'fas fa-copy', text: '复制', action: () => copyElement(element) },
        { icon: 'fas fa-share', text: '分享', action: () => shareElement(element) }
    ]);
    
    showContextMenuAt(event, menu);
}

// 创建上下文菜单
function createContextMenu(items) {
    const menu = document.createElement('div');
    menu.className = 'context-menu enhanced';
    
    items.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = `context-menu-item ${item.danger ? 'danger' : ''}`;
        menuItem.innerHTML = `
            <i class="${item.icon}"></i>
            <span>${item.text}</span>
        `;
        
        menuItem.addEventListener('click', () => {
            item.action();
            hideContextMenu();
        });
        
        menu.appendChild(menuItem);
    });
    
    return menu;
}

// 在指定位置显示上下文菜单
function showContextMenuAt(event, menu) {
    // 移除现有菜单
    hideContextMenu();
    
    // 获取触摸位置
    const touch = event.touches ? event.touches[0] : event;
    let x = touch.clientX;
    let y = touch.clientY;
    
    // 添加到页面
    document.body.appendChild(menu);
    
    // 获取菜单尺寸
    const menuRect = menu.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // 防止菜单超出屏幕
    if (x + menuRect.width > windowWidth) {
        x = windowWidth - menuRect.width - 10;
    }
    if (y + menuRect.height > windowHeight) {
        y = windowHeight - menuRect.height - 10;
    }
    
    // 设置位置
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.style.display = 'block';
    
    // 添加显示动画
    setTimeout(() => {
        menu.classList.add('visible');
    }, 10);
    
    // 设置自动关闭
    setTimeout(() => {
        document.addEventListener('touchstart', closeContextMenuHandler);
        document.addEventListener('click', closeContextMenuHandler);
    }, 100);
}

// 隐藏上下文菜单
function hideContextMenu() {
    const menus = document.querySelectorAll('.context-menu');
    menus.forEach(menu => {
        menu.classList.remove('visible');
        setTimeout(() => {
            if (menu.parentNode) {
                menu.remove();
            }
        }, 200);
    });
    
    document.removeEventListener('touchstart', closeContextMenuHandler);
    document.removeEventListener('click', closeContextMenuHandler);
}

// 关闭菜单处理器
function closeContextMenuHandler(e) {
    if (!e.target.closest('.context-menu')) {
        hideContextMenu();
    }
}

// 上下文菜单动作实现
function openPageInModal(pageId) {
    showNotification('功能开发中', `在新窗口打开${getPageTitle(pageId)}功能正在开发中`, 'info');
}

function addToFavorites(pageId) {
    showNotification('已收藏', `${getPageTitle(pageId)}已添加到收藏夹`, 'success');
}

function showPageSettings(pageId) {
    showNotification('页面设置', `${getPageTitle(pageId)}设置功能正在开发中`, 'info');
}

function exportData(type) {
    showNotification('导出数据', '数据导出功能正在处理中...', 'info');
}

function setDataAlert() {
    showNotification('提醒设置', '数据提醒功能已启用', 'success');
}

// 删除重复的简单版本，使用完整版本

function duplicateMenuItem(itemId) {
    showNotification('复制成功', `菜品 ${itemId} 已复制`, 'success');
}

function toggleMenuItemStatus(itemId) {
    showNotification('状态更新', `菜品 ${itemId} 状态已切换`, 'success');
}

function deleteMenuItem(itemId) {
    showNotification('删除成功', `菜品 ${itemId} 已删除`, 'warning');
}

function showElementInfo(element) {
    showNotification('元素信息', `类型: ${element.className}`, 'info');
}

function copyElement(element) {
    showNotification('复制成功', '内容已复制到剪贴板', 'success');
}

function shareElement(element) {
    showNotification('分享功能', '分享功能正在开发中', 'info');
}

// 拖拽功能系统
let dragState = {
    isDragging: false,
    dragElement: null,
    dragData: null,
    ghostElement: null,
    placeholder: null,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    offsetX: 0,
    offsetY: 0
};

// 初始化拖拽功能
function initializeDragAndDrop() {
    // 为可拖拽元素添加事件监听
    document.addEventListener('touchstart', handleDragStart, { passive: false });
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd, { passive: false });
    
    // 鼠标支持（用于开发测试）
    document.addEventListener('mousedown', handleDragStart, { passive: false });
    document.addEventListener('mousemove', handleDragMove, { passive: false });
    document.addEventListener('mouseup', handleDragEnd, { passive: false });
}

// 拖拽开始处理
function handleDragStart(e) {
    // 查找可拖拽的元素
    const draggableElement = e.target.closest('.draggable, .order-item[draggable="true"], [data-draggable="true"]');
    
    if (!draggableElement) return;
    
    // 如果正在长按，不启动拖拽
    if (longPressTimer) return;
    
    e.preventDefault();
    
    const touch = e.touches ? e.touches[0] : e;
    
    dragState.isDragging = true;
    dragState.dragElement = draggableElement;
    dragState.startX = touch.clientX;
    dragState.startY = touch.clientY;
    dragState.currentX = touch.clientX;
    dragState.currentY = touch.clientY;
    
    // 计算偏移量
    const rect = draggableElement.getBoundingClientRect();
    dragState.offsetX = touch.clientX - rect.left;
    dragState.offsetY = touch.clientY - rect.top;
    
    // 获取拖拽数据
    dragState.dragData = getDragData(draggableElement);
    
    // 延迟启动拖拽（避免与点击冲突）
    setTimeout(() => {
        if (dragState.isDragging) {
            startDragVisualFeedback();
        }
    }, 150);
}

// 拖拽移动处理
function handleDragMove(e) {
    if (!dragState.isDragging) return;
    
    e.preventDefault();
    
    const touch = e.touches ? e.touches[0] : e;
    dragState.currentX = touch.clientX;
    dragState.currentY = touch.clientY;
    
    const deltaX = Math.abs(dragState.currentX - dragState.startX);
    const deltaY = Math.abs(dragState.currentY - dragState.startY);
    
    // 只有移动超过阈值才开始视觉拖拽
    if (deltaX > 10 || deltaY > 10) {
        if (!dragState.ghostElement) {
            startDragVisualFeedback();
        }
        updateDragPosition();
        checkDropTargets();
    }
}

// 拖拽结束处理
function handleDragEnd(e) {
    if (!dragState.isDragging) return;
    
    e.preventDefault();
    
    const touch = e.changedTouches ? e.changedTouches[0] : e;
    const dropTarget = findDropTarget(touch.clientX, touch.clientY);
    
    if (dropTarget && isValidDropTarget(dropTarget, dragState.dragData)) {
        performDrop(dropTarget, dragState.dragData);
    } else {
        cancelDrag();
    }
    
    cleanupDrag();
}

// 开始拖拽视觉反馈
function startDragVisualFeedback() {
    if (!dragState.dragElement || dragState.ghostElement) return;
    
    // 添加拖拽样式
    dragState.dragElement.classList.add('dragging');
    
    // 创建拖拽幽灵元素
    const ghost = dragState.dragElement.cloneNode(true);
    ghost.className = 'drag-ghost';
    ghost.style.cssText = `
        position: fixed;
        z-index: 2000;
        pointer-events: none;
        opacity: 0.8;
        transform: scale(1.05) rotate(3deg);
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.25);
        border-radius: 12px;
        transition: none;
    `;
    
    document.body.appendChild(ghost);
    dragState.ghostElement = ghost;
    
    // 创建占位符
    if (isDragReordering()) {
        createDragPlaceholder();
    }
    
    // 显示拖拽指示器
    showDragIndicator('拖拽以移动项目');
    
    updateDragPosition();
}

// 更新拖拽位置
function updateDragPosition() {
    if (!dragState.ghostElement) return;
    
    const x = dragState.currentX - dragState.offsetX;
    const y = dragState.currentY - dragState.offsetY;
    
    dragState.ghostElement.style.left = x + 'px';
    dragState.ghostElement.style.top = y + 'px';
}

// 检查拖放目标
function checkDropTargets() {
    const dropTargets = document.querySelectorAll('.drop-zone, .status-column, .order-list');
    
    dropTargets.forEach(target => {
        const rect = target.getBoundingClientRect();
        const isOverTarget = (
            dragState.currentX >= rect.left &&
            dragState.currentX <= rect.right &&
            dragState.currentY >= rect.top &&
            dragState.currentY <= rect.bottom
        );
        
        if (isOverTarget && isValidDropTarget(target, dragState.dragData)) {
            target.classList.add('drag-over', 'valid-target');
            updateDragIndicator('松手以放置到此处', 'success');
        } else {
            target.classList.remove('drag-over', 'valid-target', 'invalid-target');
            if (isOverTarget) {
                target.classList.add('invalid-target');
                updateDragIndicator('无法放置到此处', 'error');
            }
        }
    });
}

// 查找拖放目标
function findDropTarget(x, y) {
    const elements = document.elementsFromPoint(x, y);
    return elements.find(el => 
        el.classList.contains('drop-zone') || 
        el.classList.contains('status-column') ||
        el.classList.contains('order-list')
    );
}

// 验证拖放目标
function isValidDropTarget(target, dragData) {
    if (!dragData) return false;
    
    // 订单项只能拖拽到状态列
    if (dragData.type === 'order') {
        return target.classList.contains('status-column') || 
               target.classList.contains('order-list');
    }
    
    // 菜单项拖拽验证
    if (dragData.type === 'menu-item') {
        return target.classList.contains('menu-category') ||
               target.classList.contains('drop-zone');
    }
    
    return true;
}

// 执行拖放操作
function performDrop(dropTarget, dragData) {
    const sourceElement = dragState.dragElement;
    
    if (dragData.type === 'order') {
        handleOrderDrop(dropTarget, dragData, sourceElement);
    } else if (dragData.type === 'menu-item') {
        handleMenuItemDrop(dropTarget, dragData, sourceElement);
    } else {
        handleGenericDrop(dropTarget, dragData, sourceElement);
    }
    
    // 成功反馈
    dropTarget.classList.add('drag-success');
    setTimeout(() => {
        dropTarget.classList.remove('drag-success');
    }, 400);
    
    showNotification('拖拽成功', '项目已成功移动', 'success');
}

// 处理订单拖放
function handleOrderDrop(dropTarget, dragData, sourceElement) {
    const newStatus = getColumnStatus(dropTarget);
    
    if (newStatus && dragData.orderId) {
        // 更新订单状态
        const order = mockData.orders.find(o => o.id === dragData.orderId);
        if (order && order.status !== newStatus) {
            order.status = newStatus;
            
            // 移动元素到目标列
            const orderList = dropTarget.querySelector('.order-list') || dropTarget;
            if (orderList !== sourceElement.parentNode) {
                orderList.appendChild(sourceElement);
            }
            
            // 更新视觉状态
            sourceElement.className = `order-item draggable ${newStatus}`;
            
            // 更新状态计数
            updateStatusCounts();
            
            const statusText = {
                'pending': '待确认',
                'preparing': '制作中',
                'ready': '已完成',
                'completed': '已完成'
            };
            
            showNotification('订单状态更新', 
                `订单 ${dragData.orderId} 已更新为 ${statusText[newStatus]}`, 'success');
        }
    }
}

// 处理菜单项拖放
function handleMenuItemDrop(dropTarget, dragData, sourceElement) {
    // 重新排序菜单项
    if (dropTarget.classList.contains('menu-category')) {
        dropTarget.appendChild(sourceElement);
        showNotification('菜单更新', '菜品分类已更新', 'success');
    }
}

// 处理通用拖放
function handleGenericDrop(dropTarget, dragData, sourceElement) {
    showNotification('拖拽完成', '项目已移动到新位置', 'info');
}

// 取消拖拽
function cancelDrag() {
    if (dragState.dragElement) {
        dragState.dragElement.style.animation = 'dragCancel 0.3s ease-out';
        setTimeout(() => {
            if (dragState.dragElement) {
                dragState.dragElement.style.animation = '';
            }
        }, 300);
    }
    showDragIndicator('拖拽已取消', 'error');
    setTimeout(hideDragIndicator, 1000);
}

// 清理拖拽状态
function cleanupDrag() {
    // 清理样式
    if (dragState.dragElement) {
        dragState.dragElement.classList.remove('dragging');
    }
    
    // 移除幽灵元素
    if (dragState.ghostElement) {
        dragState.ghostElement.remove();
    }
    
    // 移除占位符
    if (dragState.placeholder) {
        dragState.placeholder.remove();
    }
    
    // 清理拖放目标状态
    document.querySelectorAll('.drag-over, .valid-target, .invalid-target').forEach(el => {
        el.classList.remove('drag-over', 'valid-target', 'invalid-target');
    });
    
    // 隐藏指示器
    hideDragIndicator();
    
    // 重置状态
    dragState = {
        isDragging: false,
        dragElement: null,
        dragData: null,
        ghostElement: null,
        placeholder: null,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        offsetX: 0,
        offsetY: 0
    };
}

// 获取拖拽数据
function getDragData(element) {
    if (element.classList.contains('order-item')) {
        const orderId = element.querySelector('.order-number')?.textContent?.split(' - ')[0] || 'unknown';
        return {
            type: 'order',
            orderId: orderId,
            element: element
        };
    } else if (element.classList.contains('menu-item-card')) {
        return {
            type: 'menu-item',
            itemId: element.dataset.itemId || 'unknown',
            element: element
        };
    } else {
        return {
            type: 'generic',
            element: element
        };
    }
}

// 获取列状态
function getColumnStatus(column) {
    if (column.classList.contains('status-column')) {
        const title = column.querySelector('.status-column-title')?.textContent;
        if (title?.includes('待处理')) return 'pending';
        if (title?.includes('制作中')) return 'preparing';
        if (title?.includes('已完成')) return 'ready';
        if (title?.includes('已送达')) return 'completed';
    }
    return null;
}

// 判断是否为重新排序操作
function isDragReordering() {
    return dragState.dragData?.type === 'order' || dragState.dragData?.type === 'menu-item';
}

// 创建拖拽占位符
function createDragPlaceholder() {
    const placeholder = document.createElement('div');
    placeholder.className = 'drag-placeholder';
    placeholder.textContent = '在此放置';
    
    dragState.dragElement.parentNode.insertBefore(placeholder, dragState.dragElement.nextSibling);
    dragState.placeholder = placeholder;
}

// 更新状态计数
function updateStatusCounts() {
    const statusCounts = {
        pending: 0,
        preparing: 0,
        ready: 0,
        completed: 0
    };
    
    mockData.orders.forEach(order => {
        if (statusCounts.hasOwnProperty(order.status)) {
            statusCounts[order.status]++;
        }
    });
    
    // 更新界面计数
    Object.keys(statusCounts).forEach(status => {
        const countElement = document.querySelector(`[data-status="${status}"] .status-column-count`);
        if (countElement) {
            countElement.textContent = statusCounts[status];
        }
    });
}

// 拖拽指示器管理
function showDragIndicator(message, type = 'info') {
    let indicator = document.getElementById('dragIndicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'dragIndicator';
        indicator.className = 'drag-indicator';
        document.body.appendChild(indicator);
    }
    
    indicator.textContent = message;
    indicator.className = `drag-indicator ${type}`;
    indicator.classList.add('visible');
}

function updateDragIndicator(message, type = 'info') {
    const indicator = document.getElementById('dragIndicator');
    if (indicator) {
        indicator.textContent = message;
        indicator.className = `drag-indicator ${type} visible`;
    }
}

function hideDragIndicator() {
    const indicator = document.getElementById('dragIndicator');
    if (indicator) {
        indicator.classList.remove('visible');
    }
}

// CSS动画定义（添加到样式表的JavaScript版本）
const dragAnimationCSS = `
@keyframes dragCancel {
    0% { transform: scale(1.05) rotate(3deg); }
    50% { transform: scale(1.1) rotate(-2deg); }
    100% { transform: scale(1) rotate(0deg); }
}
`;

// 将动画CSS添加到页面
function addDragAnimationCSS() {
    const style = document.createElement('style');
    style.textContent = dragAnimationCSS;
    document.head.appendChild(style);
}

// 拖拽功能已在主初始化函数中启用

// 为现有订单项添加拖拽支持
function enableDragForOrderItems() {
    document.querySelectorAll('.order-item').forEach(item => {
        item.classList.add('draggable');
        item.setAttribute('draggable', 'true');
    });
}

// 渲染订单页面
function renderOrdersPage() {
    const ordersGrid = document.getElementById('ordersGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!ordersGrid) return;
    
    // 获取当前筛选状态
    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-status') || 'all';
    const searchTerm = document.getElementById('orderSearch')?.value.toLowerCase() || '';
    
    // 筛选订单
    let filteredOrders = mockData.orders;
    
    if (activeFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === activeFilter);
    }
    
    if (searchTerm) {
        filteredOrders = filteredOrders.filter(order => 
            order.id.toLowerCase().includes(searchTerm) ||
            order.customer.toLowerCase().includes(searchTerm) ||
            order.table.toLowerCase().includes(searchTerm)
        );
    }
    
    // 更新计数
    updateOrderCounts();
    
    // 渲染订单卡片
    if (filteredOrders.length === 0) {
        ordersGrid.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        ordersGrid.style.display = 'grid';
        emptyState.style.display = 'none';
        
        ordersGrid.innerHTML = filteredOrders.map(order => createOrderCard(order)).join('');
        
        // 添加选择功能
        setupOrderSelection();
    }
}

// 创建订单卡片HTML - 现代化设计
function createOrderCard(order) {
    const statusBadgeClass = `order-status-badge ${order.status}`;
    const statusText = {
        'pending': '待确认',
        'preparing': '制作中', 
        'ready': '已完成',
        'completed': '已送达',
        'cancelled': '已取消'
    };
    
    const itemsDisplay = order.items.slice(0, 3).map(item => 
        `<span class="order-item-tag">${item.name} ×${item.quantity}</span>`
    ).join('');
    
    const moreItems = order.items.length > 3 ? `<span class="order-item-tag">+${order.items.length - 3}更多</span>` : '';
    
    const urgencyIndicator = order.remark ? `
        <div style="
            position: absolute;
            top: 12px;
            right: 60px;
            width: 12px;
            height: 12px;
            background: var(--danger-color);
            border-radius: 50%;
            animation: pulse 2s infinite;
            box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.3);
        "></div>
    ` : '';

    return `
        <div class="order-card" data-order-id="${order.id}" onclick="showOrderDetails('${order.id}')" style="position: relative;">
            ${urgencyIndicator}
            
            <div class="order-checkbox" onclick="event.stopPropagation(); toggleOrderSelection('${order.id}', this)" style="
                position: absolute;
                top: 20px;
                right: 20px;
                width: 24px;
                height: 24px;
                border-radius: 6px;
                border: 2px solid var(--gray-medium);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                transition: var(--transition);
                z-index: 10;
            ">
                <i class="fas fa-check" style="display: none; color: white; font-size: 12px;"></i>
            </div>
            
            <div class="order-header" style="
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 20px;
                padding-right: 60px;
            ">
                <div class="order-info" style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                        <div class="order-table" style="
                            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                            color: white;
                            padding: 6px 14px;
                            border-radius: var(--border-radius-lg);
                            font-size: 13px;
                            font-weight: 600;
                            box-shadow: var(--shadow-sm);
                        ">${order.table}</div>
                        <div class="order-id" style="
                            font-size: 18px;
                            font-weight: 700;
                            color: var(--dark-color);
                        ">${order.id}</div>
                    </div>
                    <div class="order-customer" style="
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        color: var(--gray-color);
                        font-size: 14px;
                        font-weight: 500;
                    ">
                        <i class="fas fa-user" style="color: var(--primary-color);"></i>
                        ${order.customer}
                        <span style="
                            color: var(--gray-color);
                            font-size: 12px;
                            opacity: 0.8;
                        ">${order.phone}</span>
                    </div>
                </div>
                <div class="${statusBadgeClass}">
                    ${statusText[order.status]}
                </div>
            </div>
            
            <div class="order-items" style="margin-bottom: 20px;">
                <div class="order-items-title" style="
                    font-size: 14px;
                    color: var(--gray-color);
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 500;
                ">
                    <i class="fas fa-utensils" style="color: var(--primary-color);"></i>
                    订单明细 (${order.items.length}项)
                </div>
                <div class="order-items-list" style="
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                ">
                    ${itemsDisplay}
                    ${moreItems}
                </div>
            </div>
            
            ${order.remark ? `
                <div style="
                    margin-bottom: 16px;
                    padding: 12px 16px;
                    background: rgba(255, 212, 59, 0.1);
                    border-left: 4px solid var(--warning-color);
                    border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
                    font-size: 13px;
                    color: var(--warning-color);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                ">
                    <i class="fas fa-exclamation-triangle"></i>
                    <strong>备注:</strong> ${order.remark}
                </div>
            ` : ''}
            
            <div class="order-footer" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-top: 16px;
                border-top: 1px solid rgba(0, 0, 0, 0.08);
                margin-bottom: 16px;
            ">
                <div class="order-time">
                    <div style="
                        font-size: 11px;
                        color: var(--gray-color);
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        margin-bottom: 4px;
                    ">下单时间</div>
                    <div style="
                        font-size: 13px;
                        color: var(--dark-color);
                        font-family: 'SF Mono', 'Monaco', 'Cascadia Code', monospace;
                        display: flex;
                        align-items: center;
                        gap: 4px;
                    ">
                        <i class="fas fa-clock" style="color: var(--gray-color); font-size: 11px;"></i>
                        ${order.time} | 等待${order.waitTime}
                    </div>
                </div>
                <div class="order-amount" style="text-align: right;">
                    <div style="
                        font-size: 11px;
                        color: var(--gray-color);
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        margin-bottom: 4px;
                    ">订单金额</div>
                    <div style="
                        font-size: 24px;
                        font-weight: 800;
                        background: linear-gradient(135deg, var(--success-color), #40c057);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        line-height: 1;
                    ">¥${order.amount.toFixed(2)}</div>
                </div>
            </div>
            
            <div class="order-actions" style="
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            ">
                ${getOrderActionButtons(order)}
            </div>
        </div>
    `;
}

// 获取订单操作按钮
function getOrderActionButtons(order) {
    const buttons = [];
    
    if (order.status === 'pending') {
        buttons.push(`<button class="btn btn-success" onclick="event.stopPropagation(); updateOrderStatus('${order.id}', 'preparing')">
            <i class="fas fa-play"></i> 开始制作
        </button>`);
        buttons.push(`<button class="btn btn-danger" onclick="event.stopPropagation(); updateOrderStatus('${order.id}', 'cancelled')">
            <i class="fas fa-times"></i> 取消
        </button>`);
    } else if (order.status === 'preparing') {
        buttons.push(`<button class="btn btn-primary" onclick="event.stopPropagation(); updateOrderStatus('${order.id}', 'ready')">
            <i class="fas fa-check"></i> 制作完成
        </button>`);
    } else if (order.status === 'ready') {
        buttons.push(`<button class="btn btn-success" onclick="event.stopPropagation(); updateOrderStatus('${order.id}', 'completed')">
            <i class="fas fa-utensils"></i> 已送达
        </button>`);
    }
    
    if (order.status !== 'completed' && order.status !== 'cancelled') {
        buttons.push(`<button class="btn btn-outline" onclick="event.stopPropagation(); printOrder('${order.id}')">
            <i class="fas fa-print"></i> 打印
        </button>`);
    }
    
    return buttons.join('');
}

// 更新订单计数
function updateOrderCounts() {
    const counts = {
        all: mockData.orders.length,
        pending: mockData.orders.filter(o => o.status === 'pending').length,
        preparing: mockData.orders.filter(o => o.status === 'preparing').length,
        ready: mockData.orders.filter(o => o.status === 'ready').length,
        cancelled: mockData.orders.filter(o => o.status === 'cancelled').length
    };
    
    Object.entries(counts).forEach(([status, count]) => {
        const countElement = document.querySelector(`[data-status="${status}"] .count`);
        if (countElement) {
            countElement.textContent = count;
        }
    });
}

// 设置订单选择功能
function setupOrderSelection() {
    // 添加事件监听器已在createOrderCard中处理
}

// 切换订单选择状态
function toggleOrderSelection(orderId, checkboxElement) {
    const orderCard = checkboxElement.closest('.order-card');
    const checkIcon = checkboxElement.querySelector('i');
    
    if (orderCard.classList.contains('selected')) {
        // 取消选择
        orderCard.classList.remove('selected');
        checkboxElement.classList.remove('checked');
        checkIcon.style.display = 'none';
    } else {
        // 选择
        orderCard.classList.add('selected');
        checkboxElement.classList.add('checked');
        checkIcon.style.display = 'inline';
    }
    
    updateBulkActionsVisibility();
}

// 更新批量操作栏可见性
function updateBulkActionsVisibility() {
    const selectedOrders = document.querySelectorAll('.order-card.selected');
    const bulkActions = document.getElementById('bulkActions');
    const selectedCount = document.getElementById('selectedCount');
    
    if (selectedOrders.length > 0) {
        bulkActions.style.display = 'flex';
        selectedCount.textContent = selectedOrders.length;
    } else {
        bulkActions.style.display = 'none';
    }
}

// 批量更新订单状态
function bulkUpdateStatus(newStatus) {
    const selectedCards = document.querySelectorAll('.order-card.selected');
    const orderIds = Array.from(selectedCards).map(card => card.getAttribute('data-order-id'));
    
    orderIds.forEach(orderId => {
        updateOrderStatus(orderId, newStatus);
    });
    
    clearSelection();
    showNotification('批量操作', `已批量更新 ${orderIds.length} 个订单状态`, 'success');
}

// 批量取消订单
function bulkCancel() {
    const selectedCards = document.querySelectorAll('.order-card.selected');
    const orderIds = Array.from(selectedCards).map(card => card.getAttribute('data-order-id'));
    
    if (confirm(`确定要取消选中的 ${orderIds.length} 个订单吗？`)) {
        orderIds.forEach(orderId => {
            updateOrderStatus(orderId, 'cancelled');
        });
        
        clearSelection();
        showNotification('批量操作', `已取消 ${orderIds.length} 个订单`, 'warning');
    }
}

// 清除选择
function clearSelection() {
    document.querySelectorAll('.order-card.selected').forEach(card => {
        const checkbox = card.querySelector('.order-checkbox');
        const checkIcon = checkbox.querySelector('i');
        
        card.classList.remove('selected');
        checkbox.classList.remove('checked');
        checkIcon.style.display = 'none';
    });
    
    updateBulkActionsVisibility();
}

// 筛选器事件监听
document.addEventListener('DOMContentLoaded', function() {
    // 添加筛选器按钮事件
    document.addEventListener('click', function(e) {
        if (e.target.closest('.filter-btn')) {
            const filterBtn = e.target.closest('.filter-btn');
            
            // 移除所有活动状态
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            
            // 添加当前活动状态
            filterBtn.classList.add('active');
            
            // 重新渲染订单
            if (typeof renderOrdersPage === 'function') {
                renderOrdersPage();
            }
        }
    });
    
    // 添加搜索功能
    const searchInput = document.getElementById('orderSearch');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (typeof renderOrdersPage === 'function') {
                    renderOrdersPage();
                }
            }, 300);
        });
    }
});

// 菜单管理页面初始化
function initMenuManagement() {
    setupMenuManagementEvents();
    renderMenuItems();
}

// 设置菜单管理事件监听
function setupMenuManagementEvents() {
    // 分类标签切换
    document.addEventListener('click', function(e) {
        if (e.target.closest('.category-tab')) {
            const categoryTab = e.target.closest('.category-tab');
            const category = categoryTab.getAttribute('data-category');
            
            // 更新活动状态
            document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
            categoryTab.classList.add('active');
            
            // 重新渲染菜品
            renderMenuItems();
        }
    });
    
    // 视图切换
    document.addEventListener('click', function(e) {
        if (e.target.closest('.view-btn')) {
            const viewBtn = e.target.closest('.view-btn');
            const view = viewBtn.getAttribute('data-view');
            
            // 更新活动状态
            document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
            viewBtn.classList.add('active');
            
            // 切换视图
            switchMenuView(view);
        }
    });
    
    // 搜索功能
    const menuSearchInput = document.getElementById('menuSearch');
    if (menuSearchInput) {
        let searchTimeout;
        menuSearchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                renderMenuItems();
            }, 300);
        });
    }
}

// 渲染菜品列表
function renderMenuItems() {
    const currentView = document.querySelector('.view-btn.active')?.getAttribute('data-view') || 'grid';
    const activeCategory = document.querySelector('.category-tab.active')?.getAttribute('data-category') || 'all';
    const searchTerm = document.getElementById('menuSearch')?.value.toLowerCase() || '';
    
    // 防护措施：确保菜单数据存在
    if (!mockData || !mockData.menu || !mockData.menu.items || !Array.isArray(mockData.menu.items)) {
        console.warn('菜单数据不存在，跳过渲染');
        const menuGrid = document.getElementById('menuGrid');
        const menuList = document.getElementById('menuList');
        if (menuGrid) menuGrid.innerHTML = '<div style="text-align: center; color: var(--gray-color); padding: 40px;">暂无菜品数据</div>';
        if (menuList) menuList.style.display = 'none';
        return;
    }
    
    // 获取所有菜品 - 从正确的数据结构中获取
    let allItems = mockData.menu.items.map(item => {
        const category = mockData.menu.categories.find(cat => cat.id === item.categoryId);
        return {
            ...item,
            categoryName: category ? category.name : '未分类'
        };
    });
    
    // 筛选菜品
    let filteredItems = allItems;
    
    // 按分类筛选
    if (activeCategory !== 'all') {
        const categoryMap = {
            'hot': ['signature'], // 热菜包含招牌川菜
            'cold': ['cold'], // 凉菜系列
            'soup': ['soup'], // 汤品类
            'staple': ['staple'], // 主食类
            'drink': ['drink'] // 饮品类
        };
        
        if (categoryMap[activeCategory]) {
            filteredItems = filteredItems.filter(item => 
                categoryMap[activeCategory].includes(item.categoryId)
            );
        }
    }
    
    // 按搜索词筛选
    if (searchTerm) {
        filteredItems = filteredItems.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.categoryName.toLowerCase().includes(searchTerm)
        );
    }
    
    // 根据视图模式渲染
    if (currentView === 'grid') {
        renderMenuGrid(filteredItems);
    } else {
        renderMenuList(filteredItems);
    }
}

// 渲染网格视图
function renderMenuGrid(items) {
    const menuGrid = document.getElementById('menuGrid');
    const menuList = document.getElementById('menuList');
    
    if (!menuGrid) return;
    
    menuGrid.style.display = 'grid';
    menuList.style.display = 'none';
    
    if (items.length === 0) {
        menuGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--gray-color);">
                <i class="fas fa-utensils" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
                <h3>暂无菜品</h3>
                <p>当前筛选条件下没有找到菜品</p>
            </div>
        `;
        return;
    }
    
    menuGrid.innerHTML = items.map(item => createMenuItemCard(item)).join('');
    setupMenuItemEvents();
}

// 渲染列表视图
function renderMenuList(items) {
    const menuGrid = document.getElementById('menuGrid');
    const menuList = document.getElementById('menuList');
    const menuTableBody = document.getElementById('menuTableBody');
    
    if (!menuTableBody) return;
    
    menuGrid.style.display = 'none';
    menuList.style.display = 'block';
    
    if (items.length === 0) {
        menuTableBody.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: var(--gray-color);">
                <i class="fas fa-utensils" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
                <h3>暂无菜品</h3>
                <p>当前筛选条件下没有找到菜品</p>
            </div>
        `;
        return;
    }
    
    menuTableBody.innerHTML = items.map(item => createMenuItemRow(item)).join('');
    setupMenuItemEvents();
}

// 创建菜品卡片
function createMenuItemCard(item) {
    const statusClass = item.status === 'available' ? 'available' : 'unavailable';
    const statusText = item.status === 'available' ? '在售' : '停售';
    
    // 计算剩余库存（今日限量 - 今日已售）
    const remainingStock = (item.dailyLimit || 0) - (item.soldToday || 0);
    const stockStatus = remainingStock <= 5 ? 'low-stock' : 'normal';
    
    // 获取销量数据
    const salesData = mockData.popularItems.find(p => p.name === item.name);
    const sales = salesData ? salesData.sales : (item.soldToday || Math.floor(Math.random() * 50) + 10);
    
    return `
        <div class="menu-item-card ${item.status !== 'available' ? 'disabled' : ''}" data-item-id="${item.id}">
            <div class="menu-item-image">
                ${item.image ? 
                    `<img src="${item.image}" alt="${item.name}">` : 
                    `<i class="fas fa-utensils placeholder-icon"></i>`
                }
                <div class="menu-item-checkbox" onclick="event.stopPropagation(); toggleMenuItemSelection(${item.id}, this)">
                    <i class="fas fa-check" style="display: none;"></i>
                </div>
                <div class="menu-item-status ${statusClass}">${statusText}</div>
            </div>
            
            <div class="menu-item-info">
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-description">${item.description}</div>
                
                <div class="menu-item-meta">
                    <div class="menu-item-price">¥${item.price.toFixed(2)}</div>
                    <div class="menu-item-category">${item.categoryName}</div>
                </div>
                
                <div class="menu-item-stats">
                    <div class="menu-item-sales">
                        <i class="fas fa-chart-line"></i>
                        销量 ${sales}
                    </div>
                    <div class="menu-item-stock ${stockStatus}">
                        <i class="fas fa-box"></i>
                        剩余 ${remainingStock}
                    </div>
                </div>
                
                <div class="menu-item-actions">
                    <button class="btn btn-outline" onclick="event.stopPropagation(); editMenuItem('${item.id}')">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="btn ${item.status === 'available' ? 'btn-warning' : 'btn-success'}" 
                            onclick="event.stopPropagation(); toggleMenuItemStatus('${item.id}')">
                        <i class="fas ${item.status === 'available' ? 'fa-eye-slash' : 'fa-eye'}"></i>
                        ${item.status === 'available' ? '下架' : '上架'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// 创建菜品行（列表视图）
function createMenuItemRow(item) {
    const statusClass = item.status === 'available' ? 'available' : 'unavailable';
    const statusText = item.status === 'available' ? '在售' : '停售';
    const salesData = mockData.popularItems.find(p => p.name === item.name);
    const sales = salesData ? salesData.sales : Math.floor(Math.random() * 50) + 10;
    
    return `
        <div class="table-row" data-item-id="${item.id}" onclick="editMenuItem('${item.id}')"
            <div class="table-cell item-info" data-label="菜品信息">
                <div class="table-item-image">
                    <i class="fas fa-utensils"></i>
                </div>
                <div class="table-item-details">
                    <div class="table-item-name">${item.name}</div>
                    <div class="table-item-desc">${item.description}</div>
                </div>
            </div>
            <div class="table-cell" data-label="分类">${item.categoryName}</div>
            <div class="table-cell" data-label="价格">¥${item.price.toFixed(2)}</div>
            <div class="table-cell" data-label="状态">
                <span class="menu-item-status ${statusClass}">${statusText}</span>
            </div>
            <div class="table-cell" data-label="销量">${sales}</div>
            <div class="table-cell table-actions" data-label="操作">
                <button class="btn btn-outline" onclick="event.stopPropagation(); editMenuItem('${item.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn ${item.status === 'available' ? 'btn-warning' : 'btn-success'}" 
                        onclick="event.stopPropagation(); toggleMenuItemStatus('${item.id}')"
                    <i class="fas ${item.status === 'available' ? 'fa-eye-slash' : 'fa-eye'}"></i>
                </button>
            </div>
        </div>
    `;
}

// 切换视图模式
function switchMenuView(view) {
    renderMenuItems();
}

// 设置菜品事件
function setupMenuItemEvents() {
    // 事件已在HTML中通过onclick设置
}

// 切换菜品选择状态
function toggleMenuItemSelection(itemId, checkboxElement) {
    const menuCard = checkboxElement.closest('.menu-item-card') || checkboxElement.closest('.table-row');
    const checkIcon = checkboxElement.querySelector('i');
    
    if (menuCard.classList.contains('selected')) {
        // 取消选择
        menuCard.classList.remove('selected');
        checkboxElement.classList.remove('checked');
        checkIcon.style.display = 'none';
    } else {
        // 选择
        menuCard.classList.add('selected');
        checkboxElement.classList.add('checked');
        checkIcon.style.display = 'inline';
    }
    
    updateBulkMenuActionsVisibility();
}

// 更新批量操作栏可见性
function updateBulkMenuActionsVisibility() {
    const selectedItems = document.querySelectorAll('.menu-item-card.selected, .table-row.selected');
    const bulkActions = document.getElementById('bulkMenuActions');
    const selectedCount = document.getElementById('selectedMenuCount');
    
    if (selectedItems.length > 0) {
        bulkActions.style.display = 'flex';
        selectedCount.textContent = selectedItems.length;
    } else {
        bulkActions.style.display = 'none';
    }
}

// 编辑菜品
function editMenuItem(itemId) {
    const item = findMenuItemById(itemId);
    if (!item) return;
    
    // 获取分类列表
    const categories = mockData.menu.categories || [];
    const categoryOptions = categories.map(cat => 
        `<option value="${cat.id}" ${cat.id === item.categoryId ? 'selected' : ''}>${cat.name}</option>`
    ).join('');
    
    const modalContent = `
        <div style="padding: 24px; min-width: 600px; max-width: 700px; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2 style="margin: 0; color: var(--dark-color);">编辑菜品 - ${item.name}</h2>
                <button onclick="closeModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--gray-color);">×</button>
            </div>
            
            <form id="editMenuItemForm">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color);">菜品名称 *</label>
                        <input type="text" id="editItemName" value="${item.name}" required 
                               style="width: 100%; padding: 12px; border: 1px solid #e1e8ed; border-radius: 8px; font-size: 14px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color);">分类</label>
                        <select id="editItemCategory" style="width: 100%; padding: 12px; border: 1px solid #e1e8ed; border-radius: 8px; font-size: 14px;">
                            ${categoryOptions}
                        </select>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color);">售价 *</label>
                        <input type="number" id="editItemPrice" value="${item.price}" step="0.01" min="0" required
                               style="width: 100%; padding: 12px; border: 1px solid #e1e8ed; border-radius: 8px; font-size: 14px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color);">原价</label>
                        <input type="number" id="editItemOriginalPrice" value="${item.originalPrice || item.price}" step="0.01" min="0"
                               style="width: 100%; padding: 12px; border: 1px solid #e1e8ed; border-radius: 8px; font-size: 14px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color);">制作时间(分钟)</label>
                        <input type="number" id="editItemPrepTime" value="${item.preparationTime || 15}" min="1"
                               style="width: 100%; padding: 12px; border: 1px solid #e1e8ed; border-radius: 8px; font-size: 14px;">
                    </div>
                </div>
                
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color);">菜品描述</label>
                    <textarea id="editItemDesc" rows="3" 
                              style="width: 100%; padding: 12px; border: 1px solid #e1e8ed; border-radius: 8px; font-size: 14px; resize: vertical;">${item.description || ''}</textarea>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color);">辣度等级</label>
                        <select id="editItemSpicyLevel" style="width: 100%; padding: 12px; border: 1px solid #e1e8ed; border-radius: 8px; font-size: 14px;">
                            <option value="0" ${item.spicyLevel === 0 ? 'selected' : ''}>不辣</option>
                            <option value="1" ${item.spicyLevel === 1 ? 'selected' : ''}>微辣</option>
                            <option value="2" ${item.spicyLevel === 2 ? 'selected' : ''}>中辣</option>
                            <option value="3" ${item.spicyLevel === 3 ? 'selected' : ''}>重辣</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color);">每日限量</label>
                        <input type="number" id="editItemDailyLimit" value="${item.dailyLimit || 50}" min="1"
                               style="width: 100%; padding: 12px; border: 1px solid #e1e8ed; border-radius: 8px; font-size: 14px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color);">状态</label>
                        <select id="editItemStatus" style="width: 100%; padding: 12px; border: 1px solid #e1e8ed; border-radius: 8px; font-size: 14px;">
                            <option value="available" ${item.status === 'available' ? 'selected' : ''}>在售</option>
                            <option value="unavailable" ${item.status === 'unavailable' ? 'selected' : ''}>停售</option>
                        </select>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color);">图片链接</label>
                    <input type="url" id="editItemImage" value="${item.image || ''}" 
                           style="width: 100%; padding: 12px; border: 1px solid #e1e8ed; border-radius: 8px; font-size: 14px;">
                </div>
                
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button type="button" class="btn btn-outline" onclick="closeModal()">取消</button>
                    <button type="button" class="btn btn-danger" onclick="deleteMenuItem('${itemId}')">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                    <button type="button" class="btn btn-primary" onclick="saveMenuItem('${itemId}')">
                        <i class="fas fa-save"></i> 保存更改
                    </button>
                </div>
            </form>
        </div>
    `;
    
    showModal(null, modalContent);
}

// 保存菜品更改
function saveMenuItem(itemId) {
    const name = document.getElementById('editItemName').value.trim();
    const category = document.getElementById('editItemCategory').value;
    const price = parseFloat(document.getElementById('editItemPrice').value);
    const originalPrice = parseFloat(document.getElementById('editItemOriginalPrice').value);
    const prepTime = parseInt(document.getElementById('editItemPrepTime').value);
    const description = document.getElementById('editItemDesc').value.trim();
    const spicyLevel = parseInt(document.getElementById('editItemSpicyLevel').value);
    const dailyLimit = parseInt(document.getElementById('editItemDailyLimit').value);
    const status = document.getElementById('editItemStatus').value;
    const image = document.getElementById('editItemImage').value.trim();
    
    // 验证必填字段
    if (!name || !price || price <= 0) {
        showNotification('输入错误', '请填写菜品名称和有效价格', 'error');
        return;
    }
    
    // 查找并更新菜品
    const item = findMenuItemById(itemId);
    if (item) {
        item.name = name;
        item.categoryId = category;
        item.price = price;
        item.originalPrice = originalPrice || price;
        item.preparationTime = prepTime;
        item.description = description;
        item.spicyLevel = spicyLevel;
        item.dailyLimit = dailyLimit;
        item.status = status;
        if (image) item.image = image;
        
        // 更新页面显示
        renderMenuItems();
        closeModal();
        showNotification('保存成功', `菜品 "${name}" 已更新`, 'success');
    } else {
        showNotification('保存失败', '未找到要更新的菜品', 'error');
    }
}

// 切换菜品状态
function toggleMenuItemStatus(itemId) {
    const item = findMenuItemById(itemId);
    if (!item) return;
    
    const newStatus = item.status === 'available' ? 'unavailable' : 'available';
    item.status = newStatus;
    
    renderMenuItems();
    
    const statusText = newStatus === 'available' ? '上架' : '下架';
    showNotification('状态更新', `菜品 ${item.name} 已${statusText}`, 'success');
}

// 新增菜品功能
function showAddMenuItemModal() {
    // 获取分类列表
    const categories = mockData.menu.categories || [];
    const categoryOptions = categories.map(cat => 
        `<option value="${cat.id}">${cat.name}</option>`
    ).join('');
    
    const modalContent = `
        <div style="padding: 24px; min-width: 600px; max-width: 700px; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2 style="margin: 0; color: var(--dark-color);">添加新菜品</h2>
                <button onclick="closeModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--gray-color);">×</button>
            </div>
            
            <form id="addMenuItemForm">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color);">菜品名称 *</label>
                        <input type="text" id="newItemName" required placeholder="请输入菜品名称"
                               style="width: 100%; padding: 12px; border: 1px solid #e1e8ed; border-radius: 8px; font-size: 14px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color);">分类</label>
                        <select id="newItemCategory" style="width: 100%; padding: 12px; border: 1px solid #e1e8ed; border-radius: 8px; font-size: 14px;">
                            <option value="">请选择分类</option>
                            ${categoryOptions}
                        </select>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color);">售价 *</label>
                        <input type="number" id="newItemPrice" step="0.01" min="0" required placeholder="0.00"
                               style="width: 100%; padding: 12px; border: 1px solid #e1e8ed; border-radius: 8px; font-size: 14px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color);">原价</label>
                        <input type="number" id="newItemOriginalPrice" step="0.01" min="0" placeholder="0.00"
                               style="width: 100%; padding: 12px; border: 1px solid #e1e8ed; border-radius: 8px; font-size: 14px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color);">制作时间(分钟)</label>
                        <input type="number" id="newItemPrepTime" value="15" min="1"
                               style="width: 100%; padding: 12px; border: 1px solid #e1e8ed; border-radius: 8px; font-size: 14px;">
                    </div>
                </div>
                
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color);">菜品描述</label>
                    <textarea id="newItemDesc" rows="3" placeholder="请输入菜品描述"
                              style="width: 100%; padding: 12px; border: 1px solid #e1e8ed; border-radius: 8px; font-size: 14px; resize: vertical;"></textarea>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color);">辣度等级</label>
                        <select id="newItemSpicyLevel" style="width: 100%; padding: 12px; border: 1px solid #e1e8ed; border-radius: 8px; font-size: 14px;">
                            <option value="0">不辣</option>
                            <option value="1">微辣</option>
                            <option value="2" selected>中辣</option>
                            <option value="3">重辣</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color);">每日限量</label>
                        <input type="number" id="newItemDailyLimit" value="50" min="1"
                               style="width: 100%; padding: 12px; border: 1px solid #e1e8ed; border-radius: 8px; font-size: 14px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color);">状态</label>
                        <select id="newItemStatus" style="width: 100%; padding: 12px; border: 1px solid #e1e8ed; border-radius: 8px; font-size: 14px;">
                            <option value="available" selected>在售</option>
                            <option value="unavailable">停售</option>
                        </select>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color);">图片链接</label>
                    <input type="url" id="newItemImage" placeholder="https://example.com/image.jpg"
                           style="width: 100%; padding: 12px; border: 1px solid #e1e8ed; border-radius: 8px; font-size: 14px;">
                </div>
                
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button type="button" class="btn btn-outline" onclick="closeModal()">取消</button>
                    <button type="button" class="btn btn-primary" onclick="addMenuItem()">
                        <i class="fas fa-plus"></i> 添加菜品
                    </button>
                </div>
            </form>
        </div>
    `;
    
    showModal(null, modalContent);
}

// 添加菜品函数
function addMenuItem() {
    const name = document.getElementById('newItemName').value.trim();
    const category = document.getElementById('newItemCategory').value;
    const price = parseFloat(document.getElementById('newItemPrice').value);
    const originalPrice = parseFloat(document.getElementById('newItemOriginalPrice').value);
    const prepTime = parseInt(document.getElementById('newItemPrepTime').value);
    const description = document.getElementById('newItemDesc').value.trim();
    const spicyLevel = parseInt(document.getElementById('newItemSpicyLevel').value);
    const dailyLimit = parseInt(document.getElementById('newItemDailyLimit').value);
    const status = document.getElementById('newItemStatus').value;
    const image = document.getElementById('newItemImage').value.trim();
    
    // 验证必填字段
    if (!name || !category || !price || price <= 0) {
        showNotification('输入错误', '请填写菜品名称、分类和有效价格', 'error');
        return;
    }
    
    // 生成新ID
    const newId = 'menu_' + String(Date.now()).slice(-6);
    
    // 创建新菜品对象
    const newItem = {
        id: newId,
        name: name,
        categoryId: category,
        price: price,
        originalPrice: originalPrice || price,
        description: description,
        image: image || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
        status: status,
        spicyLevel: spicyLevel,
        preparationTime: prepTime,
        tags: [],
        nutrition: {
            calories: 200,
            protein: 15,
            carbs: 20,
            fat: 10
        },
        allergens: [],
        dailyLimit: dailyLimit,
        soldToday: 0
    };
    
    // 添加到数据中
    if (!mockData.menu.items) {
        mockData.menu.items = [];
    }
    mockData.menu.items.push(newItem);
    
    // 更新页面显示
    renderMenuItems();
    closeModal();
    showNotification('添加成功', `菜品 "${name}" 已添加`, 'success');
}

// 删除菜品
function deleteMenuItem(itemId) {
    const item = findMenuItemById(itemId);
    if (!item) return;
    
    if (confirm(`确定要删除菜品 "${item.name}" 吗？此操作不可撤销。`)) {
        // 从对应分类中删除
        mockData.menuCategories.forEach(category => {
            const index = category.items.findIndex(i => i.id === itemId);
            if (index !== -1) {
                category.items.splice(index, 1);
            }
        });
        
        renderMenuItems();
        closeModal();
        showNotification('删除成功', `菜品 ${item.name} 已删除`, 'warning');
    }
}

// 批量操作
function bulkMenuAction(action) {
    const selectedItems = document.querySelectorAll('.menu-item-card.selected, .table-row.selected');
    const itemIds = Array.from(selectedItems).map(item => parseInt(item.getAttribute('data-item-id')));
    
    if (action === 'enable') {
        itemIds.forEach(id => {
            const item = findMenuItemById(id);
            if (item) item.status = 'available';
        });
        showNotification('批量操作', `已批量上架 ${itemIds.length} 个菜品`, 'success');
    } else if (action === 'disable') {
        itemIds.forEach(id => {
            const item = findMenuItemById(id);
            if (item) item.status = 'unavailable';
        });
        showNotification('批量操作', `已批量下架 ${itemIds.length} 个菜品`, 'warning');
    } else if (action === 'delete') {
        if (confirm(`确定要删除选中的 ${itemIds.length} 个菜品吗？此操作不可撤销。`)) {
            itemIds.forEach(id => {
                mockData.menuCategories.forEach(category => {
                    const index = category.items.findIndex(i => i.id === id);
                    if (index !== -1) {
                        category.items.splice(index, 1);
                    }
                });
            });
            showNotification('批量操作', `已删除 ${itemIds.length} 个菜品`, 'warning');
        } else {
            return;
        }
    }
    
    clearMenuSelection();
    renderMenuItems();
}

// 清除菜品选择
function clearMenuSelection() {
    document.querySelectorAll('.menu-item-card.selected, .table-row.selected').forEach(item => {
        const checkbox = item.querySelector('.menu-item-checkbox');
        const checkIcon = checkbox?.querySelector('i');
        
        item.classList.remove('selected');
        if (checkbox) checkbox.classList.remove('checked');
        if (checkIcon) checkIcon.style.display = 'none';
    });
    
    updateBulkMenuActionsVisibility();
}

// 查找菜品
function findMenuItemById(itemId) {
    for (const category of mockData.menuCategories) {
        const item = category.items.find(i => i.id === itemId);
        if (item) {
            return item;
        }
    }
    return null;
}

// 库存管理页面初始化
function initInventoryPage() {
    setupInventoryEvents();
    updateInventoryStats();
    renderInventoryList();
    loadSupplierOptions();
}

// 设置库存管理事件监听
function setupInventoryEvents() {
    // 筛选按钮事件
    document.addEventListener('click', function(e) {
        if (e.target.closest('.filter-btn') && e.target.closest('#inventory')) {
            const filterBtn = e.target.closest('.filter-btn');
            const filter = filterBtn.getAttribute('data-filter');
            
            // 更新活动状态
            document.querySelectorAll('#inventory .filter-btn').forEach(btn => btn.classList.remove('active'));
            filterBtn.classList.add('active');
            
            // 重新渲染库存列表
            renderInventoryList();
        }
    });
}

// 更新库存统计
function updateInventoryStats() {
    const totalItems = mockData.inventory.length;
    const lowStockItems = mockData.inventory.filter(item => item.status === 'low_stock' || item.currentStock <= item.minStock).length;
    const outOfStockItems = mockData.inventory.filter(item => item.status === 'out_of_stock' || item.currentStock === 0).length;
    
    // 更新统计数字
    const totalStockEl = document.getElementById('total-stock-items');
    const lowStockEl = document.getElementById('low-stock-count');
    const pendingDeliveriesEl = document.getElementById('pending-deliveries');
    
    if (totalStockEl) totalStockEl.textContent = totalItems;
    if (lowStockEl) lowStockEl.textContent = lowStockItems + outOfStockItems;
    if (pendingDeliveriesEl) pendingDeliveriesEl.textContent = '3'; // 模拟待到货数量
    
}

// 渲染库存列表
function renderInventoryList() {
    const inventoryList = document.getElementById('inventory-list');
    if (!inventoryList) return;
    
    const activeFilter = document.querySelector('#inventory .filter-btn.active')?.getAttribute('data-filter') || 'all';
    
    // 筛选库存项
    let filteredItems = mockData.inventory;
    if (activeFilter !== 'all') {
        filteredItems = mockData.inventory.filter(item => {
            if (activeFilter === 'low_stock') {
                return item.status === 'low_stock' || item.currentStock <= item.minStock;
            }
            if (activeFilter === 'out_of_stock') {
                return item.status === 'out_of_stock' || item.currentStock === 0;
            }
            if (activeFilter === 'available') {
                return item.status === 'available' && item.currentStock > item.minStock;
            }
            return item.status === activeFilter;
        });
    }
    
    if (filteredItems.length === 0) {
        inventoryList.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: var(--gray-color);">
                <i class="fas fa-boxes" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
                <h3>暂无库存项</h3>
                <p>当前筛选条件下没有找到库存项目</p>
            </div>
        `;
        return;
    }
    
    inventoryList.innerHTML = filteredItems.map(item => createInventoryCard(item)).join('');
    
}

// 创建库存卡片
function createInventoryCard(item) {
    const statusClass = getInventoryStatusClass(item);
    const statusText = getInventoryStatusText(item);
    const stockPercentage = Math.min((item.currentStock / (item.minStock * 2)) * 100, 100);
    const isLowStock = item.currentStock <= item.minStock;
    const isOutOfStock = item.currentStock === 0;
    
    return `
        <div class="inventory-card ${statusClass}" data-item-id="${item.id}">
            <div class="inventory-header">
                <div class="inventory-info">
                    <h4 class="inventory-name">${item.name}</h4>
                    <div class="inventory-supplier">
                        <i class="fas fa-truck"></i>
                        ${item.supplier}
                    </div>
                </div>
                <div class="inventory-status ${statusClass}">
                    ${statusText}
                </div>
            </div>
            
            <div class="inventory-stats">
                <div class="stat-item">
                    <div class="stat-label">当前库存</div>
                    <div class="stat-value ${isOutOfStock ? 'danger' : isLowStock ? 'warning' : ''}"">
                        ${item.currentStock} ${item.unit}
                    </div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">最低库存</div>
                    <div class="stat-value">${item.minStock} ${item.unit}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">采购价格</div>
                    <div class="stat-value">¥${item.price.toFixed(2)}/${item.unit}</div>
                </div>
            </div>
            
            <div class="inventory-progress">
                <div class="progress-bar">
                    <div class="progress-fill ${isLowStock ? 'low' : ''}" style="width: ${stockPercentage}%"></div>
                </div>
                <div class="progress-text">
                    ${isOutOfStock ? '缺货' : isLowStock ? '库存不足' : '库存充足'}
                </div>
            </div>
            
            <div class="inventory-actions">
                <button class="btn btn-outline btn-sm" onclick="editInventoryItem(${item.id})">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="btn btn-primary btn-sm" onclick="addInventoryStock(${item.id})">
                    <i class="fas fa-plus"></i> 补货
                </button>
                ${isLowStock ? `
                <button class="btn btn-warning btn-sm" onclick="createPurchaseOrder(${item.id})">
                    <i class="fas fa-shopping-cart"></i> 采购
                </button>
                ` : ''}
            </div>
        </div>
    `;
}

// 获取库存状态样式类
function getInventoryStatusClass(item) {
    if (item.currentStock === 0) return 'out-of-stock';
    if (item.currentStock <= item.minStock) return 'low-stock';
    return 'normal';
}

// 获取库存状态文本
function getInventoryStatusText(item) {
    if (item.currentStock === 0) return '缺货';
    if (item.currentStock <= item.minStock) return '库存不足';
    return '库存充足';
}

// 打开添加库存模态框
function openAddInventoryModal() {
    const modal = document.getElementById('inventory-modal');
    if (modal) {
        // 清空表单
        const form = document.getElementById('inventory-form');
        if (form) form.reset();
        modal.style.display = 'flex';
    }
}

// 关闭库存模态框
function closeInventoryModal() {
    const modal = document.getElementById('inventory-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 加载供应商选项
function loadSupplierOptions() {
    const supplierSelect = document.getElementById('item-supplier');
    if (!supplierSelect) return;
    
    supplierSelect.innerHTML = '<option value="">选择供应商</option>' + 
        mockData.suppliers.map(supplier => 
            `<option value="${supplier.name}">${supplier.name}</option>`
        ).join('');
}

// 保存库存项
function saveInventoryItem() {
    const name = document.getElementById('item-name').value;
    const unit = document.getElementById('item-unit').value;
    const stock = parseInt(document.getElementById('item-stock').value);
    const minStock = parseInt(document.getElementById('item-min-stock').value);
    const price = parseFloat(document.getElementById('item-price').value);
    const supplier = document.getElementById('item-supplier').value;
    
    if (!name || !stock || !minStock || !price || !supplier) {
        showNotification('输入错误', '请填写所有必填字段', 'error');
        return;
    }
    
    // 创建新库存项
    const newItem = {
        id: mockData.inventory.length + 1,
        name: name,
        unit: unit,
        stock: stock,
        minStock: minStock,
        supplier: supplier,
        price: price,
        status: stock <= minStock ? 'low_stock' : 'available'
    };
    
    mockData.inventory.push(newItem);
    
    closeInventoryModal();
    updateInventoryStats();
    renderInventoryList();
    showNotification('添加成功', '库存项已添加', 'success');
}

// 编辑库存项
function editInventoryItem(itemId) {
    const item = mockData.inventory.find(i => i.id === itemId);
    if (!item) return;
    
    const modalContent = `
        <div style="padding: 24px; min-width: 500px; max-width: 600px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>编辑库存 - ${item.name}</h2>
                <button onclick="closeModal()" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                <div>
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">物品名称</label>
                    <input type="text" id="editInventoryName" value="${item.name}" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">单位</label>
                    <select id="editInventoryUnit" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                        <option value="斤" ${item.unit === '斤' ? 'selected' : ''}>斤</option>
                        <option value="袋" ${item.unit === '袋' ? 'selected' : ''}>袋</option>
                        <option value="箱" ${item.unit === '箱' ? 'selected' : ''}>箱</option>
                        <option value="桶" ${item.unit === '桶' ? 'selected' : ''}>桶</option>
                        <option value="块" ${item.unit === '块' ? 'selected' : ''}>块</option>
                        <option value="条" ${item.unit === '条' ? 'selected' : ''}>条</option>
                    </select>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                <div>
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">当前库存</label>
                    <input type="number" id="editInventoryStock" value="${item.currentStock}" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">最低库存</label>
                    <input type="number" id="editInventoryMinStock" value="${item.minStock}" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                <div>
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">采购价格</label>
                    <input type="number" id="editInventoryPrice" value="${item.price}" step="0.01" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">供应商</label>
                    <select id="editInventorySupplier" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                        ${mockData.suppliers.map(supplier => 
                            `<option value="${supplier.name}" ${supplier.name === item.supplier ? 'selected' : ''}>${supplier.name}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
            
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button class="btn btn-primary" onclick="saveInventoryChanges(${itemId})">
                    <i class="fas fa-save"></i> 保存更改
                </button>
                <button class="btn btn-outline" onclick="closeModal()">取消</button>
                <button class="btn btn-danger" onclick="deleteInventoryItem(${itemId})">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </div>
        </div>
    `;
    
    showModal(null, modalContent);
}

// 保存库存更改
function saveInventoryChanges(itemId) {
    const name = document.getElementById('editInventoryName').value;
    const unit = document.getElementById('editInventoryUnit').value;
    const stock = parseInt(document.getElementById('editInventoryStock').value);
    const minStock = parseInt(document.getElementById('editInventoryMinStock').value);
    const price = parseFloat(document.getElementById('editInventoryPrice').value);
    const supplier = document.getElementById('editInventorySupplier').value;
    
    if (!name || isNaN(stock) || isNaN(minStock) || isNaN(price)) {
        showNotification('输入错误', '请填写所有必填字段', 'error');
        return;
    }
    
    const item = mockData.inventory.find(i => i.id === itemId);
    if (item) {
        item.name = name;
        item.unit = unit;
        item.currentStock = stock;
        item.minStock = minStock;
        item.price = price;
        item.supplier = supplier;
        item.status = stock <= minStock ? 'low_stock' : 'available';
        
        closeModal();
        updateInventoryStats();
        renderInventoryList();
        showNotification('保存成功', '库存信息已更新', 'success');
    }
}

// 添加库存
function addInventoryStock(itemId) {
    const item = mockData.inventory.find(i => i.id === itemId);
    if (!item) return;
    
    const addAmount = prompt(`请输入要添加的${item.name}数量（${item.unit}）：`, '10');
    if (addAmount && !isNaN(addAmount) && parseInt(addAmount) > 0) {
        item.currentStock += parseInt(addAmount);
        item.status = item.currentStock <= item.minStock ? 'low_stock' : 'available';
        
        updateInventoryStats();
        renderInventoryList();
        showNotification('补货成功', `${item.name} 已补货 ${addAmount} ${item.unit}`, 'success');
    }
}

// 创建采购订单
function createPurchaseOrder(itemId) {
    const item = mockData.inventory.find(i => i.id === itemId);
    if (!item) return;
    
    const orderAmount = Math.max(item.minStock * 2 - item.currentStock, item.minStock);
    const totalCost = (orderAmount * item.price).toFixed(2);
    
    const confirmed = confirm(
        `创建采购订单：\n\n` +
        `物品：${item.name}\n` +
        `数量：${orderAmount} ${item.unit}\n` +
        `单价：¥${item.price.toFixed(2)}\n` +
        `总价：¥${totalCost}\n` +
        `供应商：${item.supplier}\n\n` +
        `确认创建采购订单吗？`
    );
    
    if (confirmed) {
        // 模拟创建采购订单
        showNotification('采购订单', `已向 ${item.supplier} 发送采购订单`, 'success');
        
        // 更新待到货数量
        const pendingEl = document.getElementById('pending-deliveries');
        if (pendingEl) {
            const currentPending = parseInt(pendingEl.textContent) || 0;
            pendingEl.textContent = currentPending + 1;
        }
    }
}

// 删除库存项
function deleteInventoryItem(itemId) {
    const item = mockData.inventory.find(i => i.id === itemId);
    if (!item) return;
    
    if (confirm(`确定要删除库存项 "${item.name}" 吗？此操作不可撤销。`)) {
        const index = mockData.inventory.findIndex(i => i.id === itemId);
        if (index !== -1) {
            mockData.inventory.splice(index, 1);
            
            closeModal();
            updateInventoryStats();
            renderInventoryList();
            showNotification('删除成功', `库存项 ${item.name} 已删除`, 'warning');
        }
    }
}

// 显示供应商管理
function showSupplierManager() {
    const suppliersSection = document.getElementById('suppliers-section');
    const inventoryContainer = document.querySelector('.inventory-container');
    
    if (suppliersSection && inventoryContainer) {
        if (suppliersSection.style.display === 'none') {
            suppliersSection.style.display = 'block';
            inventoryContainer.style.display = 'none';
            renderSuppliersList();
        } else {
            suppliersSection.style.display = 'none';
            inventoryContainer.style.display = 'block';
        }
    }
}

// 渲染供应商列表
function renderSuppliersList() {
    const suppliersList = document.getElementById('suppliers-list');
    if (!suppliersList) return;
    
    suppliersList.innerHTML = mockData.suppliers.map(supplier => `
        <div class="supplier-card" data-supplier-id="${supplier.id}">
            <div class="supplier-header">
                <div class="supplier-info">
                    <h4 class="supplier-name">${supplier.name}</h4>
                    <div class="supplier-contact">
                        <i class="fas fa-user"></i> ${supplier.contact}
                        <i class="fas fa-phone"></i> ${supplier.phone}
                    </div>
                </div>
                <div class="supplier-rating">
                    <div class="rating-stars">
                        ${generateStarRating(supplier.rating)}
                    </div>
                    <span class="rating-text">${supplier.rating}</span>
                </div>
            </div>
            
            <div class="supplier-details">
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${supplier.address}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-handshake"></i>
                    <span>合作时间：${supplier.cooperation}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-truck"></i>
                    <span>最后配送：${supplier.lastDelivery}</span>
                </div>
            </div>
            
            <div class="supplier-products">
                <div class="products-label">供应产品：</div>
                <div class="products-tags">
                    ${supplier.categories.map(category => 
                        `<span class="product-tag">${category}</span>`
                    ).join('')}
                </div>
            </div>
            
            <div class="supplier-actions">
                <button class="btn btn-outline btn-sm" onclick="editSupplier(${supplier.id})">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="btn btn-primary btn-sm" onclick="contactSupplier(${supplier.id})">
                    <i class="fas fa-phone"></i> 联系
                </button>
                <button class="btn btn-success btn-sm" onclick="createSupplierOrder(${supplier.id})">
                    <i class="fas fa-shopping-cart"></i> 下单
                </button>
            </div>
        </div>
    `).join('');
}

// 生成星级评分
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
}

// 编辑供应商
function editSupplier(supplierId) {
    showNotification('功能开发中', '供应商编辑功能正在开发中', 'info');
}

// 联系供应商
function contactSupplier(supplierId) {
    const supplier = mockData.suppliers.find(s => s.id === supplierId);
    if (supplier) {
        showNotification('联系供应商', `正在联系 ${supplier.name} - ${supplier.contact}`, 'info');
    }
}

// 创建供应商订单
function createSupplierOrder(supplierId) {
    const supplier = mockData.suppliers.find(s => s.id === supplierId);
    if (supplier) {
        showNotification('创建订单', `正在为 ${supplier.name} 创建采购订单`, 'info');
    }
}

// 添加新供应商
function addNewSupplier() {
    showNotification('功能开发中', '添加供应商功能正在开发中', 'info');
}

// 生成库存报表
function generateInventoryReport() {
    const reportData = {
        totalItems: mockData.inventory.length,
        lowStockItems: mockData.inventory.filter(item => item.currentStock <= item.minStock).length,
        totalValue: mockData.inventory.reduce((sum, item) => sum + (item.currentStock * item.price), 0),
        avgStock: mockData.inventory.reduce((sum, item) => sum + item.currentStock, 0) / mockData.inventory.length
    };
    
    const modalContent = `
        <div style="padding: 24px; min-width: 500px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>库存报表</h2>
                <button onclick="closeModal()" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: 600; color: var(--primary-color);">${reportData.totalItems}</div>
                    <div style="color: var(--gray-color);">库存品类</div>
                </div>
                <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: 600; color: var(--warning-color);">${reportData.lowStockItems}</div>
                    <div style="color: var(--gray-color);">库存不足</div>
                </div>
                <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: 600; color: var(--success-color);">¥${reportData.totalValue.toFixed(2)}</div>
                    <div style="color: var(--gray-color);">库存总价值</div>
                </div>
                <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: 600; color: var(--info-color);">${reportData.avgStock.toFixed(1)}</div>
                    <div style="color: var(--gray-color);">平均库存</div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4>库存详情</h4>
                <div style="max-height: 300px; overflow-y: auto; border: 1px solid #e1e8ed; border-radius: 8px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead style="background: #f8f9fa; position: sticky; top: 0;">
                            <tr>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e1e8ed;">物品</th>
                                <th style="padding: 12px; text-align: center; border-bottom: 1px solid #e1e8ed;">库存</th>
                                <th style="padding: 12px; text-align: center; border-bottom: 1px solid #e1e8ed;">状态</th>
                                <th style="padding: 12px; text-align: right; border-bottom: 1px solid #e1e8ed;">价值</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${mockData.inventory.map(item => `
                                <tr>
                                    <td style="padding: 8px 12px; border-bottom: 1px solid #f1f3f4;">${item.name}</td>
                                    <td style="padding: 8px 12px; text-align: center; border-bottom: 1px solid #f1f3f4;">${item.currentStock} ${item.unit}</td>
                                    <td style="padding: 8px 12px; text-align: center; border-bottom: 1px solid #f1f3f4;">
                                        <span style="color: ${item.currentStock <= item.minStock ? 'var(--warning-color)' : 'var(--success-color)'};">
                                            ${getInventoryStatusText(item)}
                                        </span>
                                    </td>
                                    <td style="padding: 8px 12px; text-align: right; border-bottom: 1px solid #f1f3f4;">¥${(item.currentStock * item.price).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button class="btn btn-primary" onclick="downloadInventoryReport()">
                    <i class="fas fa-download"></i> 下载报表
                </button>
                <button class="btn btn-outline" onclick="closeModal()">关闭</button>
            </div>
        </div>
    `;
    
    showModal(null, modalContent);
}

// 下载库存报表
function downloadInventoryReport() {
    showNotification('报表下载', '库存报表下载功能正在开发中', 'info');
    closeModal();
}

// ================== 客户管理页面 ==================

// 初始化客户管理页面
function initCustomersPage() {
    updateCustomersStats();
    renderCustomersList();
    renderRecentReviews();
    setupCustomerFilters();
}

// 更新客户统计数据
function updateCustomersStats() {
    const totalCustomers = document.getElementById('total-customers');
    const vipCustomers = document.getElementById('vip-customers');
    
    const customersCount = mockData.customers.length;
    const vipCount = mockData.customers.filter(c => c.level === 'VIP').length;
    
    
    if (totalCustomers) {
        totalCustomers.textContent = customersCount;
    } else {
    }
    
    if (vipCustomers) {
        vipCustomers.textContent = vipCount;
    } else {
    }
}

// 渲染客户列表
function renderCustomersList() {
    const customersList = document.getElementById('customers-list');
    if (!customersList) {
        return;
    }
    
    
    customersList.innerHTML = mockData.customers.map(customer => {
        const levelClass = customer.level === 'VIP' ? 'vip' : customer.level === '会员' ? 'member' : 'normal';
        const levelColor = customer.level === 'VIP' ? '#ffd700' : customer.level === '会员' ? '#3498db' : '#7f8c8d';
        
        return `
            <div class="customer-card" data-customer-id="${customer.id}" onclick="showCustomerDetail(${customer.id})">
                <div class="customer-header">
                    <div class="customer-info">
                        <div class="customer-name">
                            ${customer.name}
                            <span class="customer-badge ${levelClass}" style="background-color: ${levelColor};">${customer.level}</span>
                        </div>
                        <div class="customer-contact">
                            <i class="fas fa-phone"></i> ${customer.phone}
                        </div>
                    </div>
                    <div class="customer-stats">
                        <div class="stat-item">
                            <span class="stat-label">消费总额</span>
                            <span class="stat-value">¥${customer.totalSpent.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="customer-details">
                    <div class="detail-row">
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>到店次数：${customer.totalOrders}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-utensils"></i>
                            <span>口味偏好：${customer.favoriteItems ? customer.favoriteItems.join('、') : '暂无'}</span>
                        </div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span>最近到店：${customer.lastVisit}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-calculator"></i>
                            <span>平均消费：¥${(customer.totalSpent / customer.totalOrders).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="customer-actions">
                    <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); editCustomer(${customer.id})">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); contactCustomer(${customer.id})">
                        <i class="fas fa-comment"></i> 联系
                    </button>
                    <button class="btn btn-success btn-sm" onclick="event.stopPropagation(); sendCoupon(${customer.id})">
                        <i class="fas fa-gift"></i> 发券
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// 渲染最近评价
function renderRecentReviews() {
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) return;
    
    const recentReviews = (mockData.reviews || []).slice(0, 5);
    
    reviewsList.innerHTML = recentReviews.map(review => {
        const starsHtml = generateStarRating(review.rating);
        
        return `
            <div class="review-card">
                <div class="review-header">
                    <div class="review-customer">
                        <div class="customer-avatar">${review.customerName.charAt(0)}</div>
                        <div class="customer-info">
                            <div class="customer-name">${review.customerName}</div>
                            <div class="review-time">${review.time}</div>
                        </div>
                    </div>
                    <div class="review-rating">
                        <div class="stars">${starsHtml}</div>
                        <span class="rating-text">${review.rating}分</span>
                    </div>
                </div>
                <div class="review-content">${review.content}</div>
                <div class="review-dishes">
                    <strong>点评菜品：</strong>${review.dishes.join('、')}
                </div>
            </div>
        `;
    }).join('');
}

// 设置客户筛选器
function setupCustomerFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn[data-filter]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除其他按钮的active状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 添加当前按钮的active状态
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            filterCustomers(filter);
        });
    });
}

// 筛选客户
function filterCustomers(filter) {
    const customerCards = document.querySelectorAll('.customer-card');
    
    customerCards.forEach(card => {
        const customerId = parseInt(card.dataset.customerId);
        const customer = mockData.customers.find(c => c.id === customerId);
        
        if (!customer) return;
        
        let shouldShow = true;
        
        if (filter === 'VIP') {
            shouldShow = customer.level === 'VIP';
        } else if (filter === '会员') {
            shouldShow = customer.level === '会员';
        } else if (filter === '普通') {
            shouldShow = customer.level === '普通';
        }
        
        card.style.display = shouldShow ? 'block' : 'none';
    });
}

// 显示客户详情
function showCustomerDetail(customerId) {
    const customer = mockData.customers.find(c => c.id === customerId);
    if (!customer) return;
    
    // 填充客户信息到模态框
    document.getElementById('customer-name').value = customer.name;
    document.getElementById('customer-phone').value = customer.phone;
    document.getElementById('customer-level').value = customer.level;
    document.getElementById('customer-preference').value = customer.preference;
    document.getElementById('customer-notes').value = customer.notes || '';
    
    // 更新统计信息
    document.getElementById('customer-visits').textContent = customer.totalOrders;
    document.getElementById('customer-spent').textContent = `¥${customer.totalSpent.toFixed(2)}`;
    document.getElementById('customer-avg').textContent = `¥${(customer.totalSpent / customer.totalOrders).toFixed(2)}`;
    document.getElementById('customer-last-visit').textContent = customer.lastVisit;
    
    // 渲染消费历史
    renderCustomerHistory(customer);
    
    // 显示模态框
    document.getElementById('customer-modal').style.display = 'flex';
}

// 渲染客户消费历史
function renderCustomerHistory(customer) {
    const historyContainer = document.getElementById('customer-history');
    if (!historyContainer) return;
    
    // 获取该客户的订单历史
    const customerOrders = mockData.orders.filter(order => 
        order.customer === customer.name
    ).slice(0, 10);
    
    historyContainer.innerHTML = customerOrders.map(order => `
        <div class="history-item">
            <div class="history-date">${order.time}</div>
            <div class="history-details">
                <div class="history-items">
                    ${order.items.map(item => `${item.name} x${item.quantity}`).join('、')}
                </div>
                <div class="history-total">¥${order.total.toFixed(2)}</div>
            </div>
        </div>
    `).join('');
    
    if (customerOrders.length === 0) {
        historyContainer.innerHTML = '<div class="no-history">暂无消费记录</div>';
    }
}

// 关闭客户模态框
function closeCustomerModal() {
    document.getElementById('customer-modal').style.display = 'none';
}

// 保存客户信息
function saveCustomerInfo() {
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const level = document.getElementById('customer-level').value;
    const preference = document.getElementById('customer-preference').value;
    const notes = document.getElementById('customer-notes').value;
    
    if (!name || !phone) {
        showNotification('输入错误', '请填写客户姓名和手机号', 'error');
        return;
    }
    
    showNotification('保存成功', '客户信息已更新', 'success');
    closeCustomerModal();
}

// 搜索客户
function searchCustomers() {
    const searchInput = document.getElementById('customer-search');
    const keyword = searchInput.value.toLowerCase().trim();
    
    if (!keyword) {
        renderCustomersList();
        return;
    }
    
    const filteredCustomers = mockData.customers.filter(customer => 
        customer.name.toLowerCase().includes(keyword) ||
        customer.phone.includes(keyword)
    );
    
    const customersList = document.getElementById('customers-list');
    if (!customersList) return;
    
    if (filteredCustomers.length === 0) {
        customersList.innerHTML = '<div class="no-results">未找到匹配的客户</div>';
        return;
    }
    
    // 重新渲染搜索结果
    customersList.innerHTML = filteredCustomers.map(customer => {
        const levelClass = customer.level === 'VIP' ? 'vip' : customer.level === '会员' ? 'member' : 'normal';
        const levelColor = customer.level === 'VIP' ? '#ffd700' : customer.level === '会员' ? '#3498db' : '#7f8c8d';
        
        return `
            <div class="customer-card" data-customer-id="${customer.id}" onclick="showCustomerDetail(${customer.id})">
                <div class="customer-header">
                    <div class="customer-info">
                        <div class="customer-name">
                            ${customer.name}
                            <span class="customer-badge ${levelClass}" style="background-color: ${levelColor};">${customer.level}</span>
                        </div>
                        <div class="customer-contact">
                            <i class="fas fa-phone"></i> ${customer.phone}
                        </div>
                    </div>
                    <div class="customer-stats">
                        <div class="stat-item">
                            <span class="stat-label">消费总额</span>
                            <span class="stat-value">¥${customer.totalSpent.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="customer-details">
                    <div class="detail-row">
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>到店次数：${customer.totalOrders}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-utensils"></i>
                            <span>口味偏好：${customer.favoriteItems ? customer.favoriteItems.join('、') : '暂无'}</span>
                        </div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span>最近到店：${customer.lastVisit}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-calculator"></i>
                            <span>平均消费：¥${(customer.totalSpent / customer.totalOrders).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="customer-actions">
                    <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); editCustomer(${customer.id})">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); contactCustomer(${customer.id})">
                        <i class="fas fa-comment"></i> 联系
                    </button>
                    <button class="btn btn-success btn-sm" onclick="event.stopPropagation(); sendCoupon(${customer.id})">
                        <i class="fas fa-gift"></i> 发券
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// 编辑客户
function editCustomer(customerId) {
    showCustomerDetail(customerId);
}

// 联系客户
function contactCustomer(customerId) {
    const customer = mockData.customers.find(c => c.id === customerId);
    if (customer) {
        showNotification('联系客户', `正在联系 ${customer.name} - ${customer.phone}`, 'info');
    }
}

// 发送优惠券
function sendCoupon(customerId) {
    const customer = mockData.customers.find(c => c.id === customerId);
    if (customer) {
        showNotification('优惠券发送', `已向 ${customer.name} 发送优惠券`, 'success');
    }
}

// 添加新客户
function addNewCustomer() {
    // 清空模态框表单
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-phone').value = '';
    document.getElementById('customer-level').value = '普通';
    document.getElementById('customer-preference').value = '家常菜';
    document.getElementById('customer-notes').value = '';
    
    // 清空统计和历史
    document.getElementById('customer-visits').textContent = '0';
    document.getElementById('customer-spent').textContent = '¥0';
    document.getElementById('customer-avg').textContent = '¥0';
    document.getElementById('customer-last-visit').textContent = '-';
    document.getElementById('customer-history').innerHTML = '<div class="no-history">新客户暂无消费记录</div>';
    
    // 显示模态框
    document.getElementById('customer-modal').style.display = 'flex';
}

// 导出客户数据
function exportCustomerData() {
    showNotification('导出数据', '客户数据导出功能正在开发中', 'info');
}

// 查看所有评价
function viewAllReviews() {
    showNotification('查看评价', '查看所有评价功能正在开发中', 'info');
}

// ================== 数据分析页面 ==================

// 初始化数据分析页面
function initAnalyticsPage() {
    renderSalesChart();
    renderPopularItemsChart();
    renderRevenueStats();
    renderCustomerAnalytics();
}

// 渲染营收图表
function renderSalesChart() {
    // 这里应该集成真实的图表库，比如 Chart.js 或 ECharts
    // 目前用简单的模拟数据展示
    showNotification('图表加载', '营收图表功能正在开发中，将集成专业图表库', 'info');
}

// 渲染热销商品图表
function renderPopularItemsChart() {
    showNotification('图表加载', '热销商品图表功能正在开发中', 'info');
}

// 渲染营收统计
function renderRevenueStats() {
    // 更新营收相关的统计数据
    const todayRevenue = mockData.orders
        .filter(order => order.date === new Date().toISOString().split('T')[0])
        .reduce((sum, order) => sum + order.total, 0);
    
    const monthRevenue = mockData.orders
        .reduce((sum, order) => sum + order.total, 0);
    
    // 模拟更新页面元素（实际页面可能没有这些元素ID）
}

// 渲染客户分析
function renderCustomerAnalytics() {
    const totalCustomers = mockData.customers.length;
    const vipCustomers = mockData.customers.filter(c => c.level === 'VIP').length;
    const memberCustomers = mockData.customers.filter(c => c.level === '会员').length;
    
}

// ================== 设置页面 ==================

// 初始化设置页面
function initSettingsPage() {
    loadStoreSettings();
    loadStaffList();
    setupSettingsListeners();
}

// 加载店铺设置
function loadStoreSettings() {
    // 模拟加载店铺设置数据
    const settings = {
        storeName: '点当餐厅',
        address: '北京市朝阳区xxx街道xxx号',
        phone: '010-12345678',
        businessHours: '09:00-22:00',
        autoAcceptOrders: true,
        notifications: true,
        loyaltyProgram: true
    };
    
    // 填充设置表单（如果存在相应元素）
}

// 加载员工列表
function loadStaffList() {
}

// 设置事件监听器
function setupSettingsListeners() {
    // 设置各种开关和表单的事件监听器
}

// 保存店铺设置
function saveStoreSettings() {
    showNotification('保存设置', '店铺设置已保存', 'success');
}

// 添加员工
function addStaff() {
    showNotification('添加员工', '添加员工功能正在开发中', 'info');
}

// 编辑员工
function editStaff(staffId) {
    const staff = mockData.staff.find(s => s.id === staffId);
    if (staff) {
        showNotification('编辑员工', `正在编辑员工：${staff.name}`, 'info');
    }
}

// 删除员工
function deleteStaff(staffId) {
    const staff = mockData.staff.find(s => s.id === staffId);
    if (staff && confirm(`确定要删除员工 ${staff.name} 吗？`)) {
        showNotification('删除员工', `员工 ${staff.name} 已删除`, 'warning');
    }
}

// 添加客户管理页面所需的CSS样式
const customerPageStyles = `
<style>
.customer-card {
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    transition: var(--transition);
    cursor: pointer;
}

.customer-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.customer-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}

.customer-info .customer-name {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: var(--dark-color);
    margin-bottom: 8px;
}

.customer-badge {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.customer-contact {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--gray-color);
}

.customer-stats .stat-item {
    text-align: right;
}

.customer-stats .stat-label {
    font-size: 12px;
    color: var(--gray-color);
    margin-bottom: 4px;
}

.customer-stats .stat-value {
    font-size: 16px;
    font-weight: 600;
    color: var(--success-color);
}

.customer-details {
    margin-bottom: 16px;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--gray-color);
}

.detail-item i {
    width: 16px;
    color: var(--primary-color);
}

.customer-actions {
    display: flex;
    gap: 8px;
}

.customer-actions .btn {
    flex: 1;
    font-size: 12px;
    padding: 8px 12px;
    min-height: 36px;
}

.review-card {
    background: #f8f9fa;
    border: 1px solid #e1e8ed;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
}

.review-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
}

.review-customer {
    display: flex;
    align-items: center;
    gap: 12px;
}

.customer-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 16px;
}

.customer-info .customer-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--dark-color);
    margin-bottom: 4px;
}

.review-time {
    font-size: 12px;
    color: var(--gray-color);
}

.review-rating {
    text-align: right;
}

.stars {
    color: #ffc107;
    margin-bottom: 4px;
    font-size: 14px;
}

.rating-text {
    font-size: 12px;
    color: var(--gray-color);
}

.review-content {
    font-size: 14px;
    color: var(--dark-color);
    line-height: 1.5;
    margin-bottom: 12px;
}

.review-dishes {
    font-size: 12px;
    color: var(--gray-color);
}

.history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f1f3f4;
}

.history-item:last-child {
    border-bottom: none;
}

.history-date {
    font-size: 13px;
    color: var(--gray-color);
    min-width: 80px;
}

.history-details {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 16px;
}

.history-items {
    font-size: 13px;
    color: var(--dark-color);
}

.history-total {
    font-size: 14px;
    font-weight: 600;
    color: var(--success-color);
}

.no-history, .no-results {
    text-align: center;
    padding: 40px;
    color: var(--gray-color);
    font-style: italic;
}
</style>
`;

// 将样式注入到页面头部
if (!document.getElementById('customer-page-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'customer-page-styles';
    styleElement.innerHTML = customerPageStyles.replace('<style>', '').replace('</style>', '');
    document.head.appendChild(styleElement);
}

// ===== 平台集成功能 =====

// 平台订单管理
const PlatformOrderManager = {
    // 初始化平台集成
    init() {
        if (typeof platformData !== 'undefined') {
            this.updateMerchantInfo();
            this.updateOrderCount();
            this.startPolling();
        }
    },
    
    // 更新商家信息
    updateMerchantInfo() {
        const merchant = platformData.merchants.find(m => m.id === currentMerchantId);
        if (merchant) {
            const nameElement = document.getElementById('merchantName');
            if (nameElement) nameElement.textContent = merchant.name;
            this.updateStatus(merchant.status);
        }
    },
    
    // 更新营业状态
    updateStatus(status) {
        businessStatus = status;
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-indicator span:last-child');
        
        if (statusDot && statusText) {
            statusDot.className = `status-dot ${status}`;
            const statusMap = {
                'online': '营业中',
                'busy': '繁忙', 
                'offline': '休息中'
            };
            statusText.textContent = statusMap[status] || status;
        }
    },
    
    // 更新订单计数
    updateOrderCount() {
        const merchantOrders = this.getMerchantOrders();
        const pendingCount = merchantOrders.filter(order => 
            ['assigned', 'confirmed'].includes(order.status)
        ).length;
        
        const badge = document.getElementById('pending-orders');
        if (badge) {
            badge.textContent = pendingCount;
            badge.style.display = pendingCount > 0 ? 'inline-flex' : 'none';
        }
    },
    
    // 获取当前商家的订单
    getMerchantOrders() {
        if (typeof platformData === 'undefined') return [];
        return platformData.orders.filter(order => order.merchantId === currentMerchantId);
    },
    
    // 开始轮询订单
    startPolling() {
        if (platformOrderPolling) clearInterval(platformOrderPolling);
        
        platformOrderPolling = setInterval(() => {
            this.checkNewOrders();
            this.updateOrderCount();
        }, 5000); // 5秒检查一次
    },
    
    // 检查新订单
    checkNewOrders() {
        const newOrders = this.getMerchantOrders().filter(order => 
            order.status === 'assigned' && !order.merchantNotified
        );
        
        newOrders.forEach(order => {
            this.showNewOrderNotification(order);
            order.merchantNotified = true;
        });
    },
    
    // 显示新订单通知
    showNewOrderNotification(order) {
        const notificationHtml = `
            <div class="platform-notification new-order" data-order-id="${order.id}">
                <div class="notification-header">
                    <i class="fas fa-shopping-bag"></i>
                    <strong>新平台订单</strong>
                    <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="notification-body">
                    <p><strong>订单号:</strong> ${order.id}</p>
                    <p><strong>金额:</strong> ¥${order.pricing.total.toFixed(2)}</p>
                    <p><strong>配送:</strong> ${order.deliveryAddress.detail}</p>
                    <p><strong>备注:</strong> ${order.remark || '无'}</p>
                </div>
                <div class="notification-actions">
                    <button class="btn-accept" onclick="PlatformOrderManager.acceptOrder('${order.id}')">接单</button>
                    <button class="btn-reject" onclick="PlatformOrderManager.rejectOrder('${order.id}')">拒单</button>
                </div>
            </div>
        `;
        
        const container = document.getElementById('notificationContainer');
        if (container) {
            container.insertAdjacentHTML('afterbegin', notificationHtml);
        }
        
        // 播放通知音效
        this.playNotificationSound();
    },
    
    // 接受订单
    acceptOrder(orderId) {
        const order = platformData.orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'confirmed';
            order.timeline.push({
                status: 'confirmed',
                time: new Date().toISOString(),
                desc: '商家已确认订单'
            });
            
            this.removeOrderNotification(orderId);
            this.updateOrderCount();
            this.showToast('订单已接受', 'success');
        }
    },
    
    // 拒绝订单
    rejectOrder(orderId) {
        const order = platformData.orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'pending';
            order.merchantId = null;
            order.merchantName = null;
            order.timeline.push({
                status: 'rejected',
                time: new Date().toISOString(),
                desc: '商家拒绝订单，重新分配中'
            });
            
            this.removeOrderNotification(orderId);
            this.updateOrderCount();
            this.showToast('订单已拒绝', 'warning');
        }
    },
    
    // 移除订单通知
    removeOrderNotification(orderId) {
        const notification = document.querySelector(`[data-order-id="${orderId}"]`);
        if (notification) {
            notification.remove();
        }
    },
    
    // 播放通知音效
    playNotificationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Audio notification not supported');
        }
    },
    
    // 显示提示消息
    showToast(message, type = 'info') {
        // 创建简单的toast通知
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : '#2196F3'};
            color: white;
            border-radius: 6px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// 修改现有的订单页面渲染，集成平台订单
function renderOrdersPageWithPlatform() {
    if (typeof platformData !== 'undefined') {
        const platformOrders = PlatformOrderManager.getMerchantOrders();
        
        // 找到订单容器并渲染平台订单
        const ordersContainer = document.querySelector('#orders .page-content');
        if (ordersContainer && platformOrders.length > 0) {
            const platformOrdersHtml = `
                <div class="platform-orders-section">
                    <h3><i class="fas fa-layer-group"></i> 平台订单</h3>
                    <div class="orders-grid">
                        ${platformOrders.map(order => `
                            <div class="order-card platform-order" data-order-id="${order.id}">
                                <div class="order-header">
                                    <span class="order-id">${order.id}</span>
                                    <span class="order-status ${order.status}">
                                        ${PlatformOrderManager.getOrderStatusText(order.status)}
                                    </span>
                                </div>
                                <div class="order-details">
                                    <p><strong>金额:</strong> ¥${order.pricing.total.toFixed(2)}</p>
                                    <p><strong>时间:</strong> ${new Date(order.orderTime).toLocaleString()}</p>
                                    <p><strong>地址:</strong> ${order.deliveryAddress.detail}</p>
                                </div>
                                <div class="order-actions">
                                    ${PlatformOrderManager.getOrderActions(order)}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            ordersContainer.insertAdjacentHTML('afterbegin', platformOrdersHtml);
        }
    }
}

// 获取订单状态文本
PlatformOrderManager.getOrderStatusText = function(status) {
    const textMap = {
        'assigned': '待确认',
        'confirmed': '已确认',
        'preparing': '制作中',
        'ready': '待配送',
        'delivering': '配送中',
        'completed': '已完成',
        'cancelled': '已取消'
    };
    return textMap[status] || status;
};

// 获取订单操作按钮
PlatformOrderManager.getOrderActions = function(order) {
    switch (order.status) {
        case 'assigned':
            return `
                <button class="btn-primary btn-sm" onclick="PlatformOrderManager.acceptOrder('${order.id}')">接单</button>
                <button class="btn-danger btn-sm" onclick="PlatformOrderManager.rejectOrder('${order.id}')">拒单</button>
            `;
        case 'confirmed':
            return `<button class="btn-info btn-sm" onclick="PlatformOrderManager.startPreparing('${order.id}')">开始制作</button>`;
        case 'preparing':
            return `<button class="btn-success btn-sm" onclick="PlatformOrderManager.markReady('${order.id}')">制作完成</button>`;
        case 'ready':
            return `<button class="btn-warning btn-sm" onclick="PlatformOrderManager.markDelivering('${order.id}')">开始配送</button>`;
        case 'delivering':
            return `<button class="btn-success btn-sm" onclick="PlatformOrderManager.markCompleted('${order.id}')">配送完成</button>`;
        default:
            return '';
    }
};

// 订单状态更新方法
PlatformOrderManager.startPreparing = function(orderId) {
    const order = platformData.orders.find(o => o.id === orderId);
    if (order) {
        order.status = 'preparing';
        order.timeline.push({
            status: 'preparing',
            time: new Date().toISOString(),
            desc: '开始制作'
        });
        this.showToast('已开始制作', 'success');
        renderOrdersPageWithPlatform();
    }
};

PlatformOrderManager.markReady = function(orderId) {
    const order = platformData.orders.find(o => o.id === orderId);
    if (order) {
        order.status = 'ready';
        order.timeline.push({
            status: 'ready',
            time: new Date().toISOString(),
            desc: '制作完成'
        });
        this.showToast('制作完成', 'success');
        renderOrdersPageWithPlatform();
    }
};

PlatformOrderManager.markDelivering = function(orderId) {
    const order = platformData.orders.find(o => o.id === orderId);
    if (order && order.orderType === 'delivery' && typeof deliveryService !== 'undefined') {
        // 尝试分配配送员
        const assignmentResult = deliveryService.assignDriver(orderId);
        
        if (assignmentResult.success) {
            order.status = 'picked_up';
            this.showToast(`已安排${assignmentResult.driver.name}配送，预计${assignmentResult.estimatedTime}分钟送达`, 'success');
            
            // 模拟配送过程
            this.simulateDelivery(orderId);
        } else {
            this.showToast(assignmentResult.reason, 'warning');
        }
        
        renderOrdersPageWithPlatform();
    } else {
        // 兜底处理
        order.status = 'delivering';
        order.timeline.push({
            status: 'delivering',
            time: new Date().toISOString(),
            desc: '开始配送'
        });
        this.showToast('已开始配送', 'success');
        renderOrdersPageWithPlatform();
    }
};

// 模拟配送过程
PlatformOrderManager.simulateDelivery = function(orderId) {
    // 3分钟后更新为配送中
    setTimeout(() => {
        if (typeof deliveryService !== 'undefined') {
            deliveryService.updateDeliveryStatus(orderId, 'on_the_way');
            this.showToast('配送员已在路上', 'info');
        }
    }, 3000);

    // 8分钟后更新为即将送达
    setTimeout(() => {
        if (typeof deliveryService !== 'undefined') {
            deliveryService.updateDeliveryStatus(orderId, 'delivering');
            this.showToast('配送员即将送达', 'info');
        }
    }, 8000);

    // 12分钟后完成配送
    setTimeout(() => {
        if (typeof deliveryService !== 'undefined') {
            deliveryService.updateDeliveryStatus(orderId, 'delivered');
            this.showToast('配送已完成', 'success');
            this.updateOrderCount();
        }
    }, 12000);
};

PlatformOrderManager.markCompleted = function(orderId) {
    const order = platformData.orders.find(o => o.id === orderId);
    if (order) {
        order.status = 'completed';
        order.timeline.push({
            status: 'completed',
            time: new Date().toISOString(),
            desc: '配送完成'
        });
        
        const merchant = platformData.merchants.find(m => m.id === currentMerchantId);
        if (merchant && merchant.currentLoad > 0) {
            merchant.currentLoad -= 1;
        }
        
        this.showToast('订单已完成', 'success');
        this.updateOrderCount();
        renderOrdersPageWithPlatform();
    }
};

// 初始化平台集成
setTimeout(() => {
    if (typeof platformData !== 'undefined') {
        PlatformOrderManager.init();
        
        // 如果当前在订单页面，渲染平台订单
        if (currentPage === 'orders') {
            renderOrdersPageWithPlatform();
        }
    }
}, 1000);

// 切换店铺状态 (设置页面使用)
function toggleStoreStatus() {
    const statusBadge = document.querySelector('#settings .status-badge');
    const toggleBtn = document.querySelector('[onclick="toggleStoreStatus()"]');
    const sidebarStatusIndicator = document.querySelector('.sidebar .status-indicator');
    
    if (!statusBadge || !toggleBtn) return;
    
    const isOnline = statusBadge.classList.contains('online');
    
    if (isOnline) {
        // 切换到暂停营业
        statusBadge.textContent = '暂停营业';
        statusBadge.className = 'status-badge offline';
        toggleBtn.innerHTML = '<i class="fas fa-power-off"></i>';
        toggleBtn.setAttribute('title', '开始营业');
        
        // 更新侧边栏状态
        if (sidebarStatusIndicator) {
            sidebarStatusIndicator.innerHTML = '<span class="status-dot offline"></span><span>暂停营业</span>';
        }
        
        // 更新全局营业状态
        if (typeof businessStatus !== 'undefined') {
            businessStatus = 'offline';
        }
        
        showNotification('营业状态', '已暂停营业，不再接受新订单', 'warning');
    } else {
        // 切换到营业中
        statusBadge.textContent = '营业中';
        statusBadge.className = 'status-badge online';
        toggleBtn.innerHTML = '<i class="fas fa-power-off"></i>';
        toggleBtn.setAttribute('title', '暂停营业');
        
        // 更新侧边栏状态
        if (sidebarStatusIndicator) {
            sidebarStatusIndicator.innerHTML = '<span class="status-dot online"></span><span>营业中</span>';
        }
        
        // 更新全局营业状态
        if (typeof businessStatus !== 'undefined') {
            businessStatus = 'online';
        }
        
        showNotification('营业状态', '已开始营业，可以接受新订单', 'success');
    }
}

// 添加新桌位
function addNewTable() {
    const modalContent = `
        <div class="modal-header">
            <h3>添加新桌位</h3>
            <button class="close-btn" onclick="closeModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="addTableForm">
                <div class="form-group">
                    <label for="tableNumber">桌位号码</label>
                    <input type="number" id="tableNumber" name="tableNumber" min="1" max="99" required>
                </div>
                <div class="form-group">
                    <label for="tableCapacity">座位数量</label>
                    <select id="tableCapacity" name="tableCapacity" required>
                        <option value="2">2人桌</option>
                        <option value="4">4人桌</option>
                        <option value="6">6人桌</option>
                        <option value="8">8人桌</option>
                        <option value="10">10人桌</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="tableType">桌位类型</label>
                    <select id="tableType" name="tableType" required>
                        <option value="standard">标准桌</option>
                        <option value="booth">卡座</option>
                        <option value="private">包厢</option>
                        <option value="outdoor">户外桌</option>
                    </select>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">取消</button>
            <button class="btn btn-success" onclick="saveNewTable()">添加桌位</button>
        </div>
    `;
    showModal(null, modalContent);
}

// 保存新桌位
function saveNewTable() {
    const form = document.getElementById('addTableForm');
    const formData = new FormData(form);
    
    const tableNumber = formData.get('tableNumber');
    const tableCapacity = formData.get('tableCapacity');
    const tableType = formData.get('tableType');
    
    if (!tableNumber || !tableCapacity || !tableType) {
        showNotification('输入错误', '请填写所有必填字段', 'error');
        return;
    }
    
    // 这里应该调用API保存桌位信息
    showNotification('添加成功', `桌位 ${tableNumber} 号已添加`, 'success');
    closeModal();
    
    // 刷新桌位布局 (如果有渲染函数的话)
    if (typeof renderTableLayout === 'function') {
        renderTableLayout();
    }
}

// 编辑店铺信息
function editStoreInfo() {
    const modalContent = `
        <div class="modal-header">
            <h3>编辑店铺信息</h3>
            <button class="close-btn" onclick="closeModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="editStoreForm">
                <div class="form-group">
                    <label for="editStoreName">店铺名称</label>
                    <input type="text" id="editStoreName" name="storeName" value="仓和餐厅" required>
                </div>
                <div class="form-group">
                    <label for="editStorePhone">联系电话</label>
                    <input type="tel" id="editStorePhone" name="storePhone" value="028-8888-6666" required>
                </div>
                <div class="form-group">
                    <label for="editStoreAddress">店铺地址</label>
                    <textarea id="editStoreAddress" name="storeAddress" rows="3" required>成都市锦江区春熙路123号</textarea>
                </div>
                <div class="form-group">
                    <label for="editStoreHours">营业时间</label>
                    <input type="text" id="editStoreHours" name="storeHours" value="10:00-22:00" required>
                </div>
                <div class="form-group">
                    <label for="editStoreDescription">店铺描述</label>
                    <textarea id="editStoreDescription" name="storeDescription" rows="3" placeholder="请输入店铺简介...">川菜特色餐厅，主营正宗川菜，环境优雅，服务周到。</textarea>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">取消</button>
            <button class="btn btn-primary" onclick="saveStoreInfo()">保存修改</button>
        </div>
    `;
    showModal(null, modalContent);
}

// 保存店铺信息
function saveStoreInfo() {
    const form = document.getElementById('editStoreForm');
    const formData = new FormData(form);
    
    const storeName = formData.get('storeName');
    const storePhone = formData.get('storePhone');
    const storeAddress = formData.get('storeAddress');
    const storeHours = formData.get('storeHours');
    const storeDescription = formData.get('storeDescription');
    
    if (!storeName || !storePhone || !storeAddress || !storeHours) {
        showNotification('输入错误', '请填写所有必填字段', 'error');
        return;
    }
    
    // 更新页面显示的店铺信息
    const storeNameElement = document.getElementById('store-name');
    const storePhoneElement = document.getElementById('store-phone');
    const storeAddressElement = document.getElementById('store-address');
    const storeHoursElement = document.getElementById('store-hours');
    
    if (storeNameElement) storeNameElement.textContent = storeName;
    if (storePhoneElement) storePhoneElement.textContent = storePhone;
    if (storeAddressElement) storeAddressElement.textContent = storeAddress;
    if (storeHoursElement) storeHoursElement.textContent = storeHours;
    
    // 同时更新侧边栏的商家名称
    const merchantNameElement = document.getElementById('merchantName');
    if (merchantNameElement) merchantNameElement.textContent = storeName;
    
    showNotification('保存成功', '店铺信息已更新', 'success');
    closeModal();
}

// 添加新员工
function addNewStaff() {
    const modalContent = `
        <div class="modal-header">
            <h3>添加新员工</h3>
            <button class="close-btn" onclick="closeModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="addStaffForm">
                <div class="form-group">
                    <label for="staffName">员工姓名</label>
                    <input type="text" id="staffName" name="staffName" required>
                </div>
                <div class="form-group">
                    <label for="staffPhone">联系电话</label>
                    <input type="tel" id="staffPhone" name="staffPhone" required>
                </div>
                <div class="form-group">
                    <label for="staffPosition">职位</label>
                    <select id="staffPosition" name="staffPosition" required>
                        <option value="">请选择职位</option>
                        <option value="服务员">服务员</option>
                        <option value="收银员">收银员</option>
                        <option value="厨师">厨师</option>
                        <option value="后厨助理">后厨助理</option>
                        <option value="清洁员">清洁员</option>
                        <option value="主管">主管</option>
                        <option value="经理">经理</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="staffSalary">基础工资</label>
                    <input type="number" id="staffSalary" name="staffSalary" min="0" step="100" placeholder="请输入月工资">
                </div>
                <div class="form-group">
                    <label for="staffStartDate">入职日期</label>
                    <input type="date" id="staffStartDate" name="staffStartDate" required>
                </div>
                <div class="form-group">
                    <label for="staffStatus">员工状态</label>
                    <select id="staffStatus" name="staffStatus" required>
                        <option value="active">在职</option>
                        <option value="probation">试用期</option>
                        <option value="leave">请假</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="staffNotes">备注信息</label>
                    <textarea id="staffNotes" name="staffNotes" rows="3" placeholder="请输入备注信息..."></textarea>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">取消</button>
            <button class="btn btn-primary" onclick="saveNewStaff()">添加员工</button>
        </div>
    `;
    showModal(null, modalContent);
    
    // 设置默认入职日期为今天
    setTimeout(() => {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('staffStartDate').value = today;
    }, 100);
}

// 保存新员工
function saveNewStaff() {
    const form = document.getElementById('addStaffForm');
    const formData = new FormData(form);
    
    const staffName = formData.get('staffName');
    const staffPhone = formData.get('staffPhone');
    const staffPosition = formData.get('staffPosition');
    const staffSalary = formData.get('staffSalary');
    const staffStartDate = formData.get('staffStartDate');
    const staffStatus = formData.get('staffStatus');
    const staffNotes = formData.get('staffNotes');
    
    if (!staffName || !staffPhone || !staffPosition || !staffStartDate || !staffStatus) {
        showNotification('输入错误', '请填写所有必填字段', 'error');
        return;
    }
    
    // 验证电话号码格式
    const phoneRegex = /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/;
    if (!phoneRegex.test(staffPhone)) {
        showNotification('输入错误', '请输入正确的电话号码格式', 'error');
        return;
    }
    
    // 创建新员工对象
    const newStaff = {
        id: 'staff_' + Date.now(),
        name: staffName,
        phone: staffPhone,
        position: staffPosition,
        salary: staffSalary || '面议',
        startDate: staffStartDate,
        status: staffStatus,
        notes: staffNotes || '',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    };
    
    // 这里应该调用API保存员工信息
    // 模拟保存成功
    showNotification('添加成功', `员工 ${staffName} 已成功添加`, 'success');
    closeModal();
    
    // 刷新员工列表 (如果有渲染函数的话)
    if (typeof renderStaffList === 'function') {
        renderStaffList();
    }
}

// 数据备份
function backupData() {
    showNotification('开始备份', '正在备份店铺数据...', 'info');
    
    // 模拟备份过程
    setTimeout(() => {
        try {
            // 收集要备份的数据
            const backupData = {
                timestamp: new Date().toISOString(),
                storeInfo: {
                    name: document.getElementById('store-name')?.textContent || '仓和餐厅',
                    phone: document.getElementById('store-phone')?.textContent || '028-8888-6666',
                    address: document.getElementById('store-address')?.textContent || '成都市锦江区春熙路123号',
                    hours: document.getElementById('store-hours')?.textContent || '10:00-22:00'
                },
                orders: mockData?.orders || [],
                menu: mockData?.menu || [],
                inventory: mockData?.inventory || [],
                staff: mockData?.staff || [],
                settings: {
                    notifications: document.getElementById('notifications-enabled')?.checked || true,
                    voiceAlerts: document.getElementById('voice-alerts')?.checked || true,
                    autoPrint: document.getElementById('auto-print')?.checked || true,
                    stockWarning: document.getElementById('stock-warning-threshold')?.value || 10,
                    timeoutWarning: document.getElementById('timeout-warning')?.value || 30
                }
            };
            
            // 创建备份文件
            const fileName = `merchant_backup_${new Date().toISOString().split('T')[0]}.json`;
            const jsonStr = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            
            // 创建下载链接
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // 更新页面显示的备份时间
            const backupDesc = document.querySelector('.data-item .data-desc');
            if (backupDesc && backupDesc.textContent.includes('上次备份')) {
                const now = new Date();
                backupDesc.textContent = `上次备份：${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            }
            
            showNotification('备份完成', '数据备份文件已下载', 'success');
        } catch (error) {
            console.error('备份失败:', error);
            showNotification('备份失败', '数据备份过程中出现错误', 'error');
        }
    }, 1500);
}

// 导出数据 (增强版本)
function exportData() {
    const modalContent = `
        <div class="modal-header">
            <h3>导出营业数据</h3>
            <button class="close-btn" onclick="closeModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="exportDataForm">
                <div class="form-group">
                    <label for="exportType">导出类型</label>
                    <select id="exportType" name="exportType" required>
                        <option value="orders">订单数据</option>
                        <option value="sales">销售报表</option>
                        <option value="menu">菜单数据</option>
                        <option value="inventory">库存数据</option>
                        <option value="staff">员工数据</option>
                        <option value="all">全部数据</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="exportFormat">导出格式</label>
                    <select id="exportFormat" name="exportFormat" required>
                        <option value="json">JSON格式</option>
                        <option value="csv">CSV格式</option>
                        <option value="excel">Excel格式</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="dateRange">时间范围</label>
                    <select id="dateRange" name="dateRange" required>
                        <option value="today">今日</option>
                        <option value="week">本周</option>
                        <option value="month">本月</option>
                        <option value="quarter">本季度</option>
                        <option value="year">今年</option>
                        <option value="all">全部</option>
                    </select>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">取消</button>
            <button class="btn btn-success" onclick="performExport()">开始导出</button>
        </div>
    `;
    showModal(null, modalContent);
}

// 执行导出
function performExport() {
    const form = document.getElementById('exportDataForm');
    const formData = new FormData(form);
    
    const exportType = formData.get('exportType');
    const exportFormat = formData.get('exportFormat');
    const dateRange = formData.get('dateRange');
    
    if (!exportType || !exportFormat || !dateRange) {
        showNotification('输入错误', '请选择所有导出选项', 'error');
        return;
    }
    
    closeModal();
    showNotification('开始导出', `正在导出${exportType}数据...`, 'info');
    
    // 模拟导出过程
    setTimeout(() => {
        const fileName = `${exportType}_${dateRange}_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
        
        let exportData = {};
        switch (exportType) {
            case 'orders':
                exportData = mockData?.orders || [];
                break;
            case 'sales':
                exportData = {
                    summary: '销售报表数据',
                    period: dateRange,
                    totalSales: '¥12,345',
                    orderCount: 156
                };
                break;
            case 'menu':
                exportData = mockData?.menu || [];
                break;
            case 'inventory':
                exportData = mockData?.inventory || [];
                break;
            case 'staff':
                exportData = mockData?.staff || [];
                break;
            case 'all':
                exportData = {
                    orders: mockData?.orders || [],
                    menu: mockData?.menu || [],
                    inventory: mockData?.inventory || [],
                    staff: mockData?.staff || []
                };
                break;
        }
        
        // 创建下载文件
        const jsonStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('导出完成', '数据文件已下载', 'success');
    }, 2000);
}

// 检查更新
function checkUpdates() {
    showNotification('检查更新', '正在检查系统更新...', 'info');
    
    // 模拟检查更新过程
    setTimeout(() => {
        const currentVersion = 'v2.1.3';
        const hasUpdate = Math.random() > 0.5; // 随机模拟是否有更新
        
        if (hasUpdate) {
            const newVersion = 'v2.1.4';
            const modalContent = `
                <div class="modal-header">
                    <h3>发现新版本</h3>
                    <button class="close-btn" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="update-info">
                        <div class="version-info">
                            <div class="current-version">
                                <label>当前版本：</label>
                                <span>${currentVersion}</span>
                            </div>
                            <div class="new-version">
                                <label>最新版本：</label>
                                <span class="highlight">${newVersion}</span>
                            </div>
                        </div>
                        <div class="update-notes">
                            <h4>更新内容：</h4>
                            <ul>
                                <li>修复了订单处理的若干问题</li>
                                <li>优化了页面加载速度</li>
                                <li>新增了数据统计功能</li>
                                <li>改进了用户界面体验</li>
                                <li>增强了系统安全性</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeModal()">稍后更新</button>
                    <button class="btn btn-primary" onclick="startUpdate()">立即更新</button>
                </div>
            `;
            showModal(null, modalContent);
        } else {
            showNotification('已是最新版本', `当前版本 ${currentVersion} 已是最新版本`, 'success');
        }
    }, 2000);
}

// 开始更新
function startUpdate() {
    closeModal();
    showNotification('开始更新', '系统更新正在进行中，请勿关闭页面...', 'info');
    
    // 模拟更新过程
    let progress = 0;
    const updateInterval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
            progress = 100;
            clearInterval(updateInterval);
            showNotification('更新完成', '系统已成功更新到最新版本', 'success');
            
            // 更新版本显示
            setTimeout(() => {
                const versionElement = document.querySelector('.data-item .data-desc');
                if (versionElement && versionElement.textContent.includes('当前版本')) {
                    versionElement.textContent = '当前版本：v2.1.4';
                }
            }, 1000);
        }
    }, 500);
}