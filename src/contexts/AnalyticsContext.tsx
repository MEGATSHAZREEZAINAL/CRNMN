import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { analyticsService } from '../services/analytics';
import type {
  RevenueAnalytics,
  SalesAnalytics,
  InventoryAnalytics,
  CustomerAnalytics,
  BusinessInsights,
} from '../services/analytics';

interface AnalyticsState {
  revenueData: RevenueAnalytics | null;
  salesData: SalesAnalytics | null;
  inventoryData: InventoryAnalytics | null;
  customerData: CustomerAnalytics | null;
  insights: BusinessInsights | null;
  loading: boolean;
  error: string | null;
}

interface AnalyticsContextType extends AnalyticsState {
  refreshAll: () => Promise<void>;
  refreshSection: (
    section: 'revenue' | 'sales' | 'inventory' | 'customers' | 'insights'
  ) => Promise<void>;
  getKpiSummary: () => {
    totalRevenue: number;
    totalSales: number;
    profitMargin: number;
    customerCount: number;
  };
}

type AnalyticsAction =
  | { type: 'SET_REVENUE_DATA'; payload: RevenueAnalytics }
  | { type: 'SET_SALES_DATA'; payload: SalesAnalytics }
  | { type: 'SET_INVENTORY_DATA'; payload: InventoryAnalytics }
  | { type: 'SET_CUSTOMER_DATA'; payload: CustomerAnalytics }
  | { type: 'SET_INSIGHTS'; payload: BusinessInsights }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AnalyticsState = {
  revenueData: null,
  salesData: null,
  inventoryData: null,
  customerData: null,
  insights: null,
  loading: false,
  error: null,
};

const analyticsReducer = (state: AnalyticsState, action: AnalyticsAction): AnalyticsState => {
  switch (action.type) {
    case 'SET_REVENUE_DATA':
      return { ...state, revenueData: action.payload };
    case 'SET_SALES_DATA':
      return { ...state, salesData: action.payload };
    case 'SET_INVENTORY_DATA':
      return { ...state, inventoryData: action.payload };
    case 'SET_CUSTOMER_DATA':
      return { ...state, customerData: action.payload };
    case 'SET_INSIGHTS':
      return { ...state, insights: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(analyticsReducer, initialState);

  const refreshAll = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Fetch all analytics data in parallel
      const [
        revenueData,
        salesData,
        inventoryData,
        customerData,
        insights,
      ] = await Promise.all([
        analyticsService.getRevenueAnalytics(),
        analyticsService.getSalesAnalytics(),
        analyticsService.getInventoryAnalytics(),
        analyticsService.getCustomerAnalytics(),
        analyticsService.getBusinessInsights(),
      ]);

      dispatch({ type: 'SET_REVENUE_DATA', payload: revenueData });
      dispatch({ type: 'SET_SALES_DATA', payload: salesData });
      dispatch({ type: 'SET_INVENTORY_DATA', payload: inventoryData });
      dispatch({ type: 'SET_CUSTOMER_DATA', payload: customerData });
      dispatch({ type: 'SET_INSIGHTS', payload: insights });
      
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch analytics data' });
    }
  }, []);

  const refreshSection = useCallback(
    async (section: 'revenue' | 'sales' | 'inventory' | 'customers' | 'insights') => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        switch (section) {
          case 'revenue':
            const revenueData = await analyticsService.getRevenueAnalytics();
            dispatch({ type: 'SET_REVENUE_DATA', payload: revenueData });
            break;
          case 'sales':
            const salesData = await analyticsService.getSalesAnalytics();
            dispatch({ type: 'SET_SALES_DATA', payload: salesData });
            break;
          case 'inventory':
            const inventoryData = await analyticsService.getInventoryAnalytics();
            dispatch({ type: 'SET_INVENTORY_DATA', payload: inventoryData });
            break;
          case 'customers':
            const customerData = await analyticsService.getCustomerAnalytics();
            dispatch({ type: 'SET_CUSTOMER_DATA', payload: customerData });
            break;
          case 'insights':
            const insights = await analyticsService.getBusinessInsights();
            dispatch({ type: 'SET_INSIGHTS', payload: insights });
            break;
        }
        
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: `Failed to fetch ${section} data` });
      }
    },
    []
  );

  const getKpiSummary = useCallback(() => {
    return {
      totalRevenue: state.revenueData?.totalRevenue || 0,
      totalSales: state.salesData?.totalSales || 0,
      profitMargin: state.insights?.profitMargin || 0,
      customerCount: state.customerData?.totalCustomers || 0,
    };
  }, [state.revenueData, state.salesData, state.insights, state.customerData]);

  const value = useMemo(
    () => ({
      ...state,
      refreshAll,
      refreshSection,
      getKpiSummary,
    }),
    [state, refreshAll, refreshSection, getKpiSummary]
  );

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};