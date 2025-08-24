import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { ecommerceService } from '../services/ecommerceService';
import { api } from '../services/api';
import type { Product, Order, Category, Coupon, EcommerceSettings, EcommerceDashboardStats } from '../types/ecommerce';

interface EcommerceState {
  products: Product[];
  orders: Order[];
  categories: Category[];
  coupons: Coupon[];
  settings: EcommerceSettings | null;
  dashboardStats: EcommerceDashboardStats | null;
  loading: boolean;
  error: string | null;
}

interface EcommerceContextType extends EcommerceState {
  // Product operations
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Order operations
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  
  // Category operations
  createCategory: (category: Omit<Category, 'id' | 'createdAt'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Coupon operations
  createCoupon: (coupon: Omit<Coupon, 'id'>) => Promise<void>;
  updateCoupon: (id: string, updates: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  
  // Settings operations
  updateSettings: (updates: Partial<EcommerceSettings>) => Promise<void>;
  
  // Refresh operations
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshCoupons: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  refreshDashboardStats: () => Promise<void>;
  refreshAll: () => Promise<void>;
  
  // Utility functions
  getProductById: (id: string) => Product | undefined;
  getOrderById: (id: string) => Order | undefined;
  getCategoryById: (id: string) => Category | undefined;
}

type EcommerceAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_COUPONS'; payload: Coupon[] }
  | { type: 'SET_SETTINGS'; payload: EcommerceSettings | null }
  | { type: 'SET_DASHBOARD_STATS'; payload: EcommerceDashboardStats | null }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: { id: string; updates: Partial<Product> } }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'UPDATE_ORDER'; payload: { id: string; updates: Partial<Order> } }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: { id: string; updates: Partial<Category> } }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'ADD_COUPON'; payload: Coupon }
  | { type: 'UPDATE_COUPON'; payload: { id: string; updates: Partial<Coupon> } }
  | { type: 'DELETE_COUPON'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: EcommerceState = {
  products: [],
  orders: [],
  categories: [],
  coupons: [],
  settings: null,
  dashboardStats: null,
  loading: false,
  error: null,
};

const ecommerceReducer = (state: EcommerceState, action: EcommerceAction): EcommerceState => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, loading: false };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload, loading: false };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload, loading: false };
    case 'SET_COUPONS':
      return { ...state, coupons: action.payload, loading: false };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload, loading: false };
    case 'SET_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload, loading: false };
    case 'ADD_PRODUCT':
      return { ...state, products: [action.payload, ...state.products] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? { ...product, ...action.payload.updates } : product
        ),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload),
      };
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? { ...order, ...action.payload.updates } : order
        ),
      };
    case 'ADD_CATEGORY':
      return { ...state, categories: [action.payload, ...state.categories] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id ? { ...category, ...action.payload.updates } : category
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
      };
    case 'ADD_COUPON':
      return { ...state, coupons: [action.payload, ...state.coupons] };
    case 'UPDATE_COUPON':
      return {
        ...state,
        coupons: state.coupons.map(coupon =>
          coupon.id === action.payload.id ? { ...coupon, ...action.payload.updates } : coupon
        ),
      };
    case 'DELETE_COUPON':
      return {
        ...state,
        coupons: state.coupons.filter(coupon => coupon.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const EcommerceContext = createContext<EcommerceContextType | undefined>(undefined);

interface EcommerceProviderProps {
  children: React.ReactNode;
}

export const EcommerceProvider: React.FC<EcommerceProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(ecommerceReducer, initialState);

  // Product operations
  const refreshProducts = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const products = await ecommerceService.getProducts();
      dispatch({ type: 'SET_PRODUCTS', payload: products });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch products' });
    }
  }, []);

  const createProduct = useCallback(async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const product = await ecommerceService.createProduct(productData);
      dispatch({ type: 'ADD_PRODUCT', payload: product });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create product' });
    }
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    try {
      const product = await ecommerceService.updateProduct(id, updates);
      dispatch({ type: 'UPDATE_PRODUCT', payload: { id, updates: product } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update product' });
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await ecommerceService.deleteProduct(id);
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete product' });
    }
  }, []);

  // Order operations
  const refreshOrders = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const orders = await api.getOrders();
      dispatch({ type: 'SET_ORDERS', payload: orders });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch orders' });
    }
  }, []);

  const updateOrderStatus = useCallback(async (id: string, status: Order['status']) => {
    try {
      const order = await ecommerceService.updateOrderStatus(id, status);
      dispatch({ type: 'UPDATE_ORDER', payload: { id, updates: { status } } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update order status' });
    }
  }, []);

  // Category operations
  const refreshCategories = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const categories = await ecommerceService.getCategories();
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch categories' });
    }
  }, []);

  const createCategory = useCallback(async (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    try {
      const category = await ecommerceService.createCategory(categoryData);
      dispatch({ type: 'ADD_CATEGORY', payload: category });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create category' });
    }
  }, []);

  const updateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
    try {
      const category = await ecommerceService.updateCategory(id, updates);
      dispatch({ type: 'UPDATE_CATEGORY', payload: { id, updates: category } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update category' });
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      await ecommerceService.deleteCategory(id);
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete category' });
    }
  }, []);

  // Coupon operations
  const refreshCoupons = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const coupons = await api.getCoupons();
      dispatch({ type: 'SET_COUPONS', payload: coupons });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch coupons' });
    }
  }, []);

  const createCoupon = useCallback(async (couponData: Omit<Coupon, 'id'>) => {
    try {
      // Placeholder for actual implementation
      console.log('Creating coupon:', couponData);
      // In a real implementation, you would call the API
      // const coupon = await api.createCoupon(couponData);
      // dispatch({ type: 'ADD_COUPON', payload: coupon });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create coupon' });
    }
  }, []);

  const updateCoupon = useCallback(async (id: string, updates: Partial<Coupon>) => {
    try {
      // Placeholder for actual implementation
      console.log('Updating coupon:', id, updates);
      // In a real implementation, you would call the API
      // const coupon = await api.updateCoupon(id, updates);
      // dispatch({ type: 'UPDATE_COUPON', payload: { id, updates: coupon } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update coupon' });
    }
  }, []);

  const deleteCoupon = useCallback(async (id: string) => {
    try {
      // Placeholder for actual implementation
      console.log('Deleting coupon:', id);
      // In a real implementation, you would call the API
      // await api.deleteCoupon(id);
      // dispatch({ type: 'DELETE_COUPON', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete coupon' });
    }
  }, []);

  // Settings operations
  const refreshSettings = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const settings = await api.getEcommerceSettings();
      dispatch({ type: 'SET_SETTINGS', payload: settings });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch settings' });
    }
  }, []);

  const updateSettings = useCallback(async (updates: Partial<EcommerceSettings>) => {
    try {
      const settings = await ecommerceService.updateSettings(updates);
      dispatch({ type: 'SET_SETTINGS', payload: settings });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update settings' });
    }
  }, []);

  // Dashboard stats
  const refreshDashboardStats = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const stats = await ecommerceService.getDashboardStats();
      dispatch({ type: 'SET_DASHBOARD_STATS', payload: stats });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch dashboard stats' });
    }
  }, []);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await Promise.all([
        refreshProducts(),
        refreshOrders(),
        refreshCategories(),
        refreshCoupons(),
        refreshSettings(),
        refreshDashboardStats(),
      ]);
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh all data' });
    }
  }, [refreshProducts, refreshOrders, refreshCategories, refreshCoupons, refreshSettings, refreshDashboardStats]);

  // Utility functions
  const getProductById = useCallback(
    (id: string) => state.products.find(product => product.id === id),
    [state.products]
  );

  const getOrderById = useCallback(
    (id: string) => state.orders.find(order => order.id === id),
    [state.orders]
  );

  const getCategoryById = useCallback(
    (id: string) => state.categories.find(category => category.id === id),
    [state.categories]
  );

  const value = useMemo(
    () => ({
      ...state,
      createProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      createCategory,
      updateCategory,
      deleteCategory,
      createCoupon,
      updateCoupon,
      deleteCoupon,
      updateSettings,
      refreshProducts,
      refreshOrders,
      refreshCategories,
      refreshCoupons,
      refreshSettings,
      refreshDashboardStats,
      refreshAll,
      getProductById,
      getOrderById,
      getCategoryById,
    }),
    [
      state,
      createProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      createCategory,
      updateCategory,
      deleteCategory,
      createCoupon,
      updateCoupon,
      deleteCoupon,
      updateSettings,
      refreshProducts,
      refreshOrders,
      refreshCategories,
      refreshCoupons,
      refreshSettings,
      refreshDashboardStats,
      refreshAll,
      getProductById,
      getOrderById,
      getCategoryById,
    ]
  );

  return <EcommerceContext.Provider value={value}>{children}</EcommerceContext.Provider>;
};

export const useEcommerce = (): EcommerceContextType => {
  const context = useContext(EcommerceContext);
  if (!context) {
    throw new Error('useEcommerce must be used within an EcommerceProvider');
  }
  return context;
};