// Main application script for restaurant ordering app

window.app = {
    // Initialize application
    init() {
        this.bindEvents();
        this.setupStateListeners();
        this.loadFromStorage();
        this.hideLoading();
        
        // Initialize router
        router.init();
        
        console.log('Restaurant Ordering App initialized');
    },

    // Bind global event listeners
    bindEvents() {
        // Search functionality
        this.bindSearchEvents();
        
        // Cart functionality
        this.bindCartEvents();
        
        // Order functionality
        this.bindOrderEvents();
        
        // Modal events
        this.bindModalEvents();
        
        // Window events
        window.addEventListener('beforeunload', () => {
            this.saveToStorage();
        });

        // Online/offline status
        window.addEventListener('online', () => {
            utils.showToast('网络已连接');
        });

        window.addEventListener('offline', () => {
            utils.showToast('网络连接已断开');
        });
    },

    // Bind search events
    bindSearchEvents() {
        const searchBtn = document.getElementById('searchBtn');
        const searchBar = document.getElementById('searchBar');
        const searchInput = document.getElementById('searchInput');

        searchBtn.addEventListener('click', () => {
            searchBar.classList.toggle('hidden');
            if (!searchBar.classList.contains('hidden')) {
                searchInput.focus();
            }
        });

        searchInput.addEventListener('input', utils.debounce((e) => {
            const query = e.target.value.trim();
            appState.setSearchQuery(query);
            
            // Re-render menu items if on menu page
            if (router.currentRoute === 'menu') {
                router.renderMenuItems();
            }
        }, 300));

        // Clear search when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchBar.contains(e.target) && !searchBtn.contains(e.target)) {
                if (!searchBar.classList.contains('hidden') && !searchInput.value) {
                    searchBar.classList.add('hidden');
                }
            }
        });
    },

    // Bind cart events
    bindCartEvents() {
        // Update cart count in header
        appState.addStateChangeListener((state) => {
            this.updateCartUI(state);
        });
    },

    // Update cart UI elements
    updateCartUI(state) {
        const cartCount = document.getElementById('cartCount');
        
        if (state.cartItemCount > 0) {
            cartCount.textContent = state.cartItemCount;
            cartCount.classList.remove('hidden');
        } else {
            cartCount.classList.add('hidden');
        }

        // Update order button visibility
        const orderButton = document.getElementById('orderButton');
        if (router.currentRoute === 'cart' && state.cart.length > 0) {
            orderButton.classList.remove('hidden');
        } else {
            orderButton.classList.add('hidden');
        }
    },

    // Bind order events
    bindOrderEvents() {
        const orderButton = document.getElementById('orderButton');
        
        orderButton.addEventListener('click', () => {
            this.handleOrder();
        });
    },

    // Handle order submission
    handleOrder() {
        if (appState.cart.length === 0) {
            utils.showToast('购物车为空，无法下单');
            return;
        }

        // Get delivery info from form
        const deliveryInfo = this.getDeliveryInfo();
        
        // Validate form
        const errors = utils.validateOrderForm(deliveryInfo);
        if (errors.length > 0) {
            utils.showToast(errors[0]);
            return;
        }

        // Simulate payment process
        this.showPaymentModal(deliveryInfo);
    },

    // Get delivery information from form
    getDeliveryInfo() {
        const cartPage = document.getElementById('cartPage');
        const nameInput = cartPage.querySelector('input[placeholder="联系人姓名"]');
        const phoneInput = cartPage.querySelector('input[placeholder="联系电话"]');
        const addressInput = cartPage.querySelector('textarea[placeholder="详细地址"]');

        return {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            address: addressInput.value.trim()
        };
    },

    // Show payment modal
    showPaymentModal(deliveryInfo) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 m-4 max-w-sm w-full">
                <div class="text-center mb-4">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i class="fas fa-credit-card text-2xl text-green-600"></i>
                    </div>
                    <h3 class="text-lg font-bold">确认支付</h3>
                    <p class="text-gray-600 text-sm mt-2">订单金额</p>
                    <p class="text-2xl font-bold text-orange-500">¥${(appState.cartTotal + mockData.restaurant.deliveryFee).toFixed(2)}</p>
                </div>
                
                <div class="space-y-3 mb-6">
                    <button class="payment-method w-full p-3 border border-orange-500 rounded-lg flex items-center justify-between text-orange-500 bg-orange-50" data-method="alipay">
                        <div class="flex items-center">
                            <i class="fab fa-alipay text-xl mr-3"></i>
                            <span>支付宝支付</span>
                        </div>
                        <i class="fas fa-check"></i>
                    </button>
                    
                    <button class="payment-method w-full p-3 border rounded-lg flex items-center text-gray-700 hover:border-green-500 hover:text-green-500 transition-colors" data-method="wechat">
                        <i class="fab fa-weixin text-xl mr-3"></i>
                        <span>微信支付</span>
                    </button>
                </div>
                
                <div class="flex space-x-3">
                    <button class="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700" onclick="app.closePaymentModal()">
                        取消
                    </button>
                    <button class="flex-1 py-3 bg-orange-500 text-white rounded-lg font-medium" onclick="app.processPayment('${JSON.stringify(deliveryInfo).replace(/"/g, '&quot;')}')">
                        确认支付
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.currentPaymentModal = modal;

        // Handle payment method selection
        modal.querySelectorAll('.payment-method').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.querySelectorAll('.payment-method').forEach(b => {
                    b.classList.remove('border-orange-500', 'text-orange-500', 'bg-orange-50');
                    b.classList.add('border-gray-300', 'text-gray-700');
                    b.querySelector('.fa-check').style.display = 'none';
                });
                
                btn.classList.remove('border-gray-300', 'text-gray-700');
                btn.classList.add('border-orange-500', 'text-orange-500', 'bg-orange-50');
                btn.querySelector('.fa-check').style.display = 'block';
            });
        });
    },

    // Close payment modal
    closePaymentModal() {
        if (this.currentPaymentModal) {
            this.currentPaymentModal.remove();
            this.currentPaymentModal = null;
        }
    },

    // Process payment
    processPayment(deliveryInfoStr) {
        const deliveryInfo = JSON.parse(deliveryInfoStr.replace(/&quot;/g, '"'));
        
        // Show loading
        appState.setLoading(true);
        this.closePaymentModal();
        
        // Simulate payment processing
        setTimeout(() => {
            // Create order
            const order = appState.createOrder(deliveryInfo);
            
            if (order) {
                // Show success message
                this.showOrderSuccessModal(order);
                
                // Navigate to orders page
                setTimeout(() => {
                    router.navigate('orders');
                    this.closeOrderSuccessModal();
                }, 2000);
            }
            
            appState.setLoading(false);
        }, 1500);
    },

    // Show order success modal
    showOrderSuccessModal(order) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 m-4 max-w-sm w-full text-center">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-check text-2xl text-green-600"></i>
                </div>
                <h3 class="text-lg font-bold mb-2">下单成功</h3>
                <p class="text-gray-600 text-sm mb-4">您的订单已提交，餐厅正在准备中</p>
                <div class="bg-gray-50 rounded-lg p-3 mb-4">
                    <p class="text-sm text-gray-600">订单号</p>
                    <p class="font-bold">${order.id}</p>
                </div>
                <p class="text-sm text-gray-600">预计送达时间: ${order.estimatedTime}</p>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.currentSuccessModal = modal;
    },

    // Close order success modal
    closeOrderSuccessModal() {
        if (this.currentSuccessModal) {
            this.currentSuccessModal.remove();
            this.currentSuccessModal = null;
        }
    },

    // Bind modal events
    bindModalEvents() {
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.id === 'dishModal') {
                router.closeDishModal();
            }
        });

        // Prevent modal close when clicking inside
        document.addEventListener('click', (e) => {
            if (e.target.closest('#dishModalContent')) {
                e.stopPropagation();
            }
        });
    },

    // Setup state change listeners
    setupStateListeners() {
        appState.addStateChangeListener((state) => {
            // Update UI based on state changes
            this.updateLoadingState(state);
            this.updateToastState(state);
        });
    },

    // Update loading state
    updateLoadingState(state) {
        const loadingEl = document.getElementById('loading');
        
        if (state.isLoading) {
            loadingEl.style.display = 'flex';
        } else {
            loadingEl.style.display = 'none';
        }
    },

    // Update toast state
    updateToastState(state) {
        if (state.showToast && state.toastMessage) {
            utils.showToast(state.toastMessage);
        }
    },

    // Hide initial loading screen
    hideLoading() {
        setTimeout(() => {
            const loading = document.getElementById('loading');
            const app = document.getElementById('app');
            
            loading.style.display = 'none';
            app.style.display = 'block';
        }, 1000);
    },

    // Save app state to localStorage
    saveToStorage() {
        const stateToSave = {
            cart: appState.cart,
            orders: appState.orders.slice(0, 10), // Keep only last 10 orders
            userInfo: appState.userInfo
        };
        
        utils.storage.set('restaurantApp', stateToSave);
    },

    // Load app state from localStorage
    loadFromStorage() {
        const savedState = utils.storage.get('restaurantApp');
        
        if (savedState) {
            if (savedState.cart) {
                appState.cart = savedState.cart;
                appState.updateCartTotals();
            }
            
            if (savedState.orders) {
                appState.orders = [...savedState.orders, ...appState.orders];
            }
            
            if (savedState.userInfo) {
                appState.userInfo = savedState.userInfo;
            }
        }
    },

    // Clear all data (for testing)
    clearAllData() {
        appState.clearCart();
        appState.orders = [];
        utils.storage.clear();
        utils.showToast('所有数据已清除');
    },

    // Simulate order status updates
    simulateOrderUpdates() {
        const activeOrders = appState.orders.filter(order => 
            order.status === 'pending' || order.status === 'preparing'
        );

        activeOrders.forEach(order => {
            setTimeout(() => {
                if (order.status === 'pending') {
                    order.status = 'preparing';
                    order.statusText = '准备中';
                } else if (order.status === 'preparing') {
                    order.status = 'delivering';
                    order.statusText = '配送中';
                }
                
                appState.notifyStateChange();
                
                if (router.currentRoute === 'orders') {
                    router.renderOrdersPage();
                }
            }, Math.random() * 30000 + 10000); // 10-40 seconds
        });
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
    
    // Start order simulation for demo
    setTimeout(() => {
        app.simulateOrderUpdates();
    }, 5000);
});

// Handle app visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        app.saveToStorage();
    }
});