import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { 
  ReportsResponse, 
  ApiResponse,
  ReportsOverview,
  BestCategory,
  BestProduct,
  ChartData 
} from '../types/reports';

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

  async getProducts(filters?: Record<string, unknown>) {
    return this.makeRequest(() => this.client.get('/products', { params: filters }));
  }

  async createProduct(productData: unknown) {
    return this.makeRequest(() => this.client.post('/products', productData));
  }

  async getReportsData(): Promise<ApiResponse<ReportsResponse>> {
    return this.makeRequest<ApiResponse<ReportsResponse>>(() => this.client.get('/reports'));
  }

  async getOverviewMetrics(): Promise<ApiResponse<ReportsOverview>> {
    return this.makeRequest<ApiResponse<ReportsOverview>>(() => this.client.get('/reports/overview'));
  }

  async getBestSellingCategories(): Promise<ApiResponse<BestCategory[]>> {
    return this.makeRequest<ApiResponse<BestCategory[]>>(() => this.client.get('/reports/categories/best-selling'));
  }

  async getBestSellingProducts(): Promise<ApiResponse<BestProduct[]>> {
    return this.makeRequest<ApiResponse<BestProduct[]>>(() => this.client.get('/reports/products/best-selling'));
  }

  async getChartData(period: 'weekly' | 'monthly' = 'monthly'): Promise<ApiResponse<ChartData>> {
    return this.makeRequest<ApiResponse<ChartData>>(() => this.client.get('/reports/chart-data', { params: { period } }));
  }
}

export const apiService = new ApiService();
export type { ApiError };

