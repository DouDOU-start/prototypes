// Main application script for merchant dashboard

window.dashboardApp = {
    init() {
        this.bindEvents();
        this.setupStateListeners();
        this.loadStoredData();
        this.setupNotifications();
        this.hideLoading();
        
        // Initialize router if available
        if (typeof dashboardRouter !== 'undefined') {
            dashboardRouter.init();
        } else {
            console.warn('dashboardRouter is not available');
        }
        
        console.log('Merchant Dashboard initialized');
        
        // Start periodic updates
        this.startPeriodicUpdates();
    },

    bindEvents() {
        // Global event handlers
        this.bindNotificationEvents();
        this.bindModalEvents();
        this.bindKeyboardEvents();
        
        // Window events
        window.addEventListener('beforeunload', () => {
            this.saveDataToStorage();
        });

        window.addEventListener('online', () => {
            dashboardState.isOnline = true;
            this.showToast('网络已连接', 'success');
            dashboardState.notifyStateChange();
        });

        window.addEventListener('offline', () => {
            dashboardState.isOnline = false;
            this.showToast('网络连接已断开', 'warning');
            dashboardState.notifyStateChange();
        });

        // Visibility change handler
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.refreshData();
            }
        });
    },

    bindNotificationEvents() {
        const notificationBtn = document.getElementById('notificationBtn');
        
        notificationBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleNotificationPanel();
        });

        // Close notifications when clicking outside
        document.addEventListener('click', (e) => {
            const panel = document.getElementById('notificationPanel');
            if (panel && !notificationBtn.contains(e.target) && !panel.contains(e.target)) {
                this.hideNotificationPanel();
            }
        });
    },

    bindModalEvents() {
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('fixed') && e.target.classList.contains('inset-0')) {
                if (e.target.id === 'orderDetailModal') {
                    dashboardRouter.hideOrderDetailModal();
                } else if (e.target.id === 'dishEditModal') {
                    dashboardRouter.hideDishEditModal();
                }
            }
        });

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (!document.getElementById('orderDetailModal').classList.contains('hidden')) {
                    dashboardRouter.hideOrderDetailModal();
                } else if (!document.getElementById('dishEditModal').classList.contains('hidden')) {
                    dashboardRouter.hideDishEditModal();
                }
            }
        });
    },

    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // Keyboard shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        dashboardRouter.navigate('dashboard');
                        break;
                    case '2':
                        e.preventDefault();
                        dashboardRouter.navigate('orders');
                        break;
                    case '3':
                        e.preventDefault();
                        dashboardRouter.navigate('menu');
                        break;
                    case '4':
                        e.preventDefault();
                        dashboardRouter.navigate('analytics');
                        break;
                    case '5':
                        e.preventDefault();
                        dashboardRouter.navigate('settings');
                        break;
                    case 'r':
                        e.preventDefault();
                        dashboardRouter.refreshCurrentPage();
                        break;
                }
            }
        });
    },

    setupStateListeners() {
        // Check if dashboardState is available
        if (typeof dashboardState !== 'undefined') {
            dashboardState.addStateChangeListener((state) => {
                this.updateUI(state);
            });

            // Listen for specific state changes
            dashboardState.addStateChangeListener((state) => {
                // Update notification badges
                this.updateNotificationBadges(state);
                
                // Update online status
                this.updateOnlineStatus(state);
                
                // Handle loading states
                this.updateLoadingStates(state);
            });
        } else {
            console.warn('dashboardState is not available');
        }
    },

    updateUI(state) {
        // Update navigation badges
        if (typeof dashboardRouter !== 'undefined') {
            dashboardRouter.updateNewOrdersBadge();
        }
        
        // Update any realtime counters
        this.updateRealtimeCounters(state);
        
        // Update last refresh time
        this.updateLastRefreshTime(state.lastUpdate);
    },

    updateNotificationBadges(state) {
        const notificationBadge = document.getElementById('notificationBadge');
        const mobileNotificationBadge = document.getElementById('mobileNotificationBadge');
        const newOrdersBadge = document.getElementById('newOrdersBadge');
        
        if (state.unreadNotifications > 0) {
            if (notificationBadge) {
                notificationBadge.textContent = state.unreadNotifications;
                notificationBadge.classList.remove('hidden');
            }
            if (mobileNotificationBadge) {
                mobileNotificationBadge.textContent = state.unreadNotifications;
                mobileNotificationBadge.classList.remove('hidden');
            }
        } else {
            if (notificationBadge) notificationBadge.classList.add('hidden');
            if (mobileNotificationBadge) mobileNotificationBadge.classList.add('hidden');
        }
        
        if (state.newOrdersCount > 0) {
            newOrdersBadge.textContent = state.newOrdersCount;
            newOrdersBadge.classList.remove('hidden');
        } else {
            newOrdersBadge.classList.add('hidden');
        }
    },

    updateOnlineStatus(state) {
        const statusIndicator = document.querySelector('[data-status="connection"]');
        if (statusIndicator) {
            const icon = statusIndicator.querySelector('i');
            const text = statusIndicator.querySelector('span');
            
            if (state.isOnline) {
                icon.className = 'fas fa-wifi text-green-500';
                text.textContent = '已连接';
            } else {
                icon.className = 'fas fa-wifi-slash text-red-500';
                text.textContent = '离线';
            }
        }
    },

    updateLoadingStates(state) {
        const loadingEl = document.getElementById('loading');
        
        if (state.isLoading && loadingEl) {
            loadingEl.style.display = 'flex';
        } else if (loadingEl) {
            loadingEl.style.display = 'none';
        }
    },

    updateRealtimeCounters(state) {
        // Update any realtime statistics displays
        if (typeof dashboardRouter !== 'undefined' && dashboardRouter.currentRoute === 'dashboard') {
            dashboardRouter.updateStatsCards();
        }
    },

    updateLastRefreshTime(timestamp) {
        const refreshElements = document.querySelectorAll('[data-last-refresh]');
        const timeString = timestamp.toLocaleTimeString('zh-CN');
        
        refreshElements.forEach(el => {
            el.textContent = `最后更新: ${timeString}`;
        });
    },

    // Notification panel management
    toggleNotificationPanel() {
        let panel = document.getElementById('notificationPanel');
        
        if (!panel) {
            this.createNotificationPanel();
        } else {
            panel.classList.toggle('hidden');
        }
    },

    createNotificationPanel() {
        const panel = document.createElement('div');
        panel.id = 'notificationPanel';
        panel.className = 'absolute top-12 right-0 w-80 bg-white rounded-lg shadow-xl border z-50';
        
        const notificationBtn = document.getElementById('notificationBtn');
        notificationBtn.parentElement.style.position = 'relative';
        notificationBtn.parentElement.appendChild(panel);
        
        this.renderNotificationPanel();
    },

    hideNotificationPanel() {
        const panel = document.getElementById('notificationPanel');
        if (panel) {
            panel.classList.add('hidden');
        }
    },

    renderNotificationPanel() {
        const panel = document.getElementById('notificationPanel');
        if (!panel) return;
        
        const notifications = dashboardState.notifications.slice(0, 10); // Show last 10
        
        panel.innerHTML = `
            <div class="p-4 border-b">
                <div class="flex items-center justify-between">
                    <h3 class="font-semibold text-gray-900">通知</h3>
                    <button onclick="dashboardApp.markAllNotificationsAsRead()" class="text-sm text-orange-600 hover:text-orange-700">
                        全部标记为已读
                    </button>
                </div>
            </div>
            
            <div class="max-h-80 overflow-y-auto">
                ${notifications.length === 0 ? `
                    <div class="p-6 text-center text-gray-500">
                        <i class="fas fa-bell text-3xl mb-2"></i>
                        <p>暂无通知</p>
                    </div>
                ` : notifications.map(notification => `
                    <div class="p-3 border-b hover:bg-gray-50 cursor-pointer ${notification.read ? 'opacity-60' : ''}" onclick="dashboardApp.handleNotificationClick('${notification.id}')">
                        <div class="flex items-start space-x-3">
                            <div class="flex-shrink-0">
                                <i class="${sharedData.notificationTypes[notification.type]?.icon || 'fas fa-info-circle'} text-${sharedData.notificationTypes[notification.type]?.color || 'blue'}-500"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900">${notification.title}</p>
                                <p class="text-sm text-gray-600 truncate">${notification.message}</p>
                                <p class="text-xs text-gray-400 mt-1">${notification.time}</p>
                            </div>
                            ${!notification.read ? '<div class="flex-shrink-0"><div class="w-2 h-2 bg-orange-500 rounded-full"></div></div>' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            ${notifications.length > 0 ? `
                <div class="p-3 border-t text-center">
                    <button class="text-sm text-gray-600 hover:text-gray-800">查看全部通知</button>
                </div>
            ` : ''}
        `;
    },

    handleNotificationClick(notificationId) {
        const notification = dashboardState.notifications.find(n => n.id == notificationId);
        if (!notification) return;
        
        // Mark as read
        dashboardState.markNotificationAsRead(notificationId);
        
        // Handle specific notification actions
        if (notification.orderId) {
            dashboardRouter.navigate('orders');
            setTimeout(() => {
                dashboardRouter.showOrderDetail(notification.orderId);
            }, 500);
        } else if (notification.dishId) {
            dashboardRouter.navigate('menu');
        }
        
        this.hideNotificationPanel();
    },

    markAllNotificationsAsRead() {
        dashboardState.markAllNotificationsAsRead();
        this.renderNotificationPanel();
    },

    // Data management
    loadStoredData() {
        const savedData = dashboardUtils.loadFromStorage('merchantDashboard');
        
        if (savedData) {
            if (savedData.orders) {
                dashboardState.allOrders = [...savedData.orders, ...dashboardState.allOrders];
                dashboardState.orders = dashboardState.allOrders.slice(0, 10);
            }
            
            if (savedData.dishes) {
                // Merge saved dishes with default dishes
                dashboardState.dishes = this.mergeDishes(savedData.dishes, dashboardState.dishes);
            }
            
            if (savedData.settings) {
                Object.assign(dashboardState.settings, savedData.settings);
            }
            
            dashboardState.updateDashboardStats();
        }
    },

    mergeDishes(savedDishes, defaultDishes) {
        const mergedDishes = [...defaultDishes];
        
        savedDishes.forEach(savedDish => {
            const existingIndex = mergedDishes.findIndex(d => d.id === savedDish.id);
            if (existingIndex >= 0) {
                // Update existing dish with saved data
                mergedDishes[existingIndex] = { ...mergedDishes[existingIndex], ...savedDish };
            } else {
                // Add new dish
                mergedDishes.push(savedDish);
            }
        });
        
        return mergedDishes;
    },

    saveDataToStorage() {
        const dataToSave = {
            orders: dashboardState.allOrders.slice(0, 50), // Keep only recent 50 orders
            dishes: dashboardState.dishes,
            settings: dashboardState.settings,
            lastSaved: new Date().toISOString()
        };
        
        dashboardUtils.saveToStorage('merchantDashboard', dataToSave);
    },

    // Notification setup
    setupNotifications() {
        if (dashboardUtils.supportsFeature('notifications')) {
            Notification.requestPermission();
        }
    },

    // Periodic updates
    startPeriodicUpdates() {
        // Update stats every 30 seconds
        setInterval(() => {
            if (dashboardRouter.currentRoute === 'dashboard') {
                dashboardRouter.updateStatsCards();
            }
        }, 30000);

        // Save data every 2 minutes
        setInterval(() => {
            this.saveDataToStorage();
        }, 120000);

        // Check for stuck orders every minute
        setInterval(() => {
            this.checkStuckOrders();
        }, 60000);
    },

    checkStuckOrders() {
        if (typeof dashboardState === 'undefined') return;
        
        const now = new Date();
        const stuckOrders = dashboardState.allOrders.filter(order => {
            if (order.status !== 'preparing' && order.status !== 'delivering') return false;
            
            const orderTime = new Date(order.orderTime);
            const minutesPassed = (now - orderTime) / (1000 * 60);
            
            return minutesPassed > 45; // Consider orders stuck after 45 minutes
        });

        stuckOrders.forEach(order => {
            dashboardState.addNotification({
                type: 'warning',
                title: '订单超时提醒',
                message: `订单 ${order.id} 处理时间过长，请检查状态`,
                orderId: order.id
            });
        });
    },

    refreshData() {
        if (typeof dashboardState !== 'undefined') {
            dashboardState.setLoading(true);
            
            setTimeout(() => {
                // Simulate data refresh
                dashboardState.updateDashboardStats();
                dashboardState.setLoading(false);
                
                // Re-render current page
                if (typeof dashboardRouter !== 'undefined' && dashboardRouter.routes[dashboardRouter.currentRoute]) {
                    dashboardRouter.routes[dashboardRouter.currentRoute].render();
                }
                
                this.showToast('数据已刷新', 'success');
            }, 1000);
        }
    },

    // UI utilities
    hideLoading() {
        setTimeout(() => {
            const loading = document.getElementById('loading');
            const app = document.getElementById('app');
            
            if (loading) loading.style.display = 'none';
            if (app) app.style.display = 'flex';
        }, 1500);
    },

    showToast(message, type = 'info') {
        // Remove existing toasts
        document.querySelectorAll('.toast-notification').forEach(toast => {
            toast.remove();
        });

        const toast = document.createElement('div');
        toast.className = `toast-notification fixed top-20 right-4 z-50 bg-white rounded-lg shadow-lg border p-4 max-w-sm animate-slide-in`;
        
        const colorClasses = {
            success: ['border-green-500', 'text-green-700'],
            warning: ['border-yellow-500', 'text-yellow-700'],
            error: ['border-red-500', 'text-red-700'],
            info: ['border-blue-500', 'text-blue-700']
        };
        
        const icons = {
            success: 'fas fa-check-circle',
            warning: 'fas fa-exclamation-triangle',
            error: 'fas fa-times-circle',
            info: 'fas fa-info-circle'
        };
        
        // Add color classes individually
        colorClasses[type].forEach(cls => toast.classList.add(cls));
        
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="${icons[type]} mr-3"></i>
                <p class="flex-1">${message}</p>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 4000);
    },

    // Export functionality
    exportCurrentData() {
        const currentPage = dashboardRouter.currentRoute;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        switch (currentPage) {
            case 'orders':
                const filteredOrders = dashboardState.getFilteredOrders();
                dashboardUtils.exportOrdersToCSV(filteredOrders, `orders-${timestamp}.csv`);
                this.showToast('订单数据已导出', 'success');
                break;
                
            case 'menu':
                const filteredDishes = dashboardState.getFilteredDishes();
                dashboardUtils.exportDishesToCSV(filteredDishes, `dishes-${timestamp}.csv`);
                this.showToast('菜单数据已导出', 'success');
                break;
                
            default:
                this.showToast('当前页面不支持导出', 'warning');
        }
    },

    // Keyboard shortcut help
    showKeyboardShortcuts() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-bold">快捷键</h3>
                        <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span>数据概览</span>
                            <kbd class="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+1</kbd>
                        </div>
                        <div class="flex justify-between">
                            <span>订单管理</span>
                            <kbd class="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+2</kbd>
                        </div>
                        <div class="flex justify-between">
                            <span>菜单管理</span>
                            <kbd class="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+3</kbd>
                        </div>
                        <div class="flex justify-between">
                            <span>数据分析</span>
                            <kbd class="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+4</kbd>
                        </div>
                        <div class="flex justify-between">
                            <span>店铺设置</span>
                            <kbd class="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+5</kbd>
                        </div>
                        <div class="flex justify-between">
                            <span>刷新页面</span>
                            <kbd class="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+R</kbd>
                        </div>
                        <div class="flex justify-between">
                            <span>关闭弹窗</span>
                            <kbd class="px-2 py-1 bg-gray-100 rounded text-xs">ESC</kbd>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    // Mobile sidebar management
    toggleMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        if (!overlay) {
            this.createSidebarOverlay();
        }
        
        sidebar.classList.toggle('show');
        document.getElementById('sidebar-overlay').classList.toggle('hidden');
    },
    
    createSidebarOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'sidebar-overlay';
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden hidden';
        overlay.addEventListener('click', () => {
            this.toggleMobileSidebar();
        });
        document.body.appendChild(overlay);
    },
    
    closeMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        sidebar.classList.remove('show');
        if (overlay) overlay.classList.add('hidden');
    },

    // Development helpers
    simulateNewOrder() {
        if (typeof dashboardState !== 'undefined') {
            const newOrder = dashboardState.generateMockOrder();
            this.showToast(`模拟订单已创建: ${newOrder.id}`, 'success');
            
            // Navigate to orders if not already there
            if (typeof dashboardRouter !== 'undefined' && dashboardRouter.currentRoute !== 'orders') {
                dashboardRouter.navigate('orders');
            }
        }
    },

    resetAllData() {
        if (confirm('确定要重置所有数据吗？此操作不可恢复。')) {
            localStorage.removeItem('merchantDashboard');
            location.reload();
        }
    }
};

// Check authentication before initializing app
function checkAuthentication() {
    const savedLogin = localStorage.getItem('merchantLogin') || 
                       sessionStorage.getItem('merchantLogin');
    
    if (!savedLogin) {
        // Redirect to login page
        window.location.href = 'login.html';
        return false;
    }
    
    try {
        const loginData = JSON.parse(savedLogin);
        const hoursPassed = (Date.now() - loginData.loginTime) / (1000 * 60 * 60);
        
        // Check if login is expired
        const maxHours = loginData.remember ? 24 : 2;
        if (hoursPassed >= maxHours) {
            // Clear expired login data and redirect
            localStorage.removeItem('merchantLogin');
            sessionStorage.removeItem('merchantLogin');
            window.location.href = 'login.html';
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Authentication check error:', error);
        localStorage.removeItem('merchantLogin');
        sessionStorage.removeItem('merchantLogin');
        window.location.href = 'login.html';
        return false;
    }
}

// Add logout functionality
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('merchantLogin');
        sessionStorage.removeItem('merchantLogin');
        window.location.href = 'login.html';
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (checkAuthentication()) {
        dashboardApp.init();
        
        // Bind logout button
        const logoutBtn = document.querySelector('[title="退出登录"]');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
    }
});

// Global error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    dashboardApp.showToast('发生了一个错误，请刷新页面重试', 'error');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    dashboardApp.showToast('请求失败，请检查网络连接', 'error');
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-slide-in {
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);