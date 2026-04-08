// ================= AUTH CHECK =================
async function checkAuth() {
  try {
    const res = await apiRequest("/auth/me"); // ✅ IMPORTANT

    return res.success === true;
  } catch {
    return false;
  }
}

// ================= LOGOUT =================
async function logout() {
  // since cookie is httpOnly → cannot delete manually
  // backend should ideally clear it, but fallback:

  document.cookie = "token=; Max-Age=0; path=/";

  window.location.href = "/login.html";
}

// ================= NAVBAR =================
async function renderNavbar() {
  const nav = document.getElementById("navLinks");
  if (!nav) return;

  const isAuth = await checkAuth();

  if (isAuth) {
    nav.innerHTML = `
      <a href="/dashboard.html">Dashboard</a>
      <a href="/orders.html">Orders</a>
      <button onclick="logout()">Logout</button>
    `;
  } else {
    nav.innerHTML = `
      <a href="/login.html">Login</a>
      <a href="/register.html">Signup</a>
    `;
  }
}

document.addEventListener("DOMContentLoaded", renderNavbar);
