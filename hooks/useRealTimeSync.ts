import { useEffect, useCallback, useState } from 'react';
import { db } from '../services/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Sale, InventoryItem, Customer, Invoice, Project } from '../types';

// Note: Firestore's onSnapshot provides the full result set, not individual events.
// The logic here is simplified to notify of changes, but not the specific event type.

interface RealtimeState {
  connected: boolean;
  lastSyncTime: Date | null;
  syncInProgress: boolean;
  error: string | null;
  unreadChanges: number;
}

interface RealtimeCallbacks {
  onSaleUpdate?: (data: Sale[]) => void;
  onInventoryUpdate?: (data: InventoryItem[]) => void;
  onCustomerUpdate?: (data: Customer[]) => void;
  onProjectUpdate?: (data: Project[]) => void;
  onInvoiceUpdate?: (data: Invoice[]) => void;
}

export const useRealTimeSync = (callbacks: RealtimeCallbacks = {}) => {
  const { user, isAuthenticated } = useAuth();
  const [state, setState] = useState<RealtimeState>({
    connected: false,
    lastSyncTime: null,
    syncInProgress: false,
    error: null,
    unreadChanges: 0,
  });

  const updateState = useCallback((updates: Partial<RealtimeState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    console.log('Setting up realtime subscriptions...');

    const tables = {
      sales: callbacks.onSaleUpdate,
      inventory: callbacks.onInventoryUpdate,
      customers: callbacks.onCustomerUpdate,
      projects: callbacks.onProjectUpdate,
      invoices: callbacks.onInvoiceUpdate,
    };

    const unsubscribes = Object.entries(tables).map(([tableName, callback]) => {
      if (!callback) return () => {};

      // Note: Firestore security rules should enforce user-specific data access.
      // The `where('user_id', '==', user.uid)` clause is an example.
      // You will need to ensure your Firestore collections have a `user_id` field for this to work.
      const q = query(collection(db, tableName), where("user_id", "==", user.uid));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        console.log(`Realtime update on ${tableName}`);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(data as any);
        updateState({
          unreadChanges: state.unreadChanges + 1,
          lastSyncTime: new Date(),
        });
      }, (error) => {
        console.error(`Error on ${tableName} subscription:`, error);
        updateState({ error: `Failed to listen to ${tableName} updates` });
      });

      return unsubscribe;
    });

    updateState({ connected: true });

    return () => {
      console.log('Cleaning up realtime subscriptions...');
      unsubscribes.forEach(unsub => unsub());
      updateState({ connected: false });
    };
  }, [isAuthenticated, user, callbacks, state.unreadChanges, updateState]);

  const triggerSync = useCallback(async () => {
    if (!isAuthenticated || state.syncInProgress) return;

    updateState({ syncInProgress: true, error: null });

    try {
      const result = await api.syncToServer();

      updateState({
        syncInProgress: false,
        error: result.success ? null : result.message,
        lastSyncTime: result.success ? new Date() : state.lastSyncTime,
        unreadChanges: result.success ? 0 : state.unreadChanges,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed';
      updateState({
        syncInProgress: false,
        error: errorMessage,
      });
      return { success: false, message: errorMessage };
    }
  }, [isAuthenticated, state.syncInProgress, state.lastSyncTime, state.unreadChanges, updateState]);

  // Mocked Presence Functionality
  // TODO: Implement this with Firebase Realtime Database
  const trackPresence = useCallback((location: string) => {
    console.warn('Presence tracking is not implemented in this version.');
    return { unsubscribe: () => {} }; // Mock unsubscribe
  }, []);

  const getActiveUsers = useCallback(() => 0, []);
  const getUsersAtLocation = useCallback(() => [], []);

  const markChangesAsRead = useCallback(() => {
    updateState({ unreadChanges: 0 });
  }, [updateState]);

  return {
    ...state,
    isConnected: state.connected,
    hasUnreadChanges: state.unreadChanges > 0,
    triggerSync,
    markChangesAsRead,
    trackPresence,
    getActiveUsers,
    getUsersAtLocation,
    activeUsers: 0,
    isRealTimeEnabled: isAuthenticated && state.connected,
  };
};
