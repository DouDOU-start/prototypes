// Utility functions for merchant dashboard

window.dashboardUtils = {
    // Format functions
    formatPrice(price) {
        return `¥${price.toFixed(2)}`;
    },

    formatDateTime(dateString) {
        return new Date(dateString).toLocaleString('zh-CN');
    },

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('zh-CN');
    },

    formatTime(dateString) {
        return new Date(dateString).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    formatDuration(minutes) {
        if (minutes < 60) {
            return `${minutes}分钟`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours}小时${remainingMinutes}分钟` : `${hours}小时`;
    },

    // Data processing
    calculateOrderStats(orders) {
        const stats = {
            total: orders.length,
            completed: 0,
            pending: 0,
            preparing: 0,
            delivering: 0,
            cancelled: 0,
            revenue: 0,
            avgOrderValue: 0
        };

        orders.forEach(order => {
            stats[order.status]++;
            if (order.status === 'completed') {
                stats.revenue += order.total;
            }
        });

        if (stats.completed > 0) {
            stats.avgOrderValue = stats.revenue / stats.completed;
        }

        return stats;
    },

    calculateDishStats(dishes, orders) {
        const dishStats = {};

        dishes.forEach(dish => {
            dishStats[dish.id] = {
                ...dish,
                totalSales: 0,
                totalRevenue: 0,
                orderCount: 0
            };
        });

        orders.forEach(order => {
            if (order.status === 'completed') {
                order.items.forEach(item => {
                    const dish = dishes.find(d => d.name === item.name);
                    if (dish && dishStats[dish.id]) {
                        dishStats[dish.id].totalSales += item.quantity;
                        dishStats[dish.id].totalRevenue += item.price * item.quantity;
                        dishStats[dish.id].orderCount++;
                    }
                });
            }
        });

        return Object.values(dishStats);
    },

    // Time utilities
    getTimeRangeOrders(orders, days) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        return orders.filter(order => new Date(order.orderTime) >= cutoffDate);
    },

    getDailyStats(orders, days = 7) {
        const dailyStats = {};
        const today = new Date();

        // Initialize days
        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            
            dailyStats[dateKey] = {
                date: dateKey,
                orders: 0,
                revenue: 0,
                completedOrders: 0
            };
        }

        // Process orders
        orders.forEach(order => {
            const orderDate = new Date(order.orderTime).toISOString().split('T')[0];
            if (dailyStats[orderDate]) {
                dailyStats[orderDate].orders++;
                if (order.status === 'completed') {
                    dailyStats[orderDate].completedOrders++;
                    dailyStats[orderDate].revenue += order.total;
                }
            }
        });

        return Object.values(dailyStats).reverse();
    },

    getHourlyDistribution(orders) {
        const hourlyStats = {};
        
        // Initialize hours (11 AM to 10 PM)
        for (let hour = 11; hour <= 22; hour++) {
            hourlyStats[hour] = 0;
        }

        orders.forEach(order => {
            const hour = new Date(order.orderTime).getHours();
            if (hourlyStats[hour] !== undefined) {
                hourlyStats[hour]++;
            }
        });

        return Object.entries(hourlyStats).map(([hour, count]) => ({
            hour: parseInt(hour),
            orders: count
        }));
    },

    // Business logic
    calculateOrderPriority(order) {
        const now = new Date();
        const orderTime = new Date(order.orderTime);
        const minutesPassed = (now - orderTime) / (1000 * 60);

        // High priority if waiting more than 15 minutes
        if (minutesPassed > 15) return 'high';
        
        // Medium priority for orders over ¥100
        if (order.total > 100) return 'medium';
        
        return 'normal';
    },

    calculateEstimatedTime(preparationTime, currentLoad = 1) {
        const baseTime = preparationTime || 15;
        const adjustedTime = baseTime * currentLoad;
        
        const now = new Date();
        now.setMinutes(now.getMinutes() + adjustedTime);
        
        return now.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Validation
    validateDishData(dishData) {
        const errors = [];

        if (!dishData.name || dishData.name.trim().length < 2) {
            errors.push('菜品名称至少需要2个字符');
        }

        if (!dishData.description || dishData.description.trim().length < 5) {
            errors.push('菜品描述至少需要5个字符');
        }

        if (!dishData.price || dishData.price <= 0) {
            errors.push('售价必须大于0');
        }

        if (!dishData.cost || dishData.cost <= 0) {
            errors.push('成本必须大于0');
        }

        if (dishData.price <= dishData.cost) {
            errors.push('售价必须高于成本');
        }

        if (dishData.stock < 0) {
            errors.push('库存不能为负数');
        }

        return errors;
    },

    validateOrderData(orderData) {
        const errors = [];

        if (!orderData.customerName || orderData.customerName.trim().length < 2) {
            errors.push('客户姓名至少需要2个字符');
        }

        if (!orderData.customerPhone || !this.isValidPhone(orderData.customerPhone)) {
            errors.push('请输入有效的手机号码');
        }

        if (!orderData.deliveryAddress || orderData.deliveryAddress.trim().length < 5) {
            errors.push('配送地址至少需要5个字符');
        }

        if (!orderData.items || orderData.items.length === 0) {
            errors.push('订单必须包含至少一个商品');
        }

        return errors;
    },

    isValidPhone(phone) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(phone);
    },

    // Export/Import utilities
    exportOrdersToCSV(orders, filename = 'orders.csv') {
        const headers = ['订单号', '客户姓名', '客户电话', '订单时间', '状态', '总金额', '商品数量', '配送地址'];
        const rows = orders.map(order => [
            order.id,
            order.customerName,
            order.customerPhone,
            order.orderTime,
            order.statusText,
            order.total,
            order.itemCount,
            order.deliveryAddress
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        this.downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
    },

    exportDishesToCSV(dishes, filename = 'dishes.csv') {
        const headers = ['菜品ID', '菜品名称', '分类', '售价', '成本', '库存', '是否可用', '销量', '评分'];
        const rows = dishes.map(dish => [
            dish.id,
            dish.name,
            dish.categoryName,
            dish.price,
            dish.cost,
            dish.stock,
            dish.available ? '是' : '否',
            dish.salesCount,
            dish.rating
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        this.downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
    },

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(url);
    },

    // Print utilities
    printOrder(order) {
        const printContent = `
            <div style="font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.4;">
                <div style="text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 15px;">
                    <h2 style="margin: 0;">美味餐厅</h2>
                    <p style="margin: 5px 0;">订单小票</p>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <p><strong>订单号:</strong> ${order.id}</p>
                    <p><strong>下单时间:</strong> ${order.orderTime}</p>
                    <p><strong>客户:</strong> ${order.customerName}</p>
                    <p><strong>电话:</strong> ${order.customerPhone}</p>
                    <p><strong>地址:</strong> ${order.deliveryAddress}</p>
                    ${order.notes ? `<p><strong>备注:</strong> ${order.notes}</p>` : ''}
                </div>
                
                <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; margin-bottom: 15px;">
                    <table style="width: 100%;">
                        <thead>
                            <tr style="border-bottom: 1px solid #000;">
                                <th style="text-align: left; padding: 5px;">商品</th>
                                <th style="text-align: center; padding: 5px;">数量</th>
                                <th style="text-align: right; padding: 5px;">金额</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td style="padding: 3px;">${item.name}</td>
                                    <td style="text-align: center; padding: 3px;">${item.quantity}</td>
                                    <td style="text-align: right; padding: 3px;">¥${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div style="text-align: right;">
                    <p>小计: ¥${(order.total - 5).toFixed(2)}</p>
                    <p>配送费: ¥5.00</p>
                    <p style="font-size: 16px;"><strong>总计: ¥${order.total.toFixed(2)}</strong></p>
                </div>
                
                <div style="text-align: center; margin-top: 20px; border-top: 1px dashed #000; padding-top: 10px;">
                    <p style="font-size: 12px;">谢谢惠顾，欢迎再次光临！</p>
                    <p style="font-size: 12px;">客服电话: 010-12345678</p>
                </div>
            </div>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>订单 ${order.id}</title>
                <style>
                    body { margin: 0; padding: 20px; }
                    @media print { 
                        body { padding: 0; } 
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                ${printContent}
                <div class="no-print" style="text-align: center; margin-top: 20px;">
                    <button onclick="window.print()" style="padding: 10px 20px; background: #f97316; color: white; border: none; border-radius: 5px; cursor: pointer;">打印</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">关闭</button>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
    },

    // Local storage utilities
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    loadFromStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return defaultValue;
        }
    },

    // Notification utilities
    showNotification(title, message, type = 'info') {
        // Check if browser supports notifications
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return;
        }

        // Check permission
        if (Notification.permission === 'granted') {
            this.createNotification(title, message, type);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.createNotification(title, message, type);
                }
            });
        }
    },

    createNotification(title, message, type) {
        const notification = new Notification(title, {
            body: message,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: type,
            requireInteraction: type === 'newOrder'
        });

        // Auto close after 5 seconds
        setTimeout(() => {
            notification.close();
        }, 5000);

        return notification;
    },

    // Network utilities
    checkOnlineStatus() {
        return navigator.onLine;
    },

    // Performance utilities
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Color utilities
    getStatusColor(status) {
        const colors = {
            pending: '#f59e0b',
            confirmed: '#3b82f6',
            preparing: '#3b82f6',
            delivering: '#10b981',
            completed: '#6b7280',
            cancelled: '#ef4444'
        };
        return colors[status] || '#6b7280';
    },

    getPriorityColor(priority) {
        const colors = {
            high: '#ef4444',
            medium: '#f59e0b',
            normal: '#10b981'
        };
        return colors[priority] || '#10b981';
    },

    // Chart utilities (placeholder for future chart integration)
    generateChartData(data, type = 'line') {
        return {
            type: type,
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        };
    },

    // Error handling
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        // You could integrate with error reporting service here
        // Example: Sentry.captureException(error);
        
        return {
            success: false,
            error: error.message,
            context: context
        };
    },

    // Feature detection
    supportsFeature(feature) {
        const features = {
            notifications: 'Notification' in window,
            localStorage: typeof Storage !== 'undefined',
            webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
            geolocation: 'geolocation' in navigator,
            serviceWorker: 'serviceWorker' in navigator
        };
        
        return features[feature] || false;
    }
};