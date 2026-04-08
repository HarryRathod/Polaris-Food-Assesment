const params = new URLSearchParams(window.location.search);
const restaurantId = params.get("id");

let menuItems = [];
let cart = {};
let coupons = [];
let selectedCoupon = null;

// ================= LOAD MENU =================
async function loadMenu() {
  const res = await apiRequest(`/restaurant/${restaurantId}/menu`);
  menuItems = res.data?.data || [];

  renderMenu();
  loadCoupons();
}

// ================= ADD MENU ITEM =================
async function addMenuItem() {
  const name = document.getElementById("m_name").value;
  const price = parseFloat(document.getElementById("m_price").value);
  const category = document.getElementById("m_category").value;

  if (!name || isNaN(price) || !category) {
    alert("All fields required");
    return;
  }

  const res = await apiRequest(`/restaurant/${restaurantId}/menu`, "POST", {
    name,
    price,
    category,
  });

  if (res.success) {
    alert("Menu item added!");

    // clear inputs
    document.getElementById("m_name").value = "";
    document.getElementById("m_price").value = "";

    loadMenu(); // refresh
  }
}

// ================= RENDER MENU =================
function renderMenu() {
  let html = "";

  menuItems.forEach((item) => {
    const qty = cart[item.id] || 0;

    html += `
      <div class="card">
        <b>${item.name}</b> - ₹${item.price} (${item.category})<br><br>

        <button onclick="decreaseQty('${item.id}')">-</button>
        <span>${qty}</span>
        <button onclick="increaseQty('${item.id}')">+</button>
      </div>
    `;
  });

  document.getElementById("menu").innerHTML = html;
  renderCart();
}

// ================= CART =================
function increaseQty(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderMenu();
}

function decreaseQty(id) {
  if (!cart[id]) return;
  cart[id]--;

  if (cart[id] <= 0) delete cart[id];

  renderMenu();
}

// ================= CART UI =================
function renderCart() {
  let total = 0;
  let html = "";

  Object.keys(cart).forEach((id) => {
    const item = menuItems.find((m) => m.id === id);
    const qty = cart[id];

    if (!item) return;

    const itemTotal = item.price * qty;
    total += itemTotal;

    html += `<div>${item.name} x ${qty} = ₹${itemTotal}</div>`;
  });

  html += `<hr><b>Total: ₹${total}</b>`;
  document.getElementById("cart").innerHTML = html;

  updateCouponUI(total);
}

// ================= COUPONS =================
async function loadCoupons() {
  const res = await apiRequest("/coupon/active");
  coupons = res.data?.data || [];

  let html = `<option value="">Select Coupon</option>`;

  coupons.forEach((c) => {
    html += `
      <option value="${c.code}">
        ${c.code} (Min ₹${c.minOrderAmount})
      </option>
    `;
  });

  document.getElementById("couponDropdown").innerHTML = html;

  document
    .getElementById("couponDropdown")
    .addEventListener("change", onCouponChange);
}

function onCouponChange() {
  const code = document.getElementById("couponDropdown").value;
  selectedCoupon = coupons.find((c) => c.code === code);

  renderCart();
}

function updateCouponUI(total) {
  if (!selectedCoupon) {
    document.getElementById("couponInfo").innerHTML = "";
    return;
  }

  if (total < selectedCoupon.minOrderAmount) {
    document.getElementById("couponInfo").innerHTML =
      `❌ Add ₹${selectedCoupon.minOrderAmount - total} more`;
  } else {
    document.getElementById("couponInfo").innerHTML = "✅ Coupon applicable";
  }
}

// ================= ORDER =================
async function placeOrder() {
  const items = Object.keys(cart).map((id) => ({
    menuId: id,
    quantity: cart[id],
  }));

  if (!items.length) {
    alert("Cart empty");
    return;
  }

  let total = 0;

  Object.keys(cart).forEach((id) => {
    const item = menuItems.find((m) => m.id === id);
    total += item.price * cart[id];
  });

  let couponCode = "";

  if (selectedCoupon && total >= selectedCoupon.minOrderAmount) {
    couponCode = selectedCoupon.code;
  }

  const res = await apiRequest("/order", "POST", {
    restaurantId,
    deliveryAddress: "Chennai",
    userLat: 13.0827,
    userLng: 80.2707,
    couponCode,
    items,
  });

  if (res.success) {
    alert("Order placed!");
    window.location.href = "/orders.html";
  }
}

// INIT
loadMenu();
