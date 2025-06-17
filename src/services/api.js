import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://locahost:5173/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (email, password) => api.post("/auth/login", { email, password }),

  register: (name, email, password) =>
    api.post("/auth/signup", { name, email, password }),
};

// Expense services
export const expenseService = {
  getExpenses: ({ skip = 0, limit = 9, search = "", category = "" } = {}) => {
    return api.get("/expenses", {
      params: {
        skip,
        limit,
        search,
        category,
      },
    });
  },

  createExpense: (expense) => api.post("/expenses", expense),

  updateExpense: (id, expense) => api.put(`/expenses/${id}`, expense),

  deleteExpense: (id) => api.delete(`/expenses/${id}`),

  getExpense: (id) => api.get(`/expenses/${id}`),

  getAnalytics: () => api.get("/expenses"),
};

export default api;
