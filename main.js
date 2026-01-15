const collections = [
  { title: "Nhẫn Cao Cấp", desc: "Biểu tượng vĩnh cửu", img: "images/nhanccap.jpg" },
  { title: "Dây Chuyền", desc: "Điểm nhấn tinh tế", img: "images/daycdnhan.jpg" },
  { title: "Bông Tai", desc: "Quyến rũ mọi ánh nhìn", img: "images/bongtqru.jpg" }
];

const products = [
    { id: 1, name: "Nhẫn Kim Cương Solitaire", price: 15500000, img: "images/nhankc.jpg" },
    { id: 2, name: "Dây Chuyền Ngọc Trai", price: 8200000, img: "images/daychuyen.jpg" },
    { id: 3, name: "Bông Tai Vàng Hồng", price: 4500000, img: "images/bongtai.jpg" },
    { id: 4, name: "Lắc Tay Luxury", price: 12800000, img: "images/lactay.jpg" },
    { id: 5, name: "Nhẫn Cưới Eternity", price: 21000000, img: "images/nhancuoi.jpg" },
    { id: 6, name: "Dây Chuyền Sapphire", price: 9500000, img: "images/daychuyen2.jpg" },
    { id: 7, name: "Bông Tai Ngọc Trai", price: 3200000, img: "images/bongtai2.jpg" },
    { id: 8, name: "Lắc Chân Bạc Ý", price: 1500000, img: "images/lacchan.jpg" }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUrl = window.location.href;
    const isRegisterPage = currentUrl.includes('register.html');
    const isLoginPage = currentUrl.includes('login.html');

    if (!isLoggedIn && !isRegisterPage && !isLoginPage) {
        window.location.href = 'login.html';
    }
}

const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-pass').value;
        localStorage.setItem('user', JSON.stringify({ name, email, pass }));
        alert('Đăng ký thành công! Hãy đăng nhập.');
        window.location.href = 'login.html';
    });
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-pass').value;
        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (storedUser && storedUser.email === email && storedUser.pass === pass) {
            localStorage.setItem('isLoggedIn', 'true');
            alert('Đăng nhập thành công!');
            window.location.href = 'index.html';
        } else {
             if (email === 'admin@gmail.com' && pass === '123') {
                 localStorage.setItem('isLoggedIn', 'true');
                 localStorage.setItem('user', JSON.stringify({name: 'Admin VIP', email: email}));
                 window.location.href = 'index.html';
            } else {
                alert('Sai thông tin đăng nhập!');
            }
        }
    });
}

function updateUserInfo() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = JSON.parse(localStorage.getItem('user'));
    const userAccountDiv = document.getElementById('user-account');

    if (userAccountDiv && isLoggedIn && user) {
        userAccountDiv.innerHTML = `<span class="font-bold text-gold mr-2 text-xs md:text-sm">Hi, ${user.name}</span> <i class="fas fa-sign-out-alt text-gray-400 hover:text-dark"></i>`;
        userAccountDiv.href = "#";
        userAccountDiv.onclick = (e) => {
            e.preventDefault();
            if(confirm('Đăng xuất?')) {
                localStorage.removeItem('isLoggedIn');
                window.location.href = 'login.html';
            }
        };
    }
}

function renderCollections() {
  const grid = document.getElementById("collection-grid");
  if (!grid) return;
  grid.innerHTML = collections.map(c => `
    <div class="group relative h-64 overflow-hidden cursor-pointer shadow-md">
      <img src="${c.img}" class="col-img w-full h-full object-cover transition duration-700 group-hover:scale-110" onerror="this.src='https://via.placeholder.com/400x300?text=Collection'">
      <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>
      <div class="absolute bottom-6 left-0 right-0 text-center text-white">
        <h3 class="text-2xl font-serif font-bold mb-1">${c.title}</h3>
        <p class="text-sm opacity-80 mb-2">${c.desc}</p>
        <span class="border-b border-gold text-xs uppercase tracking-widest pb-1">Xem ngay</span>
      </div>
    </div>
  `).join("");
}

function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="product-card group cursor-pointer">
      <div class="relative overflow-hidden mb-4 bg-gray-100 aspect-[4/5]">
        <img src="${p.img}" class="product-img w-full h-full object-cover transition duration-700 group-hover:scale-110" onerror="this.src='https://via.placeholder.com/300x400?text=Product'">
        <button onclick="addToCart(${p.id})" class="btn-add absolute bottom-4 left-1/2 bg-white text-dark px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gold hover:text-white transition-all shadow-lg opacity-0 transform translate-y-4 -translate-x-1/2 w-[80%] group-hover:translate-y-0 group-hover:opacity-100">Thêm vào giỏ</button>
      </div>
      <h3 class="font-serif text-lg group-hover:text-gold transition truncate text-center">${p.name}</h3>
      <p class="text-gold font-bold mt-1 text-sm text-center">${formatMoney(p.price)}</p>
    </div>
  `).join("");
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) existingItem.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    saveCart();
    updateCartCount();
    showToast(`Đã thêm "${product.name}"`);
}

function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        countEl.innerText = totalQty;
        if (totalQty > 0) countEl.classList.remove('hidden'); else countEl.classList.add('hidden');
    }
}

function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); }
function formatMoney(amount) { return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount); }
function showToast(msg) {
    const toast = document.getElementById("toast");
    const msgEl = document.getElementById("toast-msg");
    if (toast && msgEl) { msgEl.innerText = msg; toast.classList.remove("translate-x-[200%]"); setTimeout(() => toast.classList.add("translate-x-[200%]"), 3000); }
}

function initSearch() {
    const searchBtn = document.getElementById('search-btn');
    const modal = document.getElementById('search-modal');
    const closeBtn = document.getElementById('close-search');
    const input = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');

    if (!searchBtn || !modal) return;

    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.remove('opacity-0'), 10);
        input.focus(); 
    });

    const closeModal = () => {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
    };
    closeBtn.addEventListener('click', closeModal);
    
    input.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase().trim();
        resultsContainer.innerHTML = ''; 

        if (keyword.length === 0) return;

        const foundProducts = products.filter(p => p.name.toLowerCase().includes(keyword));

        if (foundProducts.length === 0) {
            resultsContainer.innerHTML = '<p class="text-gray-400 text-center italic">Không tìm thấy sản phẩm nào.</p>';
        } else {
            foundProducts.forEach(p => {
                const item = document.createElement('div');
                item.className = 'flex items-center bg-white p-3 rounded shadow cursor-pointer hover:bg-gray-100 transition';
                item.innerHTML = `
                    <img src="${p.img}" class="w-12 h-12 object-cover rounded mr-4">
                    <div class="flex-grow text-left">
                        <h4 class="font-bold text-dark text-sm">${p.name}</h4>
                        <p class="text-gold text-xs font-bold">${formatMoney(p.price)}</p>
                    </div>
                    <button class="text-xs bg-dark text-white px-3 py-1 rounded uppercase font-bold hover:bg-gold">Thêm</button>
                `;
                item.addEventListener('click', () => {
                    addToCart(p.id);
                    closeModal();
                });
                resultsContainer.appendChild(item);
            });
        }
    });
}

checkAuth(); 

document.addEventListener("DOMContentLoaded", () => {
  renderCollections();
  renderProducts();
  updateCartCount();
  updateUserInfo();
  initSearch(); 
});