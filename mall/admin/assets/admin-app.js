// Merchant App Prototype JS

const appState = {
  current: 'dashboard',
  categories: [
    { key: 'acoustic', name: '民谣' },
    { key: 'electric', name: '电吉他' },
    { key: 'bass', name: '贝斯' },
    { key: 'ukulele', name: '尤克里里' },
    { key: 'amp', name: '音箱' },
  ],
  products: [],
  orders: [],
  messages: [],
  videos: [],
};

function app$(s, r=document){ return r.querySelector(s); }
function app$all(s, r=document){ return Array.from(r.querySelectorAll(s)); }

function appFormatPrice(v){ return '¥' + (v/1).toLocaleString('zh-CN'); }

function persistMerchant(){
  try { localStorage.setItem('gm_products', JSON.stringify(appState.products)); } catch {}
  try { localStorage.setItem('gm_videos', JSON.stringify(appState.videos)); } catch {}
}
function loadPersistMerchant(){
  try { const p = JSON.parse(localStorage.getItem('gm_products')||'[]'); if (Array.isArray(p) && p.length) appState.products = p; } catch {}
  try { const v = JSON.parse(localStorage.getItem('gm_videos')||'[]'); if (Array.isArray(v) && v.length) appState.videos = v; } catch {}
}

function seedMerchantData(){
  appState.products = [
    { id: 'p1', title: 'Taylor 314ce', price: 14999, cat: 'acoustic', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=800&auto=format&fit=crop', stock: 8 },
    { id: 'p2', title: 'Fender Stratocaster', price: 8999, cat: 'electric', image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?q=80&w=800&auto=format&fit=crop', stock: 15 },
    { id: 'p3', title: 'Gibson Les Paul Standard', price: 18999, cat: 'electric', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop', stock: 5 },
  ];
  appState.orders = [
    { id: 'O100001', status: '待发货', amount: 18999, createdAt: '2025-08-01 10:23', items: [{id:'p3', qty:1}] },
    { id: 'O100002', status: '待付款', amount: 8999, createdAt: '2025-08-02 12:15', items: [{id:'p2', qty:1}] },
    { id: 'O100003', status: '已完成', amount: 14999, createdAt: '2025-08-03 09:05', items: [{id:'p1', qty:1}] },
  ];
  appState.messages = [
    { id: 'M1', from: '用户A', text: '请问这款支持分期吗？', time: '09:10' },
    { id: 'M2', from: '用户B', text: '售后如何处理？', time: '08:55' },
  ];
  appState.videos = [
    { id: 'v1', title: '店长演示 | Strat 经典三种音色', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', productId: 'p2', merchant: 'GuitarMall 官方旗舰店' },
  ];
}

function appShowScreen(key){
  appState.current = key;
  app$all('section[data-screen]').forEach(s=>s.classList.add('hidden'));
  const el = document.querySelector(`section[data-screen="${key}"]`);
  if (el) el.classList.remove('hidden');
  app$all('nav [data-nav]').forEach(b=>{
    b.classList.toggle('text-primary', b.dataset.nav===key);
    b.classList.toggle('text-slate-600', b.dataset.nav!==key);
  });
}

function appRenderDashboard(){
  const today = appState.orders.filter(o=>o.status!=='待付款').reduce((s,o)=>s+o.amount,0);
  app$('#app-metric-today').textContent = appFormatPrice(today);
  app$('#app-metric-toship').textContent = String(appState.orders.filter(o=>o.status==='待发货').length);
  app$('#app-metric-stock').textContent = String(appState.products.filter(p=>p.stock<=5).length);
  const chart = app$('#app-chart');
  const vals = Array.from({length:7}, ()=> Math.floor(20+Math.random()*80));
  chart.innerHTML = vals.map(v=>`<div class="flex-1 bg-slate-100 rounded-t-md overflow-hidden"><div class="w-full bg-primary" style="height:${v}%"></div></div>`).join('');
  app$('#app-badge-pending').textContent = String(appState.orders.filter(o=>o.status==='待付款').length);
  app$('#app-badge-ship').textContent = String(appState.orders.filter(o=>o.status==='待发货').length);
  app$('#app-badge-after').textContent = '0';
}

const appOrderTabs = [
  { key: 'all', name: '全部' },
  { key: 'pending', name: '待付款' },
  { key: 'toship', name: '待发货' },
  { key: 'toreceive', name: '待收货' },
  { key: 'done', name: '已完成' },
  { key: 'after', name: '售后' },
];

function appRenderOrderTabs(active='all'){
  const wrap = app$('#app-order-tabs');
  wrap.innerHTML = appOrderTabs.map(t=>`<button class="px-3 h-9 rounded-full border text-sm ${t.key===active?'bg-primary text-white border-primary':'bg-white border-slate-200'}" data-otab="${t.key}">${t.name}</button>`).join('');
  app$all('[data-otab]').forEach(btn=>btn.addEventListener('click', ()=> appRenderOrders(btn.dataset.otab)));
}

function appRenderOrders(filter='all'){
  appRenderOrderTabs(filter);
  const list = app$('#app-orders-list');
  const filtered = appState.orders.filter(o=>{
    if (filter==='all') return true;
    if (filter==='pending') return o.status==='待付款';
    if (filter==='toship') return o.status==='待发货';
    if (filter==='toreceive') return o.status==='待收货';
    if (filter==='done') return o.status==='已完成';
    if (filter==='after') return o.status==='售后';
    return true;
  });
  if (filtered.length===0){ list.innerHTML = '<div class="text-center text-slate-500 py-16">暂无订单</div>'; return; }
  list.innerHTML = filtered.map(o=>`
    <div class="rounded-xl bg-white p-3 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="text-sm text-slate-500">${o.createdAt}</div>
        <div class="text-primary text-sm">${o.status}</div>
      </div>
      <div class="mt-2 flex items-center gap-3">
        ${o.items.map(it=>{ const p=appState.products.find(x=>x.id===it.id); return `<img src="${p.image}" class="h-12 w-12 rounded-lg object-cover"/>`; }).join('')}
        <div class="ml-auto font-semibold">${appFormatPrice(o.amount)}</div>
      </div>
      <div class="mt-3 text-right">
        <button class="px-3 h-9 rounded-lg border text-sm" data-oview="${o.id}">查看/处理</button>
      </div>
    </div>`).join('');
  app$all('[data-oview]').forEach(btn=>btn.addEventListener('click', ()=> appOpenOrderDetail(btn.dataset.oview)));
}

function appOpenOrderDetail(id){
  const o = appState.orders.find(x=>x.id===id);
  if(!o) return;
  const box = app$('#app-order-detail');
  box.innerHTML = `
    <div class="rounded-xl bg-white p-4 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="font-semibold">订单号：${o.id}</div>
        <div class="text-primary">${o.status}</div>
      </div>
      <div class="text-sm text-slate-500 mt-1">创建时间：${o.createdAt}</div>
    </div>
    <div class="rounded-xl bg-white p-4 shadow-sm">
      ${o.items.map(it=>{ const p=appState.products.find(x=>x.id===it.id); return `
        <div class="flex gap-3 items-center mb-3 last:mb-0">
          <img src="${p.image}" class="h-14 w-14 rounded-lg object-cover"/>
          <div class="flex-1">
            <div class="text-sm font-semibold line-clamp-1">${p.title}</div>
            <div class="text-xs text-slate-500">数量 x ${it.qty}</div>
          </div>
          <div class="text-sm font-semibold">${appFormatPrice(p.price * it.qty)}</div>
        </div>`; }).join('')}
      <div class="flex items-center justify-between mt-2">
        <span>合计</span><span class="font-semibold text-primary">${appFormatPrice(o.amount)}</span>
      </div>
    </div>`;
  const acts = app$('#app-order-actions');
  acts.innerHTML = '';
  if (o.status==='待发货'){
    acts.innerHTML = `
      <button data-back class="h-11 px-4 rounded-xl border">返回</button>
      <button class="h-11 px-4 rounded-xl border">联系买家</button>
      <button id="app-ship" class="h-11 px-4 rounded-xl bg-primary text-white">去发货</button>`;
    app$('#app-ship').onclick = ()=>{ o.status='待收货'; appOpenOrderDetail(o.id); };
  } else if (o.status==='待付款'){
    acts.innerHTML = `
      <button data-back class="h-11 px-4 rounded-xl border">返回</button>
      <button class="h-11 px-4 rounded-xl border">催付</button>`;
  } else if (o.status==='待收货'){
    acts.innerHTML = `
      <button data-back class="h-11 px-4 rounded-xl border">返回</button>
      <button class="h-11 px-4 rounded-xl border">查看物流</button>
      <button class="h-11 px-4 rounded-xl bg-slate-900 text-white">售后处理</button>`;
  } else {
    acts.innerHTML = `<button data-back class="h-11 px-4 rounded-xl border">返回</button>`;
  }
  app$all('[data-back]').forEach(b=> b.onclick = ()=> appShowScreen('orders'));
  appShowScreen('order-detail');
}

function appRenderProducts(){
  const term = (app$('#app-prod-search').value||'').trim();
  const list = app$('#app-products-list');
  const filtered = appState.products.filter(p => term ? (p.title.includes(term)) : true);
  list.innerHTML = filtered.map(p=>`
    <div class="rounded-xl bg-white p-3 shadow-sm flex gap-3">
      <img src="${p.image}" class="h-16 w-16 rounded-lg object-cover"/>
      <div class="flex-1">
        <div class="text-sm font-semibold line-clamp-1">${p.title}</div>
        <div class="text-xs text-slate-500 mt-0.5">${appState.categories.find(c=>c.key===p.cat)?.name||''} · 库存 ${p.stock}</div>
        <div class="mt-2 flex items-center justify-between">
          <div class="text-primary font-bold">${appFormatPrice(p.price)}</div>
          <div class="flex items-center gap-2">
            <button class="h-9 px-3 rounded-lg border text-sm" data-edit="${p.id}">编辑</button>
            <button class="h-9 px-3 rounded-lg border text-sm" data-stock="${p.id}">补货</button>
          </div>
        </div>
      </div>
    </div>`).join('') || '<div class="text-center text-slate-500 py-16">暂无商品</div>';
  app$all('[data-edit]').forEach(btn=> btn.addEventListener('click', ()=> appOpenProductEdit(btn.dataset.edit)));
  app$all('[data-stock]').forEach(btn=> btn.addEventListener('click', ()=>{ const p=appState.products.find(x=>x.id===btn.dataset.stock); p.stock += 10; appRenderProducts(); appRenderInventory(); persistMerchant(); }));
}

let editingProductId = null;
function appOpenProductEdit(id){
  const p = appState.products.find(x=>x.id===id) || { id: 'p'+Math.floor(Math.random()*100000), title: '', price: 0, cat: appState.categories[0].key, image: '', stock: 0 };
  editingProductId = p.id;
  app$('#app-pe-title').value = p.title;
  app$('#app-pe-price').value = String(p.price);
  app$('#app-pe-image').value = p.image || 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=800&auto=format&fit=crop';
  const sel = app$('#app-pe-cat');
  sel.innerHTML = appState.categories.map(c=>`<option value="${c.key}" ${c.key===p.cat?'selected':''}>${c.name}</option>`).join('');
  app$('#app-pe-stock').value = String(p.stock);
  app$('#app-pe-delete').style.display = appState.products.find(x=>x.id===id)?'':'none';
  app$('#app-pe-save').onclick = ()=>{
    const payload = {
      id: editingProductId,
      title: app$('#app-pe-title').value.trim(),
      price: Number(app$('#app-pe-price').value||0),
      cat: app$('#app-pe-cat').value,
      image: app$('#app-pe-image').value.trim(),
      stock: Number(app$('#app-pe-stock').value||0),
    };
    const idx = appState.products.findIndex(x=>x.id===editingProductId);
    if (idx>=0) appState.products[idx] = payload; else appState.products.unshift(payload);
    appShowScreen('products');
    appRenderProducts();
    appRenderInventory();
    appRenderVideoList();
    appFillVideoProductOptions();
    persistMerchant();
  };
  app$('#app-pe-delete').onclick = ()=>{
    appState.products = appState.products.filter(x=>x.id!==editingProductId);
    appShowScreen('products');
    appRenderProducts();
    appRenderInventory();
    appRenderVideoList();
    appFillVideoProductOptions();
    persistMerchant();
  };
  appShowScreen('product-edit');
}

function appRenderInventory(){
  const wrap = app$('#app-inv-list');
  wrap.innerHTML = appState.products.map(p=>`
    <div class="py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img src="${p.image}" class="h-10 w-10 rounded-lg object-cover"/>
        <div>
          <div class="text-sm font-semibold">${p.title}</div>
          <div class="text-xs text-slate-500">库存：${p.stock}</div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button class="h-9 px-3 rounded-lg border text-sm" data-stock="${p.id}">+10</button>
        <button class="h-9 px-3 rounded-lg border text-sm" data-stockm="${p.id}">-1</button>
      </div>
    </div>`).join('') || '<div class="text-center text-slate-500 py-16">暂无库存</div>';
  app$all('[data-stock]').forEach(btn=> btn.addEventListener('click', ()=>{ const p=appState.products.find(x=>x.id===btn.dataset.stock); p.stock+=10; appRenderInventory(); appRenderDashboard(); persistMerchant(); }));
  app$all('[data-stockm]').forEach(btn=> btn.addEventListener('click', ()=>{ const p=appState.products.find(x=>x.id===btn.dataset.stockm); p.stock=Math.max(0,p.stock-1); appRenderInventory(); appRenderDashboard(); persistMerchant(); }));
}

function appRenderAnalytics(){
  app$('#app-top-cats').innerHTML = appState.categories.map(c=>{
    const vol = Math.floor(Math.random()*1000);
    return `<div class="rounded-lg border p-3 flex items-center justify-between"><span>${c.name}</span><span class="font-semibold">${vol}</span></div>`;
  }).join('');
}

function appRenderMessages(){
  const list = app$('#app-msg-list');
  list.innerHTML = appState.messages.map(m=>`
    <div class="rounded-xl bg-white p-3 shadow-sm flex items-start gap-3">
      <div class="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center"><i class="fa-regular fa-user"></i></div>
      <div class="flex-1">
        <div class="flex items-center justify-between"><div class="font-semibold">${m.from}</div><div class="text-xs text-slate-500">${m.time}</div></div>
        <div class="text-sm text-slate-700 mt-1">${m.text}</div>
      </div>
    </div>`).join('') || '<div class="text-center text-slate-500 py-16">暂无消息</div>';
  const badge = app$('#app-msg-badge');
  if (appState.messages.length>0){ badge.textContent = String(appState.messages.length); badge.classList.remove('hidden'); } else { badge.classList.add('hidden'); }
}

// 视频管理
let editingVideoId = null;

function appRenderVideoList(){
  const list = app$('#app-videos-list');
  if (!list) return;
  list.innerHTML = appState.videos.map(v=>{
    const prod = appState.products.find(p=>p.id===v.productId);
    return `
      <div class="rounded-xl bg-white p-3 shadow-sm flex gap-3">
        <img src="${v.cover}" class="h-16 w-28 rounded-lg object-cover"/>
        <div class="flex-1">
          <div class="text-sm font-semibold line-clamp-1">${v.title}</div>
          <div class="text-xs text-slate-500 mt-0.5">关联商品：${prod?prod.title:'未关联'}</div>
          <div class="text-xs text-slate-500">商家：${v.merchant||''}</div>
          <div class="mt-2 flex items-center gap-2">
            <button class="h-8 px-3 rounded-lg border text-xs" data-vedit="${v.id}">编辑</button>
            <button class="h-8 px-3 rounded-lg border text-xs" data-vdel="${v.id}">删除</button>
          </div>
        </div>
      </div>`;
  }).join('') || '<div class="text-center text-slate-500 py-16">暂无视频</div>';
  app$all('[data-vedit]').forEach(btn=> btn.addEventListener('click', ()=> appOpenVideoEdit(btn.dataset.vedit)));
  app$all('[data-vdel]').forEach(btn=> btn.addEventListener('click', ()=>{ appState.videos = appState.videos.filter(x=>x.id!==btn.dataset.vdel); appRenderVideoList(); persistMerchant(); }));
}

function appFillVideoProductOptions(selectedId){
  const sel = app$('#app-ve-product');
  if (!sel) return;
  sel.innerHTML = appState.products.map(p=>`<option value="${p.id}" ${p.id===selectedId?'selected':''}>${p.title}</option>`).join('');
}

function appOpenVideoEdit(id){
  const v = appState.videos.find(x=>x.id===id) || { id: 'v'+Math.floor(Math.random()*100000), title: '', cover: '', url: '', productId: appState.products[0]?.id, merchant: 'GuitarMall 官方旗舰店' };
  editingVideoId = v.id;
  app$('#app-ve-title').value = v.title;
  app$('#app-ve-cover').value = v.cover || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop';
  app$('#app-ve-url').value = v.url || 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
  appFillVideoProductOptions(v.productId);
  app$('#app-ve-merchant').value = v.merchant || 'GuitarMall 官方旗舰店';
  app$('#app-ve-delete').style.display = appState.videos.find(x=>x.id===id)?'':'none';
  app$('#app-ve-save').onclick = ()=>{
    const payload = {
      id: editingVideoId,
      title: app$('#app-ve-title').value.trim(),
      cover: app$('#app-ve-cover').value.trim(),
      url: app$('#app-ve-url').value.trim(),
      productId: app$('#app-ve-product').value,
      merchant: app$('#app-ve-merchant').value.trim(),
    };
    const idx = appState.videos.findIndex(x=>x.id===editingVideoId);
    if (idx>=0) appState.videos[idx] = payload; else appState.videos.unshift(payload);
    appShowScreen('videos');
    appRenderVideoList();
    persistMerchant();
  };
  app$('#app-ve-delete').onclick = ()=>{
    appState.videos = appState.videos.filter(x=>x.id!==editingVideoId);
    appShowScreen('videos');
    appRenderVideoList();
    persistMerchant();
  };
  appShowScreen('video-edit');
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(()=> URL.revokeObjectURL(url), 1000);
}

function appBindGlobal(){
  app$all('nav [data-nav]').forEach(btn=> btn.addEventListener('click', ()=>{
    const key = btn.dataset.nav;
    appShowScreen(key);
    if (key==='dashboard') appRenderDashboard();
    if (key==='orders') appRenderOrders('all');
    if (key==='products') appRenderProducts();
    if (key==='videos') { appRenderVideoList(); appFillVideoProductOptions(); }
    if (key==='messages') appRenderMessages();
    if (key==='me') {/* nothing */}
  }));

  app$('#app-prod-add').onclick = ()=> appOpenProductEdit(null);
  app$('#app-prod-search').addEventListener('input', appRenderProducts);

  app$('#app-video-add')?.addEventListener('click', ()=> appOpenVideoEdit(null));
  app$('#app-video-export')?.addEventListener('click', ()=> {
    const payload = appState.videos.map(v=>({ id: v.id, title: v.title, cover: v.cover, url: v.url, productId: v.productId, merchant: v.merchant }));
    downloadText('videos.json', JSON.stringify(payload, null, 2));
  });
}

window.addEventListener('DOMContentLoaded', ()=>{
  seedMerchantData();
  loadPersistMerchant();
  persistMerchant();
  appBindGlobal();
  appRenderDashboard();
  appRenderOrders('all');
  appRenderProducts();
  appRenderInventory();
  appRenderAnalytics();
  appRenderMessages();
  appRenderVideoList();
}); 