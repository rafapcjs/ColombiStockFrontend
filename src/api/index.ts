// services/colombiStockApi.js
import axios from "axios";

export const colombiStockApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "api-key": process.env.NEXT_PUBLIC_API_KEY,
  },
});

colombiStockApi.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // Lee el mismo nombre que usaste en login
      const token = sessionStorage.getItem("jwt");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config; // ¡muy importante!
  },
  (error) => Promise.reject(error)
);
