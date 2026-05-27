import axios from "axios";

const API_URL = "https://seenways-backend-production.up.railway.app/api";

export const api = axios.create({ baseURL: API_URL, timeout: 30000 });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("seenways_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
        localStorage.removeItem("seenways_token");
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

// Products
export const getProducts = (params?: object) => api.get("/products", { params });
export const getProduct = (slug: string) => api.get(`/products/${slug}`);
export const getAdminProducts = (params?: object) => api.get("/products/admin/all", { params });
export const createProduct = (data: object) => api.post("/products", data);
export const updateProduct = (id: string, data: object) => api.put(`/products/${id}`, data);
export const deleteProduct = (id: string) => api.delete(`/products/${id}`);

// Orders
export const createOrder = (data: object) => api.post("/orders", data);
export const validateCoupon = (code: string, orderTotal: number) => api.post("/orders/validate-coupon", { code, orderTotal });
export const getOrders = (params?: object) => api.get("/orders", { params });
export const getOrder = (id: string) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id: string, status: string) => api.patch(`/orders/${id}/status`, { status });
export const deleteOrder = (id: string) => api.delete(`/orders/${id}`);
export const exportOrdersCSV = (params?: object) => api.get("/orders/export/csv", { params, responseType: "blob" });

// Categories
export const getCategories = () => api.get("/categories");
export const createCategory = (data: object) => api.post("/categories", data);
export const deleteCategory = (id: string) => api.delete(`/categories/${id}`);

// Coupons
export const getCoupons = () => api.get("/coupons");
export const createCoupon = (data: object) => api.post("/coupons", data);
export const toggleCoupon = (id: string) => api.patch(`/coupons/${id}/toggle`);
export const deleteCoupon = (id: string) => api.delete(`/coupons/${id}`);

// Admin
export const adminLogin = (data: object) => api.post("/admin/login", data);
export const getAdminMe = () => api.get("/admin/me");
export const getStats = () => api.get("/admin/stats");

// Upload
export const uploadImage = (file: File) => {
  const fd = new FormData();
  fd.append("image", file);
  return api.post("/upload/image", fd, { headers: { "Content-Type": "multipart/form-data" } });
};

// Track Order
export const trackOrder = (orderNumber: string, phone: string) => api.get(`/orders/track/${orderNumber}`, { params: { phone } });

// Governorates
export const getGovernorates = () => api.get("/governorates");
export const getAdminGovernorates = () => api.get("/governorates/admin/all");
export const updateGovernorate = (id: string, data: object) => api.put(`/governorates/${id}`, data);
export const deleteGovernorate = (id: string) => api.delete(`/governorates/${id}`);
