// 全局变量
let currentPage = 'dashboard';
let pageHistory = [];
let businessStatus = 'online';
let notificationCount = 0;

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

// 模拟数据
const mockData = {
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
        { id: 1, name: '张先生', phone: '138****8888', visitCount: 23, totalSpent: 1580.5, level: 'VIP', lastVisit: '2024-01-15', preference: '川菜' },
        { id: 2, name: '李女士', phone: '139****6666', visitCount: 18, totalSpent: 980.0, level: '会员', lastVisit: '2024-01-15', preference: '清淡' },
        { id: 3, name: '王先生', phone: '137****9999', visitCount: 12, totalSpent: 650.0, level: '会员', lastVisit: '2024-01-15', preference: '家常菜' },
        { id: 4, name: '赵女士', phone: '136****5555', visitCount: 35, totalSpent: 2280.0, level: 'VIP', lastVisit: '2024-01-14', preference: '川菜' },
        { id: 5, name: '陈先生', phone: '135****7777', visitCount: 8, totalSpent: 420.0, level: '普通', lastVisit: '2024-01-13', preference: '凉菜' }
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
        topDish: '宫保鸡丁'
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
    ]
};

// 初始化应用
document.addEventListener('DOMContentLoaded', async function() {
    await loadPages();
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

// 初始化应用
function initializeApp() {
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
}

// 显示页面
function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
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
        case 'analytics':
            if (typeof initAnalyticsPage === 'function') {
                initAnalyticsPage();
            }
            break;
    }
}

// 更新页面标题和面包屑
function updatePageHeader(pageId) {
    const pageTitle = document.querySelector('.page-title');
    const breadcrumb = document.querySelector('.breadcrumb .current');
    
    const pageTitles = {
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
    // 更新今日订单
    const todayOrders = document.getElementById('today-orders');
    if (todayOrders) {
        animateCountUp(todayOrders, 28);
    }
    
    // 更新今日营收
    const todayRevenue = document.getElementById('today-revenue');
    if (todayRevenue) {
        todayRevenue.textContent = '¥2,485';
    }
    
    // 更新今日客户
    const todayCustomers = document.getElementById('today-customers');
    if (todayCustomers) {
        animateCountUp(todayCustomers, 45);
    }
    
    // 更新低库存商品
    const lowStockItems = document.getElementById('low-stock-items');
    if (lowStockItems) {
        animateCountUp(lowStockItems, 2);
    }
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

// 渲染订单流
function renderOrderStream() {
    const orderStream = document.getElementById('orderStream');
    if (!orderStream) return;
    
    const ordersHtml = mockData.orders.map(order => {
        const statusText = {
            'pending': '待确认',
            'preparing': '制作中', 
            'ready': '已完成'
        };
        
        const itemNames = order.items.map(item => item.name).join(', ');
        const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
        
        return `
            <div class="order-item draggable ${order.status}" data-order-id="${order.id}" onclick="showOrderDetails('${order.id}')">
                <div class="order-avatar">
                    ${order.table}
                </div>
                <div class="order-info">
                    <div class="order-number">${order.id} - ${order.customer}</div>
                    <div class="order-details">${itemNames} (${itemCount}项)</div>
                    <div class="order-time">${order.time} | 等待${order.waitTime}</div>
                </div>
                <div class="order-status ${order.status}">${statusText[order.status]}</div>
                <div class="order-amount">¥${order.amount.toFixed(2)}</div>
            </div>
        `;
    }).join('');
    
    orderStream.innerHTML = ordersHtml;
}

// 渲染热门菜品
function renderPopularItems() {
    const popularItems = document.getElementById('popularItems');
    if (!popularItems) return;
    
    const itemsHtml = mockData.popularItems.map((item, index) => {
        let rankClass = '';
        if (index === 0) rankClass = 'gold';
        else if (index === 1) rankClass = 'silver';
        else if (index === 2) rankClass = 'bronze';
        
        return `
            <div class="popular-item">
                <div class="item-rank ${rankClass}">${index + 1}</div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-sales">销量: ${item.sales}</div>
                </div>
                <div class="item-price">¥${item.price.toFixed(2)}</div>
            </div>
        `;
    }).join('');
    
    popularItems.innerHTML = itemsHtml;
}

// 渲染系统通知
function renderSystemNotifications() {
    const systemNotifications = document.getElementById('systemNotifications');
    if (!systemNotifications) return;
    
    const notificationsHtml = mockData.notifications.map(notification => `
        <div class="notification-item ${notification.unread ? 'unread' : ''}" 
             onclick="markNotificationRead(this)">
            <div class="notification-icon">
                <i class="${notification.icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${notification.time}</div>
            </div>
        </div>
    `).join('');
    
    systemNotifications.innerHTML = notificationsHtml;
}

// 更新通知徽章
function updateNotificationBadge() {
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
    const newOrder = {
        id: 'ORD' + String(Date.now()).slice(-3),
        customer: ['王先生', '李女士', '张先生', '赵女士'][Math.floor(Math.random() * 4)],
        items: [
            ['宫保鸡丁', '白米饭'],
            ['麻婆豆腐', '紫菜蛋花汤'],
            ['回锅肉', '酸辣土豆丝']
        ][Math.floor(Math.random() * 3)],
        amount: Math.floor(Math.random() * 50) + 30,
        status: 'pending',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        table: 'A' + String(Math.floor(Math.random() * 9) + 1).padStart(2, '0')
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

function editMenuItem(itemId) {
    showNotification('编辑菜品', `正在编辑菜品 ${itemId}`, 'info');
}

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