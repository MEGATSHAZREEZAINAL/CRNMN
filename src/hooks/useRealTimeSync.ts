import { useEffect, useCallback, useState } from 'react';
// Firebase imports disabled for demo mode
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Sale, InventoryItem, Customer, Invoice, Project } from '../types';

// Note: Demo mode - simplified realtime sync

interface RealtimeState {
  connected: boolean;
  lastSyncTime: Date | null;
  syncInProgress: boolean;
  error: string | null;
  unreadChanges: number;
}

interface RealtimeCallbacks {
  onSaleUpdate?: (sales: Sale[]) => void;
  onInventoryUpdate?: (inventory: InventoryItem[]) => void;
  onCustomerUpdate?: (customers: Customer[]) => void;
  onProjectUpdate?: (projects: Project[]) => void;
  onInvoiceUpdate?: (invoices: Invoice[]) => void;
}

export const useRealTimeSync = (callbacks: RealtimeCallbacks = {}) => {
  const { user, isAuthenticated } = useAuth();
  const [state, setState] = useState<RealtimeState>({
    connected: true, // Demo mode - always connected
    lastSyncTime: new Date(),
    syncInProgress: false,
    error: null,
    unreadChanges: 0,
  });

  const updateState = useCallback((updates: Partial<RealtimeState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    console.log('Demo mode: Simulating realtime sync...');
    
    // Demo mode - just mark as connected
    updateState({ 
      connected: true, 
      lastSyncTime: new Date(),
      error: null 
    });

    // Cleanup function for demo
    return () => {
      console.log('Demo mode: Cleaning up sync...');
    };
  }, [isAuthenticated, user, updateState]);

  // Demo mode functions - simplified
  const syncData = useCallback(async (dataType: string) => {
    console.log(`Demo mode: Syncing ${dataType}...`);
    updateState({ syncInProgress: true });
    
    // Simulate sync delay
    setTimeout(() => {
      updateState({ 
        syncInProgress: false, 
        lastSyncTime: new Date(),
        unreadChanges: 0 
      });
    }, 1000);
  }, [updateState]);

  const markAsRead = useCallback(() => {
    updateState({ unreadChanges: 0 });
  }, [updateState]);

  const forceSync = useCallback(async () => {
    console.log('Demo mode: Force sync...');
    await syncData('all');
  }, [syncData]);

  return {
    state,
    syncData,
    markAsRead,
    forceSync,
    isConnected: state.connected,
    hasUnreadChanges: state.unreadChanges > 0,
    lastSync: state.lastSyncTime,
    error: state.error,
  };
};