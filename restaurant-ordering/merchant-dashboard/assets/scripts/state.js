// Global state management for merchant dashboard

window.dashboardState = {
    // Current page
    currentPage: 'dashboard',
    
    // Loading states
    isLoading: false,
    pageLoading: false,
    
    // Data states - will be initialized later
    stats: {},
    orders: [],
    allOrders: [],
    dishes: [],
    notifications: [],
    settings: {},
    
    // Filter states
    orderFilters: {
        status: 'all',
        date: null,
        customer: null
    },
    
    menuFilters: {
        category: null,
        availability: 'all',
        search: ''
    },
    
    analyticsRange: '7d',
    
    // UI states
    selectedOrder: null,
    selectedDish: null,
    showModal: false,
    modalType: null,
    
    // Notification states
    unreadNotifications: 0,
    newOrdersCount: 0,
    
    // Real-time states
    isOnline: true,
    lastUpdate: new Date(),
    
    // Methods to update state
    setCurrentPage(page) {
        this.currentPage = page;
        this.notifyStateChange();
    },

    setLoading(isLoading) {
        this.isLoading = isLoading;
        this.notifyStateChange();
    },

    setPageLoading(isLoading) {
        this.pageLoading = isLoading;
        this.notifyStateChange();
    },

    // Order management methods
    updateOrderStatus(orderId, newStatus) {
        const order = this.allOrders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            order.statusText = sharedData.utils.getStatusText(newStatus);
            
            // Update timestamps based on status
            const now = new Date().toLocaleString('zh-CN');
            if (newStatus === 'confirmed') {
                order.confirmedTime = now;
            } else if (newStatus === 'preparing') {
                order.preparingTime = now;
            } else if (newStatus === 'delivering') {
                order.deliveringTime = now;
                order.estimatedDeliveryTime = sharedData.utils.calculateDeliveryTime(30);
            } else if (newStatus === 'completed') {
                order.completedTime = now;
            }
            
            this.updateDashboardStats();
            this.notifyStateChange();
            
            // Show notification
            this.addNotification({
                type: 'orderUpdate',
                title: '订单状态更新',
                message: `订单${orderId}已更新为${order.statusText}`,
                orderId: orderId
            });
        }
    },

    addOrder(orderData) {
        const newOrder = {
            ...orderData,
            id: sharedData.utils.generateOrderId(),
            status: 'pending',
            statusText: '待接单',
            orderTime: new Date().toLocaleString('zh-CN'),
            priority: sharedData.utils.getOrderPriority(new Date(), orderData.total)
        };
        
        this.allOrders.unshift(newOrder);
        this.orders.unshift(newOrder);
        
        // Keep only recent 10 orders in orders array
        if (this.orders.length > 10) {
            this.orders = this.orders.slice(0, 10);
        }
        
        this.newOrdersCount++;
        this.updateDashboardStats();
        this.notifyStateChange();
        
        // Add notification
        this.addNotification({
            type: 'newOrder',
            title: '新订单',
            message: `收到来自${orderData.customerName}的新订单`,
            orderId: newOrder.id,
            sound: true
        });
        
        return newOrder;
    },

    removeOrder(orderId) {
        this.allOrders = this.allOrders.filter(o => o.id !== orderId);
        this.orders = this.orders.filter(o => o.id !== orderId);
        this.updateDashboardStats();
        this.notifyStateChange();
    },

    // Dish management methods
    updateDish(dishId, updates) {
        const dish = this.dishes.find(d => d.id === dishId);
        if (dish) {
            Object.assign(dish, updates);
            dish.updatedAt = new Date().toISOString().split('T')[0];
            this.notifyStateChange();
        }
    },

    addDish(dishData) {
        const newDish = {
            ...dishData,
            id: Date.now(),
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
            salesCount: 0,
            rating: 0
        };
        
        this.dishes.push(newDish);
        this.notifyStateChange();
        return newDish;
    },

    removeDish(dishId) {
        this.dishes = this.dishes.filter(d => d.id !== dishId);
        this.notifyStateChange();
    },

    toggleDishAvailability(dishId) {
        const dish = this.dishes.find(d => d.id === dishId);
        if (dish) {
            dish.available = !dish.available;
            dish.updatedAt = new Date().toISOString().split('T')[0];
            this.notifyStateChange();
            
            if (!dish.available && dish.stock === 0) {
                this.addNotification({
                    type: 'lowStock',
                    title: '菜品下架',
                    message: `${dish.name}因库存不足已下架`,
                    dishId: dishId
                });
            }
        }
    },

    // Filter methods
    setOrderFilters(filters) {
        Object.assign(this.orderFilters, filters);
        this.notifyStateChange();
    },

    setMenuFilters(filters) {
        Object.assign(this.menuFilters, filters);
        this.notifyStateChange();
    },

    setAnalyticsRange(range) {
        this.analyticsRange = range;
        this.notifyStateChange();
    },

    // Get filtered data
    getFilteredOrders() {
        let filtered = [...this.allOrders];
        
        if (this.orderFilters.status !== 'all') {
            filtered = filtered.filter(order => order.status === this.orderFilters.status);
        }
        
        if (this.orderFilters.date) {
            const filterDate = new Date(this.orderFilters.date).toDateString();
            filtered = filtered.filter(order => 
                new Date(order.orderTime).toDateString() === filterDate
            );
        }
        
        if (this.orderFilters.customer) {
            const search = this.orderFilters.customer.toLowerCase();
            filtered = filtered.filter(order => 
                order.customerName.toLowerCase().includes(search) ||
                order.customerPhone.includes(search)
            );
        }
        
        return filtered;
    },

    getFilteredDishes() {
        let filtered = [...this.dishes];
        
        if (this.menuFilters.category) {
            filtered = filtered.filter(dish => dish.category === this.menuFilters.category);
        }
        
        if (this.menuFilters.availability !== 'all') {
            const isAvailable = this.menuFilters.availability === 'available';
            filtered = filtered.filter(dish => dish.available === isAvailable);
        }
        
        if (this.menuFilters.search) {
            const search = this.menuFilters.search.toLowerCase();
            filtered = filtered.filter(dish => 
                dish.name.toLowerCase().includes(search) ||
                dish.description.toLowerCase().includes(search) ||
                dish.tags.some(tag => tag.toLowerCase().includes(search))
            );
        }
        
        return filtered;
    },

    // Notification methods
    addNotification(notificationData) {
        const notification = {
            id: Date.now(),
            time: new Date().toLocaleString('zh-CN'),
            read: false,
            ...notificationData
        };
        
        this.notifications.unshift(notification);
        this.unreadNotifications++;
        
        // Keep only last 50 notifications
        if (this.notifications.length > 50) {
            this.notifications = this.notifications.slice(0, 50);
        }
        
        this.notifyStateChange();
        
        // Play sound if enabled and notification requires it
        if (notification.sound && this.settings.enableNotifications) {
            this.playNotificationSound();
        }
        
        return notification;
    },

    markNotificationAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
            notification.read = true;
            this.unreadNotifications = Math.max(0, this.unreadNotifications - 1);
            this.notifyStateChange();
        }
    },

    markAllNotificationsAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.unreadNotifications = 0;
        this.notifyStateChange();
    },

    // Statistics methods
    updateDashboardStats() {
        const today = new Date().toDateString();
        const todayOrders = this.allOrders.filter(order => 
            new Date(order.orderTime).toDateString() === today
        );
        
        this.stats.orders = todayOrders.length;
        this.stats.revenue = todayOrders.reduce((sum, order) => 
            order.status === 'completed' ? sum + order.total : sum, 0
        );
        this.stats.pendingOrders = this.allOrders.filter(order => 
            order.status === 'pending' || order.status === 'confirmed'
        ).length;
        
        if (todayOrders.length > 0) {
            this.stats.avgOrderValue = this.stats.revenue / todayOrders.filter(o => o.status === 'completed').length || 0;
        }
    },

    // Modal methods
    showModal(type, data = null) {
        this.modalType = type;
        this.showModal = true;
        
        if (type === 'orderDetail') {
            this.selectedOrder = data;
        } else if (type === 'dishEdit') {
            this.selectedDish = data;
        }
        
        this.notifyStateChange();
    },

    hideModal() {
        this.modalType = null;
        this.showModal = false;
        this.selectedOrder = null;
        this.selectedDish = null;
        this.notifyStateChange();
    },

    // Settings methods
    updateSettings(newSettings) {
        Object.assign(this.settings, newSettings);
        this.notifyStateChange();
        
        this.addNotification({
            type: 'settingsUpdate',
            title: '设置已更新',
            message: '店铺设置已成功更新'
        });
    },

    // Utility methods
    playNotificationSound() {
        // Create audio context for notification sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Audio notification not available');
        }
    },

    // Simulate real-time order updates
    simulateOrderUpdates() {
        if (this.allOrders.length === 0) return;
        
        const activeOrders = this.allOrders.filter(order => 
            order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing'
        );
        
        if (activeOrders.length === 0) return;
        
        const randomOrder = activeOrders[Math.floor(Math.random() * activeOrders.length)];
        
        // Progress order status
        const statusProgression = {
            'pending': 'confirmed',
            'confirmed': 'preparing',
            'preparing': 'delivering'
        };
        
        const nextStatus = statusProgression[randomOrder.status];
        if (nextStatus) {
            this.updateOrderStatus(randomOrder.id, nextStatus);
        }
    },

    // Generate mock new order
    generateMockOrder() {
        const customers = ['李先生', '王女士', '张老师', '陈小姐', '刘总', '杨女士'];
        const addresses = [
            '朝阳区建国路88号', '海淀区中关村大街35号', '东城区王府井大街15号',
            '西城区西单北大街77号', '丰台区丽泽商务区', '石景山区万达广场'
        ];
        
        const randomDishes = this.dishes.filter(d => d.available).slice(0, Math.floor(Math.random() * 3) + 1);
        const items = randomDishes.map(dish => ({
            name: dish.name,
            price: dish.price,
            quantity: Math.floor(Math.random() * 2) + 1
        }));
        
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 5; // +5 delivery fee
        
        return this.addOrder({
            customerName: customers[Math.floor(Math.random() * customers.length)],
            customerPhone: '138****' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
            deliveryAddress: addresses[Math.floor(Math.random() * addresses.length)],
            paymentMethod: Math.random() > 0.5 ? 'alipay' : 'wechat',
            items: items,
            total: total,
            notes: Math.random() > 0.7 ? '请尽快配送' : ''
        });
    },

    // State change notification system
    stateChangeListeners: [],
    
    addStateChangeListener(listener) {
        this.stateChangeListeners.push(listener);
    },
    
    removeStateChangeListener(listener) {
        this.stateChangeListeners = this.stateChangeListeners.filter(l => l !== listener);
    },
    
    notifyStateChange() {
        this.lastUpdate = new Date();
        this.stateChangeListeners.forEach(listener => {
            try {
                listener(this);
            } catch (error) {
                console.error('Error in state change listener:', error);
            }
        });
    },

    // Initialize state
    initialize() {
        // Initialize data from merchantData
        if (typeof merchantData !== 'undefined') {
            this.stats = { ...merchantData.todayStats };
            this.orders = [...merchantData.recentOrders];
            this.allOrders = merchantData.getAllOrders ? merchantData.getAllOrders() : [...merchantData.recentOrders];
            this.dishes = [...merchantData.dishes];
            this.notifications = [...merchantData.notifications];
            this.settings = merchantData.getSettings ? merchantData.getSettings() : {};
        }
        
        this.updateDashboardStats();
        this.unreadNotifications = this.notifications.filter(n => !n.read).length;
        this.newOrdersCount = this.allOrders.filter(o => o.status === 'pending').length;
        
        console.log('Dashboard state initialized');
        
        // Start simulation for demo
        setTimeout(() => {
            this.startDemoSimulation();
        }, 5000);
    },

    startDemoSimulation() {
        // Simulate order updates every 20-40 seconds
        const updateInterval = setInterval(() => {
            if (Math.random() > 0.5) {
                this.simulateOrderUpdates();
            }
        }, Math.random() * 20000 + 20000);

        // Simulate new orders every 60-120 seconds
        const newOrderInterval = setInterval(() => {
            if (Math.random() > 0.3) {
                this.generateMockOrder();
            }
        }, Math.random() * 60000 + 60000);

        // Store intervals for cleanup if needed
        this.simulationIntervals = [updateInterval, newOrderInterval];
    },

    stopDemoSimulation() {
        if (this.simulationIntervals) {
            this.simulationIntervals.forEach(interval => clearInterval(interval));
            this.simulationIntervals = null;
        }
    }
};

// Initialize state when script loads
dashboardState.initialize();