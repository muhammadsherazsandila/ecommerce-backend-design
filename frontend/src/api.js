import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Let browser set correct Content-Type for FormData (multipart boundary)
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get("/products", { params }),
  search: (params) => api.get("/products/search", { params }),
  getHomepage: () => api.get("/products/homepage"),
  getFeatured: (limit) => api.get("/products/featured", { params: { limit } }),
  getCategories: () => api.get("/products/categories"),
  getById: (id) => api.get(`/products/${id}`),
  create: (formData) => api.post("/products", formData),
};

export default api;
