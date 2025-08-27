import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export interface Product {
  id: string;
  name: string;
  buyingPrice: number;
  quantity: number;
  thresholdValue: number;
  expiryDate: string;
  availability: 'In Stock' | 'Out of Stock' | 'Low Stock';
  category: string;
  supplier?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMetrics {
  categories: {
    value: number;
    lastDays: number;
  };
  totalProducts: {
    value: number;
    lastDays: number;
    revenue: number;
    revenueUnit: string;
  };
  topSelling: {
    value: number;
    lastDays: number;
    cost: number;
    costUnit: string;
  };
  lowStock: {
    value: number;
    lastDays: number;
    notInStock: number;
    notInStockUnit: string;
  };
}

interface UseInventoryParams {
  page?: number;
  size?: number;
  filters?: {
    category?: string;
    availability?: string;
    priceRange?: { min?: number; max?: number };
    quantityRange?: { min?: number; max?: number };
  };
  search?: string;
}

interface UseInventoryResult {
  products: Product[];
  inventoryMetrics: InventoryMetrics | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  totalItems: number;
  refetch: () => Promise<void>;
}

const defaultMetrics: InventoryMetrics = {
  categories: {
    value: 14,
    lastDays: 30
  },
  totalProducts: {
    value: 868,
    lastDays: 30,
    revenue: 25000,
    revenueUnit: '₹'
  },
  topSelling: {
    value: 5,
    lastDays: 7,
    cost: 2500,
    costUnit: '₹'
  },
  lowStock: {
    value: 12,
    lastDays: 7,
    notInStock: 2,
    notInStockUnit: 'products'
  }
};

export const useInventory = (params: UseInventoryParams = {}): UseInventoryResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [inventoryMetrics, setInventoryMetrics] = useState<InventoryMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const {
    page = 1,
    size = 10,
    filters = {},
    search = ''
  } = params;

  const fetchInventoryData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Construct query parameters
      const queryParams: Record<string, any> = {
        page,
        size,
        ...filters
      };

      if (search) {
        queryParams.search = search;
      }

      // Fetch products and metrics in parallel
      const [productsResult, metricsResult, categoriesResult] = await Promise.all([
        apiService.getProducts(queryParams).catch(() => null),
        apiService.getDashboardMetrics().catch(() => null),
        apiService.getCategoryAnalytics().catch(() => null)
      ]);

      // Process products data
      let processedProducts: Product[] = [];
      let totalPagesCount = 1;
      let totalItemsCount = 0;

      if (productsResult) {
        // The API returns an ApiResponse<T> with shape: { success, message, data, metadata }
        const api = productsResult as any;
        const list: any[] = Array.isArray(api?.data) ? api.data : [];

        processedProducts = list.map((product: any) => ({
          id: product.id,
          name: product.name || 'Unknown Product',
          buyingPrice: product.price || product.buyingPrice || 0,
          quantity: product.quantity || 0,
          thresholdValue: product.minQuantity || product.thresholdValue || 10,
          expiryDate: product.expiryDate ? new Date(product.expiryDate).toLocaleDateString('en-GB') : 'N/A',
          availability: getAvailabilityStatus(product.quantity || 0, product.minQuantity || 10, product.isActive),
          category: product.category || 'Uncategorized',
          supplier: product.supplier,
          isActive: product.isActive !== false,
          createdAt: product.createdAt || new Date().toISOString(),
          updatedAt: product.updatedAt || new Date().toISOString()
        }));

        const totalCount = api?.metadata?.TotalCount ?? api?.metadata?.totalCount ?? processedProducts.length;
        const pageSizeUsed = api?.metadata?.PageSize ?? api?.metadata?.pageSize ?? size;
        totalPagesCount = Math.max(1, Math.ceil(totalCount / pageSizeUsed));
        totalItemsCount = totalCount;
      }

      // Process metrics data
      const metrics = metricsResult?.data;
      const categories = categoriesResult?.data || [];

      const processedMetrics: InventoryMetrics = {
        categories: {
          value: Array.isArray(categories) ? categories.length : defaultMetrics.categories.value,
          lastDays: 30
        },
        totalProducts: {
          value: metrics?.TotalProducts || processedProducts.length || defaultMetrics.totalProducts.value,
          lastDays: 30,
          revenue: metrics?.TotalValue || defaultMetrics.totalProducts.revenue,
          revenueUnit: '₹'
        },
        topSelling: {
          value: processedProducts.filter(p => p.quantity < p.thresholdValue).length || defaultMetrics.topSelling.value,
          lastDays: 7,
          cost: Math.round((metrics?.TotalValue || 0) * 0.3) || defaultMetrics.topSelling.cost,
          costUnit: '₹'
        },
        lowStock: {
          value: metrics?.LowStockCount || processedProducts.filter(p => p.availability === 'Low Stock').length || defaultMetrics.lowStock.value,
          lastDays: 7,
          notInStock: metrics?.OutOfStockCount || processedProducts.filter(p => p.availability === 'Out of Stock').length || defaultMetrics.lowStock.notInStock,
          notInStockUnit: 'products'
        }
      };

      setProducts(processedProducts);
      setInventoryMetrics(processedMetrics);
      setTotalPages(totalPagesCount);
      setTotalItems(totalItemsCount);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load inventory data';
      setError(errorMessage);
      
      // Set fallback data on error
      setInventoryMetrics(defaultMetrics);
      setProducts([]);
      
      console.error('Inventory fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, size, JSON.stringify(filters), search]);

  useEffect(() => {
    fetchInventoryData();
  }, [fetchInventoryData]);

  return {
    products,
    inventoryMetrics,
    loading,
    error,
    totalPages,
    totalItems,
    refetch: fetchInventoryData
  };
};

function getAvailabilityStatus(quantity: number, minQuantity: number, isActive: boolean): 'In Stock' | 'Out of Stock' | 'Low Stock' {
  if (!isActive || quantity === 0) return 'Out of Stock';
  if (quantity <= minQuantity) return 'Low Stock';
  return 'In Stock';
}
