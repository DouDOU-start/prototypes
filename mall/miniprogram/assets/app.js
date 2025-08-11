// Mini Program Prototype JS

const state = {
  current: 'home',
  cart: [],
  favorites: new Set(),
  address: null,
  orders: [],
  products: [],
  categories: [
    { key: 'acoustic', name: '民谣', icon: 'fa-guitar' },
    { key: 'electric', name: '电吉他', icon: 'fa-bolt' },
    { key: 'bass', name: '贝斯', icon: 'fa-music' },
    { key: 'ukulele', name: '尤克里里', icon: 'fa-compact-disc' },
    { key: 'classical', name: '古典', icon: 'fa-hands-praying' },
    { key: 'amp', name: '音箱', icon: 'fa-volume-high' },
    { key: 'pedal', name: '效果器', icon: 'fa-sliders' },
    { key: 'string', name: '弦', icon: 'fa-wave-square' },
    { key: 'pick', name: '拨片', icon: 'fa-hand-pointer' },
    { key: 'strap', name: '背带', icon: 'fa-link' },
  ],
  banners: [
    { img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop', title: '夏季促销', sub: '热门款低至7折' },
    { img: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=1200&auto=format&fit=crop', title: '大师同款', sub: '电吉他精选' },
    { img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop', title: '新品发布', sub: '人气民谣上新' },
  ],
  videos: [],
  navStack: ['home'],
};

function initProducts() {
  const base = [
    {
      id: 'p1',
      title: 'Taylor 314ce',
      price: 14999,
      originPrice: 16999,
      category: 'acoustic',
      image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=800&auto=format&fit=crop',
      sub: '美国制造 全单民谣',
    },
    {
      id: 'p2',
      title: 'Fender Stratocaster',
      price: 8999,
      originPrice: 9999,
      category: 'electric',
      image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?q=80&w=800&auto=format&fit=crop',
      sub: '传世经典 单双单拾音',
    },
    {
      id: 'p3',
      title: 'Gibson Les Paul Standard',
      price: 18999,
      originPrice: 20999,
      category: 'electric',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop',
      sub: '厚重音墙 双双拾音',
    },
    {
      id: 'p4',
      title: 'Yamaha FG800',
      price: 1599,
      originPrice: 1899,
      category: 'acoustic',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
      sub: '入门之选 实惠耐用',
    },
    {
      id: 'p5',
      title: 'Squier Classic Vibe Bass',
      price: 2999,
      originPrice: 3399,
      category: 'bass',
      image: 'https://images.unsplash.com/photo-1482442120256-9f721d1f9ec8?q=80&w=800&auto=format&fit=crop',
      sub: '性价比之王',
    },
    {
      id: 'p6',
      title: 'Ukulele Concert',
      price: 499,
      originPrice: 699,
      category: 'ukulele',
      image: 'https://images.unsplash.com/photo-1528445487924-816c74d9ec52?q=80&w=800&auto=format&fit=crop',
      sub: '轻巧便携 小清新',
    },
  ];
  state.products = base;
}

function initVideos() {
  state.videos = [
    {
      id: 'v1',
      title: '店长演示 | Strat 经典三种音色',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
      url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      merchant: 'GuitarMall 官方旗舰店',
    },
    {
      id: 'v2',
      title: '如何挑选入门民谣吉他',
      cover: 'https://images.unsplash.com/photo-1445985543470-41fba5c3144a?q=80&w=800&auto=format&fit=crop',
      url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      merchant: 'GuitarMall 官方旗舰店',
    },
    {
      id: 'v3',
      title: '双双拾音的厚重音墙演示',
      cover: 'https://images.unsplash.com/photo-1526178611450-9f5a7a0b9a2f?q=80&w=800&auto=format&fit=crop',
      url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      merchant: 'GuitarMall 官方旗舰店',
    },
  ];
}

function seedDemoData() {
  // 预置购物车
  if (state.cart.length === 0) {
    const demo = [ ['p2', 1], ['p4', 2] ];
    demo.forEach(([id, qty]) => {
      if (state.products.find(p=>p.id===id)) state.cart.push({ id, qty });
    });
  }
  // 预置订单
  if (state.orders.length === 0) {
    const now = new Date();
    const makeTime = (offsetHours)=> new Date(now.getTime() - offsetHours*3600*1000).toLocaleString('zh-CN');
    state.orders = [
      {
        id: 'O100881',
        status: '待付款',
        createdAt: makeTime(6),
        items: [{ id: 'p1', qty: 1 }],
        total: (state.products.find(p=>p.id==='p1')?.price||0)*1,
      },
      {
        id: 'O100882',
        status: '待发货',
        createdAt: makeTime(20),
        items: [{ id: 'p2', qty: 1 }, { id: 'p6', qty: 1 }],
        total: (state.products.find(p=>p.id==='p2')?.price||0) + (state.products.find(p=>p.id==='p6')?.price||0),
      },
      {
        id: 'O100883',
        status: '待收货',
        createdAt: makeTime(36),
        items: [{ id: 'p3', qty: 1 }],
        total: (state.products.find(p=>p.id==='p3')?.price||0),
        logistics: {
          company: '顺丰速运',
          trackingNo: 'SF1234567890',
          steps: [
            { time: makeTime(12), text: '包裹已到达 上海转运中心' },
            { time: makeTime(24), text: '包裹已揽收，准备发出' },
          ],
        },
      },
      {
        id: 'O100884',
        status: '已完成',
        createdAt: makeTime(72),
        items: [{ id: 'p4', qty: 1 }, { id: 'p5', qty: 1 }],
        total: (state.products.find(p=>p.id==='p4')?.price||0) + (state.products.find(p=>p.id==='p5')?.price||0),
      },
      {
        id: 'O100885',
        status: '售后',
        createdAt: makeTime(120),
        items: [{ id: 'p6', qty: 1 }],
        total: (state.products.find(p=>p.id==='p6')?.price||0),
      },
    ];
  }
}

function formatPrice(v) {
  return '¥' + (v / 1).toLocaleString('zh-CN');
}

function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function setHeader(title) {
  $('#mp-header-title').textContent = title;
}

function showScreen(key) {
  state.current = key;
  $all('section[data-screen]').forEach(s => s.classList.add('hidden'));
  const el = document.querySelector(`section[data-screen="${key}"]`);
  if (el) el.classList.remove('hidden');

  $all('nav [data-nav]').forEach(btn => {
    btn.classList.toggle('text-primary', btn.dataset.nav === key);
    btn.classList.toggle('text-gray-600', btn.dataset.nav !== key);
  });

  const titleMap = {
    home: '首页',
    category: '分类',
    cart: '购物车',
    orders: '我的订单',
    profile: '我的',
    'product-detail': '商品详情',
    checkout: '结算',
    'order-detail': '订单详情',
    favorites: '我的收藏',
    addresses: '地址管理',
    coupons: '优惠券',
    support: '在线客服',
    videos: '商家视频',
    'video-detail': '视频详情',
    logistics: '物流详情',
    'video-feed': '刷视频',
  };
  setHeader(titleMap[key] || 'GuitarMall');
}

function navigateTo(key) {
  const currentTop = state.navStack[state.navStack.length - 1];
  if (currentTop !== key) state.navStack.push(key);
  showScreen(key);
}

function goBack() {
  if (state.navStack.length > 1) {
    state.navStack.pop();
    const prev = state.navStack[state.navStack.length - 1];
    showScreen(prev);
  } else {
    state.navStack = ['home'];
    showScreen('home');
  }
}

function renderBanners() {
  const wrap = $('#mp-banners');
  wrap.innerHTML = state.banners.map(b => `
    <div class="relative h-28 w-72 shrink-0 rounded-2xl overflow-hidden">
      <img src="${b.img}" class="h-full w-full object-cover" alt="banner" />
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="absolute bottom-2 left-3 text-white drop-shadow">
        <div class="font-semibold">${b.title}</div>
        <div class="text-xs opacity-90">${b.sub}</div>
      </div>
    </div>
  `).join('');
}

function renderCategoriesGrid() {
  const grid = $('#mp-category-grid');
  grid.innerHTML = state.categories.slice(0, 10).map(c => `
    <button class="flex flex-col items-center gap-2" data-chip-cat="${c.key}">
      <div class="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
        <i class="fa-solid ${c.icon} text-primary"></i>
      </div>
      <span class="text-xs">${c.name}</span>
    </button>
  `).join('');
}

function renderHomeVideoRow() {
  const row = $('#mp-video-row');
  if (!row) return;
  row.innerHTML = state.videos.slice(0, 10).map(v => `
    <button class="relative h-40 w-28 rounded-2xl overflow-hidden bg-black" data-video-id="${v.id}">
      <img src="${v.cover}" class="absolute inset-0 h-full w-full object-cover opacity-90"/>
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="absolute bottom-2 left-2 right-2 text-white text-xs line-clamp-2">${v.title}</div>
      <div class="absolute top-2 right-2 text-white"><i class="fa-solid fa-circle-play"></i></div>
    </button>
  `).join('');
  $all('[data-video-id]').forEach(btn => btn.addEventListener('click', ()=> openVideoDetail(btn.dataset.videoId)));
  $('#mp-see-more-video')?.addEventListener('click', () => { showScreen('videos'); renderVideosList(); });
}

function renderVideosList() {
  const list = $('#mp-videos-list');
  if (!list) return;
  list.innerHTML = state.videos.map(v => `
    <div class="rounded-xl bg-white p-3 shadow-sm flex gap-3" data-video-id="${v.id}">
      <div class="h-20 w-32 rounded-lg overflow-hidden bg-black shrink-0">
        <img src="${v.cover}" class="h-full w-full object-cover opacity-90"/>
      </div>
      <div class="flex-1">
        <div class="text-sm font-semibold line-clamp-2">${v.title}</div>
        <div class="text-xs text-gray-500 mt-1">${v.merchant}</div>
        <div class="mt-2"><button class="h-8 px-3 rounded-lg border text-xs">播放</button></div>
      </div>
    </div>
  `).join('') || '<div class="text-center text-gray-500 py-16">暂无视频</div>';
  $all('[data-video-id]').forEach(card => card.addEventListener('click', ()=> openVideoDetail(card.dataset.videoId)));
}

function openVideoDetail(id) {
  const v = state.videos.find(x => x.id === id);
  if (!v) return;
  const player = $('#mp-vd-player');
  player.src = v.url;
  $('#mp-vd-title').textContent = v.title;
  $('#mp-vd-merchant').textContent = v.merchant;
  // 绑定底部操作
  const related = v.productId ? state.products.find(p=>p.id===v.productId) : null;
  $('#mp-vd-view').onclick = () => {
    if (related) { openProductDetail(related.id); } else alert('该视频暂未关联具体商品');
  };
  $('#mp-vd-buy').onclick = () => {
    if (related) { addToCart(related.id, 1); goCheckout(); } else alert('该视频暂未关联具体商品');
  };
  navigateTo('video-detail');
}

function renderHotProducts() {
  const list = $('#mp-hot-products');
  list.innerHTML = state.products.map(p => productCard(p)).join('');
  bindProductCardClicks();
}

function productCard(p) {
  const fav = state.favorites.has(p.id);
  return `
  <div class="rounded-2xl bg-white overflow-hidden shadow-sm group" data-product-id="${p.id}">
    <div class="relative">
      <img src="${p.image}" alt="${p.title}" class="h-36 w-full object-cover" />
      <button class="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center">
        <i class="${fav ? 'fa-solid' : 'fa-regular'} fa-heart text-rose-500"></i>
      </button>
    </div>
    <div class="p-3">
      <div class="text-sm font-semibold line-clamp-1">${p.title}</div>
      <div class="text-xs text-gray-500 line-clamp-1 mt-0.5">${p.sub}</div>
      <div class="mt-2 flex items-center justify-between">
        <div class="text-primary font-bold">${formatPrice(p.price)}</div>
        <button class="h-8 px-3 rounded-lg bg-gray-900 text-white text-xs add-cart">加入购物车</button>
      </div>
    </div>
  </div>`;
}

function bindProductCardClicks() {
  $all('[data-product-id]').forEach(card => {
    const id = card.dataset.productId;
    card.addEventListener('click', (e) => {
      const isAdd = e.target.closest('.add-cart');
      const isFavBtn = e.target.closest('button') && e.target.closest('button').querySelector('.fa-heart');
      if (isAdd) {
        addToCart(id);
        e.stopPropagation();
        return;
      }
      if (isFavBtn) {
        toggleFav(id);
        e.stopPropagation();
        return;
      }
      openProductDetail(id);
    });
  });
}

function toggleFav(id) {
  if (state.favorites.has(id)) state.favorites.delete(id);
  else state.favorites.add(id);
  if (state.current === 'home') { renderHotProducts(); renderHomeVideoRow(); }
  if (state.current === 'category') renderCategoryProducts(currentCategoryKey);
  renderFavorites();
}

function addToCart(id, qty = 1) {
  const prod = state.products.find(p => p.id === id);
  if (!prod) return;
  const item = state.cart.find(i => i.id === id);
  if (item) item.qty += qty; else state.cart.push({ id, qty: Math.max(1, qty) });
  updateCartBadge();
  if (state.current === 'cart') renderCart();
}

function updateCartBadge() {
  const count = state.cart.reduce((s, i) => s + i.qty, 0);
  const badge = $('#mp-cart-badge');
  if (count > 0) {
    badge.textContent = String(count);
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function renderCategoryChips() {
  const wrap = $('#mp-category-chips');
  wrap.innerHTML = state.categories.map(c => `
    <button class="h-9 w-full rounded-full border text-sm ${c.key === currentCategoryKey ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200 text-gray-700'}" data-chip="${c.key}">
      ${c.name}
    </button>
  `).join('');
  $all('[data-chip]').forEach(btn => btn.addEventListener('click', () => {
    currentCategoryKey = btn.dataset.chip;
    renderCategoryChips();
    renderCategoryProducts(currentCategoryKey);
  }));
}

let currentCategoryKey = 'acoustic';
function renderCategoryProducts(catKey) {
  const list = $('#mp-category-products');
  const term = ($('#mp-category-search').value || '').trim();
  const filtered = state.products.filter(p => (catKey ? p.category === catKey : true) && (term ? (p.title.includes(term) || p.sub.includes(term)) : true));
  list.innerHTML = filtered.map(p => productCard(p)).join('') || '<div class="col-span-2 text-center text-gray-500 py-10">暂无商品</div>';
  bindProductCardClicks();
}

function openProductDetail(id) {
  const p = state.products.find(x => x.id === id);
  if (!p) return;
  $('#mp-pd-images').innerHTML = `<img src="${p.image}" class="h-full w-full object-cover"/>`;
  $('#mp-pd-title').textContent = p.title;
  $('#mp-pd-sub').textContent = p.sub;
  $('#mp-pd-price').textContent = formatPrice(p.price);
  $('#mp-pd-origin').textContent = p.originPrice ? formatPrice(p.originPrice) : '';
  $('#mp-pd-specs').innerHTML = `
    <div>品类：${p.category}</div>
    <div>产地：美国/日本/中国（示例）</div>
    <div>指板：玫瑰木（示例）</div>
  `;
  $('#mp-pd-reviews').innerHTML = `
    <div class="text-sm">用户A：音色很棒，手感顺滑。</div>
    <div class="text-sm">用户B：做工扎实，价格合理。</div>
  `;
  $('#mp-pd-fav').onclick = () => { toggleFav(p.id); openProductDetail(p.id); };
  $('#mp-pd-cart').onclick = () => addToCart(p.id, 1);
  $('#mp-pd-buy').onclick = () => { addToCart(p.id, 1); goCheckout(); };
  navigateTo('product-detail');
}

function renderCart() {
  const list = $('#mp-cart-list');
  if (state.cart.length === 0) {
    list.innerHTML = '<div class="text-center text-gray-500 py-16">购物车是空的</div>';
    $('#mp-cart-total').textContent = '¥0';
    return;
  }
  const items = state.cart.map(item => {
    const p = state.products.find(x => x.id === item.id);
    const subtotal = p.price * item.qty;
    return `
      <div class="flex gap-3 bg-white rounded-xl p-3 shadow-sm items-center">
        <img src="${p.image}" class="h-16 w-16 rounded-lg object-cover" />
        <div class="flex-1">
          <div class="text-sm font-semibold line-clamp-1">${p.title}</div>
          <div class="text-xs text-gray-500 mt-0.5">${p.sub}</div>
          <div class="mt-2 flex items-center justify-between">
            <div class="text-primary font-bold">${formatPrice(p.price)}</div>
            <div class="flex items-center gap-2" data-qty="${p.id}">
              <button class="h-8 w-8 rounded-lg border">-</button>
              <span class="w-6 text-center">${item.qty}</span>
              <button class="h-8 w-8 rounded-lg border">+</button>
            </div>
          </div>
        </div>
        <button class="text-gray-400" data-remove="${p.id}"><i class="fa-regular fa-trash-can"></i></button>
      </div>
    `;
  }).join('');
  list.innerHTML = items;

  $all('[data-qty]').forEach(box => {
    const id = box.dataset.qty;
    const [minus, , plus] = box.querySelectorAll('button, span');
    minus.addEventListener('click', () => changeQty(id, -1));
    plus.addEventListener('click', () => changeQty(id, +1));
  });
  $all('[data-remove]').forEach(btn => btn.addEventListener('click', () => removeFromCart(btn.dataset.remove)));

  $('#mp-cart-total').textContent = formatPrice(calcCartTotal());
}

function changeQty(id, delta) {
  const it = state.cart.find(i => i.id === id);
  if (!it) return;
  it.qty += delta;
  if (it.qty <= 0) state.cart = state.cart.filter(i => i.id !== id);
  updateCartBadge();
  renderCart();
}

function removeFromCart(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  updateCartBadge();
  renderCart();
}

function calcCartTotal() {
  return state.cart.reduce((sum, it) => {
    const p = state.products.find(x => x.id === it.id);
    return sum + (p ? p.price * it.qty : 0);
  }, 0);
}

function goCheckout() {
  const items = state.cart.map(it => {
    const p = state.products.find(x => x.id === it.id);
    return { ...it, title: p.title, price: p.price, image: p.image };
  });
  $('#mp-checkout-items').innerHTML = items.map(it => `
    <div class="flex gap-3 items-center">
      <img src="${it.image}" class="h-14 w-14 rounded-lg object-cover" />
      <div class="flex-1">
        <div class="text-sm font-semibold line-clamp-1">${it.title}</div>
        <div class="text-xs text-gray-500">数量 x ${it.qty}</div>
      </div>
      <div class="text-sm font-semibold">${formatPrice(it.price * it.qty)}</div>
    </div>
  `).join('');
  $('#mp-checkout-total').textContent = formatPrice(calcCartTotal());

  $('#mp-addr-text').textContent = state.address ? `${state.address.name} ${state.address.phone} · ${state.address.addr}` : '请选择地址';

  $('#mp-shipping').innerHTML = ['快递包邮', '同城速配', '到店自提'].map((t, i) => `
    <label class="flex items-center gap-3"> 
      <input type="radio" name="ship" ${i===0?'checked':''}/> <span>${t}</span>
    </label>`).join('');
  $('#mp-payment').innerHTML = ['微信支付', '支付宝', '银行卡'].map((t, i) => `
    <label class="flex items-center gap-3"> 
      <input type="radio" name="pay" ${i===0?'checked':''}/> <span>${t}</span>
    </label>`).join('');

  navigateTo('checkout');
}

function submitOrder() {
  if (!state.address) {
    alert('请先选择地址');
    return;
  }
  const orderId = 'O' + Math.floor(100000 + Math.random()*900000);
  const now = new Date();
  state.orders.unshift({
    id: orderId,
    status: '待发货',
    createdAt: now.toLocaleString('zh-CN'),
    items: state.cart.map(it => ({ ...it })),
    total: calcCartTotal(),
    logistics: {
      company: '顺丰速运',
      trackingNo: 'SF' + Math.floor(100000000 + Math.random()*900000000),
      steps: [
        { time: now.toLocaleString('zh-CN'), text: '订单已创建，等待仓库处理' },
      ],
    },
  });
  state.cart = [];
  updateCartBadge();
  renderOrders('all');
  state.navStack = ['orders'];
  showScreen('orders');
}

const orderStatusTabs = [
  { key: 'all', name: '全部' },
  { key: 'pending', name: '待付款' },
  { key: 'toship', name: '待发货' },
  { key: 'toreceive', name: '待收货' },
  { key: 'done', name: '已完成' },
  { key: 'after', name: '售后' },
];

function renderOrderTabs(active='all') {
  const wrap = $('#mp-order-tabs');

  const countOf = (key) => {
    if (key==='all') return state.orders.length;
    if (key==='pending') return state.orders.filter(o=>o.status==='待付款').length;
    if (key==='toship') return state.orders.filter(o=>o.status==='待发货').length;
    if (key==='toreceive') return state.orders.filter(o=>o.status==='待收货').length;
    if (key==='done') return state.orders.filter(o=>o.status==='已完成').length;
    if (key==='after') return state.orders.filter(o=>o.status==='售后').length;
    return 0;
  };
  const iconOf = (key) => ({
    all: 'fa-list-ul',
    pending: 'fa-wallet',
    toship: 'fa-truck-fast',
    toreceive: 'fa-box-open',
    done: 'fa-circle-check',
    after: 'fa-headset',
  })[key] || 'fa-list-ul';

  wrap.innerHTML = orderStatusTabs.map(t => {
    const isActive = t.key===active;
    const cnt = countOf(t.key);
    return `
      <button class="h-9 w-full rounded-full border text-sm flex items-center justify-center gap-1.5 ${isActive? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200'}" data-otab="${t.key}">
        <i class="fa-solid ${iconOf(t.key)} text-xs ${isActive? 'text-white' : 'text-gray-400'}"></i>
        <span>${t.name}</span>
        ${cnt>0?`<span class="ml-1 h-5 min-w-5 px-1 rounded-full ${isActive? 'bg-white text-primary' : 'bg-gray-100 text-gray-700'} text-[10px] flex items-center justify-center">${cnt}</span>`:''}
      </button>`;
  }).join('');

  $all('[data-otab]').forEach(btn => btn.addEventListener('click', ()=>{
    renderOrders(btn.dataset.otab);
  }));
}

function renderOrders(filter='all') {
  renderOrderTabs(filter);
  const list = $('#mp-orders-list');
  const filtered = state.orders.filter(o => {
    if (filter==='all') return true;
    if (filter==='pending') return o.status==='待付款';
    if (filter==='toship') return o.status==='待发货';
    if (filter==='toreceive') return o.status==='待收货';
    if (filter==='done') return o.status==='已完成';
    if (filter==='after') return o.status==='售后';
    return true;
  });
  if (filtered.length===0) {
    list.innerHTML = '<div class="text-center text-gray-500 py-16">暂无订单</div>';
    return;
  }
  list.innerHTML = filtered.map(o => `
    <div class="rounded-xl bg-white p-3 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-500">${o.createdAt}</div>
        <div class="text-primary text-sm">${o.status}</div>
      </div>
      <div class="mt-2 flex gap-3 items-center">
        ${o.items.slice(0,3).map(it=>{
          const p = state.products.find(x=>x.id===it.id);
          return `<img src="${p.image}" class="h-12 w-12 rounded-lg object-cover"/>`;
        }).join('')}
        ${o.items.length>3?`<div class="text-xs text-gray-500">+${o.items.length-3}</div>`:''}
        <div class="ml-auto font-semibold">${formatPrice(o.total)}</div>
      </div>
      <div class="mt-3 text-right flex items-center justify-end gap-2">
        <button class="px-3 h-9 rounded-lg border text-sm" data-oview="${o.id}">查看详情</button>
        ${o.logistics?`<button class="px-3 h-9 rounded-lg border text-sm" data-logistics="${o.id}">查看物流</button>`:''}
      </div>
    </div>
  `).join('');
  $all('[data-oview]').forEach(btn => btn.addEventListener('click', ()=> openOrderDetail(btn.dataset.oview)));
  $all('[data-logistics]').forEach(btn => btn.addEventListener('click', ()=> openLogistics(btn.dataset.logistics)));
}

function openOrderDetail(id) {
  const o = state.orders.find(x => x.id === id);
  if (!o) return;
  const box = $('#mp-order-detail');
  box.innerHTML = `
    <div class="rounded-xl bg-white p-4 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="font-semibold">订单号：${o.id}</div>
        <div class="text-primary">${o.status}</div>
      </div>
      <div class="text-sm text-gray-500 mt-1">创建时间：${o.createdAt}</div>
    </div>
    <div class="rounded-xl bg-white p-4 shadow-sm">
      ${o.items.map(it=>{
        const p = state.products.find(x=>x.id===it.id);
        return `
          <div class="flex gap-3 items-center mb-3 last:mb-0">
            <img src="${p.image}" class="h-14 w-14 rounded-lg object-cover" />
            <div class="flex-1">
              <div class="text-sm font-semibold line-clamp-1">${p.title}</div>
              <div class="text-xs text-gray-500">数量 x ${it.qty}</div>
            </div>
            <div class="text-sm font-semibold">${formatPrice(p.price * it.qty)}</div>
          </div>`;
      }).join('')}
      <div class="flex items-center justify-between mt-2">
        <span>合计</span>
        <span class="font-semibold text-primary">${formatPrice(o.total)}</span>
      </div>
    </div>
  `;
  const acts = $('#mp-order-actions');
  acts.innerHTML = '';
  if (o.status === '待发货') {
    acts.innerHTML = `
      <button data-back class="h-11 px-4 rounded-xl border">返回</button>
      <button class="h-11 px-4 rounded-xl border">申请退款</button>
      <button class="h-11 px-4 rounded-xl bg-primary text-white">提醒发货</button>`;
  } else if (o.status === '待收货') {
    acts.innerHTML = `
      <button data-back class="h-11 px-4 rounded-xl border">返回</button>
      <button class="h-11 px-4 rounded-xl border" id="mp-view-log">查看物流</button>
      <button class="h-11 px-4 rounded-xl bg-primary text-white" id="mp-confirm">确认收货</button>`;
    $('#mp-confirm').onclick = () => { o.status = '已完成'; openOrderDetail(o.id); };
    $('#mp-view-log').onclick = () => openLogistics(o.id);
  } else if (o.status === '已完成') {
    acts.innerHTML = `
      <button data-back class="h-11 px-4 rounded-xl border">返回</button>
      <button class="h-11 px-4 rounded-xl border">申请售后</button>
      <button class="h-11 px-4 rounded-xl bg-gray-900 text-white">评价晒单</button>`;
  }
  $all('[data-back]').forEach(b => b.onclick = goBack);
  navigateTo('order-detail');
}

function openLogistics(orderId) {
  const o = state.orders.find(x => x.id === orderId);
  const sum = $('#mp-logistics-summary');
  const steps = $('#mp-logistics-steps');
  if (!o || !o.logistics) {
    sum.innerHTML = '<div class="text-center text-gray-500">暂无物流信息</div>';
    steps.innerHTML = '';
    navigateTo('logistics');
    return;
  }
  sum.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <div class="font-semibold">${o.logistics.company}</div>
        <div class="text-sm text-gray-500">运单号：${o.logistics.trackingNo}</div>
      </div>
      <button class="h-9 px-3 rounded-lg border text-sm" onclick="navigator.clipboard && navigator.clipboard.writeText('${o.logistics.trackingNo}')">复制单号</button>
    </div>
  `;
  const arr = [
    { time: '2025-08-03 09:10', text: '包裹已到达 上海转运中心' },
    { time: '2025-08-02 22:30', text: '包裹已揽收，准备发出' },
    ...(o.logistics.steps || []),
  ];
  steps.innerHTML = `
    <div class="relative pl-4">
      ${arr.map((s, idx) => `
        <div class="flex gap-3 mb-3">
          <div class="flex flex-col items-center">
            <div class="h-3 w-3 rounded-full ${idx===0?'bg-primary':'bg-gray-300'}"></div>
            <div class="w-px flex-1 bg-gray-200 ml-1"></div>
          </div>
          <div>
            <div class="text-sm font-semibold">${s.text}</div>
            <div class="text-xs text-gray-500">${s.time}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  navigateTo('logistics');
}

function renderFavorites() {
  const list = $('#mp-fav-list');
  const favs = state.products.filter(p => state.favorites.has(p.id));
  list.innerHTML = favs.map(p => productCard(p)).join('') || '<div class="col-span-2 text-center text-gray-500 py-16">暂无收藏</div>';
  bindProductCardClicks();
}

function renderAddresses() {
  const list = $('#mp-addr-list');
  const arr = state.address ? [state.address] : [];
  list.innerHTML = arr.map(a => `
    <div class="rounded-xl bg-white p-4 shadow-sm flex items-start justify-between">
      <div>
        <div class="font-semibold">${a.name} ${a.phone}</div>
        <div class="text-sm text-gray-600 mt-1">${a.addr}</div>
      </div>
      <button class="text-primary text-sm" id="mp-set-addr">设为默认</button>
    </div>
  `).join('') || '<div class="text-center text-gray-500 py-16">暂无地址</div>';
}

function renderCoupons() {
  $('#mp-coupon-list').innerHTML = [
    { title: '满1000减100', sub: '仅限民谣品类', exp: '2025-12-31' },
    { title: '全场9折', sub: '不限品类', exp: '2025-09-30' },
  ].map(c => `
    <div class="rounded-xl bg-white p-4 shadow-sm flex items-center justify-between">
      <div>
        <div class="font-semibold">${c.title}</div>
        <div class="text-xs text-gray-500 mt-0.5">${c.sub} · 有效期至 ${c.exp}</div>
      </div>
      <button class="h-9 px-3 rounded-lg border">领取</button>
    </div>
  `).join('');
}

function renderSupport() {
  const thread = $('#mp-chat-thread');
  thread.innerHTML = `
    <div class="text-center text-gray-500">已连接客服</div>
    <div class="flex gap-2 items-end">
      <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=80&auto=format&fit=crop"/>
      <div class="max-w-[70%] bg-white p-3 rounded-2xl shadow">您好，请问有什么可以帮助您？</div>
    </div>
  `;
}

function bindGlobal() {
  $all('nav [data-nav]').forEach(btn => btn.addEventListener('click', () => {
    const key = btn.dataset.nav;
    state.navStack = [key];
    showScreen(key);
    if (key === 'cart') renderCart();
    if (key === 'category') {
      renderCategoryChips();
      renderCategoryProducts(currentCategoryKey);
    }
    if (key === 'video-feed') { renderVideoFeed(); setupFeedObserver(); }
    if (key === 'profile') { /* nothing extra for now */ }
  }));

  $('#mp-search-btn').onclick = () => { navigateTo('category'); };
  $('#mp-msg-btn').onclick = () => { alert('示例原型：消息中心暂未接入'); };

  $('#mp-see-more-hot').onclick = () => { navigateTo('category'); };
  $('#mp-fab-chat').onclick = () => { navigateTo('support'); renderSupport(); };

  $('#mp-category-search').addEventListener('input', () => renderCategoryProducts(currentCategoryKey));

  $all('[data-back]').forEach(btn => btn.addEventListener('click', goBack));

  $('#mp-cart-checkout').onclick = goCheckout;
  $('#mp-addr-choose').onclick = () => {
    state.address = { name: '张三', phone: '138****8888', addr: '上海市 浦东新区 世纪大道100号' };
    $('#mp-addr-text').textContent = `${state.address.name} ${state.address.phone} · ${state.address.addr}`;
  };
  $('#mp-submit-order').onclick = submitOrder;

  $all('[data-link-screen]').forEach(btn => btn.addEventListener('click', () => {
    const key = btn.dataset.linkScreen;
    navigateTo(key);
    if (key === 'favorites') renderFavorites();
    if (key === 'addresses') renderAddresses();
    if (key === 'coupons') renderCoupons();
    if (key === 'orders') renderOrders('all');
    if (key === 'category') {
      renderCategoryChips();
      renderCategoryProducts(currentCategoryKey);
    }
  }));

  $('#mp-open-feed')?.addEventListener('click', () => { renderVideoFeed(); navigateTo('video-feed'); setupFeedObserver(); });
}

// 竖刷渲染
function renderVideoFeed() {
  const wrap = $('#mp-feed');
  wrap.innerHTML = state.videos.map(v => `
    <div class="h-full min-h-[calc(100vh-3.5rem-4rem)] snap-start relative">
      <video src="${v.url}" class="absolute inset-0 h-full w-full object-cover" preload="metadata" muted playsinline webkit-playsinline></video>
      <div class="absolute bottom-20 left-4 right-4 text-white">
        <div class="text-base font-semibold drop-shadow">${v.title}</div>
        <div class="text-xs opacity-80 mt-1">${v.merchant||''}</div>
        <div class="mt-3 flex items-center gap-2">
          <button class="px-3 h-9 rounded-full bg-white/10 border border-white/20 text-sm" data-feed-like="${v.id}"><i class="fa-regular fa-heart"></i> 喜欢</button>
          <button class="px-3 h-9 rounded-full bg-white/10 border border-white/20 text-sm" data-feed-view="${v.id}">查看商品</button>
          <button class="px-3 h-9 rounded-full bg-primary text-white text-sm" data-feed-buy="${v.id}">立即购买</button>
        </div>
      </div>
    </div>
  `).join('') || '<div class="text-center text-white/70 py-16">暂无视频</div>';

  // 交互
  $all('[data-feed-like]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.feedLike; alert('已点赞');
  }));
  $all('[data-feed-view]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.feedView; const v = state.videos.find(x=>x.id===id); if (v?.productId) openProductDetail(v.productId); else alert('该视频未关联商品');
  }));
  $all('[data-feed-buy]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.feedBuy; const v = state.videos.find(x=>x.id===id); if (v?.productId) { addToCart(v.productId, 1); goCheckout(); } else alert('该视频未关联商品');
  }));
}

function setupFeedObserver(){
  const els = $all('#mp-feed video');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      const video = e.target;
      if (e.isIntersecting && e.intersectionRatio > 0.8) {
        // 自动播放当前
        video.play().catch(()=>{});
      } else {
        video.pause();
      }
    });
  }, { threshold: [0, 0.5, 0.8, 1] });
  els.forEach(v=> io.observe(v));
}

function firstRender() {
  initProducts();
  initVideos();
  seedDemoData();
  renderBanners();
  renderCategoriesGrid();
  renderHotProducts();
  renderHomeVideoRow();
  renderCategoryChips();
  renderCategoryProducts(currentCategoryKey);
  updateCartBadge();
  state.navStack = ['home'];
  showScreen('home');
}

window.addEventListener('DOMContentLoaded', () => {
  bindGlobal();
  firstRender();
}); 