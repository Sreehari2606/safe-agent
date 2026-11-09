import axios from 'axios';

// Determine the active API base URL
const envUrl = import.meta.env.VITE_API_BASE_URL;
const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

// If running on HTTPS (e.g. Vercel) and no HTTPS backend is provided, avoid mixed-content failure
export const isCloudWithoutBackend = isHttps && (!envUrl || envUrl.startsWith('http://localhost'));

export const API_BASE = envUrl || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000, // Fast 5-second failover
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor to immediately abort mixed-content requests on HTTPS Vercel if pointing to localhost
api.interceptors.request.use((config) => {
  if (isCloudWithoutBackend) {
    return Promise.reject(new Error('Mixed-content blocked: Deploy backend to Render and set VITE_API_BASE_URL in Vercel'));
  }
  return config;
});

// ---- Hazards ----
export const hazardApi = {
  list: (params = {}) => api.get('/hazards/', { params }),
  create: (data) => api.post('/hazards/', data),
  get: (id) => api.get(`/hazards/${id}`),
  update: (id, data) => api.patch(`/hazards/${id}`, data),
  verify: (id, action) => api.post(`/hazards/${id}/verify`, { action }),
  delete: (id) => api.delete(`/hazards/${id}`),
};

// ---- Weather ----
export const weatherApi = {
  current: (lat, lon) => api.get('/weather/current', { params: { lat, lon } }),
};

// ---- AI Assistant ----
export const assistantApi = {
  chat: (message, context = {}) => api.post('/assistant/chat', { message, context }),
};

// ---- Health ----
export const systemApi = {
  health: () => api.get('/health'),
};

export default api;
