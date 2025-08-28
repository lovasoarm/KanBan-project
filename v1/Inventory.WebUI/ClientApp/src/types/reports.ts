// Types pour les données de rapports basées sur les données CSV du backend

export interface ReportsOverview {
  totalProfit: number;
  revenue: number;
  sales: number;
  netPurchaseValue: number;
  netSalesValue: number;
  momProfit: number;
  yoyProfit: number;
}

export interface BestCategory {
  category: string;
  turnOver: number;
  increaseBy: string;
}

export interface BestProduct {
  product: string;
  productId: string;
  category: string;
  remainingQuantity: string;
  turnOver: number;
  increaseBy: string;
}

export interface ChartData {
  monthly: {
    labels: string[];
    revenue: number[];
    profit: number[];
  };
  weekly: {
    labels: string[];
    revenue: number[];
    profit: number[];
  };
}

export interface ReportsResponse {
  overview: ReportsOverview;
  bestCategories: BestCategory[];
  bestProducts: BestProduct[];
  chartData: ChartData;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  [key: string]: any;
}

// Types pour les produits CSV
export interface ProductCsvData {
  productId: string;
  productName: string;
  productCategory: string;
  productDescription: string;
  price: number;
  stockQuantity: number;
  warrantyPeriod: number;
  productDimensions: string;
  manufacturingDate: string;
  expirationDate: string;
  sku: string;
  productTags: string;
  colorSizeVariations: string;
  productRatings: number;
}

// Types pour le formatage des données
export interface MetricCardData {
  value: string;
  label: string;
}

export interface FormattedBestCategory {
  category: string;
  turnover: string;
  increaseBy: string;
}

export interface FormattedBestProduct {
  product: string;
  productId: string;
  category: string;
  remainingQuantity: string;
  turnover: string;
  increaseBy: string;
}

// Types pour la gestion d'état
export interface ReportsState {
  data: ReportsResponse | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// Types pour les erreurs API
export interface ApiError {
  message: string;
  status: number;
  details?: string;
}

// Types pour les filtres et paramètres
export interface ReportsFilters {
  period?: 'weekly' | 'monthly' | 'yearly';
  category?: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

// Type pour les hooks de données
export interface UseReportsResult {
  data: ReportsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}
