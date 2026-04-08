async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const type = document.getElementById("type").value;

  const res = await apiRequest("/auth/login", "POST", {
    email,
    password,
    type,
  });

  if (res.success) {
    window.location.href = "/dashboard.html";
  } else {
    alert(res.error || "Login failed");
  }
}

async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const phone = document.getElementById("phone").value;
  const type = document.getElementById("type").value;

  const res = await apiRequest("/auth/register", "POST", {
    name,
    email,
    password,
    phone,
    type,
  });

  if (res.success) {
    alert("Registered!");
    window.location.href = "/login.html";
  } else {
    alert(res.error || "Registration failed");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginBtn")?.addEventListener("click", login);
  document.getElementById("registerBtn")?.addEventListener("click", register);
});
