// 平台管理后台应用逻辑
let currentAdminPage = 'dashboard';
let selectedOrder = null;
let autoRefreshInterval = null;

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
    showAdminPage('dashboard');
    startAutoRefresh();
});

function initializeAdmin() {
    if (typeof platformData === 'undefined') {
        console.error('Platform data not loaded');
        return;
    }
    
    updatePendingOrdersCount();
    loadAdminPages();
}

// 页面切换
function showAdminPage(pageId, element) {
    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach(item => 
        item.classList.remove('active')
    );
    if (element) element.classList.add('active');
    
    // 更新页面标题
    const pageTitle = platformAdminData?.pageTitles?.[pageId] || pageId;
    document.getElementById('pageTitle').textContent = pageTitle;
    
    // 渲染页面内容
    currentAdminPage = pageId;
    renderAdminPage(pageId);
}

// 渲染页面内容
function renderAdminPage(pageId) {
    const container = document.querySelector('.page-container');
    
    switch (pageId) {
        case 'dashboard':
            renderDashboard(container);
            break;
        case 'orders':
            renderOrdersPage(container);
            break;
        case 'merchants':
            renderMerchantsPage(container);
            break;
        case 'dispatch':
            renderDispatchPage(container);
            break;
        case 'analytics':
            renderAnalyticsPage(container);
            break;
        case 'settings':
            renderSettingsPage(container);
            break;
    }
}

// 渲染平台概览
function renderDashboard(container) {
    const stats = calculatePlatformStats();
    
    container.innerHTML = `
        <div class="page-content active">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-title">今日订单</div>
                        <div class="stat-icon orders">
                            <i class="fas fa-shopping-bag"></i>
                        </div>
                    </div>
                    <div class="stat-value">${stats.todayOrders}</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i> +12.5%
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-title">活跃商家</div>
                        <div class="stat-icon merchants">
                            <i class="fas fa-store"></i>
                        </div>
                    </div>
                    <div class="stat-value">${stats.activeMerchants}</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i> +2
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-title">今日营收</div>
                        <div class="stat-icon revenue">
                            <i class="fas fa-chart-line"></i>
                        </div>
                    </div>
                    <div class="stat-value">¥${stats.todayRevenue.toLocaleString()}</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i> +8.3%
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-title">活跃用户</div>
                        <div class="stat-icon users">
                            <i class="fas fa-users"></i>
                        </div>
                    </div>
                    <div class="stat-value">${stats.activeUsers}</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i> +15.2%
                    </div>
                </div>
            </div>
            
            <div class="dashboard-content-grid">
                <div class="dashboard-chart-panel">
                    <div class="panel-header">
                        <div class="panel-title">订单趋势分析</div>
                        <div class="chart-controls">
                            <button class="filter-btn active" onclick="updateChartPeriod('today')">今日</button>
                            <button class="filter-btn" onclick="updateChartPeriod('week')">本周</button>
                            <button class="filter-btn" onclick="updateChartPeriod('month')">本月</button>
                        </div>
                    </div>
                    <div class="chart-container">
                        ${renderOrderTrendChart()}
                    </div>
                </div>
                
                <div class="dashboard-activity-panel">
                    <div class="panel-header">
                        <div class="panel-title">实时活动</div>
                        <button class="btn-secondary" onclick="refreshActivities()">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                    <div class="activity-container">
                        ${renderRecentActivities()}
                    </div>
                </div>
            </div>
            
            <div class="platform-insights">
                <div class="insight-card performance">
                    <div class="insight-header">
                        <h4>平台性能</h4>
                        <div class="performance-indicator ${getPerformanceStatus()}">
                            <span class="indicator-dot"></span>
                            <span>${getPerformanceText()}</span>
                        </div>
                    </div>
                    <div class="insight-metrics">
                        <div class="metric">
                            <span class="metric-label">平均响应时间</span>
                            <span class="metric-value">${calculateAverageResponseTime()}ms</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">订单处理率</span>
                            <span class="metric-value">${calculateOrderProcessingRate()}%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">用户满意度</span>
                            <span class="metric-value">${calculateUserSatisfaction()}/5.0</span>
                        </div>
                    </div>
                </div>
                
                <div class="insight-card revenue">
                    <div class="insight-header">
                        <h4>营收洞察</h4>
                        <button class="btn-secondary" onclick="exportRevenueReport()">
                            <i class="fas fa-download"></i> 导出报告
                        </button>
                    </div>
                    <div class="revenue-breakdown">
                        ${renderRevenueBreakdown()}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 渲染订单调度页面
function renderOrdersPage(container) {
    const pendingOrders = platformData.orders.filter(order => order.status === 'pending');
    const allOrders = platformData.orders;
    
    container.innerHTML = `
        <div class="page-content active">
            <div class="order-dispatch-container">
                <div class="orders-panel">
                    <div class="panel-header">
                        <div class="panel-title">订单列表</div>
                        <div class="order-filters">
                            <button class="filter-btn active" onclick="filterOrders('all')">全部</button>
                            <button class="filter-btn" onclick="filterOrders('pending')">待派发</button>
                            <button class="filter-btn" onclick="filterOrders('assigned')">已派发</button>
                            <button class="filter-btn" onclick="filterOrders('preparing')">制作中</button>
                        </div>
                    </div>
                    <div class="orders-list" id="ordersList">
                        ${renderOrdersList(allOrders)}
                    </div>
                </div>
                
                <div class="dispatch-panel">
                    <h3>订单详情</h3>
                    <div id="orderDetails">
                        <div style="text-align: center; padding: 40px; color: #666;">
                            <i class="fas fa-mouse-pointer" style="font-size: 48px; margin-bottom: 15px;"></i>
                            <p>选择左侧订单查看详情</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 渲染商家管理页面
function renderMerchantsPage(container) {
    container.innerHTML = `
        <div class="page-content active">
            <div class="panel-header">
                <div class="panel-title">商家管理</div>
                <button class="filter-btn" onclick="addNewMerchant()">
                    <i class="fas fa-plus"></i> 添加商家
                </button>
            </div>
            
            <div class="merchants-grid">
                ${renderMerchantsGrid()}
            </div>
        </div>
    `;
}

// 渲染派单系统页面
function renderDispatchPage(container) {
    container.innerHTML = `
        <div class="page-content active">
            <div class="dispatch-settings">
                <h3>派单策略配置</h3>
                <div class="strategy-options">
                    <div class="strategy-card">
                        <h4>距离优先</h4>
                        <p>优先派发给距离最近的商家</p>
                        <label class="switch">
                            <input type="radio" name="strategy" value="distance" ${platformData.platformConfig.orderAssignment.strategy === 'distance' ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="strategy-card">
                        <h4>负载均衡</h4>
                        <p>优先派发给负载较低的商家</p>
                        <label class="switch">
                            <input type="radio" name="strategy" value="load" ${platformData.platformConfig.orderAssignment.strategy === 'load' ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="strategy-card">
                        <h4>评分优先</h4>
                        <p>优先派发给评分最高的商家</p>
                        <label class="switch">
                            <input type="radio" name="strategy" value="rating" ${platformData.platformConfig.orderAssignment.strategy === 'rating' ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="strategy-card">
                        <h4>智能混合</h4>
                        <p>综合考虑距离、负载和评分</p>
                        <label class="switch">
                            <input type="radio" name="strategy" value="hybrid" ${platformData.platformConfig.orderAssignment.strategy === 'hybrid' ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
                
                <div class="dispatch-controls">
                    <button class="btn-primary" onclick="updateDispatchStrategy()">保存配置</button>
                    <button class="btn-secondary" onclick="testDispatchAlgorithm()">测试算法</button>
                </div>
            </div>
            
            <div class="dispatch-monitor">
                <h3>实时派单监控</h3>
                <div id="dispatchLog">
                    ${renderDispatchLog()}
                </div>
            </div>
        </div>
    `;
}

// 工具函数
function calculatePlatformStats() {
    const today = new Date().toDateString();
    const todayOrders = platformData.orders.filter(order => 
        new Date(order.orderTime).toDateString() === today
    );
    
    return {
        todayOrders: todayOrders.length,
        activeMerchants: platformData.merchants.filter(m => m.status === 'online').length,
        todayRevenue: todayOrders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0),
        activeUsers: platformData.users.length
    };
}

function renderOrdersList(orders) {
    return orders.map(order => `
        <div class="order-item" onclick="selectOrder('${order.id}')">
            <div class="order-header">
                <span class="order-id">${order.id}</span>
                <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div class="order-info">
                <div>商家: ${order.merchantName || '待分配'}</div>
                <div>时间: ${new Date(order.orderTime).toLocaleTimeString()}</div>
                <div>用户: ${order.deliveryAddress?.name || '未知'}</div>
            </div>
            <div class="order-value">¥${(order.pricing?.total || 0).toFixed(2)}</div>
        </div>
    `).join('');
}

function renderMerchantsGrid() {
    return platformData.merchants.map(merchant => `
        <div class="merchant-card">
            <div class="merchant-header">
                <div class="merchant-info">
                    <h3>${merchant.name}</h3>
                    <div class="merchant-meta">
                        <div class="rating">
                            <i class="fas fa-star"></i>
                            <span>${merchant.rating}</span>
                        </div>
                        <span class="merchant-status ${merchant.status}">${getStatusText(merchant.status)}</span>
                    </div>
                </div>
                <button class="btn-secondary" onclick="manageMerchant('${merchant.id}')">
                    <i class="fas fa-cog"></i>
                </button>
            </div>
            
            <div class="merchant-details">
                <div style="margin-bottom: 10px;">
                    <small>地址:</small> ${merchant.address}
                </div>
                <div style="margin-bottom: 10px;">
                    <small>联系:</small> ${merchant.phone}
                </div>
                <div style="margin-bottom: 15px;">
                    <small>配送范围:</small> ${merchant.deliveryRange}km
                </div>
                
                <div class="load-indicator">
                    <div class="load-bar">
                        <div class="load-progress" style="width: ${(merchant.currentLoad / merchant.capacity * 100)}%"></div>
                    </div>
                    <div class="load-text">
                        负载: ${merchant.currentLoad}/${merchant.capacity} (${Math.round(merchant.currentLoad / merchant.capacity * 100)}%)
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderRecentActivities() {
    const activities = [
        { type: 'order', text: '新订单 ORD2024011503 已创建', time: '2分钟前', priority: 'high' },
        { type: 'merchant', text: '蜀香小厨 状态变更为繁忙', time: '5分钟前', priority: 'medium' },
        { type: 'dispatch', text: '订单 ORD2024011502 已派发给麻辣诱惑', time: '8分钟前', priority: 'low' },
        { type: 'system', text: '派单策略已更新为距离优先', time: '15分钟前', priority: 'low' },
        { type: 'payment', text: '订单 ORD2024011501 支付成功', time: '18分钟前', priority: 'medium' },
        { type: 'merchant', text: '新商家 "川香阁" 已通过审核', time: '25分钟前', priority: 'medium' }
    ];
    
    return activities.map(activity => `
        <div class="activity-item ${activity.priority}">
            <div class="activity-icon ${activity.type}">
                <i class="fas fa-${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-meta">
                    <span class="activity-time">${activity.time}</span>
                    <span class="activity-priority ${activity.priority}">${getPriorityText(activity.priority)}</span>
                </div>
            </div>
            <div class="activity-actions">
                <button class="activity-action-btn" onclick="viewActivityDetail('${activity.type}')">
                    <i class="fas fa-external-link-alt"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function renderDispatchLog() {
    return `
        <div class="dispatch-log-list">
            <div class="log-item">
                <span class="log-time">14:30:15</span>
                <span class="log-action">自动派发</span>
                <span class="log-details">ORD2024011503 → 仓和川菜馆 (距离: 1.2km)</span>
                <span class="log-status success">成功</span>
            </div>
            <div class="log-item">
                <span class="log-time">14:28:42</span>
                <span class="log-action">手动派发</span>
                <span class="log-details">ORD2024011502 → 麻辣诱惑 (管理员指派)</span>
                <span class="log-status success">成功</span>
            </div>
            <div class="log-item">
                <span class="log-time">14:25:18</span>
                <span class="log-action">自动派发</span>
                <span class="log-details">ORD2024011501 → 蜀香小厨 (超出负载)</span>
                <span class="log-status failed">失败</span>
            </div>
        </div>
    `;
}

// 订单相关功能
function selectOrder(orderId) {
    selectedOrder = platformData.orders.find(order => order.id === orderId);
    if (!selectedOrder) return;
    
    // 更新选中状态
    document.querySelectorAll('.order-item').forEach(item => 
        item.classList.remove('selected')
    );
    event.target.closest('.order-item').classList.add('selected');
    
    // 渲染订单详情
    const detailsContainer = document.getElementById('orderDetails');
    if (detailsContainer) {
        detailsContainer.innerHTML = renderOrderDetails(selectedOrder);
    }
}

function renderOrderDetails(order) {
    return `
        <div class="order-details">
            <div class="order-detail-header">
                <h4>${order.id}</h4>
                <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
            </div>
            
            <div class="order-detail-section">
                <h5>基本信息</h5>
                <div class="detail-row">
                    <span>下单时间:</span>
                    <span>${new Date(order.orderTime).toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span>订单类型:</span>
                    <span>${order.orderType === 'delivery' ? '外卖配送' : '到店自取'}</span>
                </div>
                <div class="detail-row">
                    <span>商家:</span>
                    <span>${order.merchantName || '待分配'}</span>
                </div>
            </div>
            
            <div class="order-detail-section">
                <h5>配送信息</h5>
                <div class="detail-row">
                    <span>地址:</span>
                    <span>${order.deliveryAddress?.detail || '未知'}</span>
                </div>
                <div class="detail-row">
                    <span>联系电话:</span>
                    <span>${order.deliveryAddress?.phone || '未知'}</span>
                </div>
            </div>
            
            <div class="order-detail-section">
                <h5>商品清单</h5>
                ${order.items.map(item => `
                    <div class="detail-row">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>¥${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-detail-section">
                <h5>费用明细</h5>
                <div class="detail-row">
                    <span>商品金额:</span>
                    <span>¥${order.pricing?.itemsTotal?.toFixed(2) || '0.00'}</span>
                </div>
                <div class="detail-row">
                    <span>配送费:</span>
                    <span>¥${order.pricing?.deliveryFee?.toFixed(2) || '0.00'}</span>
                </div>
                <div class="detail-row">
                    <span>平台费:</span>
                    <span>¥${order.pricing?.platformFee?.toFixed(2) || '0.00'}</span>
                </div>
                <div class="detail-row total">
                    <span>总计:</span>
                    <span>¥${order.pricing?.total?.toFixed(2) || '0.00'}</span>
                </div>
            </div>
            
            ${order.status === 'pending' ? `
                <div class="order-actions">
                    <button class="btn-primary" onclick="manualDispatchOrder('${order.id}')">
                        <i class="fas fa-share"></i> 手动派发
                    </button>
                    <button class="btn-secondary" onclick="cancelOrder('${order.id}')">
                        <i class="fas fa-times"></i> 取消订单
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

// 派单相关功能
function manualDispatchOrder(orderId) {
    const availableMerchants = platformData.merchants.filter(m => 
        m.status === 'online' && m.currentLoad < m.capacity
    );
    
    if (availableMerchants.length === 0) {
        alert('暂无可用商家');
        return;
    }
    
    // 简化版本：选择第一个可用商家
    const selectedMerchant = availableMerchants[0];
    const order = platformData.orders.find(o => o.id === orderId);
    
    if (order) {
        order.merchantId = selectedMerchant.id;
        order.merchantName = selectedMerchant.name;
        order.status = 'assigned';
        order.timeline.push({
            status: 'assigned',
            time: new Date().toISOString(),
            desc: `管理员手动分配给${selectedMerchant.name}`
        });
        
        selectedMerchant.currentLoad += 1;
        
        // 刷新页面
        renderOrdersPage(document.querySelector('.page-container'));
        alert(`订单已成功派发给${selectedMerchant.name}`);
    }
}

// 其他工具函数
function getStatusText(status) {
    const statusMap = {
        'pending': '待派发',
        'assigned': '已派发', 
        'confirmed': '已确认',
        'preparing': '制作中',
        'ready': '待取餐',
        'delivering': '配送中',
        'completed': '已完成',
        'cancelled': '已取消',
        'online': '营业中',
        'busy': '繁忙',
        'offline': '休息中'
    };
    return statusMap[status] || status;
}

function getActivityIcon(type) {
    const iconMap = {
        'order': 'shopping-bag',
        'merchant': 'store',
        'dispatch': 'route',
        'system': 'cogs',
        'payment': 'credit-card',
        'user': 'user'
    };
    return iconMap[type] || 'info-circle';
}

function getPriorityText(priority) {
    const priorityMap = {
        'high': '高',
        'medium': '中',
        'low': '低'
    };
    return priorityMap[priority] || '低';
}

// 新增的数据展示组件函数
function renderOrderTrendChart() {
    return `
        <div class="chart-content">
            <div class="chart-svg-container">
                <svg class="trend-chart" viewBox="0 0 400 200">
                    <defs>
                        <linearGradient id="orderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.3" />
                            <stop offset="100%" style="stop-color:#667eea;stop-opacity:0" />
                        </linearGradient>
                    </defs>
                    
                    <!-- 网格线 -->
                    <g class="grid">
                        <line x1="50" y1="180" x2="380" y2="180" stroke="#e1e8ed" stroke-width="1"/>
                        <line x1="50" y1="135" x2="380" y2="135" stroke="#e1e8ed" stroke-width="1"/>
                        <line x1="50" y1="90" x2="380" y2="90" stroke="#e1e8ed" stroke-width="1"/>
                        <line x1="50" y1="45" x2="380" y2="45" stroke="#e1e8ed" stroke-width="1"/>
                    </g>
                    
                    <!-- 数据线 -->
                    <path d="M 50 160 Q 100 140 150 120 T 250 100 T 350 80" 
                          stroke="#667eea" stroke-width="3" fill="none" 
                          stroke-linecap="round"/>
                    
                    <!-- 填充区域 -->
                    <path d="M 50 160 Q 100 140 150 120 T 250 100 T 350 80 L 350 180 L 50 180 Z" 
                          fill="url(#orderGradient)"/>
                    
                    <!-- 数据点 -->
                    <circle cx="50" cy="160" r="4" fill="#667eea"/>
                    <circle cx="150" cy="120" r="4" fill="#667eea"/>
                    <circle cx="250" cy="100" r="4" fill="#667eea"/>
                    <circle cx="350" cy="80" r="4" fill="#667eea"/>
                    
                    <!-- Y轴标签 -->
                    <text x="40" y="185" font-size="12" fill="#666" text-anchor="end">0</text>
                    <text x="40" y="140" font-size="12" fill="#666" text-anchor="end">50</text>
                    <text x="40" y="95" font-size="12" fill="#666" text-anchor="end">100</text>
                    <text x="40" y="50" font-size="12" fill="#666" text-anchor="end">150</text>
                    
                    <!-- X轴标签 -->
                    <text x="50" y="195" font-size="12" fill="#666" text-anchor="middle">00:00</text>
                    <text x="150" y="195" font-size="12" fill="#666" text-anchor="middle">06:00</text>
                    <text x="250" y="195" font-size="12" fill="#666" text-anchor="middle">12:00</text>
                    <text x="350" y="195" font-size="12" fill="#666" text-anchor="middle">18:00</text>
                </svg>
            </div>
            <div class="chart-legend">
                <div class="legend-item">
                    <span class="legend-color" style="background: #667eea;"></span>
                    <span>订单数量</span>
                </div>
            </div>
        </div>
    `;
}

function renderRevenueBreakdown() {
    const revenueData = [
        { label: '佣金收入', value: 12580, percentage: 65, color: '#667eea' },
        { label: '配送费', value: 3420, percentage: 18, color: '#ff6b35' },
        { label: '平台服务费', value: 2280, percentage: 12, color: '#1abc9c' },
        { label: '其他收入', value: 950, percentage: 5, color: '#9b59b6' }
    ];
    
    return `
        <div class="revenue-chart">
            <div class="revenue-items">
                ${revenueData.map(item => `
                    <div class="revenue-item">
                        <div class="revenue-info">
                            <div class="revenue-label">
                                <span class="revenue-color" style="background: ${item.color};"></span>
                                <span>${item.label}</span>
                            </div>
                            <div class="revenue-amount">¥${item.value.toLocaleString()}</div>
                        </div>
                        <div class="revenue-bar">
                            <div class="revenue-progress" style="width: ${item.percentage}%; background: ${item.color};"></div>
                        </div>
                        <div class="revenue-percentage">${item.percentage}%</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// 性能指标相关函数
function getPerformanceStatus() {
    return 'excellent'; // 可以根据实际数据计算
}

function getPerformanceText() {
    const status = getPerformanceStatus();
    const statusMap = {
        'excellent': '优秀',
        'good': '良好',
        'average': '一般',
        'poor': '较差'
    };
    return statusMap[status] || '未知';
}

function calculateAverageResponseTime() {
    return Math.floor(Math.random() * 500 + 200); // 模拟数据
}

function calculateOrderProcessingRate() {
    return (Math.random() * 20 + 80).toFixed(1); // 模拟数据
}

function calculateUserSatisfaction() {
    return (Math.random() * 1 + 4).toFixed(1); // 模拟数据
}

// 交互函数
function updateChartPeriod(period) {
    // 更新按钮状态
    document.querySelectorAll('.chart-controls .filter-btn').forEach(btn => 
        btn.classList.remove('active')
    );
    event.target.classList.add('active');
    
    // 这里可以添加实际的图表更新逻辑
    console.log(`更新图表周期: ${period}`);
}

function refreshActivities() {
    // 更新活动列表
    const activityContainer = document.querySelector('.activity-container');
    if (activityContainer) {
        activityContainer.innerHTML = renderRecentActivities();
    }
}

function viewActivityDetail(type) {
    console.log(`查看活动详情: ${type}`);
    // 这里可以添加实际的详情显示逻辑
}

function exportRevenueReport() {
    console.log('导出营收报告');
    // 这里可以添加实际的导出功能
}

function updatePendingOrdersCount() {
    const pendingCount = platformData.orders.filter(order => order.status === 'pending').length;
    const badge = document.getElementById('pendingOrdersCount');
    if (badge) {
        badge.textContent = pendingCount;
        badge.style.display = pendingCount > 0 ? 'inline-flex' : 'none';
    }
}

function startAutoRefresh() {
    autoRefreshInterval = setInterval(() => {
        updatePendingOrdersCount();
        if (currentAdminPage === 'orders') {
            renderOrdersPage(document.querySelector('.page-container'));
        }
    }, 30000); // 30秒刷新一次
}

// 交互函数 - 订单筛选
function filterOrders(type) {
    // 更新按钮状态
    document.querySelectorAll('.order-filters .filter-btn').forEach(btn => 
        btn.classList.remove('active')
    );
    event.target.classList.add('active');
    
    // 筛选订单
    let filteredOrders = platformData.orders;
    if (type !== 'all') {
        filteredOrders = platformData.orders.filter(order => order.status === type);
    }
    
    // 更新订单列表
    const ordersList = document.getElementById('ordersList');
    if (ordersList) {
        ordersList.innerHTML = renderOrdersList(filteredOrders);
    }
}

function addNewMerchant() {
    // 模拟添加商家对话框
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>添加新商家</h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>商家名称</label>
                    <input type="text" class="form-input" placeholder="请输入商家名称" />
                </div>
                <div class="form-group">
                    <label>联系电话</label>
                    <input type="tel" class="form-input" placeholder="请输入联系电话" />
                </div>
                <div class="form-group">
                    <label>地址信息</label>
                    <input type="text" class="form-input" placeholder="请输入详细地址" />
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeModal()">取消</button>
                <button class="btn-primary" onclick="submitNewMerchant()">确认添加</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function manageMerchant(merchantId) {
    console.log(`管理商家: ${merchantId}`);
    // 这里可以添加实际的商家管理逻辑
}

function updateDispatchStrategy() {
    const selectedStrategy = document.querySelector('input[name="strategy"]:checked')?.value;
    if (selectedStrategy) {
        platformData.platformConfig.orderAssignment.strategy = selectedStrategy;
        showNotification('派单策略已更新', 'success');
    }
}

function testDispatchAlgorithm() {
    showNotification('开始测试派单算法...', 'info');
    
    // 模拟测试进度
    setTimeout(() => {
        showNotification('测试完成，算法运行正常', 'success');
    }, 2000);
}

// 新增的功能函数
function updateAnalyticsPeriod(period) {
    console.log(`更新分析周期: ${period}`);
    // 这里可以添加实际的数据更新逻辑
}

function generateReport() {
    showNotification('正在生成报告...', 'info');
    
    setTimeout(() => {
        showNotification('报告生成成功，已下载到本地', 'success');
    }, 1500);
}

function viewMerchantRanking() {
    console.log('查看商家排行榜');
    // 这里可以添加实际的排行榜显示逻辑
}

function resetToDefaults() {
    if (confirm('确认要恢复所有设置为默认值吗？')) {
        showNotification('设置已恢复为默认值', 'success');
        // 这里可以添加实际的恢复逻辑
    }
}

function saveAllSettings() {
    showNotification('正在保存设置...', 'info');
    
    setTimeout(() => {
        showNotification('设置保存成功', 'success');
    }, 1000);
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function submitNewMerchant() {
    showNotification('正在添加商家...', 'info');
    
    setTimeout(() => {
        showNotification('商家添加成功', 'success');
        closeModal();
        // 刷新商家列表
        if (currentAdminPage === 'merchants') {
            renderMerchantsPage(document.querySelector('.page-container'));
        }
    }, 1500);
}

// 通知系统
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 自动消失
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

function getNotificationIcon(type) {
    const iconMap = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return iconMap[type] || 'info-circle';
}

function renderAnalyticsPage(container) {
    container.innerHTML = `
        <div class="page-content active">
            <div class="analytics-header">
                <div class="analytics-title">数据分析中心</div>
                <div class="analytics-controls">
                    <select class="analytics-period" onchange="updateAnalyticsPeriod(this.value)">
                        <option value="today">今日</option>
                        <option value="week" selected>本周</option>
                        <option value="month">本月</option>
                        <option value="quarter">本季度</option>
                    </select>
                    <button class="btn-primary" onclick="generateReport()">
                        <i class="fas fa-file-export"></i> 生成报告
                    </button>
                </div>
            </div>
            
            <div class="analytics-grid">
                <div class="analytics-panel sales">
                    <div class="panel-header">
                        <div class="panel-title">销售分析</div>
                        <div class="panel-trend positive">
                            <i class="fas fa-arrow-up"></i> +18.5%
                        </div>
                    </div>
                    <div class="analytics-chart">
                        ${renderSalesChart()}
                    </div>
                </div>
                
                <div class="analytics-panel orders">
                    <div class="panel-header">
                        <div class="panel-title">订单分析</div>
                        <div class="panel-trend positive">
                            <i class="fas fa-arrow-up"></i> +12.3%
                        </div>
                    </div>
                    <div class="analytics-chart">
                        ${renderOrdersChart()}
                    </div>
                </div>
                
                <div class="analytics-panel merchants">
                    <div class="panel-header">
                        <div class="panel-title">商家表现</div>
                        <button class="btn-secondary" onclick="viewMerchantRanking()">
                            <i class="fas fa-list"></i> 排行榜
                        </button>
                    </div>
                    <div class="merchant-performance">
                        ${renderMerchantPerformance()}
                    </div>
                </div>
                
                <div class="analytics-panel users">
                    <div class="panel-header">
                        <div class="panel-title">用户行为</div>
                        <div class="panel-info">
                            <i class="fas fa-info-circle"></i>
                        </div>
                    </div>
                    <div class="user-analytics">
                        ${renderUserAnalytics()}
                    </div>
                </div>
            </div>
            
            <div class="analytics-insights">
                <div class="insight-panel">
                    <div class="insight-title">智能洞察</div>
                    <div class="insights-list">
                        ${renderBusinessInsights()}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderSalesChart() {
    return `
        <div class="chart-mini">
            <div class="chart-value">¥${(Math.random() * 50000 + 100000).toLocaleString('zh-CN', {maximumFractionDigits: 0})}</div>
            <div class="chart-label">本周销售额</div>
            <div class="mini-trend">
                <svg viewBox="0 0 100 30">
                    <path d="M5 25 Q 25 20 45 15 T 85 5" stroke="#27ae60" stroke-width="2" fill="none"/>
                </svg>
            </div>
        </div>
    `;
}

function renderOrdersChart() {
    return `
        <div class="chart-mini">
            <div class="chart-value">${Math.floor(Math.random() * 500 + 1200)}</div>
            <div class="chart-label">本周订单数</div>
            <div class="mini-trend">
                <svg viewBox="0 0 100 30">
                    <path d="M5 20 Q 25 15 45 18 T 85 8" stroke="#667eea" stroke-width="2" fill="none"/>
                </svg>
            </div>
        </div>
    `;
}

function renderMerchantPerformance() {
    const merchants = [
        { name: '麻辣诱惑', score: 98, trend: 'up' },
        { name: '蜀香小厨', score: 95, trend: 'up' },
        { name: '仓和川菜馆', score: 92, trend: 'down' },
        { name: '川香阁', score: 88, trend: 'up' }
    ];
    
    return merchants.map((merchant, index) => `
        <div class="merchant-rank-item">
            <div class="rank-number">${index + 1}</div>
            <div class="merchant-name">${merchant.name}</div>
            <div class="merchant-score">${merchant.score}</div>
            <div class="merchant-trend ${merchant.trend}">
                <i class="fas fa-arrow-${merchant.trend === 'up' ? 'up' : 'down'}"></i>
            </div>
        </div>
    `).join('');
}

function renderUserAnalytics() {
    return `
        <div class="user-metrics">
            <div class="user-metric">
                <div class="metric-icon">
                    <i class="fas fa-user-plus"></i>
                </div>
                <div class="metric-data">
                    <div class="metric-value">${Math.floor(Math.random() * 100 + 250)}</div>
                    <div class="metric-label">新用户</div>
                </div>
            </div>
            
            <div class="user-metric">
                <div class="metric-icon">
                    <i class="fas fa-redo"></i>
                </div>
                <div class="metric-data">
                    <div class="metric-value">${Math.floor(Math.random() * 30 + 65)}%</div>
                    <div class="metric-label">复购率</div>
                </div>
            </div>
            
            <div class="user-metric">
                <div class="metric-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="metric-data">
                    <div class="metric-value">${Math.floor(Math.random() * 5 + 8)}分钟</div>
                    <div class="metric-label">平均停留</div>
                </div>
            </div>
        </div>
    `;
}

function renderBusinessInsights() {
    const insights = [
        { type: 'trend', title: '午餐时段订单量显著上升', description: '建议在 11:30-13:30 加强人员配置', priority: 'high' },
        { type: 'opportunity', title: '新区域市场潜力巨大', description: '建议考虑在高新区扩展商家', priority: 'medium' },
        { type: 'warning', title: '部分商家响应速度较慢', description: '建议对响应时间超过 30 分钟的商家进行培训', priority: 'medium' }
    ];
    
    return insights.map(insight => `
        <div class="insight-item ${insight.priority}">
            <div class="insight-icon ${insight.type}">
                <i class="fas fa-${getInsightIcon(insight.type)}"></i>
            </div>
            <div class="insight-content">
                <div class="insight-title">${insight.title}</div>
                <div class="insight-description">${insight.description}</div>
            </div>
            <div class="insight-priority ${insight.priority}">
                ${getPriorityText(insight.priority)}
            </div>
        </div>
    `).join('');
}

function getInsightIcon(type) {
    const iconMap = {
        'trend': 'chart-line',
        'opportunity': 'lightbulb',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return iconMap[type] || 'info-circle';
}

function renderSettingsPage(container) {
    container.innerHTML = `
        <div class="page-content active">
            <div class="settings-header">
                <div class="settings-title">平台配置中心</div>
                <div class="settings-actions">
                    <button class="btn-secondary" onclick="resetToDefaults()">
                        <i class="fas fa-undo"></i> 恢复默认
                    </button>
                    <button class="btn-primary" onclick="saveAllSettings()">
                        <i class="fas fa-save"></i> 保存设置
                    </button>
                </div>
            </div>
            
            <div class="settings-content">
                <div class="settings-section">
                    <div class="section-title">基础设置</div>
                    <div class="settings-grid">
                        <div class="setting-item">
                            <div class="setting-label">平台名称</div>
                            <input type="text" class="setting-input" value="点当外卖平台" />
                        </div>
                        <div class="setting-item">
                            <div class="setting-label">服务时间</div>
                            <div class="time-range">
                                <input type="time" class="setting-input time" value="08:00" />
                                <span>至</span>
                                <input type="time" class="setting-input time" value="22:00" />
                            </div>
                        </div>
                        <div class="setting-item">
                            <div class="setting-label">最大配送距离</div>
                            <div class="input-with-unit">
                                <input type="number" class="setting-input" value="5" />
                                <span class="unit">km</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="settings-section">
                    <div class="section-title">订单设置</div>
                    <div class="settings-grid">
                        <div class="setting-item">
                            <div class="setting-label">订单超时时间</div>
                            <div class="input-with-unit">
                                <input type="number" class="setting-input" value="30" />
                                <span class="unit">分钟</span>
                            </div>
                        </div>
                        <div class="setting-item">
                            <div class="setting-label">最低起送金额</div>
                            <div class="input-with-unit">
                                <span class="unit-prefix">¥</span>
                                <input type="number" class="setting-input" value="20" />
                            </div>
                        </div>
                        <div class="setting-item">
                            <div class="setting-label">基础配送费</div>
                            <div class="input-with-unit">
                                <span class="unit-prefix">¥</span>
                                <input type="number" class="setting-input" value="3" />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="settings-section">
                    <div class="section-title">派单策略</div>
                    <div class="strategy-settings">
                        <div class="setting-item full-width">
                            <div class="setting-label">默认派单策略</div>
                            <div class="strategy-options">
                                <label class="strategy-option">
                                    <input type="radio" name="defaultStrategy" value="distance" checked />
                                    <span class="strategy-card mini">
                                        <i class="fas fa-map-marker-alt"></i>
                                        <span>距离优先</span>
                                    </span>
                                </label>
                                <label class="strategy-option">
                                    <input type="radio" name="defaultStrategy" value="load" />
                                    <span class="strategy-card mini">
                                        <i class="fas fa-balance-scale"></i>
                                        <span>负载均衡</span>
                                    </span>
                                </label>
                                <label class="strategy-option">
                                    <input type="radio" name="defaultStrategy" value="rating" />
                                    <span class="strategy-card mini">
                                        <i class="fas fa-star"></i>
                                        <span>评分优先</span>
                                    </span>
                                </label>
                                <label class="strategy-option">
                                    <input type="radio" name="defaultStrategy" value="hybrid" />
                                    <span class="strategy-card mini">
                                        <i class="fas fa-brain"></i>
                                        <span>智能混合</span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="settings-section">
                    <div class="section-title">通知设置</div>
                    <div class="notification-settings">
                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-label">新订单提醒</div>
                                <div class="setting-desc">收到新订单时发送通知</div>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" checked />
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-label">系统异常报警</div>
                                <div class="setting-desc">系统出现异常时发送报警</div>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" checked />
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-label">日报发送</div>
                                <div class="setting-desc">每日自动发送运营数据报告</div>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" />
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}