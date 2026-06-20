// Set your Render backend URL here
const API_BASE = import.meta.env.VITE_API_URL || "https://waec-backend-g41k.onrender.com";
const getToken = () => localStorage.getItem("waec_admin_token");

const request = async (path, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // Token expired or invalid — force logout
  if (res.status === 401) {
    localStorage.removeItem("waec_admin_token");
    window.location.href = "/login";
    return null;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const api = {
  // Auth
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  me: () => request("/auth/me"),
  registerAdmin: (payload) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),

  // Pins
  getPins: (params = "") => request(`/admin/pins${params}`),
  getPinsSummary: () => request("/admin/pins/summary"),
  uploadPins: (pins) =>
    request("/admin/pins/bulk", { method: "POST", body: JSON.stringify({ pins }) }),
  deletePin: (id) => request(`/admin/pins/${id}`, { method: "DELETE" }),

  // Orders
  getOrders: (params = "") => request(`/admin/orders${params}`),
  getOrderStats: () => request("/admin/orders/stats"),
  resendSms: (id) => request(`/admin/orders/${id}/resend-sms`, { method: "POST" }),

  // Users
  getUsers: () => request("/admin/users"),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: "DELETE" }),

  // Settings
  getSettings: () => request("/admin/settings"),
  updateSettings: (payload) =>
    request("/admin/settings", { method: "PUT", body: JSON.stringify(payload) }),
};

export { getToken };