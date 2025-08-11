let currentPage = 'splash';
let cartItems = 0;
let pageHistory = [];

// 小程序模拟数据
const miniprogramData = {
    user: {
        name: '小程序用户',
        avatar: '',
        phone: '138****8888',
        points: 258,
        level: '黄金会员',
        visitCount: 12,
        favoriteTable: 'A03'
    },
    menuCategories: [
        {
            id: 'signature',
            name: '招牌川菜',
            icon: '🌶️',
            items: [
                { 
                    id: 1, 
                    name: '宫保鸡丁', 
                    price: 32.0, 
                    originalPrice: 36.0,
                    description: '传统宫保鸡丁，选用优质鸡胸肉，配以花生米，口感鲜嫩爽口', 
                    image: '', 
                    rating: 4.8,
                    salesCount: 156,
                    tags: ['招牌', '微辣', '下饭'],
                    spicyLevel: 2,
                    preparationTime: '15分钟'
                },
                { 
                    id: 2, 
                    name: '麻婆豆腐', 
                    price: 26.0, 
                    originalPrice: 28.0,
                    description: '正宗川味麻婆豆腐，嫩滑豆腐配麻辣汤汁，开胃下饭', 
                    image: '', 
                    rating: 4.7,
                    salesCount: 134,
                    tags: ['经典', '麻辣', '素食'],
                    spicyLevel: 3,
                    preparationTime: '12分钟'
                },
                { 
                    id: 3, 
                    name: '回锅肉', 
                    price: 38.0, 
                    originalPrice: 42.0,
                    description: '家常回锅肉，五花肉片配青椒豆瓣酱，肥而不腻香辣开胃', 
                    image: '', 
                    rating: 4.9,
                    salesCount: 128,
                    tags: ['家常', '香辣', '下饭'],
                    spicyLevel: 2,
                    preparationTime: '18分钟'
                },
                { 
                    id: 4, 
                    name: '水煮鱼', 
                    price: 68.0, 
                    originalPrice: 78.0,
                    description: '麻辣鲜香水煮鱼，选用新鲜草鱼，配豆芽菜，汤鲜肉嫩', 
                    image: '', 
                    rating: 4.8,
                    salesCount: 95,
                    tags: ['招牌', '重辣', '鲜美'],
                    spicyLevel: 4,
                    preparationTime: '25分钟'
                }
            ]
        },
        {
            id: 'homestyle',
            name: '经典家常',
            icon: '🏠',
            items: [
                { 
                    id: 5, 
                    name: '糖醋排骨', 
                    price: 42.0, 
                    originalPrice: 48.0,
                    description: '酸甜可口糖醋排骨，精选新鲜排骨，色泽红亮，酸甜适中', 
                    image: '', 
                    rating: 4.7,
                    salesCount: 76,
                    tags: ['酸甜', '家常', '老少皆宜'],
                    spicyLevel: 0,
                    preparationTime: '30分钟'
                },
                { 
                    id: 6, 
                    name: '红烧肉', 
                    price: 45.0, 
                    originalPrice: 52.0,
                    description: '经典红烧肉，肥瘦相间，色泽红润，入口即化', 
                    image: '', 
                    rating: 4.6,
                    salesCount: 62,
                    tags: ['经典', '软糯', '营养'],
                    spicyLevel: 0,
                    preparationTime: '35分钟'
                }
            ]
        },
        {
            id: 'cold',
            name: '凉菜系列',
            icon: '🥒',
            items: [
                { 
                    id: 7, 
                    name: '口水鸡', 
                    price: 35.0, 
                    originalPrice: 38.0,
                    description: '麻辣口水鸡，选用三黄鸡，配特制口水鸡汁，麻辣鲜香', 
                    image: '', 
                    rating: 4.5,
                    salesCount: 65,
                    tags: ['凉菜', '麻辣', '开胃'],
                    spicyLevel: 3,
                    preparationTime: '10分钟'
                },
                { 
                    id: 8, 
                    name: '凉拌黄瓜', 
                    price: 12.0, 
                    originalPrice: 15.0,
                    description: '爽脆凉拌黄瓜，选用新鲜黄瓜，清脆爽口，解腻开胃', 
                    image: '', 
                    rating: 4.4,
                    salesCount: 89,
                    tags: ['清爽', '开胃', '素食'],
                    spicyLevel: 1,
                    preparationTime: '5分钟'
                }
            ]
        },
        {
            id: 'soup',
            name: '汤品粥类',
            icon: '🍲',
            items: [
                { 
                    id: 9, 
                    name: '蛋花汤', 
                    price: 15.0, 
                    originalPrice: 18.0,
                    description: '清淡蛋花汤，蛋花朵朵，汤清味鲜，营养丰富', 
                    image: '', 
                    rating: 4.3,
                    salesCount: 156,
                    tags: ['清淡', '营养', '暖胃'],
                    spicyLevel: 0,
                    preparationTime: '8分钟'
                },
                { 
                    id: 10, 
                    name: '小米粥', 
                    price: 8.0, 
                    originalPrice: 12.0,
                    description: '养胃小米粥，精选优质小米，熬制香浓，养胃润燥', 
                    image: '', 
                    rating: 4.6,
                    salesCount: 98,
                    tags: ['养胃', '营养', '温润'],
                    spicyLevel: 0,
                    preparationTime: '6分钟'
                },
                { 
                    id: 11, 
                    name: '白米饭', 
                    price: 5.0, 
                    originalPrice: 6.0,
                    description: '优质东北大米，颗粒饱满，香甜可口', 
                    image: '', 
                    rating: 4.8,
                    salesCount: 200,
                    tags: ['主食', '香甜', '优质'],
                    spicyLevel: 0,
                    preparationTime: '3分钟'
                }
            ]
        }
    ],
    cart: [
        { id: 1, name: '宫保鸡丁', price: 32.0, quantity: 1, note: '微辣' },
        { id: 2, name: '麻婆豆腐', price: 26.0, quantity: 1, note: '不要花椒' },
        { id: 11, name: '白米饭', price: 5.0, quantity: 2, note: '' }
    ],
    orders: [
        {
            id: 'ORD2024011503',
            status: 'pending',
            items: [
                { name: '宫保鸡丁', price: 32.0, quantity: 1 },
                { name: '麻婆豆腐', price: 26.0, quantity: 1 },
                { name: '白米饭', price: 5.0, quantity: 2 }
            ],
            total: 68.0,
            orderTime: '2024-01-15 14:30:15',
            tableNumber: 'A03',
            estimatedTime: '等待确认',
            remark: '微辣，不要花椒',
            paymentMethod: '微信支付',
            paymentStatus: '已支付'
        },
        {
            id: 'ORD2024011502',
            status: 'ready',
            items: [
                { name: '糖醋排骨', price: 42.0, quantity: 1 },
                { name: '蛋花汤', price: 15.0, quantity: 1 },
                { name: '白米饭', price: 5.0, quantity: 1 }
            ],
            total: 62.0,
            orderTime: '2024-01-15 13:45:20',
            tableNumber: 'B06',
            estimatedTime: '请取餐',
            remark: '',
            paymentMethod: '支付宝',
            paymentStatus: '已支付'
        },
        {
            id: 'ORD2024011501',
            status: 'preparing',
            items: [
                { name: '回锅肉', price: 38.0, quantity: 1 },
                { name: '凉拌黄瓜', price: 12.0, quantity: 1 },
                { name: '小米粥', price: 8.0, quantity: 1 }
            ],
            total: 58.0,
            orderTime: '2024-01-15 12:25:30',
            tableNumber: 'C02',
            estimatedTime: '15分钟',
            remark: '少放辣椒',
            paymentMethod: '微信支付',
            paymentStatus: '已支付'
        },
        {
            id: 'ORD2024011401',
            status: 'completed',
            items: [
                { name: '水煮鱼', price: 68.0, quantity: 1 },
                { name: '口水鸡', price: 35.0, quantity: 1 },
                { name: '白米饭', price: 5.0, quantity: 2 }
            ],
            total: 113.0,
            orderTime: '2024-01-14 18:45:20',
            tableNumber: 'A01',
            estimatedTime: '已完成',
            remark: '中辣',
            paymentMethod: '微信支付',
            paymentStatus: '已支付'
        },
        {
            id: 'ORD2024011301',
            status: 'completed',
            items: [
                { name: '宫保鸡丁', price: 32.0, quantity: 1 },
                { name: '蛋花汤', price: 15.0, quantity: 1 }
            ],
            total: 47.0,
            orderTime: '2024-01-13 19:15:10',
            tableNumber: 'B08',
            estimatedTime: '已完成',
            remark: '',
            paymentMethod: '现金',
            paymentStatus: '已支付'
        },
        {
            id: 'ORD2024011201',
            status: 'cancelled',
            items: [
                { name: '红烧肉', price: 45.0, quantity: 1 },
                { name: '白米饭', price: 5.0, quantity: 1 }
            ],
            total: 50.0,
            orderTime: '2024-01-12 17:30:25',
            tableNumber: 'C05',
            estimatedTime: '已取消',
            remark: '临时有事',
            paymentMethod: '微信支付',
            paymentStatus: '已退款'
        },
        {
            id: 'ORD2024011202',
            status: 'refunded',
            items: [
                { name: '水煮鱼', price: 68.0, quantity: 1 },
                { name: '小米粥', price: 8.0, quantity: 1 }
            ],
            total: 76.0,
            orderTime: '2024-01-12 19:45:10',
            tableNumber: 'A05',
            estimatedTime: '已退款',
            remark: '菜品问题',
            paymentMethod: '支付宝',
            paymentStatus: '已退款'
        },
        {
            id: 'ORD2024011203',
            status: 'delayed',
            items: [
                { name: '糖醋排骨', price: 42.0, quantity: 2 },
                { name: '蛋花汤', price: 15.0, quantity: 1 }
            ],
            total: 99.0,
            orderTime: '2024-01-12 18:15:30',
            tableNumber: 'B12',
            estimatedTime: '延迟30分钟',
            remark: '要求现做',
            paymentMethod: '微信支付',
            paymentStatus: '已支付'
        },
        {
            id: 'ORD2024011204',
            status: 'confirmed',
            items: [
                { name: '口水鸡', price: 35.0, quantity: 1 },
                { name: '凉拌黄瓜', price: 12.0, quantity: 1 },
                { name: '白米饭', price: 5.0, quantity: 1 }
            ],
            total: 52.0,
            orderTime: '2024-01-12 20:10:15',
            tableNumber: 'A08',
            estimatedTime: '20分钟',
            remark: '不要辣',
            paymentMethod: '现金',
            paymentStatus: '已支付'
        }
    ],
    restaurantInfo: {
        name: '仓和餐厅',
        rating: 4.7,
        address: '成都市锦江区春熙路123号',
        phone: '028-8888-6666',
        hours: '10:00-22:00',
        features: ['川菜', '家常菜', '外卖', '堂食'],
        announcement: '新品上市！限时优惠，全场菜品9折优惠，活动截止到本月底。'
    },
    promotions: [
        {
            id: 1,
            title: '新用户专享',
            description: '首单立减10元',
            discount: 10,
            minAmount: 50,
            type: 'new_user'
        },
        {
            id: 2,
            title: '满减优惠',
            description: '满100元减15元',
            discount: 15,
            minAmount: 100,
            type: 'full_reduction'
        }
    ]
};

const pagesToLoad = [
  'splash',
  'wechat-login',
  'auth-confirm',
  'auth-processing',
  'wechat-pay',
  'pay-success',
  'home',
  'menu',
  'detail',
  'cart',
  'order',
  'payment',
  'status',
  'profile',
  'orders'
];

async function loadPages() {
  const container = document.querySelector('.app-container');
  for (const id of pagesToLoad) {
    const res = await fetch(`./pages/${id}.html`);
    const html = await res.text();
    container.insertAdjacentHTML('beforeend', html);
  }
}

function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');

  if (currentPage !== pageId) {
    pageHistory.push(currentPage);
  }
  currentPage = pageId;

  // 移除浮动购物车相关显示逻辑
  const bottomNav = document.querySelector('.bottom-nav');
  const mainPages = ['home', 'menu', 'cart', 'status', 'profile'];
  bottomNav.style.display = mainPages.includes(pageId) ? 'flex' : 'none';
  
  // 页面特定初始化
  initializePage(pageId);
}

// 页面特定初始化
function initializePage(pageId) {
  switch (pageId) {
    case 'orders':
      renderOrderHistory();
      break;
    case 'status':
      renderCurrentOrder();
      break;
    case 'menu':
      renderMenuCategories();
      break;
    case 'cart':
      renderCart();
      break;
    case 'profile':
      updateUserProfile();
      break;
  }
}

function goBack() {
  if (pageHistory.length > 0) {
    const previousPage = pageHistory.pop();
    showPage(previousPage);
  } else {
    showPage('home');
  }
}

function navigateTo(pageId, element) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  element.classList.add('active');
  showPage(pageId);
}

function addToCart() {
  cartItems++;
  updateCartBadge();
}

function addToCartFromDetail() {
  const quantity = parseInt(document.getElementById('quantity').textContent);
  cartItems += quantity;
  updateCartBadge();
  showPage('cart');
}

function updateCartBadge() {
  const count = cartItems;
  const ids = ['cartCountHome', 'cartCountMenu', 'cartCountDetail'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = String(count);
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    }
  });
}

function increaseQty() {
  const qtyElement = document.getElementById('quantity');
  const currentQty = parseInt(qtyElement.textContent);
  qtyElement.textContent = currentQty + 1;
}

function decreaseQty() {
  const qtyElement = document.getElementById('quantity');
  const currentQty = parseInt(qtyElement.textContent);
  if (currentQty > 1) {
    qtyElement.textContent = currentQty - 1;
  }
}

function selectPayment(element) {
  const radios = document.querySelectorAll('.payment-radio');
  radios.forEach(radio => radio.classList.remove('selected'));
  const radio = element.querySelector('.payment-radio');
  radio.classList.add('selected');
}

// 微信登录相关
function startWeChatAuth() { showPage('auth-confirm'); }
function confirmAuth() {
  showPage('auth-processing');
  setTimeout(() => { completeAuth(); }, 3000);
}
function cancelAuth() { showPage('wechat-login'); }
function completeAuth() {
  // 使用模拟用户数据
  const user = miniprogramData.user;
  
  const username = document.querySelector('.username');
  if (username) username.textContent = user.name;
  
  if (user.avatar) {
    const avatar = document.querySelector('.avatar');
    if (avatar) avatar.innerHTML = `<img src="${user.avatar}" alt="用户头像">`;
  } else {
    const placeholder = document.querySelector('.avatar-placeholder');
    if (placeholder && user.name) placeholder.textContent = user.name.charAt(0);
  }
  
  // 更新所有用户信息
  updateUserInfo();
  
  showPage('home');
}

// 支付相关
function processPayment() {
  const selectedPayment = document.querySelector('.payment-radio.selected');
  if (!selectedPayment) return;
  const paymentMethod = selectedPayment.closest('.payment-method');
  const isWeChatPay = paymentMethod && paymentMethod.querySelector('.fa-weixin');
  if (isWeChatPay) { showPage('wechat-pay'); } else { showPage('pay-success'); }
}

function callWechatPay() {
  const loadingElement = document.getElementById('payLoading');
  const confirmBtn = document.getElementById('confirmPayBtn');
  if (!loadingElement || !confirmBtn) return;
  loadingElement.classList.add('show');
  confirmBtn.disabled = true;
  confirmBtn.style.opacity = '0.6';
  setTimeout(() => {
    if (Math.random() > 0.1) {
      showPage('pay-success');
      setTimeout(() => { showPage('status'); }, 2000);
    } else {
      alert('支付失败，请重试');
      loadingElement.classList.remove('show');
      confirmBtn.disabled = false;
      confirmBtn.style.opacity = '1';
    }
  }, 2000);
}

function startPaymentTimer() {
  let timeLeft = 15 * 60;
  const timer = document.getElementById('payTimer');
  const countdown = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    if (timer) timer.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    timeLeft--;
    if (timeLeft < 0) { clearInterval(countdown); if (timer) timer.textContent = '00:00'; }
  }, 1000);
  setTimeout(() => { clearInterval(countdown); showPage('pay-success'); }, 8000);
}

function refreshQRCode() {
  const qrCode = document.querySelector('.pay-qr-code');
  if (qrCode) {
    qrCode.style.opacity = '0.5';
    setTimeout(() => { qrCode.style.opacity = '1'; }, 500);
  }
}

function checkPaymentStatus() { showPage('pay-success'); }

// 阻止页面滚动穿透（与原逻辑一致）
document.addEventListener('touchmove', function(e) {
  const target = e.target;
  const scrollableElements = document.querySelectorAll('.page, .order-content, .cart-content, .home-content, .order-history, .profile-menu, .wechat-pay-page, .auth-confirm, .login-page');
  let isScrollable = false;
  scrollableElements.forEach(element => { if (element.contains(target)) { isScrollable = true; } });
  if (!isScrollable) { e.preventDefault(); }
}, { passive: false });

// 初始化
window.addEventListener('DOMContentLoaded', async () => {
  await loadPages();
  
  // 使用模拟购物车数据
  cartItems = miniprogramData.cart.reduce((total, item) => total + item.quantity, 0);
  updateCartBadge();
  
  // 更新用户信息
  updateUserInfo();
  
  showPage('splash');
  setTimeout(() => { showPage('wechat-login'); }, 2000);
});

// 更新用户信息
function updateUserInfo() {
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

// 渲染订单历史
function renderOrderHistory() {
  const orderHistory = document.getElementById('orderHistory');
  if (!orderHistory) return;
  
  const ordersHtml = miniprogramData.orders.map(order => {
    const statusText = {
      'pending': '等待确认',
      'confirmed': '已确认',
      'preparing': '制作中',
      'ready': '待取餐',
      'completed': '已完成',
      'cancelled': '已取消',
      'refunded': '已退款',
      'delayed': '制作延迟'
    };
    
    const statusClass = {
      'pending': 'pending',
      'confirmed': 'confirmed',
      'preparing': 'preparing',
      'ready': 'ready',
      'completed': 'completed',
      'cancelled': 'cancelled',
      'refunded': 'refunded',
      'delayed': 'delayed'
    };
    
    const itemsHtml = order.items.map(item => 
      `<div class="order-item">${item.name} × ${item.quantity}</div>`
    ).join('');
    
    const getActionButtons = (status, orderId) => {
      switch (status) {
        case 'pending':
          return `
            <button class="order-btn btn-danger" onclick="cancelOrder('${orderId}')">取消订单</button>
            <button class="order-btn btn-primary" onclick="viewOrderDetail('${orderId}')">查看详情</button>
          `;
        case 'confirmed':
          return `
            <button class="order-btn btn-danger" onclick="cancelOrder('${orderId}')">取消订单</button>
            <button class="order-btn btn-primary" onclick="rushOrder('${orderId}')">催单</button>
          `;
        case 'preparing':
          return `
            <button class="order-btn btn-secondary" onclick="viewOrderDetail('${orderId}')">查看详情</button>
            <button class="order-btn btn-primary" onclick="rushOrder('${orderId}')">催单</button>
          `;
        case 'delayed':
          return `
            <button class="order-btn btn-warning" onclick="rushOrder('${orderId}')">继续催单</button>
            <button class="order-btn btn-secondary" onclick="contactService('${orderId}')">联系客服</button>
          `;
        case 'ready':
          return `
            <button class="order-btn btn-success" onclick="confirmPickup('${orderId}')">确认取餐</button>
          `;
        case 'completed':
          return `
            <button class="order-btn btn-secondary" onclick="rateOrder('${orderId}')">评价</button>
            <button class="order-btn btn-primary" onclick="reorder('${orderId}')">再来一单</button>
          `;
        case 'cancelled':
          return `
            <button class="order-btn btn-secondary" onclick="viewOrderDetail('${orderId}')">查看详情</button>
            <button class="order-btn btn-primary" onclick="reorder('${orderId}')">重新下单</button>
          `;
        case 'refunded':
          return `
            <button class="order-btn btn-secondary" onclick="viewOrderDetail('${orderId}')">查看详情</button>
            <button class="order-btn btn-primary" onclick="reorder('${orderId}')">重新下单</button>
          `;
        default:
          return '';
      }
    };
    
    return `
      <div class="order-card">
        <div class="order-header">
          <span class="order-number">订单号: ${order.id}</span>
          <span class="order-status ${statusClass[order.status]}">${statusText[order.status]}</span>
        </div>
        <div class="order-items">
          ${itemsHtml}
        </div>
        <div class="order-footer">
          <span class="order-time">${order.orderTime}</span>
          <div class="order-actions">
            ${getActionButtons(order.status, order.id)}
          </div>
          <span class="order-total">¥${order.total.toFixed(2)}</span>
        </div>
        ${order.remark ? `<div class="order-remark">备注: ${order.remark}</div>` : ''}
      </div>
    `;
  }).join('');
  
  orderHistory.innerHTML = ordersHtml;
}

// 订单相关操作函数
function viewOrderDetail(orderId) {
  const order = miniprogramData.orders.find(o => o.id === orderId);
  if (order) {
    alert(`订单详情:\n订单号: ${order.id}\n桌号: ${order.tableNumber}\n状态: ${order.estimatedTime}\n支付方式: ${order.paymentMethod}\n备注: ${order.remark || '无'}`);
  }
}

function cancelOrder(orderId) {
  if (confirm('确定要取消这个订单吗？')) {
    const order = miniprogramData.orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'cancelled';
      order.estimatedTime = '已取消';
      renderOrderHistory();
      alert('订单已取消');
    }
  }
}

function rushOrder(orderId) {
  alert('已提醒商家加急处理您的订单');
}

function confirmPickup(orderId) {
  const order = miniprogramData.orders.find(o => o.id === orderId);
  if (order) {
    order.status = 'completed';
    order.estimatedTime = '已完成';
    renderOrderHistory();
    alert('感谢您的光临，用餐愉快！');
  }
}

function rateOrder(orderId) {
  alert('评价功能开发中...');
}

function reorder(orderId) {
  const order = miniprogramData.orders.find(o => o.id === orderId);
  if (order) {
    // 清空购物车并添加订单菜品
    miniprogramData.cart = order.items.map(item => ({
      id: Math.random(),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      note: ''
    }));
    cartItems = miniprogramData.cart.reduce((total, item) => total + item.quantity, 0);
    updateCartBadge();
    showPage('cart');
    alert('商品已加入购物车');
  }
}

function contactService(orderId) {
  alert('客服电话: 028-8888-6666\n或点击右上角联系在线客服');
}

// 渲染当前订单状态页面
function renderCurrentOrder() {
  const currentOrdersContent = document.getElementById('currentOrdersContent');
  if (!currentOrdersContent) return;
  
  // 找到所有进行中的订单
  const activeOrders = miniprogramData.orders.filter(order => 
    ['pending', 'preparing', 'ready', 'confirmed', 'delayed'].includes(order.status)
  );
  
  if (activeOrders.length === 0) {
    currentOrdersContent.innerHTML = `
      <div class="no-orders">
        <div class="no-orders-icon"><i class="fas fa-clipboard-list"></i></div>
        <div class="no-orders-title">暂无进行中的订单</div>
        <div class="no-orders-desc">去菜单页看看有什么好吃的吧</div>
        <button class="btn-primary" onclick="showPage('menu')">浏览菜单</button>
      </div>
    `;
    return;
  }
  
  const ordersHtml = activeOrders.map(order => {
    const statusConfig = {
      'pending': {
        icon: 'fas fa-clock',
        title: '等待确认',
        desc: '您的订单已提交，正在等待商家确认',
        color: '#ff9500'
      },
      'confirmed': {
        icon: 'fas fa-check-circle',
        title: '已确认',
        desc: '您的订单已确认，商家正在安排制作',
        color: '#32d74b'
      },
      'preparing': {
        icon: 'fas fa-utensils',
        title: '厨房制作中',
        desc: '您的订单已确认，厨房正在用心制作',
        color: '#007aff'
      },
      'ready': {
        icon: 'fas fa-bell',
        title: '可以取餐',
        desc: '您的订单已制作完成，请尽快取餐',
        color: '#34c759'
      },
      'delayed': {
        icon: 'fas fa-exclamation-triangle',
        title: '制作延迟',
        desc: '由于特殊要求或繁忙时段，制作时间有所延长',
        color: '#ff9500'
      }
    };
    
    const config = statusConfig[order.status];
    const orderTime = new Date(order.orderTime);
    const timeDisplay = orderTime.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // 生成进度步骤
    const getProgressSteps = (status) => {
      const steps = [
        { key: 'confirmed', title: '订单已确认', icon: 'fas fa-check' },
        { key: 'paid', title: '支付成功', icon: 'fas fa-credit-card' },
        { key: 'preparing', title: '厨房制作中', icon: 'fas fa-utensils' },
        { key: 'ready', title: '可以取餐', icon: 'fas fa-bell' }
      ];
      
      let currentStepIndex = 0;
      if (status === 'pending') currentStepIndex = 1;
      else if (status === 'confirmed') currentStepIndex = 1;
      else if (status === 'preparing') currentStepIndex = 2;
      else if (status === 'ready') currentStepIndex = 3;
      else if (status === 'delayed') currentStepIndex = 2; // 延迟状态仍在制作阶段
      
      return steps.map((step, index) => {
        let stepClass = '';
        let stepTime = '';
        
        if (index < currentStepIndex) {
          stepClass = 'completed';
          stepTime = index === 0 ? timeDisplay : new Date(orderTime.getTime() + index * 60000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        } else if (index === currentStepIndex) {
          stepClass = status === 'delayed' ? 'delayed' : 'active';
          if (status === 'ready') {
            stepTime = '请取餐';
          } else if (status === 'delayed') {
            stepTime = '延迟中';
          } else {
            stepTime = order.estimatedTime;
          }
        } else {
          stepClass = '';
          stepTime = '请等待';
        }
        
        return `
          <div class="progress-step">
            <div class="step-icon ${stepClass}"><i class="${step.icon}"></i></div>
            <div class="step-info">
              <div class="step-title">${step.title}</div>
              <div class="step-time">${stepTime}</div>
            </div>
          </div>
        `;
      }).join('');
    };
    
    // 生成订单菜品列表
    const itemsHtml = order.items.map(item => 
      `<div class="order-item-detail">
        <span class="item-name">${item.name}</span>
        <span class="item-quantity">×${item.quantity}</span>
        <span class="item-price">¥${(item.price * item.quantity).toFixed(2)}</span>
      </div>`
    ).join('');
    
    return `
      <div class="order-status-card" data-order-id="${order.id}">
        <!-- 订单头部 - 总是显示 -->
        <div class="order-card-header" onclick="toggleOrderCard('${order.id}')">
          <div class="order-basic-info">
            <div class="status-icon-small" style="color: ${config.color}">
              <i class="${config.icon}"></i>
            </div>
            <div class="order-basic-text">
              <div class="order-id-time">
                <span class="order-number-short">${order.id}</span>
                <span class="order-time-short">${timeDisplay}</span>
              </div>
              <div class="status-title-small">${config.title}</div>
            </div>
          </div>
          <div class="order-summary-quick">
            <div class="estimated-time-compact">
              <span class="time-value-small">${order.estimatedTime}</span>
            </div>
            <div class="order-total-small">¥${order.total.toFixed(2)}</div>
            <div class="expand-icon">
              <i class="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>
        
        <!-- 订单详情 - 可折叠 -->
        <div class="order-card-details collapsed" id="details-${order.id}">
          <div class="status-header-full">
            <div class="status-icon" style="color: ${config.color}">
              <i class="${config.icon}"></i>
            </div>
            <div class="status-title">${config.title}</div>
            <div class="status-desc">${config.desc}</div>
          </div>
          
          <div class="estimated-time">
            <div class="time-label">预计出菜时间</div>
            <div class="time-display">
              <span class="time-value">${order.estimatedTime}</span>
            </div>
          </div>
          
          <div class="progress-steps">
            ${getProgressSteps(order.status)}
          </div>
          
          <div class="order-section">
            <div class="section-header">
              <i class="fas fa-info-circle section-icon"></i>
              <span class="section-name">订单信息</span>
            </div>
            <div class="order-summary">
              <span class="summary-item">订单号</span>
              <span class="summary-value">${order.id}</span>
            </div>
            <div class="order-summary">
              <span class="summary-item">桌号</span>
              <span class="summary-value">${order.tableNumber}</span>
            </div>
            <div class="order-summary">
              <span class="summary-item">下单时间</span>
              <span class="summary-value">${order.orderTime}</span>
            </div>
            <div class="order-summary">
              <span class="summary-item">支付金额</span>
              <span class="summary-value">¥${order.total.toFixed(2)}</span>
            </div>
            ${order.remark ? `
            <div class="order-summary">
              <span class="summary-item">备注</span>
              <span class="summary-value">${order.remark}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="order-section">
            <div class="section-header">
              <i class="fas fa-utensils section-icon"></i>
              <span class="section-name">订单详情</span>
            </div>
            <div class="order-items-detail">
              ${itemsHtml}
            </div>
          </div>
          
          <div class="order-actions-status">
            ${order.status === 'pending' ? `
              <button class="btn-secondary" onclick="cancelOrder('${order.id}')">取消订单</button>
            ` : ''}
            ${order.status === 'confirmed' ? `
              <button class="btn-secondary" onclick="cancelOrder('${order.id}')">取消订单</button>
              <button class="btn-primary" onclick="rushOrder('${order.id}')">催单</button>
            ` : ''}
            ${order.status === 'preparing' ? `
              <button class="btn-primary" onclick="rushOrder('${order.id}')">催单</button>
            ` : ''}
            ${order.status === 'delayed' ? `
              <button class="btn-warning" onclick="rushOrder('${order.id}')">继续催单</button>
              <button class="btn-secondary" onclick="contactService('${order.id}')">联系客服</button>
            ` : ''}
            ${order.status === 'ready' ? `
              <button class="btn-success" onclick="confirmPickup('${order.id}')">确认取餐</button>
            ` : ''}
            <button class="btn-outline" onclick="viewOrderDetail('${order.id}')">查看详情</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  currentOrdersContent.innerHTML = ordersHtml;
}

// 订单卡片折叠/展开功能
function toggleOrderCard(orderId) {
  const detailsElement = document.getElementById(`details-${orderId}`);
  const expandIcon = document.querySelector(`[data-order-id="${orderId}"] .expand-icon i`);
  
  if (!detailsElement || !expandIcon) return;
  
  const isCollapsed = detailsElement.classList.contains('collapsed');
  
  if (isCollapsed) {
    // 展开
    detailsElement.classList.remove('collapsed');
    detailsElement.classList.add('expanded');
    expandIcon.classList.remove('fa-chevron-down');
    expandIcon.classList.add('fa-chevron-up');
  } else {
    // 折叠
    detailsElement.classList.remove('expanded');
    detailsElement.classList.add('collapsed');
    expandIcon.classList.remove('fa-chevron-up');
    expandIcon.classList.add('fa-chevron-down');
  }
}

// 其他渲染函数占位符
function renderMenuCategories() {
  // 菜单页面渲染逻辑
}

function renderCart() {
  // 购物车页面渲染逻辑
}

function updateUserProfile() {
  // 用户资料页面更新逻辑
} 