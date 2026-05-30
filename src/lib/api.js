import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((req) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) req.headers['access-token'] = token;
  }
  return req;
});

export const authApi = {
  login: (data) => api.post('auth/login', data),
  register: (data) => api.post('auth/register', data),
  profile: () => api.get('auth/profile'),
};

export const cardsApi = {
  list: () => api.get('cards'),
  summary: (id, params) => api.get(`cards/${id}/summary`, { params }),
  create: (data) => api.post('cards', data),
  update: (id, data) => api.put(`cards/${id}`, data),
  remove: (id) => api.delete(`cards/${id}`),
};

export const expensesApi = {
  list: (params) => api.get('expenses', { params }),
  create: (data) => api.post('expenses', data),
  update: (id, data) => api.put(`expenses/${id}`, data),
  remove: (id) => api.delete(`expenses/${id}`),
};

export const membersApi = {
  list: () => api.get('members'),
  dashboard: (id, params) => api.get(`members/${id}/dashboard`, { params }),
};

export const budgetsApi = {
  list: (params) => api.get('budgets', { params }),
  create: (data) => api.post('budgets', data),
};

export const analyticsApi = {
  dashboard: (params) => api.get('analytics/dashboard', { params }),
  insights: () => api.get('analytics/insights'),
};

export const paymentsApi = {
  list: (params) => api.get('payments', { params }),
  upcoming: (days = 7) => api.get('payments/upcoming', { params: { days } }),
};

export const emiApi = {
  list: () => api.get('emi'),
};

export const notificationsApi = {
  list: (params) => api.get('notifications', { params }),
  markAllRead: () => api.patch('notifications/read-all'),
};

export default api;
