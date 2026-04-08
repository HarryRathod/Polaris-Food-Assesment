const DEFAULT_LAT = 13.0827;
const DEFAULT_LNG = 80.2707;

let currentPage = 1;
const limit = 5;

// ✅ REMOVE cookie check

function getUserLocation() {
  let lat = parseFloat(document.getElementById("lat").value) || DEFAULT_LAT;
  let lng = parseFloat(document.getElementById("lng").value) || DEFAULT_LNG;
  return { lat, lng };
}

async function loadRestaurants(page = 1) {
  const { lat, lng } = getUserLocation();
  currentPage = page;

  const res = await apiRequest(
    `/restaurant?latitude=${lat}&longitude=${lng}&page=${page}&limit=${limit}`,
  );

  if (!res.success) {
    document.getElementById("content").innerHTML = "Failed to load";
    return;
  }

  const data = res.data || {};
  const restaurants = data.data || [];

  let html = `<h3>Restaurants</h3>`;

  restaurants.forEach((r) => {
    html += `
      <div class="card">
        <b>${r.name}</b><br>
        ${r.address}<br>
        Distance: ${r.distance?.toFixed(2) || "N/A"} km<br><br>
        <button onclick="viewMenu('${r.id}')">View Menu</button>
      </div>
    `;
  });

  document.getElementById("content").innerHTML = html;
}

function viewMenu(id) {
  window.location.href = `/restaurant.html?id=${id}`;
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("restaurantBtn")
    ?.addEventListener("click", () => loadRestaurants(1));
});
