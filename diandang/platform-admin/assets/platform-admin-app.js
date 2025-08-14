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
            
            <div class="dashboard-charts">
                <div class="chart-container">
                    <h3>订单趋势</h3>
                    <div class="chart-placeholder">
                        <i class="fas fa-chart-area" style="font-size: 48px; color: #ddd;"></i>
                        <p style="color: #666; margin-top: 10px;">订单趋势图表</p>
                    </div>
                </div>
            </div>
            
            <div class="recent-activities">
                <h3>最近活动</h3>
                <div class="activity-list">
                    ${renderRecentActivities()}
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
        { type: 'order', text: '新订单 ORD2024011503 已创建', time: '2分钟前' },
        { type: 'merchant', text: '蜀香小厨 状态变更为繁忙', time: '5分钟前' },
        { type: 'dispatch', text: '订单 ORD2024011502 已派发给麻辣诱惑', time: '8分钟前' },
        { type: 'system', text: '派单策略已更新为距离优先', time: '15分钟前' }
    ];
    
    return activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.type}">
                <i class="fas fa-${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${activity.time}</div>
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
        'system': 'cogs'
    };
    return iconMap[type] || 'info-circle';
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

// 占位符函数
function filterOrders(type) {
    // TODO: 实现订单筛选
    console.log('Filter orders by:', type);
}

function addNewMerchant() {
    alert('添加商家功能开发中...');
}

function manageMerchant(merchantId) {
    alert(`管理商家 ${merchantId} 功能开发中...`);
}

function updateDispatchStrategy() {
    const selectedStrategy = document.querySelector('input[name="strategy"]:checked')?.value;
    if (selectedStrategy) {
        platformData.platformConfig.orderAssignment.strategy = selectedStrategy;
        alert('派单策略已更新');
    }
}

function testDispatchAlgorithm() {
    alert('算法测试功能开发中...');
}

function renderAnalyticsPage(container) {
    container.innerHTML = `
        <div class="page-content active">
            <h3>数据分析</h3>
            <p>数据分析功能开发中...</p>
        </div>
    `;
}

function renderSettingsPage(container) {
    container.innerHTML = `
        <div class="page-content active">
            <h3>平台配置</h3>
            <p>平台配置功能开发中...</p>
        </div>
    `;
}