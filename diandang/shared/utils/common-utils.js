// 点当平台 - 通用工具函数库
const CommonUtils = {
    // 格式化相关
    format: {
        // 价格格式化
        currency: (amount, showSymbol = true) => {
            const formatted = parseFloat(amount || 0).toFixed(2);
            return showSymbol ? `¥${formatted}` : formatted;
        },
        
        // 时间格式化
        time: (dateString, format = 'datetime') => {
            const date = new Date(dateString);
            if (isNaN(date)) return '无效时间';
            
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            
            switch (format) {
                case 'date':
                    return `${year}-${month}-${day}`;
                case 'time':
                    return `${hours}:${minutes}`;
                case 'datetime':
                    return `${year}-${month}-${day} ${hours}:${minutes}`;
                default:
                    return date.toLocaleString('zh-CN');
            }
        },
        
        // 相对时间
        relativeTime: (dateString) => {
            const now = new Date();
            const date = new Date(dateString);
            const diff = Math.floor((now - date) / 1000);
            
            if (diff < 60) return '刚刚';
            if (diff < 3600) return Math.floor(diff / 60) + '分钟前';
            if (diff < 86400) return Math.floor(diff / 3600) + '小时前';
            if (diff < 604800) return Math.floor(diff / 86400) + '天前';
            return CommonUtils.format.time(dateString, 'date');
        },
        
        // 手机号脱敏
        maskPhone: (phone) => {
            if (!phone || phone.length !== 11) return phone;
            return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        },
        
        // 百分比格式化
        percentage: (value, decimals = 1) => {
            return (parseFloat(value || 0) * 100).toFixed(decimals) + '%';
        }
    },
    
    // 验证相关
    validate: {
        // 手机号验证
        phone: (phone) => {
            return /^1[3-9]\d{9}$/.test(phone);
        },
        
        // 邮箱验证
        email: (email) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        
        // 价格验证
        price: (price) => {
            return !isNaN(price) && parseFloat(price) >= 0;
        },
        
        // 非空验证
        required: (value) => {
            return value !== null && value !== undefined && value !== '';
        }
    },
    
    // 数组操作
    array: {
        // 去重
        unique: (arr, key = null) => {
            if (!key) return [...new Set(arr)];
            const seen = new Set();
            return arr.filter(item => {
                const value = item[key];
                if (seen.has(value)) return false;
                seen.add(value);
                return true;
            });
        },
        
        // 分组
        groupBy: (arr, key) => {
            return arr.reduce((groups, item) => {
                const value = typeof key === 'function' ? key(item) : item[key];
                (groups[value] = groups[value] || []).push(item);
                return groups;
            }, {});
        },
        
        // 排序
        sortBy: (arr, key, desc = false) => {
            return [...arr].sort((a, b) => {
                const aVal = typeof key === 'function' ? key(a) : a[key];
                const bVal = typeof key === 'function' ? key(b) : b[key];
                
                if (aVal < bVal) return desc ? 1 : -1;
                if (aVal > bVal) return desc ? -1 : 1;
                return 0;
            });
        }
    },
    
    // 对象操作
    object: {
        // 深拷贝
        deepClone: (obj) => {
            if (obj === null || typeof obj !== 'object') return obj;
            if (obj instanceof Date) return new Date(obj.getTime());
            if (obj instanceof Array) return obj.map(item => CommonUtils.object.deepClone(item));
            if (typeof obj === 'object') {
                const cloned = {};
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        cloned[key] = CommonUtils.object.deepClone(obj[key]);
                    }
                }
                return cloned;
            }
        },
        
        // 获取嵌套属性
        get: (obj, path, defaultValue = null) => {
            const keys = path.split('.');
            let result = obj;
            for (let key of keys) {
                if (result === null || result === undefined || !result.hasOwnProperty(key)) {
                    return defaultValue;
                }
                result = result[key];
            }
            return result;
        },
        
        // 过滤空值
        filterEmpty: (obj) => {
            const filtered = {};
            for (let key in obj) {
                if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
                    filtered[key] = obj[key];
                }
            }
            return filtered;
        }
    },
    
    // DOM 操作助手
    dom: {
        // 查找元素
        $: (selector) => document.querySelector(selector),
        $$: (selector) => document.querySelectorAll(selector),
        
        // 显示/隐藏元素
        show: (element) => {
            if (typeof element === 'string') element = CommonUtils.dom.$(element);
            if (element) element.style.display = 'block';
        },
        
        hide: (element) => {
            if (typeof element === 'string') element = CommonUtils.dom.$(element);
            if (element) element.style.display = 'none';
        },
        
        toggle: (element) => {
            if (typeof element === 'string') element = CommonUtils.dom.$(element);
            if (element) {
                element.style.display = element.style.display === 'none' ? 'block' : 'none';
            }
        },
        
        // 添加/移除类
        addClass: (element, className) => {
            if (typeof element === 'string') element = CommonUtils.dom.$(element);
            if (element) element.classList.add(className);
        },
        
        removeClass: (element, className) => {
            if (typeof element === 'string') element = CommonUtils.dom.$(element);
            if (element) element.classList.remove(className);
        },
        
        toggleClass: (element, className) => {
            if (typeof element === 'string') element = CommonUtils.dom.$(element);
            if (element) element.classList.toggle(className);
        }
    },
    
    // 存储操作
    storage: {
        // localStorage 操作
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('存储失败:', e);
                return false;
            }
        },
        
        get: (key, defaultValue = null) => {
            try {
                const value = localStorage.getItem(key);
                return value ? JSON.parse(value) : defaultValue;
            } catch (e) {
                console.error('读取存储失败:', e);
                return defaultValue;
            }
        },
        
        remove: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('删除存储失败:', e);
                return false;
            }
        },
        
        clear: () => {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.error('清空存储失败:', e);
                return false;
            }
        }
    },
    
    // 网络请求助手
    http: {
        // 模拟 API 调用
        mockRequest: (data, delay = 1000) => {
            return new Promise((resolve) => {
                setTimeout(() => resolve({ success: true, data }), delay);
            });
        },
        
        // 获取查询参数
        getQueryParam: (name) => {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        }
    },
    
    // 随机工具
    random: {
        // 生成随机字符串
        string: (length = 8) => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        },
        
        // 生成随机数字
        number: (min = 0, max = 100) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        
        // 从数组中随机选择
        choice: (arr) => {
            return arr[Math.floor(Math.random() * arr.length)];
        }
    },
    
    // 防抖和节流
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// 导出工具函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommonUtils;
} else if (typeof window !== 'undefined') {
    window.CommonUtils = CommonUtils;
}