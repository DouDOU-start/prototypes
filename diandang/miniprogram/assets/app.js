// ============================================
// 点当小程序 - 主应用文件
// ============================================

// 全局状态变量
let currentPage = 'splash';
let cartItems = 0;
let pageHistory = [];
let selectedMerchant = null;
let currentUserLocation = { lat: 30.6598, lng: 104.0656 }; // 默认春熙路位置

// 初始化应用数据
function initializeAppData() {
    if (typeof miniprogramData !== 'undefined' && typeof platformData !== 'undefined') {
        // 设置用户信息
        miniprogramData.user = platformData.users[0];
        miniprogramData.cart = [];
        miniprogramData.currentMerchant = null;
        miniprogramData.orders = [];
    }
}

// ============================================
// 页面导航系统
// ============================================

// 显示指定页面
async function showPage(pageId) {
    try {
        const response = await fetch(`./pages/${pageId}.html`);
        if (!response.ok) throw new Error(`页面 ${pageId} 加载失败`);
        
        const html = await response.text();
        const appContainer = document.querySelector('.app-container');
        if (appContainer) {
            appContainer.innerHTML = html;
            
            // 为当前页面添加 active 类
            const currentPageElement = appContainer.querySelector('.page');
            if (currentPageElement) {
                currentPageElement.classList.add('active');
            }
        }
        
        currentPage = pageId;
        
        // 更新页面标题
        const title = pageConfig?.titles?.[pageId] || '点当外卖';
        document.title = title;
        
        // 执行页面特定的初始化
        await initializePage(pageId);
        
        // 更新导航状态
        updateNavigationState();
        
    } catch (error) {
        console.error('页面加载失败:', error);
        showErrorMessage('页面加载失败，请重试');
    }
}

// 初始化页面
async function initializePage(pageId) {
    switch (pageId) {
        case 'home':
            renderMerchantList();
            renderRecommendedItems();
            updateUserInfo();
            break;
        case 'menu':
            renderMenu();
            break;
        case 'cart':
            renderCart();
            break;
        case 'status':
            renderCurrentOrder();
            break;
        case 'orders':
            renderOrderHistory();
            break;
        case 'profile':
            updateUserInfo();
            break;
    }
}

// 更新导航状态
function updateNavigationState() {
    const mainPages = ['home', 'menu', 'cart', 'status', 'profile'];
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.classList.remove('active');
        const pageId = item.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        if (pageId === currentPage) {
            item.classList.add('active');
        }
    });
}

// 导航到指定页面
function navigateTo(pageId, element = null) {
    showPage(pageId);
    
    // 更新导航状态
    if (element) {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        element.classList.add('active');
    }
}

// ============================================
// 购物车管理
// ============================================

// 添加到购物车
function addToCart(itemId, itemName, itemPrice, quantity = 1) {
    if (!miniprogramData) {
        showErrorMessage('数据未加载，请刷新页面');
        return;
    }
    
    const existingItem = miniprogramData.cart.find(item => item.id == itemId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        miniprogramData.cart.push({
            id: itemId,
            name: itemName,
            price: itemPrice,
            quantity: quantity,
            note: ''
        });
    }
    
    cartItems = miniprogramUtils.getCartTotal(miniprogramData.cart);
    updateCartBadge();
    showSuccessMessage(`${itemName} 已加入购物车`);
}

// 从购物车移除
function removeFromCart(itemId) {
    if (!miniprogramData) return;
    
    miniprogramData.cart = miniprogramData.cart.filter(item => item.id != itemId);
    cartItems = miniprogramUtils.getCartTotal(miniprogramData.cart);
    updateCartBadge();
    renderCart();
}

// 更新购物车商品数量
function updateCartQuantity(itemId, newQuantity) {
    if (!miniprogramData) return;
    
    const item = miniprogramData.cart.find(item => item.id == itemId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
        } else {
            item.quantity = newQuantity;
            cartItems = miniprogramUtils.getCartTotal(miniprogramData.cart);
            updateCartBadge();
            renderCart();
        }
    }
}

// 更新购物车徽章
function updateCartBadge() {
    const ids = ['cartCountHome', 'cartCountMenu', 'cartCountDetail'];
    ids.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = cartItems;
            element.style.display = cartItems > 0 ? 'block' : 'none';
        }
    });
    
    // 更新购物车页面徽章
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        cartBadge.textContent = cartItems;
        cartBadge.style.display = cartItems > 0 ? 'inline-block' : 'none';
    }
}

// 清空购物车
function clearCart() {
    if (confirm('确定要清空购物车吗？')) {
        miniprogramData.cart = [];
        cartItems = 0;
        updateCartBadge();
        renderCart();
    }
}

// ============================================
// 渲染函数
// ============================================

// 渲染购物车
function renderCart() {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer || !miniprogramData) return;
    
    if (miniprogramData.cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon"><i class="fas fa-shopping-cart"></i></div>
                <div class="empty-cart-title">购物车为空</div>
                <div class="empty-cart-desc">去菜单页看看有什么好吃的吧</div>
                <button class="btn-primary" onclick="navigateTo('menu')">浏览菜单</button>
            </div>
        `;
        return;
    }
    
    const cartHtml = miniprogramData.cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">¥${miniprogramUtils.formatPrice(item.price)}</div>
                ${item.note ? `<div class="cart-item-note">备注: ${item.note}</div>` : ''}
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
    
    cartContainer.innerHTML = cartHtml;
    
    // 更新总价
    const totalAmount = miniprogramUtils.getCartAmount(miniprogramData.cart);
    const totalElement = document.getElementById('cartTotal');
    if (totalElement) {
        totalElement.textContent = miniprogramUtils.formatPrice(totalAmount);
    }
}

// 渲染菜单
function renderMenu() {
    if (!miniprogramData?.menuCategories) return;
    
    const menuContainer = document.getElementById('menuItems');
    if (!menuContainer) return;
    
    const menuHtml = miniprogramData.menuCategories.map(category => `
        <div class="menu-category">
            <div class="category-header">
                <span class="category-icon">${category.icon}</span>
                <span class="category-name">${category.name}</span>
            </div>
            <div class="category-items">
                ${category.items.map(item => `
                    <div class="menu-item" onclick="showItemDetail(${item.id})">
                        <div class="menu-item-image">
                            ${item.image ? `<img src="${item.image}" alt="${item.name}" loading="lazy">` : '<i class="fas fa-utensils"></i>'}
                        </div>
                        <div class="menu-item-info">
                            <div class="menu-item-name">${item.name}</div>
                            <div class="menu-item-desc">${item.description}</div>
                            <div class="menu-item-meta">
                                <span class="menu-item-price">¥${miniprogramUtils.formatPrice(item.price)}</span>
                                ${item.originalPrice ? `<span class="original-price">¥${miniprogramUtils.formatPrice(item.originalPrice)}</span>` : ''}
                                <div class="item-rating">
                                    <i class="fas fa-star"></i>
                                    <span>${item.rating}</span>
                                    <span class="sales-count">(${item.salesCount})</span>
                                </div>
                            </div>
                            <div class="item-tags">
                                ${item.tags ? item.tags.slice(0, 2).map(tag => `<span class="item-tag">${tag}</span>`).join('') : ''}
                                ${item.spicyLevel > 0 ? `<span class="spicy-tag">${miniprogramUtils.getSpicyDisplay(item.spicyLevel)}</span>` : ''}
                            </div>
                        </div>
                        <button class="add-btn" onclick="event.stopPropagation(); addToCart(${item.id}, '${item.name}', ${item.price})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
    
    menuContainer.innerHTML = menuHtml;
}

// 渲染商家列表
function renderMerchantList() {
    if (!platformData?.merchants) return;
    
    const merchantListContainer = document.getElementById('merchantList');
    if (!merchantListContainer) return;
    
    const availableMerchants = platformData.merchants.filter(merchant => 
        merchant.status === 'online' || merchant.status === 'busy'
    );
    
    if (availableMerchants.length === 0) {
        merchantListContainer.innerHTML = `
            <div class="no-merchants">
                <div class="no-merchants-icon"><i class="fas fa-store-slash"></i></div>
                <div class="no-merchants-title">暂无营业商家</div>
                <div class="no-merchants-desc">所有商家都在休息，请稍后再试</div>
            </div>
        `;
        return;
    }
    
    const merchantsHtml = availableMerchants.map(merchant => `
        <div class="merchant-card" onclick="selectMerchant('${merchant.id}')">
            <div class="merchant-header">
                <div class="merchant-name">${merchant.name}</div>
                <div class="merchant-status ${merchant.status}">${merchant.status === 'online' ? '营业中' : '繁忙'}</div>
            </div>
            <div class="merchant-info">
                <div class="merchant-rating">
                    <i class="fas fa-star"></i>
                    <span>${merchant.rating}</span>
                </div>
                <div class="merchant-delivery">
                    <i class="fas fa-clock"></i>
                    <span>${merchant.averageDeliveryTime}分钟</span>
                </div>
                <div class="merchant-fee">
                    配送费 ¥${miniprogramUtils.formatPrice(merchant.deliveryFee)}
                </div>
            </div>
            <div class="merchant-features">
                ${merchant.features.slice(0, 3).map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>
            ${merchant.announcement ? `<div class="merchant-announcement">${merchant.announcement}</div>` : ''}
        </div>
    `).join('');
    
    merchantListContainer.innerHTML = merchantsHtml;
}

// 渲染推荐商品
function renderRecommendedItems() {
    const recommendedContainer = document.getElementById('recommendedItems');
    if (!recommendedContainer || !miniprogramData?.menuCategories) return;
    
    // 从各分类中选择推荐商品
    const allItems = [];
    miniprogramData.menuCategories.forEach(category => {
        allItems.push(...category.items.slice(0, 2)); // 每个分类取前2个
    });
    
    const itemsHtml = allItems.map(item => `
        <div class="menu-item" onclick="showItemDetail(${item.id})">
            <div class="menu-item-image">
                ${item.image ? `<img src="${item.image}" alt="${item.name}" loading="lazy">` : '<i class="fas fa-utensils"></i>'}
            </div>
            <div class="menu-item-info">
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-desc">${item.description}</div>
                <div class="menu-item-meta">
                    <span class="menu-item-price">¥${miniprogramUtils.formatPrice(item.price)}</span>
                    ${item.originalPrice ? `<span class="original-price">¥${miniprogramUtils.formatPrice(item.originalPrice)}</span>` : ''}
                    <div class="item-tags">
                        ${item.tags ? item.tags.slice(0, 2).map(tag => `<span class="item-tag">${tag}</span>`).join('') : ''}
                    </div>
                </div>
            </div>
            <button class="add-btn" onclick="event.stopPropagation(); addToCart(${item.id}, '${item.name}', ${item.price})">
                <i class="fas fa-plus"></i>
            </button>
        </div>
    `).join('');
    
    recommendedContainer.innerHTML = itemsHtml;
}

// ============================================
// 订单管理
// ============================================

// 提交订单
function submitOrder() {
    if (!miniprogramData?.cart || miniprogramData.cart.length === 0) {
        showErrorMessage('请选择商品');
        return;
    }
    
    // 创建订单
    const orderId = miniprogramUtils.generateOrderId();
    const itemsTotal = miniprogramUtils.getCartAmount(miniprogramData.cart);
    
    const newOrder = {
        id: orderId,
        userId: miniprogramData.user?.id || 'user_001',
        merchantId: null, // 订单提交时不指定商家
        merchantName: null, // 将由平台分配
        status: 'pending',
        orderType: 'delivery',
        items: [...miniprogramData.cart],
        pricing: {
            itemsTotal: itemsTotal,
            deliveryFee: 5, // 默认配送费，分配商家后调整
            platformFee: Math.max(itemsTotal * 0.03, 1.0),
            discount: 0.0,
            total: itemsTotal + 5 + Math.max(itemsTotal * 0.03, 1.0)
        },
        orderTime: new Date().toISOString(),
        deliveryAddress: miniprogramData.user?.address?.default || '默认地址',
        estimatedTime: {
            preparation: 25,
            delivery: 35,  
            total: 60
        },
        timeline: [
            { status: 'pending', time: new Date().toISOString(), desc: '订单已提交，正在为您智能匹配最佳商家...' }
        ],
        remark: document.getElementById('orderRemark')?.value || '',
        paymentMethod: '微信支付',
        paymentStatus: '待支付'
    };
    
    // 添加到平台订单列表
    if (platformData?.orders) {
        platformData.orders.unshift(newOrder);
    }
    
    // 清空购物车
    miniprogramData.cart = [];
    cartItems = 0;
    updateCartBadge();
    
    // 跳转到支付页面
    showPage('payment');
    
    // 智能派单流程
    setTimeout(() => {
        if (typeof OrderAssignmentService !== 'undefined') {
            const assignmentResult = OrderAssignmentService.assignOrder(orderId, currentUserLocation, newOrder.items);
            
            if (assignmentResult.success) {
                // 分配成功，更新订单信息
                newOrder.merchantId = assignmentResult.merchant.id;
                newOrder.merchantName = assignmentResult.merchant.name;
                newOrder.status = 'assigned';
                newOrder.pricing.deliveryFee = assignmentResult.merchant.deliveryFee;
                newOrder.pricing.total = newOrder.pricing.itemsTotal + assignmentResult.merchant.deliveryFee + newOrder.pricing.platformFee;
                newOrder.estimatedTime = {
                    preparation: assignmentResult.merchant.avgPreparationTime,
                    delivery: assignmentResult.merchant.averageDeliveryTime,
                    total: assignmentResult.estimatedTime
                };
                newOrder.timeline.push({
                    status: 'assigned',
                    time: new Date().toISOString(),
                    desc: `已为您匹配到【${assignmentResult.merchant.name}】，预计 ${assignmentResult.estimatedTime} 分钟送达`
                });
                
                // 如果用户在状态页面，刷新显示
                if (currentPage === 'status') {
                    renderCurrentOrder();
                }
            } else {
                // 分配失败处理
                newOrder.timeline.push({
                    status: 'assignment_failed',
                    time: new Date().toISOString(),
                    desc: `暂时无法为您分配商家：${assignmentResult.reason}，我们正在为您重新匹配...`
                });
                
                if (currentPage === 'status') {
                    renderCurrentOrder();
                }
            }
        }
    }, 2000);
}

// 渲染当前订单状态
function renderCurrentOrder() {
    const currentOrdersContent = document.getElementById('currentOrdersContent');
    if (!currentOrdersContent) return;
    
    // 使用平台订单数据
    let activeOrders = [];
    if (platformData?.orders) {
        activeOrders = platformData.orders.filter(order => 
            order.userId === (miniprogramData.user?.id || 'user_001') &&
            ['pending', 'assigned', 'confirmed', 'preparing', 'ready', 'delivering', 'picked_up', 'on_the_way'].includes(order.status)
        );
    }
    
    if (activeOrders.length === 0) {
        currentOrdersContent.innerHTML = `
            <div class="no-orders">
                <div class="no-orders-icon"><i class="fas fa-clipboard-list"></i></div>
                <div class="no-orders-title">暂无进行中的订单</div>
                <div class="no-orders-desc">去菜单页看看有什么好吃的吧</div>
                <button class="btn-primary" onclick="navigateTo('menu')">浏览菜单</button>
            </div>
        `;
        return;
    }
    
    const ordersHtml = activeOrders.map(order => {
        const config = pageConfig.statusConfig[order.status] || {
            icon: 'fas fa-question',
            title: '未知状态',
            desc: '订单状态异常',
            color: '#999'
        };
        
        const itemsHtml = (order.items || []).map(item => 
            `<div class="order-item">${item.name || '未知商品'} × ${item.quantity || 1}</div>`
        ).join('');
        
        return `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-status" style="color: ${config.color}">
                        <i class="${config.icon}"></i>
                        <span>${config.title}</span>
                    </div>
                    <div class="order-id">#${order.id}</div>
                </div>
                <div class="order-content">
                    <div class="order-desc">${config.desc}</div>
                    ${order.merchantName ? `<div class="merchant-name">商家：${order.merchantName}</div>` : ''}
                    <div class="order-items">${itemsHtml}</div>
                    <div class="order-amount">总计：¥${miniprogramUtils.formatPrice(order.pricing?.total || 0)}</div>
                </div>
                <div class="order-actions">
                    <button class="btn-secondary" onclick="viewOrderDetail('${order.id}')">查看详情</button>
                    ${order.status === 'pending' ? `<button class="btn-danger" onclick="cancelOrder('${order.id}')">取消订单</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    currentOrdersContent.innerHTML = ordersHtml;
}

// ============================================
// 用户相关功能
// ============================================

// 更新用户信息
function updateUserInfo() {
    if (!miniprogramData?.user) return;
    
    const userNameElements = document.querySelectorAll('.username, .user-name');
    const userPointsElements = document.querySelectorAll('.user-points');
    const userLevelElements = document.querySelectorAll('.user-level');
    
    userNameElements.forEach(element => {
        if (element) element.textContent = miniprogramData.user.name;
    });
    
    userPointsElements.forEach(element => {
        if (element) element.textContent = miniprogramData.user.points + '积分';
    });
    
    userLevelElements.forEach(element => {
        if (element) element.textContent = miniprogramData.user.level;
    });
}

// 选择商家
function selectMerchant(merchantId) {
    const merchant = platformData?.merchants?.find(m => m.id === merchantId);
    if (!merchant) return;
    
    miniprogramData.currentMerchant = merchant;
    
    // 加载商家菜单
    loadMerchantMenu(merchantId);
    navigateTo('menu');
}

// 加载商家菜单
function loadMerchantMenu(merchantId) {
    if (!platformData?.menuData) return;
    
    const merchantMenu = platformData.menuData[merchantId];
    if (merchantMenu) {
        miniprogramData.menuCategories = merchantMenu.categories;
    }
}

// ============================================
// 工具函数
// ============================================

// 显示成功消息
function showSuccessMessage(message) {
    // 简化版本的消息提示
    alert(message);
}

// 显示错误消息
function showErrorMessage(message) {
    // 简化版本的错误提示
    alert(message);
}

// 显示商品详情
function showItemDetail(itemId) {
    // 这里可以实现商品详情模态框
    console.log('显示商品详情:', itemId);
}

// 查看订单详情
function viewOrderDetail(orderId) {
    console.log('查看订单详情:', orderId);
}

// 取消订单
function cancelOrder(orderId) {
    if (confirm('确定要取消这个订单吗？')) {
        const order = platformData?.orders?.find(o => o.id === orderId);
        if (order) {
            order.status = 'cancelled';
            order.timeline.push({
                status: 'cancelled',
                time: new Date().toISOString(),
                desc: '订单已取消'
            });
            renderCurrentOrder();
            showSuccessMessage('订单已取消');
        }
    }
}

// ============================================
// 微信登录相关功能
// ============================================

// 开始微信授权登录
function startWeChatAuth() {
    // 显示授权确认页面
    showPage('auth-confirm');
    
    // 模拟授权过程
    setTimeout(() => {
        showPage('auth-processing');
        setTimeout(() => {
            // 授权完成，跳转到首页
            showPage('home');
        }, 2000);
    }, 1000);
}

// 确认授权
function confirmAuth() {
    // 跳转到授权处理页面
    showPage('auth-processing');
    
    // 模拟处理过程
    setTimeout(() => {
        // 授权成功，跳转到首页
        showPage('home');
    }, 2000);
}

// 取消授权
function cancelAuth() {
    // 返回微信登录页面
    showPage('wechat-login');
}

// ============================================
// 导航和界面交互功能
// ============================================

// 返回上一页
function goBack() {
    if (pageHistory.length > 0) {
        const previousPage = pageHistory.pop();
        showPage(previousPage);
    } else {
        showPage('home');
    }
}

// 选择配送地址
function selectDeliveryAddress() {
    alert('选择配送地址功能，实际应用中打开地址选择界面');
}

// 显示分类菜单
function showCategoryMenu(category) {
    console.log('显示分类菜单:', category);
    navigateTo('menu');
}

// 选择支付方式
function selectPayment(element) {
    // 移除其他选中状态
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('selected');
    });
    // 添加当前选中状态
    element.classList.add('selected');
}

// 处理支付
function processPayment() {
    // 模拟支付过程
    showPage('wechat-pay');
    setTimeout(() => {
        showPage('pay-success');
    }, 3000);
}

// ============================================
// 应用初始化
// ============================================

// DOM 加载完成后初始化应用
document.addEventListener('DOMContentLoaded', function() {
    // 初始化数据
    initializeAppData();
    
    // 更新购物车徽章
    updateCartBadge();
    
    // 更新用户信息
    updateUserInfo();
    
    // 显示启动页面
    showPage('splash');
    setTimeout(() => { 
        showPage('wechat-login'); 
    }, 2000);
});