import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/api';

export interface CategoryData {
  category: string;
  count: number;
}

export interface StatusData {
  status: string;
  count: number;
}

export interface MonthlyTrend {
  month: string;
  value: number;
}

export interface DashboardData {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
  categoryData: CategoryData[];
  statusData: StatusData[];
  monthlyTrends: MonthlyTrend[];
}

export interface UseDashboardResult {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboard = (): UseDashboardResult => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await dashboardService.getDashboardData();
      
      // Mock data if no real data is available
      const mockData: DashboardData = {
        totalProducts: result?.totalProducts || 1247,
        lowStockItems: result?.lowStockItems || 23,
        outOfStockItems: result?.outOfStockItems || 8,
        totalValue: result?.totalValue || 89750,
        categoryData: result?.categoryData || [
          { category: 'Electronics', count: 45 },
          { category: 'Furniture', count: 32 },
          { category: 'Clothing', count: 28 },
          { category: 'Books', count: 15 },
          { category: 'Sports', count: 12 }
        ],
        statusData: result?.statusData || [
          { status: 'In Stock', count: 156 },
          { status: 'Low Stock', count: 23 },
          { status: 'Out of Stock', count: 8 },
          { status: 'On Order', count: 45 }
        ],
        monthlyTrends: result?.monthlyTrends || [
          { month: 'Jan', value: 65000 },
          { month: 'Feb', value: 72000 },
          { month: 'Mar', value: 68000 },
          { month: 'Apr', value: 75000 },
          { month: 'May', value: 82000 },
          { month: 'Jun', value: 89750 }
        ]
      };
      
      setData(mockData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(errorMessage);
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData
  };
};
