import React, { createContext, useContext, useReducer, useCallback, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { offlineStorage } from '../services/offlineStorage';

interface DataSyncState {
  isOnline: boolean;
  lastSync: Date | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  error: string | null;
  offlineDataCount: number;
  syncProgress: number; // 0-100
}

interface DataSyncContextType extends DataSyncState {
  syncToServer: () => Promise<void>;
  syncFromServer: () => Promise<void>;
  getOfflineData: () => Promise<any>;
  clearOfflineData: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  getSyncHistory: () => Promise<{ timestamp: Date; success: boolean; records: number }[]>;
}

type DataSyncAction =
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'SET_SYNC_STATUS'; payload: 'idle' | 'syncing' | 'success' | 'error' }
  | { type: 'SET_LAST_SYNC'; payload: Date | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_OFFLINE_DATA_COUNT'; payload: number }
  | { type: 'SET_SYNC_PROGRESS'; payload: number };

const initialState: DataSyncState = {
  isOnline: navigator.onLine,
  lastSync: null,
  syncStatus: 'idle',
  error: null,
  offlineDataCount: 0,
  syncProgress: 0,
};

const dataSyncReducer = (state: DataSyncState, action: DataSyncAction): DataSyncState => {
  switch (action.type) {
    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };
    case 'SET_SYNC_STATUS':
      return { ...state, syncStatus: action.payload };
    case 'SET_LAST_SYNC':
      return { ...state, lastSync: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_OFFLINE_DATA_COUNT':
      return { ...state, offlineDataCount: action.payload };
    case 'SET_SYNC_PROGRESS':
      return { ...state, syncProgress: action.payload };
    default:
      return state;
  }
};

const DataSyncContext = createContext<DataSyncContextType | undefined>(undefined);

interface DataSyncProviderProps {
  children: React.ReactNode;
}

export const DataSyncProvider: React.FC<DataSyncProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(dataSyncReducer, initialState);

  // Update online status when network changes
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Refresh offline data count periodically
  useEffect(() => {
    const updateOfflineDataCount = async () => {
      try {
        const data = await offlineStorage.getAllData();
        const count = Object.values(data).reduce((total, arr) => {
          if (Array.isArray(arr)) return total + arr.length;
          return total;
        }, 0);
        dispatch({ type: 'SET_OFFLINE_DATA_COUNT', payload: count });
      } catch (error) {
        console.error('Failed to count offline data:', error);
      }
    };

    updateOfflineDataCount();
    const interval = setInterval(updateOfflineDataCount, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const refreshStatus = useCallback(async () => {
    dispatch({ type: 'SET_ONLINE_STATUS', payload: navigator.onLine });
    
    try {
      const lastSync = await offlineStorage.getLastSync();
      dispatch({ type: 'SET_LAST_SYNC', payload: lastSync ? new Date(lastSync) : null });
    } catch (error) {
      console.error('Failed to get last sync time:', error);
    }
  }, []);

  const syncToServer = useCallback(async () => {
    if (!state.isOnline) {
      dispatch({ type: 'SET_ERROR', payload: 'Device is offline' });
      return;
    }

    try {
      dispatch({ type: 'SET_SYNC_STATUS', payload: 'syncing' });
      dispatch({ type: 'SET_SYNC_PROGRESS', payload: 0 });
      
      // Get progress updates from the sync process
      const result = await api.syncToServer();
      
      if (result.success) {
        dispatch({ type: 'SET_SYNC_STATUS', payload: 'success' });
        dispatch({ type: 'SET_LAST_SYNC', payload: new Date() });
        dispatch({ type: 'SET_ERROR', payload: null });
        
        // Update offline data count after sync
        const data = await offlineStorage.getAllData();
        const count = Object.values(data).reduce((total, arr) => {
          if (Array.isArray(arr)) return total + arr.length;
          return total;
        }, 0);
        dispatch({ type: 'SET_OFFLINE_DATA_COUNT', payload: count });
      } else {
        dispatch({ type: 'SET_SYNC_STATUS', payload: 'error' });
        dispatch({ type: 'SET_ERROR', payload: result.message });
      }
    } catch (error) {
      dispatch({ type: 'SET_SYNC_STATUS', payload: 'error' });
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message || 'Sync failed' });
    } finally {
      dispatch({ type: 'SET_SYNC_PROGRESS', payload: 100 });
    }
  }, [state.isOnline]);

  const syncFromServer = useCallback(async () => {
    if (!state.isOnline) {
      dispatch({ type: 'SET_ERROR', payload: 'Device is offline' });
      return;
    }

    try {
      dispatch({ type: 'SET_SYNC_STATUS', payload: 'syncing' });
      dispatch({ type: 'SET_SYNC_PROGRESS', payload: 0 });
      
      // In a real implementation, this would fetch data from server
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      dispatch({ type: 'SET_SYNC_STATUS', payload: 'success' });
      dispatch({ type: 'SET_LAST_SYNC', payload: new Date() });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_SYNC_STATUS', payload: 'error' });
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message || 'Sync failed' });
    } finally {
      dispatch({ type: 'SET_SYNC_PROGRESS', payload: 100 });
    }
  }, [state.isOnline]);

  const getOfflineData = useCallback(async () => {
    try {
      const data = await offlineStorage.getAllData();
      return data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to get offline data' });
      return {};
    }
  }, []);

  const clearOfflineData = useCallback(async () => {
    try {
      await offlineStorage.clearAllData();
      dispatch({ type: 'SET_OFFLINE_DATA_COUNT', payload: 0 });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear offline data' });
    }
  }, []);

  const getSyncHistory = useCallback(async () => {
    // In a real implementation, this would fetch sync history from storage or server
    // For now, we'll return an empty array
    return [];
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      syncToServer,
      syncFromServer,
      getOfflineData,
      clearOfflineData,
      refreshStatus,
      getSyncHistory,
    }),
    [
      state,
      syncToServer,
      syncFromServer,
      getOfflineData,
      clearOfflineData,
      refreshStatus,
      getSyncHistory,
    ]
  );

  return <DataSyncContext.Provider value={value}>{children}</DataSyncContext.Provider>;
};

export const useDataSync = (): DataSyncContextType => {
  const context = useContext(DataSyncContext);
  if (!context) {
    throw new Error('useDataSync must be used within a DataSyncProvider');
  }
  return context;
};