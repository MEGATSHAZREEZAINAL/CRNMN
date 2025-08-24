import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import type { InventoryItem } from '../types';

interface InventoryState {
  inventory: InventoryItem[];
  loading: boolean;
  error: string | null;
}

interface InventoryContextType extends InventoryState {
  updateStock: (id: string, quantity: number) => Promise<void>;
  getLowStockItems: () => InventoryItem[];
  restockItem: (id: string, quantity: number) => Promise<void>;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;
  refreshInventory: () => Promise<void>;
  getTotalInventoryValue: () => number;
}

type InventoryAction =
  | { type: 'SET_INVENTORY'; payload: InventoryItem[] }
  | { type: 'UPDATE_ITEM'; payload: { id: string; updates: Partial<InventoryItem> } }
  | { type: 'ADD_ITEM'; payload: InventoryItem }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: InventoryState = {
  inventory: [],
  loading: false,
  error: null,
};

const inventoryReducer = (state: InventoryState, action: InventoryAction): InventoryState => {
  switch (action.type) {
    case 'SET_INVENTORY':
      return { ...state, inventory: action.payload, loading: false };
    case 'UPDATE_ITEM':
      return {
        ...state,
        inventory: state.inventory.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.updates } : item
        ),
      };
    case 'ADD_ITEM':
      return { ...state, inventory: [action.payload, ...state.inventory] };
    case 'DELETE_ITEM':
      return {
        ...state,
        inventory: state.inventory.filter(item => item.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

interface InventoryProviderProps {
  children: React.ReactNode;
}

export const InventoryProvider: React.FC<InventoryProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(inventoryReducer, initialState);

  const refreshInventory = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const inventory = await api.getInventory();
      dispatch({ type: 'SET_INVENTORY', payload: inventory });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch inventory' });
    }
  }, []);

  const updateStock = useCallback(async (id: string, quantity: number) => {
    try {
      const item = state.inventory.find(i => i.id === id);
      if (item) {
        const updatedItem = await api.updateInventory({
          ...item,
          stock: quantity,
        });
        dispatch({ type: 'UPDATE_ITEM', payload: { id, updates: updatedItem } });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update stock' });
    }
  }, [state.inventory]);

  const restockItem = useCallback(async (id: string, quantity: number) => {
    try {
      const item = state.inventory.find(i => i.id === id);
      if (item) {
        const newStock = item.stock + quantity;
        const updatedItem = await api.updateInventory({
          ...item,
          stock: newStock,
        });
        dispatch({ type: 'UPDATE_ITEM', payload: { id, updates: updatedItem } });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to restock item' });
    }
  }, [state.inventory]);

  const addInventoryItem = useCallback(async (itemData: Omit<InventoryItem, 'id'>) => {
    try {
      const newItem = await api.createInventoryItem(itemData);
      dispatch({ type: 'ADD_ITEM', payload: newItem });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add inventory item' });
    }
  }, []);

  const updateInventoryItem = useCallback(async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const item = state.inventory.find(i => i.id === id);
      if (item) {
        const updatedItem = await api.updateInventory({ ...item, ...updates, id });
        dispatch({ type: 'UPDATE_ITEM', payload: { id, updates: updatedItem } });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update inventory item' });
    }
  }, [state.inventory]);

  const deleteInventoryItem = useCallback(async (id: string) => {
    try {
      await api.deleteInventoryItem(id);
      dispatch({ type: 'DELETE_ITEM', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete inventory item' });
    }
  }, []);

  const getLowStockItems = useCallback((): InventoryItem[] => {
    return state.inventory.filter(item => item.stock <= item.threshold);
  }, [state.inventory]);

  const getTotalInventoryValue = useCallback((): number => {
    return state.inventory.reduce((total, item) => {
      return total + (item.stock * (item.cost || 0));
    }, 0);
  }, [state.inventory]);

  const value = useMemo(
    () => ({
      ...state,
      updateStock,
      getLowStockItems,
      restockItem,
      addInventoryItem,
      updateInventoryItem,
      deleteInventoryItem,
      refreshInventory,
      getTotalInventoryValue,
    }),
    [
      state,
      updateStock,
      getLowStockItems,
      restockItem,
      addInventoryItem,
      updateInventoryItem,
      deleteInventoryItem,
      refreshInventory,
      getTotalInventoryValue,
    ]
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};