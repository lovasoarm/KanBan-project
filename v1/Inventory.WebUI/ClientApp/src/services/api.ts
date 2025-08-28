import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

interface ApiError {
  message: string;
  status: number;
  details?: string;
}

class ApiService {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: error.message || 'An unknown error occurred',
          status: error.response?.status || 500,
          details: error.response?.data as string,
        };
        return Promise.reject(apiError);
      }
    );
  }

  private async makeRequest<T>(request: () => Promise<AxiosResponse<T>>): Promise<T> {
    try {
      const response = await request();
      return response.data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getDashboardMetrics() {
    return this.makeRequest(() => this.client.get('/dashboard/metrics'));
  }

  async getProducts(filters?: Record<string, unknown>) {
    return this.makeRequest(() => this.client.get('/products', { params: filters }));
  }

  async getCategoryAnalytics() {
    return this.makeRequest(() => this.client.get('/dashboard/analytics/categories'));
  }

  async getLocationAnalytics() {
    return this.makeRequest(() => this.client.get('/dashboard/analytics/locations'));
  }

  async getValueTrend(days: number = 30) {
    return this.makeRequest(() => this.client.get('/dashboard/trends/value', { params: { days } }));
  }

  async getRestockAlerts() {
    return this.makeRequest(() => this.client.get('/dashboard/alerts/restock'));
  }

  async getSummaryStats() {
    return this.makeRequest(() => this.client.get('/dashboard/stats/summary'));
  }

  async createProduct(productData: unknown) {
    return this.makeRequest(() => this.client.post('/products', productData));
  }

  async updateProduct(id: string, productData: unknown) {
    return this.makeRequest(() => this.client.put(`/products/${id}`, productData));
  }

  async deleteProduct(id: string) {
    return this.makeRequest(() => this.client.delete(`/products/${id}`));
  }
}

export const apiService = new ApiService();

// Export dashboardService with real API endpoints
export const dashboardService = {
  getDashboardMetrics: () => apiService.getDashboardMetrics(),
  getProducts: (filters?: Record<string, unknown>) => apiService.getProducts(filters),
  getCategoryAnalytics: () => apiService.getCategoryAnalytics(),
  getLocationAnalytics: () => apiService.getLocationAnalytics(),
  getValueTrend: (days?: number) => apiService.getValueTrend(days),
  getRestockAlerts: () => apiService.getRestockAlerts(),
  getSummaryStats: () => apiService.getSummaryStats()
};

