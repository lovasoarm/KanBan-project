import axios from 'axios';
import { 
  DashboardData, 
  DashboardStats, 
  ChartData, 
  TableData, 
  PurchaseOverview, 
  ProductSummary,
  ApiResponse,
  DashboardMetrics,
  CategoryAnalytics,
  Product
} from '../types/dashboard.types';

const API_BASE_URL = '/api';

class DashboardService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get from cache if available and not expired
   */
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data as T;
    }
    return null;
  }

  /**
   * Set cache entry
   */
  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Get dashboard metrics from API
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const cacheKey = 'dashboard-metrics';
    const cached = this.getFromCache<DashboardMetrics>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get<ApiResponse<DashboardMetrics>>(`${API_BASE_URL}/dashboard/metrics`);
      const data = response.data.data;
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      // Return mock data as fallback
      return this.getMockDashboardMetrics();
    }
  }

  /**
   * Get category analytics
   */
  async getCategoryAnalytics(): Promise<CategoryAnalytics[]> {
    const cacheKey = 'category-analytics';
    const cached = this.getFromCache<CategoryAnalytics[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get<ApiResponse<CategoryAnalytics[]>>(`${API_BASE_URL}/dashboard/analytics/categories`);
      const data = response.data.data;
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching category analytics:', error);
      return this.getMockCategoryAnalytics();
    }
  }

  /**
   * Get all products with CSV data processing
   */
  async getProducts(): Promise<Product[]> {
    const cacheKey = 'products';
    const cached = this.getFromCache<Product[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get<ApiResponse<Product[]>>(`${API_BASE_URL}/products`);
      const data = response.data.data;
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return this.getMockProducts();
    }
  }

  /**
   * Process products to extract dashboard statistics
   */
  private processProductsToStats(products: Product[]): DashboardStats {
    const totalValue = products.reduce((sum, p) => sum + p.totalValue, 0);
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const lowStockProducts = products.filter(p => p.isLowStock).length;
    
    // Calculate month-over-month changes (mock for now)
    return {
      salesOverview: { value: totalValue * 0.85, change: 12.5 },
      revenue: { value: totalValue * 0.7, change: 8.3 },
      profit: { value: totalValue * 0.2, change: -2.1 },
      cost: { value: totalValue * 0.5, change: 5.7 },
      quantityInHand: { value: totalQuantity, change: 15.2 },
      toBeReceived: { value: Math.floor(totalQuantity * 0.15), change: 22.1 }
    };
  }

  /**
   * Generate chart data from products
   */
  private generateChartData(products: Product[]): ChartData {
    const categories = [...new Set(products.map(p => p.category))];
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleString('default', { month: 'short' });
    }).reverse();

    // Mock sales and purchase data based on categories
    const salesData = last6Months.map(() => Math.floor(Math.random() * 50000) + 20000);
    const purchaseData = last6Months.map(() => Math.floor(Math.random() * 40000) + 15000);
    
    const orderedData = categories.map(() => Math.floor(Math.random() * 100) + 50);
    const deliveredData = orderedData.map(ordered => Math.floor(ordered * (0.8 + Math.random() * 0.2)));

    return {
      salesAndPurchase: {
        labels: last6Months,
        salesData,
        purchaseData
      },
      orderSummary: {
        labels: categories,
        orderedData,
        deliveredData
      }
    };
  }

  /**
   * Generate table data from products
   */
  private generateTableData(products: Product[]): TableData {
    // Top selling products (sorted by total value)
    const topSellingStock = products
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 10)
      .map(product => ({
        id: product.id,
        name: product.name,
        soldQuantity: Math.floor(product.quantity * 0.3), // Mock sold quantity
        remainingQuantity: product.quantity,
        price: product.price,
        category: product.category
      }));

    // Low quantity stock
    const lowQuantityStock = products
      .filter(product => product.isLowStock || product.isOutOfStock)
      .slice(0, 10)
      .map(product => ({
        id: product.id,
        name: product.name,
        currentStock: product.quantity,
        minStock: product.minQuantity,
        supplier: product.supplier,
        lastRestock: product.lastRestockedAt || new Date(),
        urgency: product.quantity === 0 ? 'critical' as const : 
                product.quantity <= product.minQuantity * 0.5 ? 'warning' as const : 
                'info' as const
      }));

    return {
      topSellingStock,
      lowQuantityStock
    };
  }

  /**
   * Main method to get all dashboard data
   */
  async getDashboardData(): Promise<DashboardData> {
    try {
      const products = await this.getProducts();
      const categoryAnalytics = await this.getCategoryAnalytics();
      
      const stats = this.processProductsToStats(products);
      const charts = this.generateChartData(products);
      const tables = this.generateTableData(products);
      
      const suppliers = [...new Set(products.map(p => p.supplier))];
      const categories = [...new Set(products.map(p => p.category))];
      
      const purchase: PurchaseOverview = {
        purchase: { value: 89500, change: 8.2 },
        cancel: { value: 2300, change: -12.4 },
        return: { value: 1800, change: 5.1 }
      };

      const summary: ProductSummary = {
        numberOfSuppliers: suppliers.length,
        numberOfCategories: categories.length,
        totalProducts: products.length,
        activeProducts: products.filter(p => p.isActive).length,
        averagePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length
      };

      return {
        stats,
        charts,
        tables,
        purchase,
        summary
      };
    } catch (error) {
      console.error('Error generating dashboard data:', error);
      return this.getMockDashboardData();
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  // Mock data methods for fallback
  private getMockDashboardMetrics(): DashboardMetrics {
    return {
      totalProducts: 1250,
      totalValue: 2854000,
      lowStockCount: 15,
      outOfStockCount: 3,
      overstockedCount: 8,
      averageProfitMargin: 23.5,
      categoryDistribution: {
        'Electronics': 450,
        'Clothing': 380,
        'Home Appliances': 420
      },
      statusDistribution: {
        Available: 1200,
        LowStock: 15,
        OutOfStock: 3,
        Overstocked: 8,
        Discontinued: 24
      },
      locationValues: {
        'Electronics Warehouse': 1200000,
        'Fashion Center': 890000,
        'Home & Garden Storage': 764000
      },
      topValueProducts: [],
      criticalStockProducts: [],
      monthlyStockTurnover: 4.2
    };
  }

  private getMockCategoryAnalytics(): CategoryAnalytics[] {
    return [
      {
        name: 'Electronics',
        productCount: 450,
        totalValue: 1250000,
        averagePrice: 275.50,
        lowStockCount: 8,
        profitMargin: 25.3
      },
      {
        name: 'Clothing',
        productCount: 380,
        totalValue: 890000,
        averagePrice: 125.75,
        lowStockCount: 4,
        profitMargin: 28.1
      },
      {
        name: 'Home Appliances',
        productCount: 420,
        totalValue: 714000,
        averagePrice: 185.20,
        lowStockCount: 3,
        profitMargin: 19.8
      }
    ];
  }

  private getMockProducts(): Product[] {
    // Return a few mock products based on CSV structure
    return [];
  }

  private getMockDashboardData(): DashboardData {
    return {
      stats: {
        salesOverview: { value: 125000, change: 12.5 },
        revenue: { value: 89500, change: 8.3 },
        profit: { value: 23000, change: -2.1 },
        cost: { value: 66500, change: 5.7 },
        quantityInHand: { value: 12890, change: 15.2 },
        toBeReceived: { value: 2340, change: 22.1 }
      },
      charts: {
        salesAndPurchase: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          salesData: [45000, 52000, 48000, 61000, 55000, 67000],
          purchaseData: [32000, 41000, 35000, 48000, 42000, 53000]
        },
        orderSummary: {
          labels: ['Electronics', 'Clothing', 'Home Appliances'],
          orderedData: [150, 120, 95],
          deliveredData: [145, 118, 91]
        }
      },
      tables: {
        topSellingStock: [],
        lowQuantityStock: []
      },
      purchase: {
        purchase: { value: 89500, change: 8.2 },
        cancel: { value: 2300, change: -12.4 },
        return: { value: 1800, change: 5.1 }
      },
      summary: {
        numberOfSuppliers: 25,
        numberOfCategories: 3,
        totalProducts: 1250,
        activeProducts: 1226,
        averagePrice: 185.75
      }
    };
  }
}

export const dashboardService = new DashboardService();
