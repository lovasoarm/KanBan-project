import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  Product,
  DashboardData,
  ProductStatus,
} from "../types/dashboard.types";

type InventoryAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_DASHBOARD_DATA"; payload: DashboardData }
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: number }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_FILTERS"; payload: InventoryFilters }
  | { type: "CLEAR_FILTERS" }
  | { type: "SET_SELECTED_CATEGORY"; payload: string }
  | { type: "SET_SEARCH_QUERY"; payload: string };

export interface InventoryFilters {
  category?: string;
  status?: ProductStatus;
  priceMin?: number;
  priceMax?: number;
  lowStockOnly?: boolean;
  outOfStockOnly?: boolean;
  supplier?: string;
  location?: string;
  searchQuery?: string;
}

interface InventoryState {
  loading: boolean;
  dashboardData: DashboardData | null;
  products: Product[];
  error: string | null;
  filters: InventoryFilters;
  selectedCategory: string | null;
  searchQuery: string;
  lastUpdated: Date | null;
}

const initialState: InventoryState = {
  loading: false,
  dashboardData: null,
  products: [],
  error: null,
  filters: {},
  selectedCategory: null,
  searchQuery: "",
  lastUpdated: null,
};

function inventoryReducer(
  state: InventoryState,
  action: InventoryAction
): InventoryState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_DASHBOARD_DATA":
      return {
        ...state,
        dashboardData: action.payload,
        lastUpdated: new Date(),
        error: null,
      };

    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.payload,
        lastUpdated: new Date(),
        error: null,
      };

    case "ADD_PRODUCT":
      return {
        ...state,
        products: [...state.products, action.payload],
        lastUpdated: new Date(),
      };

    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
        lastUpdated: new Date(),
      };

    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
        lastUpdated: new Date(),
      };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case "CLEAR_FILTERS":
      return { ...state, filters: {}, searchQuery: "" };

    case "SET_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.payload };

    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };

    default:
      return state;
  }
}

interface InventoryContextType {
  state: InventoryState;
  dispatch: React.Dispatch<InventoryAction>;

  setLoading: (loading: boolean) => void;
  setDashboardData: (data: DashboardData) => void;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: InventoryFilters) => void;
  clearFilters: () => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;

  getFilteredProducts: () => Product[];
  getProductsByCategory: () => Record<string, Product[]>;
  getProductsByStatus: () => Record<ProductStatus, Product[]>;
  getLowStockProducts: () => Product[];
  getOutOfStockProducts: () => Product[];
  getTotalValue: () => number;
  getCategoryStats: () => Array<{
    category: string;
    count: number;
    value: number;
  }>;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

interface InventoryProviderProps {
  children: ReactNode;
}

export const InventoryProvider: React.FC<InventoryProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(inventoryReducer, initialState);

  const setLoading = (loading: boolean) =>
    dispatch({ type: "SET_LOADING", payload: loading });
  const setDashboardData = (data: DashboardData) =>
    dispatch({ type: "SET_DASHBOARD_DATA", payload: data });
  const setProducts = (products: Product[]) =>
    dispatch({ type: "SET_PRODUCTS", payload: products });
  const addProduct = (product: Product) =>
    dispatch({ type: "ADD_PRODUCT", payload: product });
  const updateProduct = (product: Product) =>
    dispatch({ type: "UPDATE_PRODUCT", payload: product });
  const deleteProduct = (id: number) =>
    dispatch({ type: "DELETE_PRODUCT", payload: id });
  const setError = (error: string | null) =>
    dispatch({ type: "SET_ERROR", payload: error });
  const setFilters = (filters: InventoryFilters) =>
    dispatch({ type: "SET_FILTERS", payload: filters });
  const clearFilters = () => dispatch({ type: "CLEAR_FILTERS" });
  const setSelectedCategory = (category: string) =>
    dispatch({ type: "SET_SELECTED_CATEGORY", payload: category });
  const setSearchQuery = (query: string) =>
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });

  const getFilteredProducts = (): Product[] => {
    let filtered = state.products;
    const { filters, searchQuery } = state;

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    if (filters.status) {
      filtered = filtered.filter((p) => p.status === filters.status);
    }

    if (filters.priceMin !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.priceMin!);
    }
    if (filters.priceMax !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.priceMax!);
    }

    if (filters.lowStockOnly) {
      filtered = filtered.filter((p) => p.isLowStock);
    }

    if (filters.outOfStockOnly) {
      filtered = filtered.filter((p) => p.isOutOfStock);
    }

    if (filters.supplier) {
      filtered = filtered.filter((p) => p.supplier === filters.supplier);
    }

    if (filters.location) {
      filtered = filtered.filter((p) => p.location === filters.location);
    }

    return filtered;
  };

  const getProductsByCategory = (): Record<string, Product[]> => {
    return state.products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  };

  const getProductsByStatus = (): Record<ProductStatus, Product[]> => {
    return state.products.reduce((acc, product) => {
      if (!acc[product.status]) {
        acc[product.status] = [];
      }
      acc[product.status].push(product);
      return acc;
    }, {} as Record<ProductStatus, Product[]>);
  };

  const getLowStockProducts = (): Product[] => {
    return state.products.filter((p) => p.isLowStock);
  };

  const getOutOfStockProducts = (): Product[] => {
    return state.products.filter((p) => p.isOutOfStock);
  };

  const getTotalValue = (): number => {
    return state.products.reduce(
      (total, product) => total + product.totalValue,
      0
    );
  };

  const getCategoryStats = (): Array<{
    category: string;
    count: number;
    value: number;
  }> => {
    const categoryData = getProductsByCategory();
    return Object.entries(categoryData).map(([category, products]) => ({
      category,
      count: products.length,
      value: products.reduce((total, p) => total + p.totalValue, 0),
    }));
  };

  const value: InventoryContextType = {
    state,
    dispatch,
    setLoading,
    setDashboardData,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setError,
    setFilters,
    clearFilters,
    setSelectedCategory,
    setSearchQuery,
    getFilteredProducts,
    getProductsByCategory,
    getProductsByStatus,
    getLowStockProducts,
    getOutOfStockProducts,
    getTotalValue,
    getCategoryStats,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};

export default InventoryContext;

