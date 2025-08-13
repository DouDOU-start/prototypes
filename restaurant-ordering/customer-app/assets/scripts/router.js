// Router for single page navigation

window.router = {
    // Current route
    currentRoute: 'home',
    
    // Route handlers
    routes: {
        'home': () => router.showPage('homePage'),
        'menu': () => router.showPage('menuPage'),
        'cart': () => router.showPage('cartPage'),
        'orders': () => router.showPage('ordersPage')
    },

    // Initialize router
    init() {
        this.bindEvents();
        this.navigate('home');
        console.log('Router initialized');
    },

    // Bind navigation events
    bindEvents() {
        // Bottom navigation
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const page = btn.dataset.page;
                this.navigate(page);
            });
        });

        // Back button
        const backBtn = document.getElementById('backBtn');
        backBtn.addEventListener('click', () => {
            this.goBack();
        });

        // Cart button in header
        const cartBtn = document.getElementById('cartBtn');
        cartBtn.addEventListener('click', () => {
            this.navigate('cart');
        });

        // Quick actions on home page
        document.addEventListener('click', (e) => {
            if (e.target.closest('.quick-action')) {
                e.preventDefault();
                this.navigate('menu');
            }
        });

        // Category cards on home page
        document.addEventListener('click', (e) => {
            if (e.target.closest('.category-card')) {
                e.preventDefault();
                const categoryId = parseInt(e.target.closest('.category-card').dataset.categoryId);
                appState.setSelectedCategory(categoryId);
                this.navigate('menu');
            }
        });
    },

    // Navigate to a route
    navigate(route, params = {}) {
        if (!this.routes[route]) {
            console.error(`Route ${route} not found`);
            return;
        }

        this.currentRoute = route;
        this.routes[route](params);
        this.updateNavigation();
        this.updateHeader(route);
        
        // Update app state
        appState.setCurrentPage(route);
        
        console.log(`Navigated to: ${route}`);
    },

    // Show specific page
    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            page.classList.add('hidden');
        });

        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            targetPage.classList.add('active');
        }

        // Update page-specific content
        this.updatePageContent(pageId);
        
        // Show/hide specific UI elements
        this.updateUIElements(pageId);
    },

    // Update navigation active state
    updateNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === this.currentRoute) {
                item.classList.add('active');
            }
        });
    },

    // Update header based on current page
    updateHeader(route) {
        const headerTitle = document.getElementById('headerTitle');
        const backBtn = document.getElementById('backBtn');
        const searchBtn = document.getElementById('searchBtn');

        const titles = {
            'home': '美味餐厅',
            'menu': '菜单',
            'cart': '购物车',
            'orders': '我的订单'
        };

        headerTitle.textContent = titles[route] || '美味餐厅';

        // Show back button for non-home pages
        if (route === 'home') {
            backBtn.classList.add('hidden');
        } else {
            backBtn.classList.remove('hidden');
        }

        // Show search button only on menu page
        if (route === 'menu') {
            searchBtn.classList.remove('hidden');
        } else {
            searchBtn.classList.add('hidden');
        }
    },

    // Update page-specific content
    updatePageContent(pageId) {
        switch (pageId) {
            case 'homePage':
                this.renderHomePage();
                break;
            case 'menuPage':
                this.renderMenuPage();
                break;
            case 'cartPage':
                this.renderCartPage();
                break;
            case 'ordersPage':
                this.renderOrdersPage();
                break;
        }
    },

    // Update UI elements visibility
    updateUIElements(pageId) {
        const orderButton = document.getElementById('orderButton');
        
        // Show order button only on cart page
        if (pageId === 'cartPage' && appState.cart.length > 0) {
            orderButton.classList.remove('hidden');
        } else {
            orderButton.classList.add('hidden');
        }
    },

    // Render home page content
    renderHomePage() {
        this.renderFeaturedDishes();
        this.renderCategoriesGrid();
    },

    // Render featured dishes on home page
    renderFeaturedDishes() {
        const container = document.getElementById('featuredDishes');
        const featuredDishes = mockData.dishes.filter(dish => dish.featured);
        
        container.innerHTML = featuredDishes.map(dish => `
            <div class="dish-card bg-white rounded-lg shadow-sm p-3 flex items-center space-x-3 cursor-pointer hover:shadow-md transition-shadow" data-dish-id="${dish.id}">
                <img src="${dish.image}" alt="${dish.name}" class="w-16 h-16 object-cover rounded-lg">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-800">${dish.name}</h4>
                    <p class="text-xs text-gray-500 mb-1">${dish.description}</p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <span class="text-orange-500 font-bold">¥${dish.price.toFixed(2)}</span>
                            ${dish.originalPrice ? `<span class="text-gray-400 text-sm line-through">¥${dish.originalPrice.toFixed(2)}</span>` : ''}
                        </div>
                        <div class="flex items-center space-x-1 text-xs text-gray-500">
                            <i class="fas fa-star text-yellow-400"></i>
                            <span>${dish.rating}</span>
                            <span class="ml-2">月售${dish.salesCount}</span>
                        </div>
                    </div>
                </div>
                <button class="add-to-cart-btn bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors" data-dish-id="${dish.id}">
                    <i class="fas fa-plus text-sm"></i>
                </button>
            </div>
        `).join('');

        // Bind click events
        this.bindDishCardEvents(container);
    },

    // Render categories grid on home page
    renderCategoriesGrid() {
        const container = document.getElementById('categories');
        
        container.innerHTML = mockData.categories.map(category => `
            <div class="category-card bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow" data-category-id="${category.id}">
                <img src="${category.image}" alt="${category.name}" class="w-full h-24 object-cover">
                <div class="p-3 text-center">
                    <h4 class="font-semibold text-gray-800">${category.name}</h4>
                </div>
            </div>
        `).join('');
    },

    // Render menu page content
    renderMenuPage() {
        this.renderCategoryTabs();
        this.renderMenuItems();
    },

    // Render category tabs
    renderCategoryTabs() {
        const container = document.getElementById('categoryTabs');
        
        container.innerHTML = mockData.categories.map(category => `
            <button class="category-tab ${appState.selectedCategory === category.id ? 'active' : ''}" data-category-id="${category.id}">
                ${category.name}
            </button>
        `).join('');

        // Bind tab events
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-tab')) {
                const categoryId = parseInt(e.target.dataset.categoryId);
                appState.setSelectedCategory(categoryId);
                this.renderMenuItems();
                
                // Update tab active state
                container.querySelectorAll('.category-tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                e.target.classList.add('active');
            }
        });
    },

    // Render menu items
    renderMenuItems() {
        const container = document.getElementById('menuItems');
        let dishes;

        if (appState.searchQuery) {
            dishes = appState.searchResults;
        } else if (appState.selectedCategory) {
            dishes = mockData.dishes.filter(dish => dish.category === appState.selectedCategory);
        } else {
            dishes = mockData.dishes;
        }

        container.innerHTML = dishes.map(dish => `
            <div class="dish-card bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow" data-dish-id="${dish.id}">
                <div class="flex">
                    <img src="${dish.image}" alt="${dish.name}" class="w-24 h-24 object-cover">
                    <div class="flex-1 p-3">
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="font-semibold text-gray-800">${dish.name}</h4>
                            ${this.renderSpicyLevel(dish.spicy)}
                        </div>
                        <p class="text-xs text-gray-500 mb-2 line-clamp-2">${dish.description}</p>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <span class="text-orange-500 font-bold">¥${dish.price.toFixed(2)}</span>
                                ${dish.originalPrice ? `<span class="text-gray-400 text-sm line-through">¥${dish.originalPrice.toFixed(2)}</span>` : ''}
                            </div>
                            <div class="flex items-center space-x-2">
                                ${this.renderQuantityControl(dish.id)}
                            </div>
                        </div>
                        <div class="flex items-center mt-2 space-x-2">
                            <div class="flex items-center space-x-1 text-xs text-gray-500">
                                <i class="fas fa-star text-yellow-400"></i>
                                <span>${dish.rating}</span>
                            </div>
                            <span class="text-xs text-gray-500">月售${dish.salesCount}</span>
                            <div class="flex space-x-1">
                                ${dish.tags.map(tag => `<span class="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">${tag}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Bind events
        this.bindDishCardEvents(container);
        this.bindQuantityControlEvents(container);
    },

    // Render cart page content
    renderCartPage() {
        const container = document.getElementById('cartItems');
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('total');

        if (appState.cart.length === 0) {
            container.innerHTML = `
                <div class="text-center py-16">
                    <i class="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500 mb-4">购物车还是空的</p>
                    <button class="btn-primary px-6 py-2 rounded-lg text-white font-medium" onclick="router.navigate('menu')">
                        去点餐
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <h3 class="font-bold mb-4">订单详情</h3>
            <div class="space-y-3">
                ${appState.cart.map(item => `
                    <div class="cart-item flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div class="flex items-center space-x-3">
                            <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-lg">
                            <div>
                                <h5 class="font-medium">${item.name}</h5>
                                <p class="text-orange-500 font-semibold">¥${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-3">
                            ${this.renderQuantityControl(item.dishId)}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Update totals
        subtotalEl.textContent = `¥${appState.cartTotal.toFixed(2)}`;
        totalEl.textContent = `¥${(appState.cartTotal + mockData.restaurant.deliveryFee).toFixed(2)}`;

        // Bind quantity control events
        this.bindQuantityControlEvents(container);
    },

    // Render orders page content
    renderOrdersPage() {
        const container = document.getElementById('ordersList');
        
        if (appState.orders.length === 0) {
            container.innerHTML = `
                <div class="text-center py-16">
                    <i class="fas fa-receipt text-6xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500">暂无订单</p>
                </div>
            `;
            return;
        }

        container.innerHTML = appState.orders.map(order => `
            <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h4 class="font-semibold">订单号: ${order.id}</h4>
                        <p class="text-sm text-gray-500">${order.orderTime}</p>
                    </div>
                    <span class="status-badge status-${order.status}">${order.statusText}</span>
                </div>
                
                <div class="space-y-2 mb-3">
                    ${order.items.map(item => `
                        <div class="flex justify-between text-sm">
                            <span>${item.name} × ${item.quantity}</span>
                            <span>¥${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="flex justify-between items-center pt-3 border-t">
                    <span class="font-bold">总计: ¥${order.total.toFixed(2)}</span>
                    ${order.status === 'preparing' ? `<span class="text-sm text-blue-600">预计送达: ${order.estimatedTime}</span>` : ''}
                </div>
            </div>
        `).join('');
    },

    // Helper methods
    renderSpicyLevel(level) {
        if (level === 0) return '';
        
        const colors = ['', 'text-orange-400', 'text-red-400', 'text-red-600'];
        const icons = Array(level).fill('<i class="fas fa-pepper-hot"></i>').join(' ');
        
        return `<span class="${colors[level]} text-xs">${icons}</span>`;
    },

    renderQuantityControl(dishId) {
        const quantity = appState.getCartItemQuantity(dishId);
        
        if (quantity === 0) {
            return `
                <button class="add-to-cart-btn bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors" data-dish-id="${dishId}">
                    <i class="fas fa-plus text-sm"></i>
                </button>
            `;
        }
        
        return `
            <div class="quantity-control">
                <button class="quantity-btn decrease-btn" data-dish-id="${dishId}" ${quantity <= 1 ? 'disabled' : ''}>
                    <i class="fas fa-minus"></i>
                </button>
                <span class="quantity-display">${quantity}</span>
                <button class="quantity-btn increase-btn" data-dish-id="${dishId}">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `;
    },

    // Event binding helpers
    bindDishCardEvents(container) {
        container.addEventListener('click', (e) => {
            const dishCard = e.target.closest('.dish-card');
            if (!dishCard) return;

            // Don't trigger modal if clicking on add to cart button or quantity controls
            if (e.target.closest('.add-to-cart-btn') || e.target.closest('.quantity-control')) {
                return;
            }

            const dishId = parseInt(dishCard.dataset.dishId);
            const dish = mockData.dishes.find(d => d.id === dishId);
            if (dish) {
                this.showDishModal(dish);
            }
        });

        // Add to cart button events
        container.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart-btn')) {
                e.stopPropagation();
                const dishId = parseInt(e.target.closest('.add-to-cart-btn').dataset.dishId);
                appState.addToCart(dishId);
                
                // Re-render the specific element
                setTimeout(() => {
                    if (this.currentRoute === 'menu') {
                        this.renderMenuItems();
                    } else if (this.currentRoute === 'home') {
                        this.renderFeaturedDishes();
                    }
                }, 100);
            }
        });
    },

    bindQuantityControlEvents(container) {
        container.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (e.target.closest('.increase-btn')) {
                const dishId = parseInt(e.target.closest('.increase-btn').dataset.dishId);
                const currentQty = appState.getCartItemQuantity(dishId);
                appState.updateCartItemQuantity(dishId, currentQty + 1);
                
                setTimeout(() => {
                    if (this.currentRoute === 'menu') {
                        this.renderMenuItems();
                    } else if (this.currentRoute === 'cart') {
                        this.renderCartPage();
                    }
                }, 100);
                
            } else if (e.target.closest('.decrease-btn')) {
                const dishId = parseInt(e.target.closest('.decrease-btn').dataset.dishId);
                const currentQty = appState.getCartItemQuantity(dishId);
                appState.updateCartItemQuantity(dishId, currentQty - 1);
                
                setTimeout(() => {
                    if (this.currentRoute === 'menu') {
                        this.renderMenuItems();
                    } else if (this.currentRoute === 'cart') {
                        this.renderCartPage();
                    }
                }, 100);
            }
        });
    },

    // Show dish detail modal
    showDishModal(dish) {
        const modal = document.getElementById('dishModal');
        const content = document.getElementById('dishModalContent');
        
        content.innerHTML = `
            <div class="p-6">
                <button class="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center" onclick="router.closeDishModal()">
                    <i class="fas fa-times"></i>
                </button>
                
                <img src="${dish.image}" alt="${dish.name}" class="w-full h-48 object-cover rounded-lg mb-4">
                
                <div class="flex justify-between items-start mb-3">
                    <h3 class="text-xl font-bold">${dish.name}</h3>
                    ${this.renderSpicyLevel(dish.spicy)}
                </div>
                
                <p class="text-gray-600 mb-4">${dish.description}</p>
                
                <div class="flex items-center space-x-4 mb-4">
                    <div class="flex items-center space-x-1 text-yellow-500">
                        <i class="fas fa-star"></i>
                        <span class="font-semibold">${dish.rating}</span>
                    </div>
                    <span class="text-gray-500">月售${dish.salesCount}</span>
                    <div class="flex space-x-1">
                        ${dish.tags.map(tag => `<span class="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">${tag}</span>`).join('')}
                    </div>
                </div>
                
                <div class="flex items-center justify-between pt-4 border-t">
                    <div>
                        <span class="text-2xl font-bold text-orange-500">¥${dish.price.toFixed(2)}</span>
                        ${dish.originalPrice ? `<span class="text-gray-400 text-lg line-through ml-2">¥${dish.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <div class="flex items-center space-x-3">
                        ${this.renderQuantityControl(dish.id)}
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
        appState.setShowModal(true);
        
        // Bind quantity control events for modal
        this.bindQuantityControlEvents(content);
    },

    closeDishModal() {
        const modal = document.getElementById('dishModal');
        modal.classList.add('hidden');
        appState.setShowModal(false);
    },

    // Go back navigation
    goBack() {
        if (this.currentRoute !== 'home') {
            this.navigate('home');
        }
    }
};