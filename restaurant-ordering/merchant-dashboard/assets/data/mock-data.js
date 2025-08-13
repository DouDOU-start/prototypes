// Mock data for merchant dashboard

window.merchantData = {
    // Dashboard statistics
    todayStats: {
        orders: 45,
        revenue: 2280.50,
        pendingOrders: 3,
        avgOrderValue: 50.68,
        customerSatisfaction: 4.8,
        orderGrowth: 12.5,
        revenueGrowth: 8.2
    },

    // Recent orders for dashboard
    recentOrders: [
        {
            id: "2024011215001",
            customerName: "张先生",
            customerPhone: "138****8888",
            status: "preparing",
            statusText: "准备中",
            orderTime: "2024-01-12 14:30:15",
            estimatedTime: "15:00",
            total: 86.00,
            itemCount: 3,
            priority: "normal",
            items: [
                { name: "宫保鸡丁", quantity: 1, price: 28.00 },
                { name: "麻婆豆腐", quantity: 1, price: 22.00 },
                { name: "白米饭", quantity: 2, price: 3.00 }
            ],
            deliveryAddress: "朝阳区三里屯街道工体北路8号院",
            paymentMethod: "alipay",
            notes: "少放辣椒"
        },
        {
            id: "2024011214045",
            customerName: "李女士",
            customerPhone: "139****9999",
            status: "pending",
            statusText: "待接单",
            orderTime: "2024-01-12 14:25:30",
            total: 52.00,
            itemCount: 2,
            priority: "high",
            items: [
                { name: "水煮鱼", quantity: 1, price: 58.00 },
                { name: "凉拌黄瓜", quantity: 1, price: 12.00 }
            ],
            deliveryAddress: "海淀区中关村大街27号",
            paymentMethod: "wechat",
            notes: "尽快送达，谢谢"
        },
        {
            id: "2024011214032",
            customerName: "王先生",
            customerPhone: "136****7777",
            status: "delivering",
            statusText: "配送中",
            orderTime: "2024-01-12 14:15:45",
            deliveryTime: "14:45",
            total: 73.50,
            itemCount: 4,
            priority: "normal",
            items: [
                { name: "口水鸡", quantity: 1, price: 32.00 },
                { name: "蒜蓉西兰花", quantity: 1, price: 18.00 },
                { name: "银耳莲子汤", quantity: 2, price: 18.00 }
            ],
            deliveryAddress: "东城区王府井大街138号",
            paymentMethod: "alipay"
        },
        {
            id: "2024011213058",
            customerName: "赵女士",
            customerPhone: "135****6666",
            status: "completed",
            statusText: "已完成",
            orderTime: "2024-01-12 13:45:20",
            deliveredTime: "14:20",
            total: 41.00,
            itemCount: 2,
            priority: "normal",
            rating: 5,
            items: [
                { name: "干煸四季豆", quantity: 1, price: 20.00 },
                { name: "老鸭汤", quantity: 1, price: 38.00 }
            ],
            deliveryAddress: "西城区西单北大街120号",
            paymentMethod: "wechat"
        }
    ],

    // All orders (extended list) - using function to avoid spread operator on undefined
    getAllOrders() {
        const baseOrders = [
            {
                id: "2024011213045",
                customerName: "陈先生",
                customerPhone: "132****5555",
                status: "completed",
                statusText: "已完成",
                orderTime: "2024-01-12 13:30:15",
                deliveredTime: "14:05",
                total: 95.50,
                itemCount: 5,
                priority: "medium",
                rating: 4.5,
                items: [
                    { name: "毛血旺", quantity: 1, price: 42.00 },
                    { name: "泡菜", quantity: 2, price: 10.00 },
                    { name: "白粥", quantity: 3, price: 8.00 }
                ],
                deliveryAddress: "朝阳区建国门外大街22号",
                paymentMethod: "cash"
            }
        ];
        return [...this.recentOrders, ...baseOrders];
    },

    // Popular dishes for dashboard
    popularDishes: [
        {
            id: 1,
            name: "宫保鸡丁",
            category: "招牌川菜",
            salesCount: 520,
            revenue: 14560,
            avgRating: 4.9,
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"
        },
        {
            id: 2,
            name: "麻婆豆腐",
            category: "招牌川菜",
            salesCount: 380,
            revenue: 8360,
            avgRating: 4.8,
            image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop"
        },
        {
            id: 4,
            name: "水煮鱼",
            category: "招牌川菜",
            salesCount: 180,
            revenue: 10440,
            avgRating: 4.9,
            image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop"
        },
        {
            id: 15,
            name: "泡菜",
            category: "特色小菜",
            salesCount: 180,
            revenue: 1800,
            avgRating: 4.4,
            image: "https://images.unsplash.com/photo-1563379091339-03246963d7d9?w=400&h=300&fit=crop"
        }
    ],

    // Menu management data (using customer app dish data with additional management fields)
    dishes: [
        {
            id: 1,
            name: "宫保鸡丁",
            price: 28.00,
            originalPrice: 32.00,
            cost: 12.00,
            category: 1,
            categoryName: "今日推荐",
            description: "经典川菜，鸡肉鲜嫩，花生香脆，酸甜微辣",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
            tags: ["招牌", "微辣"],
            rating: 4.9,
            salesCount: 520,
            spicy: 1,
            available: true,
            stock: 50,
            preparationTime: 15, // minutes
            featured: true,
            createdAt: "2024-01-01",
            updatedAt: "2024-01-12"
        },
        {
            id: 2,
            name: "麻婆豆腐",
            price: 22.00,
            cost: 8.00,
            category: 1,
            categoryName: "今日推荐",
            description: "正宗川味，豆腐嫩滑，麻辣鲜香，下饭神器",
            image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop",
            tags: ["素食", "中辣"],
            rating: 4.8,
            salesCount: 380,
            spicy: 2,
            available: true,
            stock: 30,
            preparationTime: 12,
            featured: true,
            createdAt: "2024-01-01",
            updatedAt: "2024-01-10"
        },
        {
            id: 4,
            name: "水煮鱼",
            price: 58.00,
            cost: 25.00,
            category: 2,
            categoryName: "招牌川菜",
            description: "新鲜鱼片，麻辣鲜香，配时令蔬菜",
            image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop",
            tags: ["招牌", "重辣"],
            rating: 4.9,
            salesCount: 180,
            spicy: 3,
            available: true,
            stock: 20,
            preparationTime: 25,
            featured: false,
            createdAt: "2024-01-01",
            updatedAt: "2024-01-11"
        },
        {
            id: 7,
            name: "蒜蓉西兰花",
            price: 18.00,
            cost: 6.00,
            category: 3,
            categoryName: "清爽素食",
            description: "新鲜西兰花，清香蒜蓉，营养健康",
            image: "https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=400&h=300&fit=crop",
            tags: ["素食", "清淡"],
            rating: 4.5,
            salesCount: 120,
            spicy: 0,
            available: true,
            stock: 40,
            preparationTime: 8,
            featured: false,
            createdAt: "2024-01-01",
            updatedAt: "2024-01-08"
        },
        {
            id: 10,
            name: "柠檬蜂蜜茶",
            price: 15.00,
            cost: 5.00,
            category: 4,
            categoryName: "饮品甜点",
            description: "新鲜柠檬，天然蜂蜜，清香怡人",
            image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
            tags: ["饮品", "清香"],
            rating: 4.7,
            salesCount: 300,
            spicy: 0,
            available: false, // Out of stock example
            stock: 0,
            preparationTime: 5,
            featured: false,
            createdAt: "2024-01-01",
            updatedAt: "2024-01-12"
        }
    ],

    // Analytics data
    analytics: {
        salesTrend: [
            { date: '2024-01-06', orders: 32, revenue: 1680 },
            { date: '2024-01-07', orders: 28, revenue: 1450 },
            { date: '2024-01-08', orders: 35, revenue: 1820 },
            { date: '2024-01-09', orders: 42, revenue: 2140 },
            { date: '2024-01-10', orders: 38, revenue: 1960 },
            { date: '2024-01-11', orders: 45, revenue: 2350 },
            { date: '2024-01-12', orders: 51, revenue: 2680 }
        ],
        orderDistribution: [
            { status: 'completed', count: 156, percentage: 78 },
            { status: 'cancelled', count: 12, percentage: 6 },
            { status: 'delivering', count: 18, percentage: 9 },
            { status: 'preparing', count: 14, percentage: 7 }
        ],
        dishRanking: [
            { name: "宫保鸡丁", sales: 520, revenue: 14560, rank: 1 },
            { name: "麻婆豆腐", sales: 380, revenue: 8360, rank: 2 },
            { name: "柠檬蜂蜜茶", sales: 300, revenue: 4500, rank: 3 },
            { name: "凉拌黄瓜", sales: 200, revenue: 2400, rank: 4 },
            { name: "水煮鱼", sales: 180, revenue: 10440, rank: 5 }
        ],
        hourlyDistribution: [
            { hour: 11, orders: 8 }, { hour: 12, orders: 15 },
            { hour: 13, orders: 12 }, { hour: 14, orders: 10 },
            { hour: 15, orders: 6 }, { hour: 16, orders: 8 },
            { hour: 17, orders: 14 }, { hour: 18, orders: 20 },
            { hour: 19, orders: 18 }, { hour: 20, orders: 16 },
            { hour: 21, orders: 12 }, { hour: 22, orders: 6 }
        ]
    },

    // Notifications
    notifications: [
        {
            id: 1,
            type: 'newOrder',
            title: '新订单提醒',
            message: '收到来自张先生的新订单，订单号：2024011215001',
            time: '2024-01-12 14:30:15',
            read: false,
            orderId: '2024011215001'
        },
        {
            id: 2,
            type: 'lowStock',
            title: '库存预警',
            message: '柠檬蜂蜜茶库存不足，请及时补货',
            time: '2024-01-12 14:15:30',
            read: false,
            dishId: 10
        },
        {
            id: 3,
            type: 'orderCancelled',
            title: '订单取消',
            message: '订单2024011214032已被客户取消',
            time: '2024-01-12 13:45:20',
            read: true,
            orderId: '2024011214032'
        }
    ],

    // Restaurant settings - using function to avoid reference errors
    getSettings() {
        return {
            ...sharedData.initRestaurantSettings(),
            autoAcceptOrders: true,
            maxOrdersPerHour: 30,
            preparationBuffer: 5, // extra minutes added to prep time
            enableNotifications: true,
            printOrders: true,
            printerIP: '192.168.1.100',
            taxRate: 0.06,
            serviceCharge: 0.10
        };
    },

    // Staff management (for future expansion)
    staff: [
        {
            id: 1,
            name: '张大厨',
            role: 'chef',
            phone: '138****1111',
            shift: 'morning',
            status: 'active'
        },
        {
            id: 2,
            name: '李服务员',
            role: 'waiter',
            phone: '139****2222',
            shift: 'evening',
            status: 'active'
        }
    ]
};