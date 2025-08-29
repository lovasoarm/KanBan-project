export interface DashboardStats {
  sales: StatValue;
  revenue: StatValue;
  profit: StatValue;
  cost: StatValue;
  quantityInHand: StatValue;
  toBeReceived: StatValue;
}

export interface StatValue {
  value: number;
  change: number;
}

export interface ChartData {
  salesAndPurchase: {
    labels: string[];
    salesData: number[];
    purchaseData: number[];
  };
  orderSummary: {
    labels: string[];
    orderedData: number[];
    deliveredData: number[];
  };
}

export interface TableData {
  topSellingStock: TopSellingProduct[];
  lowQuantityStock: LowStockProduct[];
}

export interface TopSellingProduct {
  id: number;
  name: string;
  soldQuantity: number;
  remainingQuantity: number;
  price: number;
  category: string;
  image?: string;
}

export interface LowStockProduct {
  id: number;
  name: string;
  image?: string;
  remaining: number;
  currentStock: number;
  minStock: number;
  supplier: string;
  lastRestock: Date;
  urgency: 'critical' | 'warning' | 'info';
}

export interface PurchaseOverview {
  purchase: StatValue;
  cost: StatValue;
  cancel: StatValue;
  return: StatValue;
}

export interface ProductSummary {
  numberOfSuppliers: number;
  numberOfCategories: number;
  totalProducts: number;
  activeProducts: number;
  averagePrice: number;
}

export interface DashboardData {
  stats: DashboardStats;
  charts: ChartData;
  tables: TableData;
  purchase: PurchaseOverview;
  summary: ProductSummary;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  metadata?: Record<string, any>;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  brand: string;
  model: string;
  price: number;
  cost: number;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  category: string;
  subCategory: string;
  supplier: string;
  location: string;
  barcode: string;
  unit: string;
  weight: number;
  weightUnit: string;
  createdAt: Date;
  updatedAt?: Date;
  lastRestockedAt?: Date;
  isActive: boolean;
  isOutOfStock: boolean;
  isLowStock: boolean;
  isOverstocked: boolean;
  totalValue: number;
  profitMargin: number;
  status: ProductStatus;
  sustainabilityScore: string;
}

export enum ProductStatus {
  Available = 'Available',
  LowStock = 'LowStock',
  OutOfStock = 'OutOfStock',
  Overstocked = 'Overstocked',
  Discontinued = 'Discontinued'
}

export interface DashboardMetrics {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  overstockedCount: number;
  averageProfitMargin: number;
  categoryDistribution: Record<string, number>;
  statusDistribution: Record<ProductStatus, number>;
  locationValues: Record<string, number>;
  topValueProducts: Product[];
  criticalStockProducts: Product[];
  monthlyStockTurnover: number;
}

export interface CategoryAnalytics {
  name: string;
  productCount: number;
  totalValue: number;
  averagePrice: number;
  lowStockCount: number;
  profitMargin: number;
}

export interface LocationAnalytics {
  name: string;
  productCount: number;
  totalValue: number;
  capacity: number;
  utilizationRate: number;
}

