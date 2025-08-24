import React, { createContext, useContext, useReducer, useCallback, useMemo, useRef, useEffect } from 'react';

// ============================================================================
// ADVANCED PERFORMANCE CONTEXT ENGINEERING
// ============================================================================

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  slowestRender: number;
  componentPerformance: Record<string, {
    renders: number;
    totalTime: number;
    avgTime: number;
    slowest: number;
  }>;
  memoryUsage: number;
  cacheHitRate: number;
  apiCallMetrics: {
    total: number;
    successful: number;
    failed: number;
    averageResponseTime: number;
  };
}

interface PerformanceState {
  metrics: PerformanceMetrics;
  isMonitoring: boolean;
  cacheData: Map<string, { data: any; timestamp: number; ttl: number }>;
  suspenseCache: Map<string, Promise<any>>;
  batchedUpdates: Array<{ id: string; update: () => void; priority: 'high' | 'medium' | 'low' }>;
  renderOptimizations: {
    enableMemoization: boolean;
    enableVirtualization: boolean;
    enableLazyLoading: boolean;
    batchUpdates: boolean;
  };
}

type PerformanceAction =
  | { type: 'START_MONITORING' }
  | { type: 'STOP_MONITORING' }
  | { type: 'RECORD_RENDER'; payload: { component: string; duration: number } }
  | { type: 'RECORD_API_CALL'; payload: { success: boolean; duration: number } }
  | { type: 'UPDATE_MEMORY_USAGE'; payload: number }
  | { type: 'CACHE_SET'; payload: { key: string; data: any; ttl?: number } }
  | { type: 'CACHE_CLEAR'; payload?: string }
  | { type: 'BATCH_UPDATE_ADD'; payload: { id: string; update: () => void; priority: 'high' | 'medium' | 'low' } }
  | { type: 'BATCH_UPDATE_EXECUTE' }
  | { type: 'TOGGLE_OPTIMIZATION'; payload: { type: keyof PerformanceState['renderOptimizations']; enabled: boolean } };

const initialState: PerformanceState = {
  metrics: {
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    slowestRender: 0,
    componentPerformance: {},
    memoryUsage: 0,
    cacheHitRate: 0,
    apiCallMetrics: {
      total: 0,
      successful: 0,
      failed: 0,
      averageResponseTime: 0,
    },
  },
  isMonitoring: import.meta.env.DEV, // Auto-enable in development
  cacheData: new Map(),
  suspenseCache: new Map(),
  batchedUpdates: [],
  renderOptimizations: {
    enableMemoization: true,
    enableVirtualization: true,
    enableLazyLoading: true,
    batchUpdates: true,
  },
};

const performanceReducer = (state: PerformanceState, action: PerformanceAction): PerformanceState => {
  switch (action.type) {
    case 'START_MONITORING':
      return { ...state, isMonitoring: true };

    case 'STOP_MONITORING':
      return { ...state, isMonitoring: false };

    case 'RECORD_RENDER': {
      if (!state.isMonitoring) return state;

      const { component, duration } = action.payload;
      const metrics = state.metrics;
      const componentStats = metrics.componentPerformance[component] || {
        renders: 0,
        totalTime: 0,
        avgTime: 0,
        slowest: 0,
      };

      const newComponentStats = {
        renders: componentStats.renders + 1,
        totalTime: componentStats.totalTime + duration,
        avgTime: (componentStats.totalTime + duration) / (componentStats.renders + 1),
        slowest: Math.max(componentStats.slowest, duration),
      };

      const totalRenders = metrics.renderCount + 1;
      const totalRenderTime = (metrics.averageRenderTime * metrics.renderCount) + duration;

      return {
        ...state,
        metrics: {
          ...metrics,
          renderCount: totalRenders,
          lastRenderTime: duration,
          averageRenderTime: totalRenderTime / totalRenders,
          slowestRender: Math.max(metrics.slowestRender, duration),
          componentPerformance: {
            ...metrics.componentPerformance,
            [component]: newComponentStats,
          },
        },
      };
    }

    case 'RECORD_API_CALL': {
      if (!state.isMonitoring) return state;

      const { success, duration } = action.payload;
      const api = state.metrics.apiCallMetrics;
      const totalCalls = api.total + 1;
      const totalTime = (api.averageResponseTime * api.total) + duration;

      return {
        ...state,
        metrics: {
          ...state.metrics,
          apiCallMetrics: {
            total: totalCalls,
            successful: api.successful + (success ? 1 : 0),
            failed: api.failed + (success ? 0 : 1),
            averageResponseTime: totalTime / totalCalls,
          },
        },
      };
    }

    case 'UPDATE_MEMORY_USAGE': {
      if (!state.isMonitoring) return state;
      return {
        ...state,
        metrics: {
          ...state.metrics,
          memoryUsage: action.payload,
        },
      };
    }

    case 'CACHE_SET': {
      const { key, data, ttl = 300000 } = action.payload; // Default 5 min TTL
      const newCache = new Map(state.cacheData);
      newCache.set(key, { data, timestamp: Date.now(), ttl });
      return { ...state, cacheData: newCache };
    }

    case 'CACHE_CLEAR': {
      if (action.payload) {
        const newCache = new Map(state.cacheData);
        newCache.delete(action.payload);
        return { ...state, cacheData: newCache };
      }
      return { ...state, cacheData: new Map() };
    }

    case 'BATCH_UPDATE_ADD':
      return {
        ...state,
        batchedUpdates: [...state.batchedUpdates, action.payload],
      };

    case 'BATCH_UPDATE_EXECUTE':
      // Execute updates by priority
      const sortedUpdates = [...state.batchedUpdates].sort((a, b) => {
        const priority = { high: 3, medium: 2, low: 1 };
        return priority[b.priority] - priority[a.priority];
      });
      
      sortedUpdates.forEach(({ update }) => update());
      
      return {
        ...state,
        batchedUpdates: [],
      };

    case 'TOGGLE_OPTIMIZATION':
      return {
        ...state,
        renderOptimizations: {
          ...state.renderOptimizations,
          [action.payload.type]: action.payload.enabled,
        },
      };

    default:
      return state;
  }
};

interface PerformanceContextType {
  state: PerformanceState;
  dispatch: React.Dispatch<PerformanceAction>;
  
  // Performance Monitoring
  startMonitoring: () => void;
  stopMonitoring: () => void;
  recordRender: (component: string, duration: number) => void;
  recordApiCall: (success: boolean, duration: number) => void;
  
  // Caching System
  getCachedData: <T>(key: string) => T | null;
  setCachedData: <T>(key: string, data: T, ttl?: number) => void;
  clearCache: (key?: string) => void;
  
  // Suspense Integration
  createSuspenseResource: <T>(key: string, fetcher: () => Promise<T>) => T;
  
  // Batch Updates
  batchUpdate: (id: string, update: () => void, priority?: 'high' | 'medium' | 'low') => void;
  flushBatchedUpdates: () => void;
  
  // Optimization Controls
  toggleOptimization: (type: keyof PerformanceState['renderOptimizations'], enabled: boolean) => void;
  
  // Performance Utilities
  measurePerformance: <T>(fn: () => T, component?: string) => T;
  debounce: <T extends (...args: any[]) => any>(fn: T, delay: number) => T;
  throttle: <T extends (...args: any[]) => any>(fn: T, limit: number) => T;
  
  // Memory Management
  analyzeMemoryUsage: () => void;
  
  // Performance Report
  getPerformanceReport: () => PerformanceMetrics;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

interface PerformanceProviderProps {
  children: React.ReactNode;
  enableAutoOptimizations?: boolean;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({ 
  children, 
  enableAutoOptimizations = true 
}) => {
  const [state, dispatch] = useReducer(performanceReducer, initialState);
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-execute batched updates
  useEffect(() => {
    if (state.batchedUpdates.length > 0 && state.renderOptimizations.batchUpdates) {
      if (batchTimeoutRef.current) clearTimeout(batchTimeoutRef.current);
      
      batchTimeoutRef.current = setTimeout(() => {
        dispatch({ type: 'BATCH_UPDATE_EXECUTE' });
      }, 16); // Next animation frame
    }
  }, [state.batchedUpdates.length, state.renderOptimizations.batchUpdates]);

  // Memory usage monitoring
  useEffect(() => {
    if (!state.isMonitoring) return;

    const interval = setInterval(() => {
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        const memoryUsage = memInfo.usedJSHeapSize / memInfo.totalJSHeapSize;
        dispatch({ type: 'UPDATE_MEMORY_USAGE', payload: memoryUsage });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [state.isMonitoring]);

  // Performance Monitoring Methods
  const startMonitoring = useCallback(() => {
    dispatch({ type: 'START_MONITORING' });
  }, []);

  const stopMonitoring = useCallback(() => {
    dispatch({ type: 'STOP_MONITORING' });
  }, []);

  const recordRender = useCallback((component: string, duration: number) => {
    dispatch({ type: 'RECORD_RENDER', payload: { component, duration } });
  }, []);

  const recordApiCall = useCallback((success: boolean, duration: number) => {
    dispatch({ type: 'RECORD_API_CALL', payload: { success, duration } });
  }, []);

  // Caching System
  const getCachedData = useCallback(<T,>(key: string): T | null => {
    const cached = state.cacheData.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      dispatch({ type: 'CACHE_CLEAR', payload: key });
      return null;
    }
    
    return cached.data as T;
  }, [state.cacheData]);

  const setCachedData = useCallback(<T,>(key: string, data: T, ttl?: number) => {
    dispatch({ type: 'CACHE_SET', payload: { key, data, ttl } });
  }, []);

  const clearCache = useCallback((key?: string) => {
    dispatch({ type: 'CACHE_CLEAR', payload: key });
  }, []);

  // Suspense Resource Creation
  const createSuspenseResource = useCallback(<T,>(key: string, fetcher: () => Promise<T>): T => {
    // Check cache first
    const cached = getCachedData<T>(key);
    if (cached) return cached;

    // Check suspense cache
    let suspensePromise = state.suspenseCache.get(key);
    if (!suspensePromise) {
      suspensePromise = fetcher().then(data => {
        setCachedData(key, data);
        state.suspenseCache.delete(key);
        return data;
      });
      state.suspenseCache.set(key, suspensePromise);
    }

    throw suspensePromise; // This triggers Suspense
  }, [getCachedData, setCachedData, state.suspenseCache]);

  // Batch Updates
  const batchUpdate = useCallback((
    id: string, 
    update: () => void, 
    priority: 'high' | 'medium' | 'low' = 'medium'
  ) => {
    dispatch({ type: 'BATCH_UPDATE_ADD', payload: { id, update, priority } });
  }, []);

  const flushBatchedUpdates = useCallback(() => {
    dispatch({ type: 'BATCH_UPDATE_EXECUTE' });
  }, []);

  // Optimization Controls
  const toggleOptimization = useCallback((
    type: keyof PerformanceState['renderOptimizations'], 
    enabled: boolean
  ) => {
    dispatch({ type: 'TOGGLE_OPTIMIZATION', payload: { type, enabled } });
  }, []);

  // Performance Utilities
  const measurePerformance = useCallback(<T,>(fn: () => T, component?: string): T => {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    if (component) {
      recordRender(component, duration);
    }
    
    return result;
  }, [recordRender]);

  const debounce = useCallback(<T extends (...args: any[]) => any,>(
    fn: T, 
    delay: number
  ): T => {
    let timeoutId: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    }) as T;
  }, []);

  const throttle = useCallback(<T extends (...args: any[]) => any,>(
    fn: T, 
    limit: number
  ): T => {
    let inThrottle: boolean;
    return ((...args: any[]) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    }) as T;
  }, []);

  const analyzeMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      console.log('Memory Analysis:', {
        used: `${(memInfo.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memInfo.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memInfo.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
        usage: `${((memInfo.usedJSHeapSize / memInfo.totalJSHeapSize) * 100).toFixed(2)}%`,
      });
    }
  }, []);

  const getPerformanceReport = useCallback((): PerformanceMetrics => {
    return state.metrics;
  }, [state.metrics]);

  const contextValue = useMemo<PerformanceContextType>(() => ({
    state,
    dispatch,
    startMonitoring,
    stopMonitoring,
    recordRender,
    recordApiCall,
    getCachedData,
    setCachedData,
    clearCache,
    createSuspenseResource,
    batchUpdate,
    flushBatchedUpdates,
    toggleOptimization,
    measurePerformance,
    debounce,
    throttle,
    analyzeMemoryUsage,
    getPerformanceReport,
  }), [
    state,
    startMonitoring,
    stopMonitoring,
    recordRender,
    recordApiCall,
    getCachedData,
    setCachedData,
    clearCache,
    createSuspenseResource,
    batchUpdate,
    flushBatchedUpdates,
    toggleOptimization,
    measurePerformance,
    debounce,
    throttle,
    analyzeMemoryUsage,
    getPerformanceReport,
  ]);

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = (): PerformanceContextType => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

// Performance Monitoring HOC
export function withPerformanceMonitoring<T extends object>(
  Component: React.ComponentType<T>,
  componentName?: string
): React.ComponentType<T> {
  const displayName = componentName || Component.displayName || Component.name || 'Component';
  
  const PerformanceMonitoredComponent = React.memo((props: T) => {
    const { measurePerformance } = usePerformance();
    
    return measurePerformance(
      () => <Component {...props} />,
      displayName
    );
  });
  
  PerformanceMonitoredComponent.displayName = `withPerformanceMonitoring(${displayName})`;
  
  return PerformanceMonitoredComponent as React.ComponentType<T>;
}

// Selective Performance Hooks
export const usePerformanceMetrics = () => {
  const { state } = usePerformance();
  return state.metrics;
};

export const useCache = () => {
  const { getCachedData, setCachedData, clearCache } = usePerformance();
  return { get: getCachedData, set: setCachedData, clear: clearCache };
};

export const useBatchUpdates = () => {
  const { batchUpdate, flushBatchedUpdates } = usePerformance();
  return { batch: batchUpdate, flush: flushBatchedUpdates };
};
