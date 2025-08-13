// Router for merchant dashboard navigation

window.dashboardRouter = {
    currentRoute: 'dashboard',
    
    routes: {
        'dashboard': {
            title: '数据概览',
            subtitle: '实时查看餐厅运营数据',
            render: () => dashboardRouter.renderDashboard()
        },
        'orders': {
            title: '订单管理',
            subtitle: '处理客户订单和配送状态',
            render: () => dashboardRouter.renderOrders()
        },
        'menu': {
            title: '菜单管理',
            subtitle: '管理菜品信息和库存状态',
            render: () => dashboardRouter.renderMenu()
        },
        'analytics': {
            title: '数据分析',
            subtitle: '查看详细的经营分析报告',
            render: () => dashboardRouter.renderAnalytics()
        },
        'settings': {
            title: '店铺设置',
            subtitle: '配置餐厅基本信息和营业设置',
            render: () => dashboardRouter.renderSettings()
        }
    },

    init() {
        this.bindEvents();
        this.navigate('dashboard');
        console.log('Dashboard router initialized');
    },

    bindEvents() {
        // Navigation items
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const page = btn.dataset.page;
                this.navigate(page);
                
                // Close mobile sidebar on navigation
                if (window.innerWidth < 1024 && typeof dashboardApp !== 'undefined') {
                    dashboardApp.closeMobileSidebar();
                }
            });
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshCurrentPage();
        });
    },

    navigate(route) {
        if (!this.routes[route]) {
            console.error(`Route ${route} not found`);
            return;
        }

        this.currentRoute = route;
        this.updateNavigation();
        this.updateHeader(route);
        this.showPage(route);
        this.routes[route].render();
        
        dashboardState.setCurrentPage(route);
        console.log(`Navigated to: ${route}`);
    },

    updateNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === this.currentRoute) {
                item.classList.add('active');
            }
        });
    },

    updateHeader(route) {
        const routeConfig = this.routes[route];
        document.getElementById('pageTitle').textContent = routeConfig.title;
        document.getElementById('pageSubtitle').textContent = routeConfig.subtitle;
    },

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            page.classList.add('hidden');
        });

        const targetPage = document.getElementById(`${pageId}Page`);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            targetPage.classList.add('active');
        }
    },

    refreshCurrentPage() {
        dashboardState.setLoading(true);
        
        setTimeout(() => {
            this.routes[this.currentRoute].render();
            dashboardState.setLoading(false);
            this.showToast('页面已刷新');
        }, 500);
    },

    // Page rendering methods
    renderDashboard() {
        this.updateStatsCards();
        this.renderRecentOrders();
        this.renderPopularDishes();
    },

    updateStatsCards() {
        const stats = dashboardState.stats;
        
        document.getElementById('todayOrders').textContent = stats.orders;
        document.getElementById('todayRevenue').textContent = sharedData.utils.formatPrice(stats.revenue);
        document.getElementById('pendingOrders').textContent = stats.pendingOrders;
    },

    renderRecentOrders() {
        const container = document.getElementById('recentOrdersList');
        const recentOrders = dashboardState.orders.slice(0, 5);

        if (recentOrders.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-receipt text-3xl mb-2"></i>
                    <p>暂无最近订单</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recentOrders.map(order => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer priority-${order.priority}" onclick="dashboardRouter.showOrderDetail('${order.id}')">
                <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                        <h5 class="font-medium text-gray-900">${order.customerName}</h5>
                        <span class="order-status status-${order.status}">${order.statusText}</span>
                    </div>
                    <p class="text-sm text-gray-600">${order.orderTime}</p>
                    <p class="text-sm text-gray-500">${order.itemCount}件商品</p>
                </div>
                <div class="text-right ml-4">
                    <p class="font-bold text-gray-900">${sharedData.utils.formatPrice(order.total)}</p>
                    ${order.priority === 'high' ? '<i class="fas fa-exclamation-circle text-red-500 text-sm mt-1"></i>' : ''}
                </div>
            </div>
        `).join('');
    },

    renderPopularDishes() {
        const container = document.getElementById('popularDishesList');
        const popularDishes = merchantData.popularDishes.slice(0, 5);

        container.innerHTML = popularDishes.map((dish, index) => `
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-sm font-bold text-orange-600">${index + 1}</span>
                </div>
                <img src="${dish.image}" alt="${dish.name}" class="w-12 h-12 object-cover rounded-lg mr-3">
                <div class="flex-1">
                    <h5 class="font-medium text-gray-900">${dish.name}</h5>
                    <p class="text-sm text-gray-500">月售${dish.salesCount} · ${sharedData.utils.formatPrice(dish.revenue)}</p>
                </div>
                <div class="flex items-center text-yellow-500">
                    <i class="fas fa-star text-sm mr-1"></i>
                    <span class="text-sm">${dish.avgRating}</span>
                </div>
            </div>
        `).join('');
    },

    renderOrders() {
        this.renderOrderFilters();
        this.renderOrdersList();
        this.updateNewOrdersBadge();
    },

    renderOrderFilters() {
        const dateFilter = document.getElementById('orderDateFilter');
        if (!dateFilter.value) {
            dateFilter.value = new Date().toISOString().split('T')[0];
        }

        // Bind filter events
        document.getElementById('orderStatusFilter').addEventListener('change', (e) => {
            dashboardState.setOrderFilters({ status: e.target.value });
            this.renderOrdersList();
        });

        document.getElementById('orderDateFilter').addEventListener('change', (e) => {
            dashboardState.setOrderFilters({ date: e.target.value });
            this.renderOrdersList();
        });

        document.getElementById('resetFiltersBtn').addEventListener('click', () => {
            document.getElementById('orderStatusFilter').value = 'all';
            document.getElementById('orderDateFilter').value = '';
            dashboardState.setOrderFilters({ status: 'all', date: null, customer: null });
            this.renderOrdersList();
        });
    },

    renderOrdersList() {
        const container = document.getElementById('ordersListContainer');
        const filteredOrders = dashboardState.getFilteredOrders();

        if (filteredOrders.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 text-gray-500">
                    <i class="fas fa-search text-4xl mb-4"></i>
                    <p class="text-lg mb-2">没有找到匹配的订单</p>
                    <p class="text-sm">请调整筛选条件后重试</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredOrders.map(order => `
            <div class="p-4 hover:bg-gray-50 transition-colors cursor-pointer priority-${order.priority}" onclick="dashboardRouter.showOrderDetail('${order.id}')">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center space-x-3">
                                <h4 class="font-semibold text-gray-900">订单 ${order.id}</h4>
                                <span class="order-status status-${order.status}">${order.statusText}</span>
                                ${order.priority === 'high' ? '<i class="fas fa-exclamation-circle text-red-500"></i>' : ''}
                            </div>
                            <div class="text-right">
                                <p class="font-bold text-lg">${sharedData.utils.formatPrice(order.total)}</p>
                                <p class="text-sm text-gray-500">${order.itemCount}件商品</p>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                                <p><i class="fas fa-user w-4"></i> ${order.customerName}</p>
                                <p><i class="fas fa-phone w-4"></i> ${order.customerPhone}</p>
                            </div>
                            <div>
                                <p><i class="fas fa-clock w-4"></i> ${order.orderTime}</p>
                                <p><i class="fas fa-map-marker-alt w-4"></i> ${order.deliveryAddress}</p>
                            </div>
                        </div>
                        
                        ${order.notes ? `<p class="text-sm text-orange-600 mt-2"><i class="fas fa-comment"></i> ${order.notes}</p>` : ''}
                    </div>
                </div>
                
                <div class="flex items-center justify-between mt-4 pt-3 border-t">
                    <div class="flex items-center space-x-2">
                        ${order.items.slice(0, 3).map(item => `
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">${item.name} x${item.quantity}</span>
                        `).join('')}
                        ${order.items.length > 3 ? `<span class="text-xs text-gray-500">+${order.items.length - 3}...</span>` : ''}
                    </div>
                    
                    <div class="flex space-x-2">
                        ${this.getOrderActionButtons(order)}
                    </div>
                </div>
            </div>
        `).join('');
    },

    getOrderActionButtons(order) {
        const buttons = [];
        
        if (order.status === 'pending') {
            buttons.push(`
                <button class="btn-success px-3 py-1 rounded text-xs font-medium" onclick="event.stopPropagation(); dashboardRouter.updateOrderStatus('${order.id}', 'confirmed')">
                    接单
                </button>
                <button class="btn-danger px-3 py-1 rounded text-xs font-medium" onclick="event.stopPropagation(); dashboardRouter.updateOrderStatus('${order.id}', 'cancelled')">
                    拒单
                </button>
            `);
        } else if (order.status === 'confirmed') {
            buttons.push(`
                <button class="btn-primary px-3 py-1 rounded text-xs font-medium" onclick="event.stopPropagation(); dashboardRouter.updateOrderStatus('${order.id}', 'preparing')">
                    开始制作
                </button>
            `);
        } else if (order.status === 'preparing') {
            buttons.push(`
                <button class="btn-primary px-3 py-1 rounded text-xs font-medium" onclick="event.stopPropagation(); dashboardRouter.updateOrderStatus('${order.id}', 'delivering')">
                    开始配送
                </button>
            `);
        } else if (order.status === 'delivering') {
            buttons.push(`
                <button class="btn-success px-3 py-1 rounded text-xs font-medium" onclick="event.stopPropagation(); dashboardRouter.updateOrderStatus('${order.id}', 'completed')">
                    确认送达
                </button>
            `);
        }
        
        buttons.push(`
            <button class="btn-secondary px-3 py-1 rounded text-xs font-medium" onclick="event.stopPropagation(); dashboardRouter.printOrder('${order.id}')">
                <i class="fas fa-print"></i>
            </button>
        `);
        
        return buttons.join('');
    },

    renderMenu() {
        this.renderMenuFilters();
        this.renderMenuGrid();
    },

    renderMenuFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        
        // Populate category filter
        if (categoryFilter.children.length <= 1) {
            sharedData.dishCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categoryFilter.appendChild(option);
            });
        }

        // Bind events
        categoryFilter.addEventListener('change', (e) => {
            const categoryId = e.target.value ? parseInt(e.target.value) : null;
            dashboardState.setMenuFilters({ category: categoryId });
            this.renderMenuGrid();
        });

        document.getElementById('addDishBtn').addEventListener('click', () => {
            this.showDishEditModal();
        });
    },

    renderMenuGrid() {
        const container = document.getElementById('menuGrid');
        const filteredDishes = dashboardState.getFilteredDishes();

        if (filteredDishes.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12 text-gray-500">
                    <i class="fas fa-utensils text-4xl mb-4"></i>
                    <p class="text-lg mb-2">没有找到匹配的菜品</p>
                    <button class="btn-primary px-4 py-2 rounded-lg mt-4" onclick="dashboardRouter.showDishEditModal()">
                        添加菜品
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredDishes.map(dish => `
            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div class="relative">
                    <img src="${dish.image}" alt="${dish.name}" class="w-full h-48 object-cover">
                    <div class="absolute top-2 right-2">
                        <span class="px-2 py-1 text-xs font-medium rounded-full ${dish.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                            ${dish.available ? '在售' : '下架'}
                        </span>
                    </div>
                    ${dish.stock <= 5 && dish.available ? '<div class="absolute top-2 left-2"><span class="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">库存不足</span></div>' : ''}
                </div>
                
                <div class="p-4">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-semibold text-gray-900">${dish.name}</h3>
                        ${this.renderSpicyLevel(dish.spicy)}
                    </div>
                    
                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">${dish.description}</p>
                    
                    <div class="flex items-center justify-between mb-3">
                        <div>
                            <span class="text-lg font-bold text-orange-600">${sharedData.utils.formatPrice(dish.price)}</span>
                            ${dish.originalPrice ? `<span class="text-sm text-gray-400 line-through ml-2">${sharedData.utils.formatPrice(dish.originalPrice)}</span>` : ''}
                        </div>
                        <div class="text-right text-sm text-gray-500">
                            <p>成本: ${sharedData.utils.formatPrice(dish.cost)}</p>
                            <p>利润: ${sharedData.utils.formatPrice(dish.price - dish.cost)}</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between mb-4 text-sm text-gray-500">
                        <span>月售${dish.salesCount}</span>
                        <span class="flex items-center">
                            <i class="fas fa-star text-yellow-400 mr-1"></i>
                            ${dish.rating || '暂无评分'}
                        </span>
                        <span>库存: ${dish.stock}</span>
                    </div>
                    
                    <div class="flex space-x-2">
                        <button class="flex-1 btn-primary px-3 py-2 rounded-lg text-sm font-medium" onclick="dashboardRouter.showDishEditModal(${dish.id})">
                            编辑
                        </button>
                        <button class="px-3 py-2 rounded-lg text-sm font-medium ${dish.available ? 'btn-secondary' : 'btn-success'}" onclick="dashboardRouter.toggleDishAvailability(${dish.id})">
                            ${dish.available ? '下架' : '上架'}
                        </button>
                    </div>
                    
                    <div class="flex justify-center mt-2 space-x-1">
                        ${dish.tags.map(tag => `<span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    },

    renderAnalytics() {
        this.renderTimeRangeButtons();
        this.renderAnalyticsTables();
    },

    renderTimeRangeButtons() {
        const buttons = document.querySelectorAll('.time-range-btn');
        
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.range === dashboardState.analyticsRange.replace('d', '')) {
                btn.classList.add('active');
            }
            
            btn.addEventListener('click', () => {
                dashboardState.setAnalyticsRange(btn.dataset.range + 'd');
                this.renderTimeRangeButtons();
                this.renderAnalyticsTables();
            });
        });
    },

    renderAnalyticsTables() {
        const container = document.getElementById('dishRankingTable');
        const ranking = merchantData.analytics.dishRanking;

        container.innerHTML = `
            <div class="overflow-x-auto">
                <table class="table">
                    <thead>
                        <tr>
                            <th>排名</th>
                            <th>菜品名称</th>
                            <th>销量</th>
                            <th>营收</th>
                            <th>客单价</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ranking.map(dish => `
                            <tr>
                                <td>
                                    <div class="flex items-center">
                                        <span class="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">
                                            ${dish.rank}
                                        </span>
                                    </div>
                                </td>
                                <td class="font-medium">${dish.name}</td>
                                <td>${dish.sales}</td>
                                <td class="font-semibold text-green-600">${sharedData.utils.formatPrice(dish.revenue)}</td>
                                <td>${sharedData.utils.formatPrice(dish.revenue / dish.sales)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderSettings() {
        this.renderBusinessHours();
        this.bindSettingsEvents();
    },

    renderBusinessHours() {
        const container = document.getElementById('businessHours');
        
        container.innerHTML = sharedData.businessHours.map(day => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                    <label class="toggle-switch">
                        <input type="checkbox" ${day.isOpen ? 'checked' : ''} data-day="${day.day}">
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="font-medium">${day.name}</span>
                </div>
                <div class="flex items-center space-x-2 ${day.isOpen ? '' : 'opacity-50'}">
                    <input type="time" value="${day.openTime}" class="border border-gray-300 rounded px-2 py-1 text-sm" data-day="${day.day}" data-type="open" ${day.isOpen ? '' : 'disabled'}>
                    <span>-</span>
                    <input type="time" value="${day.closeTime}" class="border border-gray-300 rounded px-2 py-1 text-sm" data-day="${day.day}" data-type="close" ${day.isOpen ? '' : 'disabled'}>
                </div>
            </div>
        `).join('');
    },

    bindSettingsEvents() {
        // Business hours toggles
        document.querySelectorAll('#businessHours input[type="checkbox"]').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const day = e.target.dataset.day;
                const timeInputs = document.querySelectorAll(`input[data-day="${day}"][type="time"]`);
                
                timeInputs.forEach(input => {
                    input.disabled = !e.target.checked;
                    input.parentElement.classList.toggle('opacity-50', !e.target.checked);
                });
            });
        });
    },

    // Utility methods
    renderSpicyLevel(level) {
        if (level === 0) return '';
        
        const spicyInfo = sharedData.spicyLevels[level];
        return `<span class="${spicyInfo.color} text-sm">${spicyInfo.icon}</span>`;
    },

    updateNewOrdersBadge() {
        const badge = document.getElementById('newOrdersBadge');
        const notificationBadge = document.getElementById('notificationBadge');
        
        if (dashboardState.newOrdersCount > 0) {
            badge.textContent = dashboardState.newOrdersCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
        
        if (dashboardState.unreadNotifications > 0) {
            notificationBadge.textContent = dashboardState.unreadNotifications;
            notificationBadge.classList.remove('hidden');
        } else {
            notificationBadge.classList.add('hidden');
        }
    },

    // Order actions
    showOrderDetail(orderId) {
        const order = dashboardState.allOrders.find(o => o.id === orderId);
        if (order) {
            this.showOrderDetailModal(order);
        }
    },

    showOrderDetailModal(order) {
        const modal = document.getElementById('orderDetailModal');
        const content = document.getElementById('orderDetailContent');
        
        content.innerHTML = `
            <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold">订单详情</h3>
                    <button onclick="dashboardRouter.hideOrderDetailModal()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <h4 class="font-semibold mb-2">订单信息</h4>
                            <p><strong>订单号:</strong> ${order.id}</p>
                            <p><strong>下单时间:</strong> ${order.orderTime}</p>
                            <p><strong>状态:</strong> <span class="order-status status-${order.status}">${order.statusText}</span></p>
                            <p><strong>支付方式:</strong> ${sharedData.paymentMethods[order.paymentMethod]?.name || order.paymentMethod}</p>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-2">客户信息</h4>
                            <p><strong>姓名:</strong> ${order.customerName}</p>
                            <p><strong>电话:</strong> ${order.customerPhone}</p>
                            <p><strong>地址:</strong> ${order.deliveryAddress}</p>
                            ${order.notes ? `<p><strong>备注:</strong> ${order.notes}</p>` : ''}
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="font-semibold mb-2">订单商品</h4>
                        <div class="border rounded-lg overflow-hidden">
                            ${order.items.map(item => `
                                <div class="flex justify-between items-center p-3 border-b last:border-b-0">
                                    <span>${item.name}</span>
                                    <span>x${item.quantity}</span>
                                    <span class="font-semibold">${sharedData.utils.formatPrice(item.price * item.quantity)}</span>
                                </div>
                            `).join('')}
                            
                            <div class="bg-gray-50 p-3">
                                <div class="flex justify-between mb-1">
                                    <span>小计</span>
                                    <span>${sharedData.utils.formatPrice(order.total - 5)}</span>
                                </div>
                                <div class="flex justify-between mb-1">
                                    <span>配送费</span>
                                    <span>${sharedData.utils.formatPrice(5)}</span>
                                </div>
                                <div class="flex justify-between font-bold text-lg pt-2 border-t">
                                    <span>总计</span>
                                    <span class="text-orange-600">${sharedData.utils.formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex space-x-2 pt-4">
                        ${this.getOrderActionButtons(order)}
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
    },

    hideOrderDetailModal() {
        document.getElementById('orderDetailModal').classList.add('hidden');
    },

    updateOrderStatus(orderId, newStatus) {
        dashboardState.updateOrderStatus(orderId, newStatus);
        
        // Update current page if we're on orders page
        if (this.currentRoute === 'orders') {
            this.renderOrdersList();
        }
        
        // Update dashboard if we're on dashboard
        if (this.currentRoute === 'dashboard') {
            this.renderRecentOrders();
            this.updateStatsCards();
        }
        
        // Close modal if open
        this.hideOrderDetailModal();
        
        this.showToast(`订单状态已更新为: ${sharedData.utils.getStatusText(newStatus)}`);
    },

    printOrder(orderId) {
        this.showToast('订单已发送到打印机');
    },

    // Dish actions
    showDishEditModal(dishId = null) {
        const modal = document.getElementById('dishEditModal');
        const content = document.getElementById('dishEditContent');
        
        const dish = dishId ? dashboardState.dishes.find(d => d.id === dishId) : null;
        const isEditing = !!dish;
        
        content.innerHTML = `
            <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold">${isEditing ? '编辑菜品' : '添加菜品'}</h3>
                    <button onclick="dashboardRouter.hideDishEditModal()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <form id="dishEditForm" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">菜品名称</label>
                            <input type="text" name="name" value="${dish?.name || ''}" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">分类</label>
                            <select name="category" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
                                ${sharedData.dishCategories.map(cat => `
                                    <option value="${cat.id}" ${dish?.category === cat.id ? 'selected' : ''}>${cat.name}</option>
                                `).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">描述</label>
                        <textarea name="description" rows="2" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>${dish?.description || ''}</textarea>
                    </div>
                    
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">售价</label>
                            <input type="number" name="price" value="${dish?.price || ''}" step="0.01" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">成本</label>
                            <input type="number" name="cost" value="${dish?.cost || ''}" step="0.01" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">库存</label>
                            <input type="number" name="stock" value="${dish?.stock || 0}" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">辣度等级</label>
                            <select name="spicy" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                                ${sharedData.spicyLevels.map(level => `
                                    <option value="${level.level}" ${dish?.spicy === level.level ? 'selected' : ''}>${level.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">制作时间(分钟)</label>
                            <input type="number" name="preparationTime" value="${dish?.preparationTime || 15}" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-4">
                        <label class="flex items-center">
                            <input type="checkbox" name="available" ${dish?.available !== false ? 'checked' : ''} class="mr-2">
                            <span class="text-sm">立即上架</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="featured" ${dish?.featured ? 'checked' : ''} class="mr-2">
                            <span class="text-sm">推荐菜品</span>
                        </label>
                    </div>
                    
                    <div class="flex space-x-3 pt-4">
                        <button type="submit" class="flex-1 btn-primary px-4 py-2 rounded-lg font-medium">
                            ${isEditing ? '保存修改' : '添加菜品'}
                        </button>
                        <button type="button" onclick="dashboardRouter.hideDishEditModal()" class="btn-secondary px-4 py-2 rounded-lg font-medium">
                            取消
                        </button>
                        ${isEditing ? `
                            <button type="button" onclick="dashboardRouter.deleteDish(${dish.id})" class="btn-danger px-4 py-2 rounded-lg font-medium">
                                删除
                            </button>
                        ` : ''}
                    </div>
                </form>
            </div>
        `;
        
        modal.classList.remove('hidden');
        
        // Bind form submission
        document.getElementById('dishEditForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveDish(new FormData(e.target), dishId);
        });
    },

    hideDishEditModal() {
        document.getElementById('dishEditModal').classList.add('hidden');
    },

    saveDish(formData, dishId) {
        const dishData = {
            name: formData.get('name'),
            category: parseInt(formData.get('category')),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            cost: parseFloat(formData.get('cost')),
            stock: parseInt(formData.get('stock')),
            spicy: parseInt(formData.get('spicy')),
            preparationTime: parseInt(formData.get('preparationTime')),
            available: formData.has('available'),
            featured: formData.has('featured'),
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop" // Default image
        };
        
        if (dishId) {
            dashboardState.updateDish(dishId, dishData);
            this.showToast('菜品信息已更新');
        } else {
            dashboardState.addDish(dishData);
            this.showToast('菜品已添加');
        }
        
        this.hideDishEditModal();
        this.renderMenuGrid();
    },

    toggleDishAvailability(dishId) {
        dashboardState.toggleDishAvailability(dishId);
        this.renderMenuGrid();
        
        const dish = dashboardState.dishes.find(d => d.id === dishId);
        this.showToast(`${dish.name} 已${dish.available ? '上架' : '下架'}`);
    },

    deleteDish(dishId) {
        if (confirm('确定要删除这个菜品吗？此操作不可恢复。')) {
            const dish = dashboardState.dishes.find(d => d.id === dishId);
            dashboardState.removeDish(dishId);
            this.hideDishEditModal();
            this.renderMenuGrid();
            this.showToast(`${dish.name} 已删除`);
        }
    },

    // Toast notification
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `notification notification-${type}`;
        toast.innerHTML = `
            <div class="p-4">
                <div class="flex items-center">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} text-${type === 'success' ? 'green' : 'blue'}-500 mr-3"></i>
                    <p class="text-gray-800">${message}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
};