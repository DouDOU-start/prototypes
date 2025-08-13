// Mock data for restaurant ordering app

window.mockData = {
    // Restaurant information
    restaurant: {
        id: 1,
        name: "美味餐厅",
        description: "正宗川菜 · 新鲜食材 · 快速配送",
        rating: 4.8,
        monthlyOrders: 1200,
        deliveryTime: "30min",
        deliveryFee: 5.00,
        minOrder: 20.00,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop"
    },

    // Categories
    categories: [
        { id: 1, name: "今日推荐", icon: "fas fa-fire", color: "orange", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop" },
        { id: 2, name: "招牌川菜", icon: "fas fa-pepper-hot", color: "red", image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=200&h=150&fit=crop" },
        { id: 3, name: "清爽素食", icon: "fas fa-leaf", color: "green", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop" },
        { id: 4, name: "饮品甜点", icon: "fas fa-cocktail", color: "blue", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=150&fit=crop" },
        { id: 5, name: "汤品粥类", icon: "fas fa-bowl-food", color: "yellow", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&h=150&fit=crop" },
        { id: 6, name: "特色小菜", icon: "fas fa-seedling", color: "purple", image: "https://images.unsplash.com/photo-1563379091339-03246963d7d9?w=200&h=150&fit=crop" }
    ],

    // Menu items
    dishes: [
        // 今日推荐
        {
            id: 1,
            name: "宫保鸡丁",
            price: 28.00,
            originalPrice: 32.00,
            category: 1,
            description: "经典川菜，鸡肉鲜嫩，花生香脆，酸甜微辣",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
            tags: ["招牌", "微辣"],
            rating: 4.9,
            salesCount: 520,
            spicy: 1,
            featured: true
        },
        {
            id: 2,
            name: "麻婆豆腐",
            price: 22.00,
            category: 1,
            description: "正宗川味，豆腐嫩滑，麻辣鲜香，下饭神器",
            image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop",
            tags: ["素食", "中辣"],
            rating: 4.8,
            salesCount: 380,
            spicy: 2,
            featured: true
        },
        {
            id: 3,
            name: "白切鸡",
            price: 35.00,
            category: 1,
            description: "精选土鸡，肉质鲜美，配特制蘸料",
            image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop",
            tags: ["清淡", "营养"],
            rating: 4.7,
            salesCount: 200,
            spicy: 0,
            featured: true
        },

        // 招牌川菜
        {
            id: 4,
            name: "水煮鱼",
            price: 58.00,
            category: 2,
            description: "新鲜鱼片，麻辣鲜香，配时令蔬菜",
            image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop",
            tags: ["招牌", "重辣"],
            rating: 4.9,
            salesCount: 180,
            spicy: 3
        },
        {
            id: 5,
            name: "口水鸡",
            price: 32.00,
            category: 2,
            description: "四川名菜，鸡肉软嫩，口感层次丰富",
            image: "https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=400&h=300&fit=crop",
            tags: ["经典", "中辣"],
            rating: 4.8,
            salesCount: 220,
            spicy: 2
        },
        {
            id: 6,
            name: "毛血旺",
            price: 42.00,
            category: 2,
            description: "重庆特色，血旺嫩滑，配菜丰富",
            image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop",
            tags: ["特色", "重辣"],
            rating: 4.6,
            salesCount: 150,
            spicy: 3
        },

        // 清爽素食
        {
            id: 7,
            name: "蒜蓉西兰花",
            price: 18.00,
            category: 3,
            description: "新鲜西兰花，清香蒜蓉，营养健康",
            image: "https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=400&h=300&fit=crop",
            tags: ["素食", "清淡"],
            rating: 4.5,
            salesCount: 120,
            spicy: 0
        },
        {
            id: 8,
            name: "干煸四季豆",
            price: 20.00,
            category: 3,
            description: "四季豆爽脆，调料香浓，开胃下饭",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
            tags: ["素食", "微辣"],
            rating: 4.6,
            salesCount: 90,
            spicy: 1
        },
        {
            id: 9,
            name: "凉拌黄瓜",
            price: 12.00,
            category: 3,
            description: "清脆黄瓜，酸甜开胃，解腻必备",
            image: "https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=400&h=300&fit=crop",
            tags: ["凉菜", "爽口"],
            rating: 4.4,
            salesCount: 200,
            spicy: 0
        },

        // 饮品甜点
        {
            id: 10,
            name: "柠檬蜂蜜茶",
            price: 15.00,
            category: 4,
            description: "新鲜柠檬，天然蜂蜜，清香怡人",
            image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
            tags: ["饮品", "清香"],
            rating: 4.7,
            salesCount: 300,
            spicy: 0
        },
        {
            id: 11,
            name: "银耳莲子汤",
            price: 18.00,
            category: 4,
            description: "滋补甜汤，银耳软糯，莲子清香",
            image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
            tags: ["甜品", "滋补"],
            rating: 4.6,
            salesCount: 80,
            spicy: 0
        },
        {
            id: 12,
            name: "红豆沙",
            price: 16.00,
            category: 4,
            description: "香甜红豆，细腻沙质，温润可口",
            image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop",
            tags: ["甜品", "传统"],
            rating: 4.5,
            salesCount: 60,
            spicy: 0
        },

        // 汤品粥类
        {
            id: 13,
            name: "老鸭汤",
            price: 38.00,
            category: 5,
            description: "老鸭慢炖，汤汁清香，营养滋补",
            image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
            tags: ["汤品", "滋补"],
            rating: 4.8,
            salesCount: 110,
            spicy: 0
        },
        {
            id: 14,
            name: "白粥",
            price: 8.00,
            category: 5,
            description: "香滑白粥，温润养胃，配菜必选",
            image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
            tags: ["粥品", "养胃"],
            rating: 4.3,
            salesCount: 250,
            spicy: 0
        },

        // 特色小菜
        {
            id: 15,
            name: "泡菜",
            price: 10.00,
            category: 6,
            description: "自制泡菜，酸脆开胃，佐餐佳品",
            image: "https://images.unsplash.com/photo-1563379091339-03246963d7d9?w=400&h=300&fit=crop",
            tags: ["小菜", "开胃"],
            rating: 4.4,
            salesCount: 180,
            spicy: 1
        }
    ],

    // Sample orders for order history
    orders: [
        {
            id: "2024011201",
            status: "preparing",
            statusText: "准备中",
            orderTime: "2024-01-12 14:30",
            estimatedTime: "15:00",
            total: 86.00,
            items: [
                { dishId: 1, name: "宫保鸡丁", price: 28.00, quantity: 1 },
                { dishId: 4, name: "水煮鱼", price: 58.00, quantity: 1 }
            ],
            deliveryInfo: {
                name: "张先生",
                phone: "138****8888",
                address: "朝阳区三里屯街道工体北路8号院"
            }
        },
        {
            id: "2024011101",
            status: "completed",
            statusText: "已完成",
            orderTime: "2024-01-11 19:20",
            deliveredTime: "19:55",
            total: 52.00,
            rating: 5,
            items: [
                { dishId: 2, name: "麻婆豆腐", price: 22.00, quantity: 1 },
                { dishId: 5, name: "口水鸡", price: 32.00, quantity: 1 }
            ],
            deliveryInfo: {
                name: "李女士",
                phone: "139****9999",
                address: "海淀区中关村大街27号"
            }
        }
    ],

    // User info (mock)
    user: {
        id: 1,
        name: "用户001",
        phone: "138****8888",
        defaultAddress: {
            name: "张先生",
            phone: "138****8888",
            address: "朝阳区三里屯街道工体北路8号院",
            detail: "A座1208室"
        },
        addresses: [
            {
                id: 1,
                name: "张先生",
                phone: "138****8888",
                address: "朝阳区三里屯街道工体北路8号院",
                detail: "A座1208室",
                isDefault: true
            },
            {
                id: 2,
                name: "王女士",
                phone: "139****7777",
                address: "海淀区中关村大街27号",
                detail: "科技大厦15层",
                isDefault: false
            }
        ]
    }
};