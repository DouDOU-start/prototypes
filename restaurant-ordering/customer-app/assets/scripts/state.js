// Global state management for restaurant ordering app

window.appState = {
    // Current page
    currentPage: 'home',
    
    // Search state
    searchQuery: '',
    searchResults: [],
    isSearching: false,
    
    // Selected category
    selectedCategory: null,
    
    // Shopping cart
    cart: [],
    cartTotal: 0,
    cartItemCount: 0,
    
    // Current dish being viewed
    selectedDish: null,
    
    // Orders
    orders: [],
    
    // UI state
    isLoading: false,
    showModal: false,
    showToast: false,
    toastMessage: '',
    
    // User preferences
    userLocation: null,
    userInfo: null,

    // Methods to update state
    setCurrentPage(page) {
        this.currentPage = page;
        this.notifyStateChange();
    },

    setSearchQuery(query) {
        this.searchQuery = query;
        if (query.trim()) {
            this.searchDishes(query);
        } else {
            this.searchResults = [];
        }
        this.notifyStateChange();
    },

    searchDishes(query) {
        const lowercaseQuery = query.toLowerCase();
        this.searchResults = mockData.dishes.filter(dish => 
            dish.name.toLowerCase().includes(lowercaseQuery) ||
            dish.description.toLowerCase().includes(lowercaseQuery) ||
            dish.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        );
        this.notifyStateChange();
    },

    setSelectedCategory(categoryId) {
        this.selectedCategory = categoryId;
        this.notifyStateChange();
    },

    addToCart(dishId, quantity = 1) {
        const dish = mockData.dishes.find(d => d.id === dishId);
        if (!dish) return;

        const existingItem = this.cart.find(item => item.dishId === dishId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                dishId: dishId,
                name: dish.name,
                price: dish.price,
                image: dish.image,
                quantity: quantity
            });
        }
        
        this.updateCartTotals();
        this.showToastMessage(`${dish.name} 已添加到购物车`);
        this.notifyStateChange();
    },

    updateCartItemQuantity(dishId, quantity) {
        const item = this.cart.find(item => item.dishId === dishId);
        if (!item) return;

        if (quantity <= 0) {
            this.removeFromCart(dishId);
        } else {
            item.quantity = quantity;
            this.updateCartTotals();
            this.notifyStateChange();
        }
    },

    removeFromCart(dishId) {
        this.cart = this.cart.filter(item => item.dishId !== dishId);
        this.updateCartTotals();
        this.notifyStateChange();
    },

    clearCart() {
        this.cart = [];
        this.updateCartTotals();
        this.notifyStateChange();
    },

    updateCartTotals() {
        this.cartItemCount = this.cart.reduce((total, item) => total + item.quantity, 0);
        this.cartTotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    getCartItemQuantity(dishId) {
        const item = this.cart.find(item => item.dishId === dishId);
        return item ? item.quantity : 0;
    },

    setSelectedDish(dish) {
        this.selectedDish = dish;
        this.notifyStateChange();
    },

    setShowModal(show) {
        this.showModal = show;
        this.notifyStateChange();
    },

    showToastMessage(message) {
        this.toastMessage = message;
        this.showToast = true;
        this.notifyStateChange();
        
        // Auto hide toast after 2 seconds
        setTimeout(() => {
            this.hideToast();
        }, 2000);
    },

    hideToast() {
        this.showToast = false;
        this.toastMessage = '';
        this.notifyStateChange();
    },

    setLoading(isLoading) {
        this.isLoading = isLoading;
        this.notifyStateChange();
    },

    createOrder(deliveryInfo) {
        if (this.cart.length === 0) {
            this.showToastMessage('购物车为空，无法下单');
            return null;
        }

        const order = {
            id: Date.now().toString(),
            status: 'pending',
            statusText: '待接单',
            orderTime: new Date().toLocaleString('zh-CN'),
            estimatedTime: this.calculateEstimatedTime(),
            total: this.cartTotal + mockData.restaurant.deliveryFee,
            items: [...this.cart],
            deliveryInfo: { ...deliveryInfo }
        };

        this.orders.unshift(order);
        this.clearCart();
        this.showToastMessage('订单提交成功！');
        this.notifyStateChange();
        
        return order;
    },

    calculateEstimatedTime() {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 30); // Add 30 minutes
        return now.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    },

    // State change notification for components that need to react
    stateChangeListeners: [],
    
    addStateChangeListener(listener) {
        this.stateChangeListeners.push(listener);
    },
    
    removeStateChangeListener(listener) {
        this.stateChangeListeners = this.stateChangeListeners.filter(l => l !== listener);
    },
    
    notifyStateChange() {
        this.stateChangeListeners.forEach(listener => {
            try {
                listener(this);
            } catch (error) {
                console.error('Error in state change listener:', error);
            }
        });
    },

    // Initialize state with mock data
    initialize() {
        // Load orders from mock data
        this.orders = [...mockData.orders];
        
        // Load user info
        this.userInfo = { ...mockData.user };
        
        // Initialize cart totals
        this.updateCartTotals();
        
        console.log('App state initialized');
    }
};

// Initialize state when script loads
appState.initialize();