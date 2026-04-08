const API_BASE = "http://127.0.0.1:8081/api/v1";

async function apiRequest(url, method = "GET", body = null) {
  try {
    const res = await fetch(API_BASE + url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store", // ✅ FIX: disable cache
      body: body ? JSON.stringify(body) : null,
    });

    const contentType = res.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error("Non-JSON response:", text);
      return { success: false, error: "Invalid server response" };
    }

    return await res.json();
  } catch (err) {
    console.error("API ERROR:", err.message);
    return { success: false, error: err.message };
  }
}
