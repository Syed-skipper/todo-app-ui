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
  allWithSummaries: (params) => api.get('cards/summaries/all', { params }),
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
  importCsv: (file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('expenses/import', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const familyMembersApi = {
  list: () => api.get('family-members'),
  create: (data) => api.post('family-members', data),
  update: (id, data) => api.put(`family-members/${id}`, data),
  remove: (id) => api.delete(`family-members/${id}`),
};

export const settlementsApi = {
  balances: (params) => api.get('settlements/balances', { params }),
  statement: (params) => api.get('settlements/statement', { params }),
  memberReport: (memberId, params) => api.get(`settlements/member/${memberId}/report`, { params }),
  whatsapp: (memberId, params) => api.get(`settlements/member/${memberId}/whatsapp`, { params }),
};

export const memberPaymentsApi = {
  list: (params) => api.get('member-payments', { params }),
  create: (data) => api.post('member-payments', data),
  remove: (id) => api.delete(`member-payments/${id}`),
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
  create: (data) => api.post('payments', data),
  markPaid: (id, data) => api.patch(`payments/${id}/pay`, data),
};

export const reportsApi = {
  exportCsv: (params) =>
    api.get('reports/export/csv', { params, responseType: 'blob' }),
  exportPdf: (params) =>
    api.get('reports/monthly/pdf', { params, responseType: 'blob' }),
};

export const notificationsApi = {
  list: (params) => api.get('notifications', { params }),
  markAllRead: () => api.patch('notifications/read-all'),
};

export default api;
