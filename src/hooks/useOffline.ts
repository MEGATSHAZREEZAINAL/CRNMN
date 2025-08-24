import { useState, useEffect, useCallback } from 'react';
import { offlineStorage } from '../services/offlineStorage';
import type { Sale, InventoryItem, Customer, Invoice, Project, ScheduledPost } from '../types';
import type { Product, Order, Category, Coupon, EcommerceSettings } from '../types/ecommerce';

interface OfflineState {
  isOnline: boolean;
  hasOfflineData: boolean;
  lastSync: Date | null;
  syncInProgress: boolean;
  syncError: string | null;
}

export const useOffline = () => {
  const [state, setState] = useState<OfflineState>({
    isOnline: navigator.onLine,
    hasOfflineData: false,
    lastSync: null,
    syncInProgress: false,
    syncError: null,
  });

  // Initialize offline storage and check for existing data
  useEffect(() => {
    const initOfflineStorage = async () => {
      try {
        await offlineStorage.init();
        const lastSyncTimestamp = await offlineStorage.getLastSync();
        const hasData = lastSyncTimestamp > 0;

        setState((prev) => ({
          ...prev,
          hasOfflineData: hasData,
          lastSync: hasData ? new Date(lastSyncTimestamp) : null,
        }));
      } catch (error: unknown) {
        console.error('Failed to initialize offline storage:', error);
      }
    };

    initOfflineStorage();
  }, []);

  // Listen to online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setState((prev) => ({ ...prev, isOnline: true, syncError: null }));
    };

    const handleOffline = () => {
      setState((prev) => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save data to offline storage
  type OfflineData = Partial<{
    sales: Sale[];
    inventory: InventoryItem[];
    customers: Customer[];
    invoices: Invoice[];
    projects: Project[];
    scheduledPosts: ScheduledPost[];
    products: Product[];
    orders: Order[];
    categories: Category[];
    coupons: Coupon[];
    ecommerceSettings: EcommerceSettings;
    aiInsights: { prompt: string; response: string; timestamp: number }[];
    lastSync: number;
  }>;

  const saveToOffline = useCallback(async (data: OfflineData) => {
    try {
      await offlineStorage.saveAllData(data);
      await offlineStorage.setLastSync(Date.now());

      setState((prev) => ({
        ...prev,
        hasOfflineData: true,
        lastSync: new Date(),
      }));
    } catch (error: unknown) {
      console.error('Failed to save offline data:', error);
      setState((prev) => ({
        ...prev,
        syncError: 'Failed to save data offline',
      }));
    }
  }, []);

  // Load data from offline storage
  const loadFromOffline = useCallback(async () => {
    try {
      return await offlineStorage.getAllData();
    } catch (error: unknown) {
      console.error('Failed to load offline data:', error);
      setState((prev) => ({
        ...prev,
        syncError: 'Failed to load offline data',
      }));
      return null;
    }
  }, []);

  // Sync with remote server using Firestore batch
  const syncWithServer = useCallback(async () => {
    setState((prev) => ({ ...prev, syncInProgress: true, syncError: null }));

    try {
      const { api } = await import('../services/api');
      const result = await api.syncToServer();
      if (!result.success) throw new Error(result.message);
      await offlineStorage.setLastSync(Date.now());
      setState((prev) => ({
        ...prev,
        syncInProgress: false,
        lastSync: new Date(),
      }));
    } catch (error: unknown) {
      console.error('Sync failed:', error);
      setState((prev) => ({
        ...prev,
        syncInProgress: false,
        syncError: 'Sync failed. Will retry automatically.',
      }));
    }
  }, []);

  // Auto-sync when coming online
  useEffect(() => {
    if (state.isOnline && state.hasOfflineData && !state.syncInProgress) {
      // Auto-sync after 5 seconds of being online
      const syncTimeout = setTimeout(() => {
        syncWithServer();
      }, 5000);

      return () => clearTimeout(syncTimeout);
    }
  }, [state.isOnline, state.hasOfflineData, state.syncInProgress, syncWithServer]);

  // Clear offline data
  const clearOfflineData = useCallback(async () => {
    try {
      await offlineStorage.clearAllData();
      setState((prev) => ({
        ...prev,
        hasOfflineData: false,
        lastSync: null,
      }));
    } catch (error: unknown) {
      console.error('Failed to clear offline data:', error);
    }
  }, []);

  return {
    ...state,
    saveToOffline,
    loadFromOffline,
    syncWithServer,
    clearOfflineData,
    // Utility methods
    canUseApp: state.isOnline || state.hasOfflineData,
    needsSync: state.hasOfflineData && state.isOnline && !state.syncInProgress,
    offlineStorage, // Expose for direct access if needed
  };
};
