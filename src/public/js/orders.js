let currentPage = 1;
const limit = 5;

// ================= LOAD ORDERS =================
async function loadOrders(page = 1) {
  currentPage = page;

  try {
    const res = await apiRequest(`/order?page=${page}&limit=${limit}`);

    console.log("Orders API:", res); // debug

    const data = res.data || {};
    const orders = data.data || [];

    let html = `<h3>Orders (Page ${data.page || 1})</h3>`;

    if (!orders.length) {
      html += "<p>No orders found</p>";
    }

    orders.forEach((o) => {
      html += `
        <div class="card">
          <b>${o.itemName}</b><br><br>

          Status: <span class="status ${o.status}">${o.status}</span><br>
          Amount: ₹${o.totalAmount}<br>
          Address: ${o.deliveryAddress}<br><br>

          ${renderRiderActions(o)}
        </div>
      `;
    });

    html += `
      <div class="pagination">
        <button onclick="loadOrders(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>Prev</button>
        Page ${data.page || 1} / ${data.totalPages || 1}
        <button onclick="loadOrders(${currentPage + 1})" ${currentPage >= (data.totalPages || 1) ? "disabled" : ""}>Next</button>
      </div>
    `;

    document.getElementById("orders").innerHTML = html;
  } catch (err) {
    console.error(err);
    document.getElementById("orders").innerHTML =
      "<p style='color:red;'>Failed to load orders</p>";
  }
}

// ================= RIDER ACTIONS =================
function renderRiderActions(order) {
  if (["PLACED", "ACCEPTED", "PREPARING"].includes(order.status)) {
    return `
      <select id="status-${order.id}">
        <option value="">Update Status</option>
        <option value="DELIVERED">DELIVERED</option>
      </select>

      <button onclick="updateOrderStatus('${order.id}', this)">Update</button>
    `;
  }

  if (order.status === "OUT_FOR_DELIVERY") {
    return `
      <button onclick="quickUpdate('${order.id}', 'DELIVERED', this)">
        Mark Delivered
      </button>
    `;
  }

  return "";
}

// ================= UPDATE STATUS =================
async function updateOrderStatus(orderId, btn) {
  const select = document.getElementById(`status-${orderId}`);
  const status = select.value;

  if (!status) {
    alert("Select status");
    return;
  }

  await callStatusUpdate(orderId, status, btn);
}

async function quickUpdate(orderId, status, btn) {
  await callStatusUpdate(orderId, status, btn);
}

// ================= PATCH + REFRESH =================
async function callStatusUpdate(orderId, status, btn) {
  try {
    // disable button to prevent multiple clicks
    btn.disabled = true;
    btn.innerText = "Updating...";

    const res = await apiRequest(`/order/${orderId}/status`, "PATCH", {
      status,
    });

    if (res.success) {
      alert("Status updated!");

      // ✅ IMPORTANT: RE-FETCH LATEST DATA
      await loadOrders(currentPage);
    } else {
      alert("Failed to update");
    }
  } catch (err) {
    console.error(err);
    alert("Error updating status");
  } finally {
    btn.disabled = false;
    btn.innerText = "Update";
  }
}

// INIT
document.addEventListener("DOMContentLoaded", () => loadOrders(1));
