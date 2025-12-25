import axios from 'axios';

const baseURL = 'https://ecommerce-website-final.onrender.com/api';

const api = axios.create({ baseURL });

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');

    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

// Helper: search products
export const searchProducts = (q) => api.get(`/products/search?q=${encodeURIComponent(q)}`);
