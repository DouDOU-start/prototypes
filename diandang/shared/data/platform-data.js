// 平台聚合数据模型 - 支持多商家订餐平台
const platformData = {
    // 平台信息
    platform: {
        name: '点当外卖平台',
        slogan: '美食聚合，一键到达',
        version: '2.0.0',
        supportPhone: '400-888-6666'
    },

    // 商家数据
    merchants: [
        {
            id: 'merchant_001',
            name: '仓和川菜馆',
            type: 'restaurant',
            status: 'online', // online, offline, busy
            rating: 4.7,
            address: '成都市锦江区春熙路123号',
            phone: '028-8888-6666',
            coordinates: { lat: 30.6598, lng: 104.0656 },
            deliveryRange: 5, // 配送范围(公里)
            averageDeliveryTime: 35, // 平均配送时间(分钟)
            minimumOrder: 30, // 起送金额
            deliveryFee: 5, // 配送费
            operatingHours: {
                open: '10:00',
                close: '22:00'
            },
            cuisine: ['川菜', '家常菜'],
            features: ['外卖', '堂食', '快速出餐'],
            monthlyOrders: 1256,
            capacity: 50, // 同时处理订单数量
            currentLoad: 12, // 当前处理中订单数
            avgPreparationTime: 25, // 平均制作时间
            announcement: '春节期间正常营业，部分菜品供应有限'
        },
        {
            id: 'merchant_002', 
            name: '麻辣诱惑',
            type: 'restaurant',
            status: 'online',
            rating: 4.5,
            address: '成都市武侯区天府二街456号',
            phone: '028-6666-8888',
            coordinates: { lat: 30.5728, lng: 104.0667 },
            deliveryRange: 3,
            averageDeliveryTime: 40,
            minimumOrder: 25,
            deliveryFee: 4,
            operatingHours: {
                open: '11:00',
                close: '23:00'
            },
            cuisine: ['川菜', '麻辣烫'],
            features: ['外卖', '24小时', '夜宵'],
            monthlyOrders: 890,
            capacity: 30,
            currentLoad: 8,
            avgPreparationTime: 20
        },
        {
            id: 'merchant_003',
            name: '蜀香小厨',
            type: 'restaurant', 
            status: 'busy',
            rating: 4.8,
            address: '成都市高新区科华北路789号',
            phone: '028-5555-7777',
            coordinates: { lat: 30.6406, lng: 104.0536 },
            deliveryRange: 4,
            averageDeliveryTime: 30,
            minimumOrder: 35,
            deliveryFee: 6,
            operatingHours: {
                open: '09:30',
                close: '21:30'
            },
            cuisine: ['川菜', '精品菜'],
            features: ['外卖', '堂食', '精品'],
            monthlyOrders: 2100,
            capacity: 80,
            currentLoad: 75,
            avgPreparationTime: 30
        }
    ],

    // 配送员数据
    deliveryDrivers: [
        {
            id: 'driver_001',
            name: '李师傅',
            phone: '138****1234',
            status: 'available', // available, busy, offline
            currentLocation: { lat: 30.6598, lng: 104.0656 },
            rating: 4.8,
            completedOrders: 1256,
            vehicle: 'motorcycle',
            workingHours: { start: '08:00', end: '22:00' },
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
            earnings: {
                today: 285.50,
                thisMonth: 8520.00
            }
        },
        {
            id: 'driver_002', 
            name: '王师傅',
            phone: '139****5678',
            status: 'busy',
            currentLocation: { lat: 30.5728, lng: 104.0667 },
            rating: 4.6,
            completedOrders: 892,
            vehicle: 'electric_bike',
            workingHours: { start: '09:00', end: '21:00' },
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
            currentOrder: 'ORD2024011502',
            earnings: {
                today: 195.00,
                thisMonth: 6420.00
            }
        },
        {
            id: 'driver_003',
            name: '张师傅',
            phone: '137****9012',
            status: 'available',
            currentLocation: { lat: 30.6406, lng: 104.0536 },
            rating: 4.9,
            completedOrders: 2100,
            vehicle: 'electric_bike',
            workingHours: { start: '07:00', end: '23:00' },
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&h=64&fit=crop&crop=face',
            earnings: {
                today: 320.00,
                thisMonth: 9650.00
            }
        }
    ],

    // 用户数据
    users: [
        {
            id: 'user_001',
            name: '小程序用户',
            phone: '138****8888',
            avatar: '',
            points: 258,
            level: '黄金会员',
            address: {
                default: {
                    name: '春熙路地铁站',
                    detail: '成都市锦江区春熙路地铁站A出口',
                    coordinates: { lat: 30.6598, lng: 104.0656 }
                },
                list: [
                    {
                        id: 'addr_001',
                        name: '公司',
                        detail: '成都市高新区天府大道中段1号',
                        coordinates: { lat: 30.5728, lng: 104.0667 }
                    },
                    {
                        id: 'addr_002', 
                        name: '家',
                        detail: '成都市武侯区科华北路100号',
                        coordinates: { lat: 30.6406, lng: 104.0536 }
                    }
                ]
            },
            preferences: {
                cuisine: ['川菜', '家常菜'],
                maxDeliveryTime: 45,
                maxDeliveryFee: 8
            }
        }
    ],

    // 订单数据 - 重构为平台级订单
    orders: [
        {
            id: 'ORD2024011503',
            userId: 'user_001',
            merchantId: 'merchant_001',
            merchantName: '仓和川菜馆',
            status: 'pending', // pending, assigned, confirmed, preparing, ready, delivering, completed, cancelled
            orderType: 'delivery', // delivery, pickup
            items: [
                { id: 1, name: '宫保鸡丁', price: 32.0, quantity: 1, note: '微辣' },
                { id: 2, name: '麻婆豆腐', price: 26.0, quantity: 1, note: '不要花椒' },
                { id: 11, name: '白米饭', price: 5.0, quantity: 2, note: '' }
            ],
            pricing: {
                itemsTotal: 68.0,
                deliveryFee: 5.0,
                platformFee: 2.0,
                discount: 0.0,
                total: 75.0
            },
            orderTime: '2024-01-15 14:30:15',
            deliveryAddress: {
                name: '春熙路地铁站',
                detail: '成都市锦江区春熙路地铁站A出口',
                coordinates: { lat: 30.6598, lng: 104.0656 },
                phone: '138****8888'
            },
            estimatedTime: {
                preparation: 25, // 制作时间
                delivery: 35, // 配送时间
                total: 60 // 总时间
            },
            timeline: [
                { status: 'pending', time: '2024-01-15 14:30:15', desc: '订单已提交，等待分配商家' }
            ],
            remark: '微辣，不要花椒',
            paymentMethod: '微信支付',
            paymentStatus: '已支付',
            assignmentLog: [] // 派单记录
        },
        {
            id: 'ORD2024011502',
            userId: 'user_001', 
            merchantId: 'merchant_002',
            merchantName: '麻辣诱惑',
            status: 'preparing',
            orderType: 'delivery',
            items: [
                { id: 5, name: '糖醋排骨', price: 42.0, quantity: 1, note: '' },
                { id: 9, name: '蛋花汤', price: 15.0, quantity: 1, note: '' },
                { id: 11, name: '白米饭', price: 5.0, quantity: 1, note: '' }
            ],
            pricing: {
                itemsTotal: 62.0,
                deliveryFee: 4.0,
                platformFee: 2.0,
                discount: 0.0,
                total: 68.0
            },
            orderTime: '2024-01-15 13:45:20',
            deliveryAddress: {
                name: '公司',
                detail: '成都市高新区天府大道中段1号',
                coordinates: { lat: 30.5728, lng: 104.0667 },
                phone: '138****8888'
            },
            estimatedTime: {
                preparation: 20,
                delivery: 30,
                total: 50
            },
            timeline: [
                { status: 'pending', time: '2024-01-15 13:45:20', desc: '订单已提交' },
                { status: 'assigned', time: '2024-01-15 13:45:35', desc: '已分配给麻辣诱惑' },
                { status: 'confirmed', time: '2024-01-15 13:46:10', desc: '商家已确认订单' },
                { status: 'preparing', time: '2024-01-15 13:46:30', desc: '开始制作' }
            ],
            remark: '',
            paymentMethod: '支付宝',
            paymentStatus: '已支付',
            assignmentLog: [
                { merchantId: 'merchant_002', assignedAt: '2024-01-15 13:45:35', status: 'accepted' }
            ]
        }
    ],

    // 平台配置
    platformConfig: {
        // 派单策略配置
        orderAssignment: {
            strategy: 'distance', // distance, load, rating, hybrid
            maxAssignmentAttempts: 3,
            assignmentTimeout: 300, // 5分钟超时
            fallbackMerchants: ['merchant_001'], // 兜底商家
            autoAssignment: true
        },
        
        // 定价配置
        pricing: {
            platformFeeRate: 0.03, // 平台费率3%
            minPlatformFee: 1.0,
            maxPlatformFee: 5.0,
            deliveryFeeRange: { min: 2, max: 10 }
        },

        // 服务配置
        service: {
            maxDeliveryTime: 90, // 最大配送时间
            customerServiceHours: { open: '08:00', close: '24:00' },
            refundPolicy: 'auto_approval_under_50' // 50元以下自动退款
        }
    },

    // 菜品数据 - 按商家组织
    menuData: {
        merchant_001: {
            categories: [
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
                            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', 
                            rating: 4.8,
                            salesCount: 156,
                            tags: ['招牌', '微辣', '下饭'],
                            spicyLevel: 2,
                            preparationTime: 15,
                            available: true
                        },
                        { 
                            id: 2, 
                            name: '麻婆豆腐', 
                            price: 26.0, 
                            originalPrice: 28.0,
                            description: '正宗川味麻婆豆腐，嫩滑豆腐配麻辣汤汁，开胃下饭', 
                            image: 'https://images.unsplash.com/photo-1603085219811-c30e8f5c4c70?w=400', 
                            rating: 4.7,
                            salesCount: 134,
                            tags: ['经典', '麻辣', '素食'],
                            spicyLevel: 3,
                            preparationTime: 12,
                            available: true
                        }
                    ]
                }
            ]
        },
        merchant_002: {
            categories: [
                {
                    id: 'spicy',
                    name: '麻辣系列',
                    icon: '🌶️',
                    items: [
                        {
                            id: 101,
                            name: '重庆小面',
                            price: 18.0,
                            originalPrice: 22.0,
                            description: '正宗重庆小面，麻辣鲜香，面条劲道',
                            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
                            rating: 4.6,
                            salesCount: 89,
                            tags: ['麻辣', '面条', '正宗'],
                            spicyLevel: 3,
                            preparationTime: 8,
                            available: true
                        }
                    ]
                }
            ]
        }
    }
};

// 配送管理服务
const deliveryService = {
    // 为订单分配配送员
    assignDriver(orderId) {
        const order = platformData.orders.find(o => o.id === orderId);
        if (!order || order.orderType !== 'delivery') return null;

        // 找到可用的配送员
        const availableDrivers = platformData.deliveryDrivers.filter(driver => 
            driver.status === 'available'
        );

        if (availableDrivers.length === 0) {
            return { success: false, reason: '暂无可用配送员' };
        }

        // 计算距离最近的配送员
        const driversWithDistance = availableDrivers.map(driver => ({
            driver,
            distance: orderAssignmentService.calculateDistance(
                order.deliveryAddress.coordinates,
                driver.currentLocation
            )
        })).sort((a, b) => a.distance - b.distance);

        const selectedDriver = driversWithDistance[0].driver;
        
        // 更新订单和配送员状态
        order.driverId = selectedDriver.id;
        order.driverName = selectedDriver.name;
        order.driverPhone = selectedDriver.phone;
        order.timeline.push({
            status: 'driver_assigned',
            time: new Date().toISOString(),
            desc: `已安排${selectedDriver.name}配送`
        });

        selectedDriver.status = 'busy';
        selectedDriver.currentOrder = orderId;

        return {
            success: true,
            driver: selectedDriver,
            estimatedTime: Math.round(driversWithDistance[0].distance * 3) // 3分钟每公里
        };
    },

    // 更新配送状态
    updateDeliveryStatus(orderId, status, location = null) {
        const order = platformData.orders.find(o => o.id === orderId);
        const driver = platformData.deliveryDrivers.find(d => d.currentOrder === orderId);
        
        if (!order || !driver) return false;

        // 更新配送员位置
        if (location) {
            driver.currentLocation = location;
        }

        // 更新订单状态和时间线
        order.status = status;
        const statusMessages = {
            'picked_up': '配送员已取餐',
            'on_the_way': '配送员正在路上',
            'delivered': '已送达'
        };

        order.timeline.push({
            status: status,
            time: new Date().toISOString(),
            desc: statusMessages[status] || `状态更新为${status}`
        });

        // 如果配送完成，释放配送员
        if (status === 'delivered' || status === 'completed') {
            driver.status = 'available';
            driver.currentOrder = null;
            driver.completedOrders += 1;
            
            // 更新配送员收入
            const deliveryFee = order.pricing.deliveryFee || 0;
            const driverEarning = deliveryFee * 0.8; // 配送员拿80%
            driver.earnings.today += driverEarning;
            driver.earnings.thisMonth += driverEarning;
        }

        return true;
    },

    // 获取配送员实时位置
    getDriverLocation(driverId) {
        const driver = platformData.deliveryDrivers.find(d => d.id === driverId);
        return driver ? driver.currentLocation : null;
    },

    // 计算预估配送时间
    estimateDeliveryTime(fromLocation, toLocation, trafficFactor = 1.2) {
        const distance = orderAssignmentService.calculateDistance(fromLocation, toLocation);
        return Math.round(distance * 3 * trafficFactor); // 基础3分钟/公里 * 交通系数
    }
};

// 订单派发算法
const orderAssignmentService = {
    // 计算商家与用户距离
    calculateDistance(userCoords, merchantCoords) {
        const R = 6371; // 地球半径（公里）
        const dLat = (merchantCoords.lat - userCoords.lat) * Math.PI / 180;
        const dLng = (merchantCoords.lng - userCoords.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(userCoords.lat * Math.PI / 180) * Math.cos(merchantCoords.lat * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // 距离（公里）
    },

    // 计算商家评分（综合距离、负载、评级）
    calculateMerchantScore(merchant, userCoords, strategy = 'distance', orderItems = []) {
        const distance = this.calculateDistance(userCoords, merchant.coordinates);
        const loadRatio = merchant.currentLoad / merchant.capacity;
        const avgPrepTime = merchant.avgPreparationTime || 25;
        const deliveryTime = merchant.averageDeliveryTime || 30;
        
        // 基础评分计算
        const distanceScore = Math.max(0, 100 - distance * 10); // 距离越近分数越高
        const loadScore = Math.max(0, 100 * (1 - loadRatio)); // 负载越低分数越高
        const ratingScore = merchant.rating * 20; // 评级分数 (4.5 * 20 = 90)
        const speedScore = Math.max(0, 100 - (avgPrepTime + deliveryTime) / 2); // 速度分数
        
        // 检查商家是否在营业时间内
        const now = new Date();
        const currentHour = now.getHours();
        const openHour = parseInt(merchant.operatingHours.open.split(':')[0]);
        const closeHour = parseInt(merchant.operatingHours.close.split(':')[0]);
        const isOpen = currentHour >= openHour && currentHour < closeHour;
        
        if (!isOpen) return 0; // 不在营业时间
        
        // 检查商家状态
        if (merchant.status === 'offline') return 0;
        
        // 状态调整系数
        const statusMultiplier = merchant.status === 'online' ? 1.0 : 0.7; // busy状态打折
        
        // 菜品匹配度（如果商家有对应菜品）
        let itemMatchScore = 100;
        if (orderItems.length > 0 && platformData.menuData[merchant.id]) {
            const merchantItems = platformData.menuData[merchant.id].categories
                .flatMap(cat => cat.items)
                .map(item => item.name);
            
            const matchCount = orderItems.filter(item => 
                merchantItems.some(menuItem => menuItem.includes(item.name) || item.name.includes(menuItem))
            ).length;
            
            itemMatchScore = orderItems.length > 0 ? (matchCount / orderItems.length) * 100 : 100;
        }
        
        switch (strategy) {
            case 'distance':
                return distanceScore * statusMultiplier;
                
            case 'load':
                return loadScore * statusMultiplier;
                
            case 'rating':
                return ratingScore * statusMultiplier;
                
            case 'speed':
                return speedScore * statusMultiplier;
                
            case 'hybrid':
                // 智能混合算法 - 根据不同因素加权
                const baseScore = (
                    distanceScore * 0.25 +     // 距离权重25%
                    loadScore * 0.20 +         // 负载权重20%
                    ratingScore * 0.25 +       // 评级权重25%
                    speedScore * 0.15 +        // 速度权重15%
                    itemMatchScore * 0.15      // 菜品匹配度15%
                );
                
                // 加入时间衰减因子（高峰期优先选择快速商家）
                const isPeakHour = (currentHour >= 11 && currentHour <= 13) || (currentHour >= 17 && currentHour <= 19);
                const timeMultiplier = isPeakHour ? 1.2 : 1.0;
                
                return baseScore * statusMultiplier * timeMultiplier;
                
            case 'smart':
                // 更智能的算法 - 考虑历史数据和动态调整
                let smartScore = distanceScore * 0.3 + loadScore * 0.25 + ratingScore * 0.25 + speedScore * 0.2;
                
                // 考虑商家历史表现
                const monthlyOrderRatio = merchant.monthlyOrders / 1000; // 标准化到0-2之间
                const performanceBonus = Math.min(monthlyOrderRatio * 10, 20); // 最多20分加成
                
                // 考虑距离对配送费的影响
                const distancePenalty = distance > merchant.deliveryRange * 0.8 ? -10 : 0;
                
                smartScore += performanceBonus + distancePenalty;
                
                return Math.max(0, smartScore * statusMultiplier);
                
            default:
                return distanceScore * statusMultiplier;
        }
    },

    // 为订单分配商家 - 智能派单算法
    assignOrder(orderId, userCoords, availableItems = []) {
        const order = platformData.orders.find(o => o.id === orderId);
        if (!order) return { success: false, reason: '订单不存在' };

        // 筛选可用商家 - 更严格的筛选条件
        const availableMerchants = platformData.merchants.filter(merchant => {
            const distance = this.calculateDistance(userCoords, merchant.coordinates);
            const isInRange = distance <= merchant.deliveryRange;
            const hasCapacity = merchant.currentLoad < merchant.capacity;
            const isOperational = ['online', 'busy'].includes(merchant.status);
            
            return isInRange && hasCapacity && isOperational;
        });

        if (availableMerchants.length === 0) {
            // 尝试寻找兜底商家
            const fallbackMerchants = platformData.platformConfig.orderAssignment.fallbackMerchants || [];
            const fallbackAvailable = platformData.merchants.filter(merchant => 
                fallbackMerchants.includes(merchant.id) && 
                merchant.status !== 'offline' &&
                merchant.currentLoad < merchant.capacity * 1.2 // 允许超载20%
            );
            
            if (fallbackAvailable.length === 0) {
                return { success: false, reason: '暂无可用商家，请稍后再试' };
            }
            
            // 使用兜底商家
            const fallbackMerchant = fallbackAvailable[0];
            this.assignToMerchant(order, fallbackMerchant, 'fallback');
            return { 
                success: true, 
                merchant: fallbackMerchant,
                estimatedTime: fallbackMerchant.avgPreparationTime + fallbackMerchant.averageDeliveryTime + 10, // 额外10分钟
                isFallback: true
            };
        }

        // 使用智能算法排序
        const strategy = platformData.platformConfig.orderAssignment.strategy || 'hybrid';
        const rankedMerchants = availableMerchants
            .map(merchant => ({
                merchant,
                score: this.calculateMerchantScore(merchant, userCoords, strategy, order.items || []),
                distance: this.calculateDistance(userCoords, merchant.coordinates)
            }))
            .filter(item => item.score > 0) // 过滤掉评分为0的商家
            .sort((a, b) => {
                // 先按评分排序，评分相同时按距离排序
                if (Math.abs(a.score - b.score) < 5) {
                    return a.distance - b.distance;
                }
                return b.score - a.score;
            });

        if (rankedMerchants.length === 0) {
            return { success: false, reason: '没有合适的商家可以处理此订单' };
        }

        const bestMatch = rankedMerchants[0];
        const selectedMerchant = bestMatch.merchant;
        
        // 记录派单决策信息
        const assignmentInfo = {
            strategy: strategy,
            score: bestMatch.score,
            distance: bestMatch.distance,
            alternatives: rankedMerchants.slice(1, 3).map(m => ({
                merchantName: m.merchant.name,
                score: m.score,
                distance: m.distance
            }))
        };

        this.assignToMerchant(order, selectedMerchant, 'auto', assignmentInfo);

        return { 
            success: true, 
            merchant: selectedMerchant,
            estimatedTime: selectedMerchant.avgPreparationTime + selectedMerchant.averageDeliveryTime,
            assignmentInfo: assignmentInfo
        };
    },

    // 将订单分配给特定商家
    assignToMerchant(order, merchant, assignmentType = 'auto', assignmentInfo = null) {
        // 更新订单信息
        order.merchantId = merchant.id;
        order.merchantName = merchant.name;
        order.status = 'assigned';
        
        const timelineDesc = assignmentType === 'fallback' ? 
            `兜底分配给${merchant.name}` : 
            `智能分配给${merchant.name}`;
            
        order.timeline.push({
            status: 'assigned',
            time: new Date().toISOString(),
            desc: timelineDesc,
            assignmentType: assignmentType,
            assignmentInfo: assignmentInfo
        });
        
        // 更新商家负载
        merchant.currentLoad += 1;
        
        // 记录派单日志
        order.assignmentLog.push({
            merchantId: merchant.id,
            assignedAt: new Date().toISOString(),
            status: 'assigned',
            type: assignmentType,
            info: assignmentInfo
        });
    },

    // 智能重新派单（商家拒单时）
    reassignOrder(orderId, rejectedMerchantId, reason = '') {
        const order = platformData.orders.find(o => o.id === orderId);
        if (!order) return { success: false, reason: '订单不存在' };

        // 标记被拒绝的商家
        const rejectedMerchant = platformData.merchants.find(m => m.id === rejectedMerchantId);
        if (rejectedMerchant) {
            rejectedMerchant.currentLoad = Math.max(0, rejectedMerchant.currentLoad - 1);
        }

        // 记录拒单日志
        order.assignmentLog.push({
            merchantId: rejectedMerchantId,
            assignedAt: order.timeline.find(t => t.status === 'assigned')?.time,
            rejectedAt: new Date().toISOString(),
            status: 'rejected',
            reason: reason
        });

        // 重置订单状态
        order.status = 'pending';
        order.merchantId = null;
        order.merchantName = null;
        order.timeline.push({
            status: 'pending',
            time: new Date().toISOString(),
            desc: `${rejectedMerchant?.name || '商家'}拒绝订单，重新分配中`
        });

        // 尝试重新分配，排除已拒绝的商家
        const userCoords = order.deliveryAddress?.coordinates || { lat: 30.6598, lng: 104.0656 };
        
        return this.assignOrder(orderId, userCoords, order.items);
    }
};

// 导出数据和服务
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { platformData, orderAssignmentService, deliveryService };
} else {
    window.platformData = platformData;
    window.orderAssignmentService = orderAssignmentService;
    window.deliveryService = deliveryService;
}