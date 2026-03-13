import axios from 'axios';

const baseURL = import.meta.env.MODE === "development"
  ? "http://localhost:5000/api"
  : "https://ecommerce-website-final.onrender.com/api";

const api = axios.create({ baseURL, timeout: 30000 });

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

// Retry interceptor: retry failed requests up to 3 times with backoff
// Skip retries for 4xx errors (auth failures, validation, etc.)
api.interceptors.response.use(null, async (error) => {
  const config = error.config;
  const status = error.response?.status;
  if (!config || config._retryCount >= 3 || (status >= 400 && status < 500)) return Promise.reject(error);

  config._retryCount = (config._retryCount || 0) + 1;
  const delay = config._retryCount * 2000;
  await new Promise(r => setTimeout(r, delay));
  return api(config);
});

// Wake up the backend immediately on app load
let _warmUpPromise = null;
export const warmUpBackend = () => {
  if (!_warmUpPromise) {
    _warmUpPromise = api.get("/health", { timeout: 60000 })
      .then(() => {})
      .catch(() => {});
  }
  return _warmUpPromise;
};
// Fire warm-up immediately on import
warmUpBackend();

export default api;

// Helper: search products
export const searchProducts = (q) => api.get(`/products/search?q=${encodeURIComponent(q)}`);
