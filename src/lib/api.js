
import axios from "axios";
import API_URL from "../config/config";


const API = axios.create({
  baseURL: `${API_URL}/api`, 
  headers: { "Content-Type": "application/json" },
});

export const publicAPI = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

// -----------------------------
// Token Management
// -----------------------------
const getToken = () => localStorage.getItem("token") || localStorage.getItem("user_token");

const clearTokens = () => {
  ["token", "user_token", "auth", "user"].forEach((key) => localStorage.removeItem(key));
};

// -----------------------------
// Request Interceptor
// -----------------------------
API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------
// Response Interceptor
// -----------------------------
API.interceptors.response.use(
  (response) => {
    const newToken = response.headers["x-new-token"];
    if (newToken) {
      localStorage.setItem("token", newToken);
      localStorage.setItem("user_token", newToken);
      console.log("Token refreshed automatically");
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;

    if (status === 401 && ["TOKEN_EXPIRED", "INVALID_TOKEN"].includes(code)) {
      clearTokens();
      if (!["/login", "/otp-login", "/user/login"].includes(window.location.pathname)) {
        window.location.href = "/user/login";
      }
    }
    return Promise.reject(error);
  }
);

// -----------------------------
// AUTH APIs
// -----------------------------
export const authAPI = {
  login: async (credentials) => (await API.post("/auth/login", credentials)).data,
  register: async (userData) => (await API.post("/auth/register", userData)).data,
  getProfile: async () => (await API.get("/auth/profile")).data,
  updateProfile: async (userData) => (await API.put("/auth/profile", userData)).data,
  changePassword: async (passwordData) => (await API.put("/auth/change-password", passwordData)).data,
  logout: async () => { clearTokens(); return (await API.post("/auth/logout")).data; },
  verifyToken: async () => (await API.get("/auth/verify-token")).data,
  sendOTP: async (data) => (await API.post("/auth/send-otp", data)).data,
  verifyOTP: async (data) => (await API.post("/auth/verify-otp", data)).data,
  resendOTP: async (data) => (await API.post("/auth/resend-otp", data)).data,
  refreshToken: async (refreshToken) => (await API.post("/auth/refresh-token", { refreshToken })).data,
  forgotPassword: async (email) => (await API.post("/auth/forgot-password", { email })).data,
  resetPassword: async (token, password) => (await API.post("/auth/reset-password", { token, password })).data,
};

// -----------------------------
// ADMIN AUTH APIs
// -----------------------------
export const adminAuthAPI = {
  login: async (credentials) => (await API.post("/admin-auth/login", credentials)).data,
  register: async (adminData) => (await API.post("/admin-auth/register", adminData)).data,
  getProfile: async () => (await API.get("/admin-auth/profile")).data,
  updateProfile: async (adminData) => (await API.put("/admin-auth/profile", adminData)).data,
  changePassword: async (passwordData) => (await API.put("/admin-auth/change-password", passwordData)).data,
  logout: async () => { clearTokens(); return (await API.post("/admin-auth/logout")).data; },
  verifyToken: async () => (await API.get("/admin-auth/verify-token")).data,
};

// -----------------------------
// PUBLIC PRODUCTS & CATEGORIES
// -----------------------------
export const productsAPI = {
  getProducts: async ({ category, subcategory, page = 1, search } = {}) => {
    const response = await publicAPI.get("/products", { params: { category, subcategory, page, search } });
    return response.data;
  },
};

export const categoriesAPI = {
  getCategories: async () => (await publicAPI.get("/products/categories")).data,
  getCategory: async (id) => (await publicAPI.get(`/products/category/${id}`)).data,
};

// -----------------------------
// USER CART APIs
// -----------------------------
export const cartAPI = {
  getCart: async () => (await API.get("/cart")).data,
  addToCart: async (productId, quantity = 1) => (await API.post("/cart/add", { productId, quantity })).data,
  updateCartItem: async (productId, quantity) => (await API.put(`/cart/${productId}`, { quantity })).data,
  removeFromCart: async (productId) => (await API.delete(`/cart/${productId}`)).data,
  clearCart: async () => (await API.delete("/cart")).data,
};

// -----------------------------
// USER WISHLIST APIs
// -----------------------------
export const wishlistAPI = {
  getWishlist: async () => (await API.get("/wishlist")).data,
  addToWishlist: async (productId) => (await API.post("/wishlist/add", { productId })).data,
  removeFromWishlist: async (productId) => (await API.delete(`/wishlist/${productId}`)).data,
};

// -----------------------------
// ORDERS
// -----------------------------
export const ordersAPI = {
  getUserOrders: async () => (await API.get("/orders/user")).data,
  createOrder: async (orderData) => (await API.post("/orders", orderData)).data,
  getOrder: async (id) => (await API.get(`/orders/${id}`)).data,
  updateOrderStatus: async (id, status) => (await API.put(`/orders/${id}/status`, { status })).data,
};

// -----------------------------
// ADMIN APIs
// -----------------------------
export const adminAPI = {
  getUsers: async (params = {}) => (await API.get("/admin/users", { params })).data,
  getUserById: async (id) => (await API.get(`/admin/users/${id}`)).data,
  updateUser: async (id, userData) => (await API.put(`/admin/users/${id}`, userData)).data,
  deleteUser: async (id) => (await API.delete(`/admin/users/${id}`)).data,
  getUserOrders: async (id, params = {}) => (await API.get(`/admin/users/${id}/orders`, { params })).data,
  getUserStats: async () => (await API.get("/admin/users/stats")).data,

  // Category Management
  getCategories: async () => (await API.get("/categories")).data,
  getCategoryTree: async () => (await API.get("/categories/tree")).data,
  createCategory: async (categoryData) => (await API.post("/categories", categoryData)).data,
  updateCategory: async (id, categoryData) => (await API.put(`/categories/${id}`, categoryData)).data,
  deleteCategory: async (id) => (await API.delete(`/categories/${id}`)).data,

  // Order Management
  getOrders: async (params = {}) => (await API.get("/orders", { params })).data,
  getOrderById: async (id) => (await API.get(`/orders/${id}`)).data,
  updateOrderStatus: async (id, status, message) => (await API.put(`/orders/${id}/status`, { status, message })).data,
  processRefund: async (id, refundData) => (await API.put(`/orders/${id}/refund`, refundData)).data,
  getOrderStats: async () => (await API.get("/orders/stats")).data,
};

// -----------------------------
// DASHBOARD APIs
// -----------------------------
export const dashboardAPI = {
  getStats: async () => (await API.get("/dashboard/stats")).data,
  getAnalytics: async (period = "30d") => (await API.get("/dashboard/analytics", { params: { period } })).data,
  getRecentActivity: async (limit = 10) => (await API.get("/dashboard/recent-activity", { params: { limit } })).data,
};

// -----------------------------
// REAL-TIME APIs
// -----------------------------
export const realTimeAPI = {
  getDashboardStats: async () => (await API.get("/dashboard/stats")).data,
  getLiveUpdates: async () => (await API.get("/live/updates")).data,
};

// -----------------------------
// GENERIC API HELPERS
// -----------------------------
export const apiGet = async (url, config = {}) => (await API.get(url, config)).data;
export const apiPost = async (url, data = {}, config = {}) => (await API.post(url, data, config)).data;
export const apiPut = async (url, data = {}, config = {}) => (await API.put(url, data, config)).data;
export const apiDelete = async (url, config = {}) => (await API.delete(url, config)).data;

export default API;