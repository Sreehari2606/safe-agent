import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
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

