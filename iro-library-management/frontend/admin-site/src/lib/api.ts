import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
    if (error.response?.status === 401) {
      // Only redirect on authentication/authorization failures, not on 404s
      const errorMessage = error.response?.data?.message || "";

      // Check if it's actually an auth failure (not just a missing resource)
      if (
        errorMessage.includes("unauthorized") ||
        errorMessage.includes("token") ||
        errorMessage.includes("authentication") ||
        errorMessage.includes("expired") ||
        error.config?.url?.includes("/auth/") ||
        error.config?.url?.includes("/me")
      ) {
        // Handle unauthorized access - clear auth and redirect
        if (typeof window !== "undefined") {
          localStorage.removeItem("admin-token");
          localStorage.removeItem("admin-user");
          window.location.href = "/auth/login";
        }
      }
    }

    // Extract error message from response
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    } else if (error.response?.data?.errors) {
      // Handle validation errors
      const validationErrors = error.response.data.errors;
      if (Array.isArray(validationErrors)) {
        error.message = validationErrors
          .map((err: any) => err.msg || err.message)
          .join(", ");
      } else {
        error.message = validationErrors.toString();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
