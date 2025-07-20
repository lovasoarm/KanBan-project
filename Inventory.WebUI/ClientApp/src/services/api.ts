import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Service
export const dashboardService = {
  getDashboardData: async () => {
    const response = await apiClient.get('/dashboard');
    return response.data;
  },

  getProducts: async (filters?: any) => {
    const response = await apiClient.get('/products', { params: filters });
    return response.data;
  },

  getAnalytics: async () => {
    const response = await apiClient.get('/analytics');
    return response.data;
  },
};

