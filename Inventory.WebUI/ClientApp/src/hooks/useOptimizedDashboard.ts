import { useState, useEffect, useMemo, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';

interface DashboardState {
  data: any;
  isLoading: boolean;
  error: string | null;
}

interface UseOptimizedDashboardReturn extends DashboardState {
  refetch: () => Promise<void>;
  clearCache: () => void;
}


const FALLBACK_DATA = {
  stats: {
    salesOverview: { value: 45231, change: 12.5 },
    revenue: { value: 125000, change: 8.3 },
    profit: { value: 32450, change: 15.2 },
    cost: { value: 92550, change: -2.1 },
    quantityInHand: { value: 2456, change: 5.7 },
    toBeReceived: { value: 156, change: 23.4 },
    // Compatibilité avec l'ancien format
    totalSales: 45231,
    totalOrders: 1563,
    avgOrderValue: 289,
    conversion: 3.2
  },
  purchase: {
    purchase: { value: 32450, change: 7.8 },
    cancel: { value: 245, change: -12.3 },
    return: { value: 89, change: 4.5 },
    // Compatibilité avec l'ancien format
    totalPurchase: 32450,
    totalSuppliers: 45,
    pendingOrders: 23,
    avgLeadTime: 5.2
  },
  summary: {
    numberOfSuppliers: 45,
    numberOfCategories: 24,
    totalProducts: 2456,
    activeProducts: 2344,
    averagePrice: 1250,
    // Compatibilité avec l'ancien format
    lowStock: 45,
    outOfStock: 12,
    categories: 24
  },
  tables: {
    topSellingStock: [
      { 
        id: 1,
        name: 'iPhone 14 Pro', 
        soldQuantity: 245, 
        remainingQuantity: 156, 
        price: 999,
        category: 'Electronics',
        // Compatibilité avec l'ancien format
        sold: 245, 
        remaining: 156, 
        priceFormatted: '$999' 
      },
      { 
        id: 2,
        name: 'Samsung Galaxy S23', 
        soldQuantity: 189, 
        remainingQuantity: 203, 
        price: 899,
        category: 'Electronics',
        // Compatibilité avec l'ancien format
        sold: 189, 
        remaining: 203, 
        priceFormatted: '$899' 
      },
      { 
        id: 3,
        name: 'MacBook Air M2', 
        soldQuantity: 156, 
        remainingQuantity: 89, 
        price: 1299,
        category: 'Computers',
        // Compatibilité avec l'ancien format
        sold: 156, 
        remaining: 89, 
        priceFormatted: '$1299' 
      },
      { 
        id: 4,
        name: 'iPad Pro 11"', 
        soldQuantity: 134, 
        remainingQuantity: 67, 
        price: 799,
        category: 'Tablets',
        // Compatibilité avec l'ancien format
        sold: 134, 
        remaining: 67, 
        priceFormatted: '$799' 
      },
      { 
        id: 5,
        name: 'AirPods Pro', 
        soldQuantity: 298, 
        remainingQuantity: 445, 
        price: 249,
        category: 'Audio',
        // Compatibilité avec l'ancien format
        sold: 298, 
        remaining: 445, 
        priceFormatted: '$249' 
      }
    ],
    lowQuantityStock: [
      { 
        id: 1,
        name: 'iPhone 13', 
        currentStock: 5,
        minStock: 20,
        supplier: 'Apple Inc',
        lastRestock: new Date('2024-01-15'),
        urgency: 'critical' as const,
        // Compatibilité avec l'ancien format
        remaining: 5, 
        image: '/images/products/1.png' 
      },
      { 
        id: 2,
        name: 'Samsung TV 55"', 
        currentStock: 3,
        minStock: 10,
        supplier: 'Samsung Electronics',
        lastRestock: new Date('2024-01-10'),
        urgency: 'critical' as const,
        // Compatibilité avec l'ancien format
        remaining: 3, 
        image: '/images/products/2.png' 
      },
      { 
        id: 3,
        name: 'Dell Laptop', 
        currentStock: 8,
        minStock: 15,
        supplier: 'Dell Technologies',
        lastRestock: new Date('2024-01-20'),
        urgency: 'warning' as const,
        // Compatibilité avec l'ancien format
        remaining: 8, 
        image: '/images/products/3.png' 
      },
      { 
        id: 4,
        name: 'Sony Headphones', 
        currentStock: 2,
        minStock: 12,
        supplier: 'Sony Corporation',
        lastRestock: new Date('2024-01-08'),
        urgency: 'critical' as const,
        // Compatibilité avec l'ancien format
        remaining: 2, 
        image: '/images/products/4.png' 
      },
      { 
        id: 5,
        name: 'Gaming Console', 
        currentStock: 1,
        minStock: 8,
        supplier: 'Gaming Corp',
        lastRestock: new Date('2024-01-05'),
        urgency: 'critical' as const,
        // Compatibilité avec l'ancien format
        remaining: 1, 
        image: '/images/products/5.png' 
      }
    ]
  },
  charts: {
    salesAndPurchase: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      salesData: [150000, 142000, 165000, 155000, 170000, 160000],
      purchaseData: [125000, 115000, 140000, 130000, 145000, 135000]
    },
    orderSummary: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      orderedData: [450, 380, 520, 460, 580, 490],
      deliveredData: [420, 360, 480, 440, 540, 470]
    }
  }
};

export const useOptimizedDashboard = (): UseOptimizedDashboardReturn => {
  const [state, setState] = useState<DashboardState>({
    data: null,
    isLoading: false,
    error: null
  });

  const fetchDashboardData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const data = await dashboardService.getDashboardData();
      // Geler les données pour éviter les mutations accidentelles
      const frozenData = JSON.parse(JSON.stringify(data || FALLBACK_DATA));
      setState({
        data: frozenData,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      const frozenFallback = JSON.parse(JSON.stringify(FALLBACK_DATA));
      setState({
        data: frozenFallback,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }, []);

  const clearCache = useCallback(() => {
    dashboardService.clearCache();
  }, []);

  // Chargement initial des données
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Mémoriser les valeurs pour éviter les re-rendus inutiles
  const memoizedReturn = useMemo<UseOptimizedDashboardReturn>(() => ({
    ...state,
    refetch: fetchDashboardData,
    clearCache
  }), [state, fetchDashboardData, clearCache]);

  return memoizedReturn;
};
