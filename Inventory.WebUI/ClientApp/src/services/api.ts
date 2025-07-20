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

  async getDashboardData() {
    return this.makeRequest(() => this.client.get('/dashboard'));
  }

  async getProducts(filters?: Record<string, unknown>) {
    return this.makeRequest(() => this.client.get('/products', { params: filters }));
  }

  async getAnalytics() {
    return this.makeRequest(() => this.client.get('/analytics'));
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

// Legacy export for backward compatibility
export const dashboardService = {
  getDashboardData: () => apiService.getDashboardData(),
  getProducts: (filters?: Record<string, unknown>) => apiService.getProducts(filters),
  getAnalytics: () => apiService.getAnalytics(),
};

