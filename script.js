const PRODUCTS = [
  { id:1, name:'Linen Oversized Tee', category:'clothing', emoji:'👕', color:'#f0ece4', price:899, tag:'Clothing', rating:4.8, reviews:124, badge:'new' },
  { id:2, name:'Wave Runner Pro', category:'footwear', emoji:'👟', color:'#e8f0ea', price:4299, tag:'Footwear', rating:4.9, reviews:87, badge:'new' },
  { id:3, name:'Slim Cargo Pants', category:'clothing', emoji:'👖', color:'#e8e4f0', price:1799, originalPrice:2299, tag:'Clothing', rating:4.6, reviews:56, badge:'sale' },
  { id:4, name:'Leather Tote Bag', category:'accessories', emoji:'👜', color:'#f0e8e4', price:2499, tag:'Accessories', rating:4.7, reviews:203 },
  { id:5, name:'Wireless Earbuds', category:'electronics', emoji:'🎧', color:'#e4eaf0', price:3599, originalPrice:4599, tag:'Electronics', rating:4.8, reviews:341, badge:'sale' },
  { id:6, name:'Bucket Hat', category:'accessories', emoji:'🧢', color:'#eaf0e4', price:649, tag:'Accessories', rating:4.4, reviews:78 },
  { id:7, name:'Chunky Sneakers', category:'footwear', emoji:'🥿', color:'#f0ece8', price:5299, tag:'Footwear', rating:4.9, reviews:192, badge:'new' },
  { id:8, name:'Ribbed Knit Vest', category:'clothing', emoji:'🧥', color:'#f0eae4', price:1199, tag:'Clothing', rating:4.5, reviews:44 },
  { id:9, name:'Smart Watch', category:'electronics', emoji:'⌚', color:'#eaeaf0', price:8999, tag:'Electronics', rating:4.7, reviews:267, badge:'new' },
  { id:10, name:'Canvas Backpack', category:'accessories', emoji:'🎒', color:'#e8f0e8', price:1899, tag:'Accessories', rating:4.6, reviews:135 },
  { id:11, name:'Linen Shorts', category:'clothing', emoji:'🩳', color:'#f4f0e8', price:799, tag:'Clothing', rating:4.3, reviews:29 },
  { id:12, name:'Minimalist Watch', category:'accessories', emoji:'🕐', color:'#e8ecf0', price:3299, originalPrice:3999, tag:'Accessories', rating:4.8, reviews:88, badge:'sale' },
];

let cart = {};
let currentFilter = 'all';

function renderStars(r) {
  const full = Math.round(r);
  return '★'.repeat(full) + '☆'.repeat(5-full);
}

function renderProducts(filter='all') {
  const grid = document.getElementById('products-grid');
  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  document.getElementById('product-count').textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;
  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-img" style="background:${p.color}">
        <span>${p.emoji}</span>
        ${p.badge === 'new' ? '<span class="product-badge-new">NEW</span>' : ''}
        ${p.badge === 'sale' ? '<span class="product-badge-sale">SALE</span>' : ''}
        <button class="product-wishlist" onclick="wishlist(event,${p.id})" title="Wishlist">♡</button>
      </div>
      <div class="product-body">
        <div class="product-tag">${p.tag}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">
          <span class="stars">${renderStars(p.rating)}</span>
          <span>${p.rating} (${p.reviews})</span>
        </div>
        <div class="product-footer">
          <div>
            <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
            ${p.originalPrice ? `<span class="product-price-old">₹${p.originalPrice.toLocaleString('en-IN')}</span>` : ''}
          </div>
          <button class="add-to-cart" onclick="addToCart(event,${p.id})">+ Add</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterProducts(btn, cat) {
  document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = cat;
  renderProducts(cat);
}

function addToCart(e, id) {
  e.stopPropagation();
  const p = PRODUCTS.find(x => x.id === id);
  if (!cart[id]) cart[id] = { ...p, qty: 0 };
  cart[id].qty++;
  updateCartUI();
  showToast(`${p.emoji} ${p.name} added to cart`);
}

function wishlist(e, id) {
  e.stopPropagation();
  const btn = e.currentTarget;
  btn.textContent = btn.textContent === '♡' ? '♥' : '♡';
  if (btn.textContent === '♥') showToast('Added to wishlist ♥');
}

function updateCartUI() {
  const items = Object.values(cart).filter(x => x.qty > 0);
  const totalQty = items.reduce((s, x) => s + x.qty, 0);
  const totalPrice = items.reduce((s, x) => s + x.qty * x.price, 0);
  document.getElementById('cart-count').textContent = totalQty;
  const list = document.getElementById('cart-items-list');
  const footer = document.getElementById('cart-footer');
  if (items.length === 0) {
    list.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Your cart is empty</p></div>`;
    footer.style.display = 'none';
  } else {
    list.innerHTML = items.map(item => `
      <div class="cart-item">
        <div class="cart-item-img">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')} each</div>
          <div class="cart-item-actions">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
          </div>
        </div>
      </div>
    `).join('');
    document.getElementById('subtotal').textContent = `₹${totalPrice.toLocaleString('en-IN')}`;
    document.getElementById('total').textContent = `₹${totalPrice.toLocaleString('en-IN')}`;
    footer.style.display = 'block';
  }
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty = Math.max(0, cart[id].qty + delta);
  if (cart[id].qty === 0) delete cart[id];
  updateCartUI();
}

function removeItem(id) {
  delete cart[id];
  updateCartUI();
}

function openCart() {
  document.getElementById('cart-overlay').classList.add('open');
  document.getElementById('cart-drawer').classList.add('open');
}

function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
  document.getElementById('cart-drawer').classList.remove('open');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

renderProducts();
updateCartUI();
