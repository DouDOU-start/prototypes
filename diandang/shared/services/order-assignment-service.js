// 点当平台 - 智能订单分配服务
const OrderAssignmentService = {
    // 计算两点间距离（简化版本，使用经纬度计算）
    calculateDistance: (lat1, lng1, lat2, lng2) => {
        const R = 6371; // 地球半径（公里）
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // 距离（公里）
    },
    
    // 评估商家适合度
    evaluateMerchant: (merchant, userLocation, orderItems) => {
        // 基础检查
        if (merchant.status !== 'online' && merchant.status !== 'busy') {
            return { suitable: false, score: 0, reason: '商家不在营业状态' };
        }
        
        // 计算距离
        const distance = OrderAssignmentService.calculateDistance(
            userLocation.lat, userLocation.lng,
            merchant.coordinates.lat, merchant.coordinates.lng
        );
        
        // 超出配送范围
        if (distance > merchant.deliveryRange) {
            return { suitable: false, score: 0, reason: '超出配送范围' };
        }
        
        // 检查菜品可用性（简化版本）
        const hasAllItems = orderItems.every(orderItem => {
            // 假设商家都有相应菜品，实际应该检查商家菜单
            return true;
        });
        
        if (!hasAllItems) {
            return { suitable: false, score: 0, reason: '部分菜品缺货' };
        }
        
        // 计算适合度评分
        let score = 100;
        
        // 距离评分 (越近越好，满分30)
        const distanceScore = Math.max(0, 30 - (distance * 5));
        score += distanceScore;
        
        // 评分评分 (满分20)
        const ratingScore = (merchant.rating / 5) * 20;
        score += ratingScore;
        
        // 负载评分 (当前订单数越少越好，满分20)
        const loadRatio = merchant.currentLoad / merchant.capacity;
        const loadScore = Math.max(0, 20 - (loadRatio * 20));
        score += loadScore;
        
        // 制作时间评分 (时间越短越好，满分15)
        const timeScore = Math.max(0, 15 - (merchant.avgPreparationTime / 5));
        score += timeScore;
        
        // 月度订单量评分 (经验值，满分15)
        const experienceScore = Math.min(15, (merchant.monthlyOrders / 100) * 15);
        score += experienceScore;
        
        return {
            suitable: true,
            score: score,
            distance: distance,
            estimatedTime: merchant.avgPreparationTime + Math.ceil(distance * 3), // 制作时间 + 配送时间
            reason: '商家可接单'
        };
    },
    
    // 主要的订单分配逻辑
    assignOrder: (orderId, userLocation, orderItems) => {
        try {
            // 获取所有商家数据
            if (typeof platformData === 'undefined') {
                return {
                    success: false,
                    reason: '平台数据未加载'
                };
            }
            
            const merchants = platformData.merchants;
            if (!merchants || merchants.length === 0) {
                return {
                    success: false,
                    reason: '暂无可用商家'
                };
            }
            
            // 评估所有商家
            const evaluations = merchants.map(merchant => ({
                merchant: merchant,
                evaluation: OrderAssignmentService.evaluateMerchant(merchant, userLocation, orderItems)
            }));
            
            // 过滤出适合的商家
            const suitableMerchants = evaluations.filter(item => item.evaluation.suitable);
            
            if (suitableMerchants.length === 0) {
                return {
                    success: false,
                    reason: '当前地区暂无可用商家，请稍后再试'
                };
            }
            
            // 按评分排序，选择最佳商家
            suitableMerchants.sort((a, b) => b.evaluation.score - a.evaluation.score);
            const bestMatch = suitableMerchants[0];
            
            // 更新商家状态（增加当前订单数）
            bestMatch.merchant.currentLoad += 1;
            
            // 记录分配日志
            const assignmentLog = {
                orderId: orderId,
                merchantId: bestMatch.merchant.id,
                merchantName: bestMatch.merchant.name,
                score: bestMatch.evaluation.score,
                distance: bestMatch.evaluation.distance,
                estimatedTime: bestMatch.evaluation.estimatedTime,
                assignTime: new Date().toISOString(),
                alternatives: suitableMerchants.slice(1, 4).map(item => ({
                    merchantId: item.merchant.id,
                    merchantName: item.merchant.name,
                    score: item.evaluation.score
                }))
            };
            
            return {
                success: true,
                merchant: bestMatch.merchant,
                evaluation: bestMatch.evaluation,
                estimatedTime: bestMatch.evaluation.estimatedTime,
                assignmentLog: assignmentLog
            };
            
        } catch (error) {
            console.error('订单分配失败:', error);
            return {
                success: false,
                reason: '系统错误，请稍后再试'
            };
        }
    },
    
    // 重新分配订单（当商家拒绝或无法处理时）
    reassignOrder: (orderId, excludeMerchantIds = []) => {
        // 实现重新分配逻辑
        // 这里可以添加更复杂的重新分配策略
        return OrderAssignmentService.assignOrder(orderId, userLocation, orderItems, excludeMerchantIds);
    },
    
    // 获取分配统计信息
    getAssignmentStats: () => {
        if (typeof platformData === 'undefined') return null;
        
        const merchants = platformData.merchants;
        const totalMerchants = merchants.length;
        const onlineMerchants = merchants.filter(m => m.status === 'online').length;
        const busyMerchants = merchants.filter(m => m.status === 'busy').length;
        const avgLoad = merchants.reduce((sum, m) => sum + (m.currentLoad / m.capacity), 0) / totalMerchants;
        
        return {
            totalMerchants,
            onlineMerchants,
            busyMerchants,
            avgLoad: avgLoad.toFixed(2),
            lastUpdated: new Date().toISOString()
        };
    }
};

// 导出服务
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrderAssignmentService;
} else if (typeof window !== 'undefined') {
    window.OrderAssignmentService = OrderAssignmentService;
    // 兼容原有命名
    window.orderAssignmentService = OrderAssignmentService;
}