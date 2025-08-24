import React, { createContext, useContext, useReducer, useCallback, useEffect, useMemo } from 'react';

// Define feature flags
interface FeatureFlags {
  analyticsDashboard: boolean;
  teamManagement: boolean;
  ecommerceModule: boolean;
  mobileApp: boolean;
  automationEngine: boolean;
  supplyChain: boolean;
  integrations: boolean;
  viralPrediction: boolean;
  whatsappBot: boolean;
  offlineMode: boolean;
  darkMode: boolean;
  newUI: boolean;
}

interface FeatureFlagState {
  flags: FeatureFlags;
  isLoading: boolean;
  error: string | null;
  usageTracking: Record<string, number>;
}

interface FeatureFlagContextType extends FeatureFlagState {
  refreshFlags: () => Promise<void>;
  isEnabled: (feature: keyof FeatureFlags) => boolean;
  trackFeatureUsage: (feature: keyof FeatureFlags) => void;
  enableFeature: (feature: keyof FeatureFlags) => void;
  disableFeature: (feature: keyof FeatureFlags) => void;
  getFeatureUsage: (feature: keyof FeatureFlags) => number;
  getMostUsedFeatures: (limit?: number) => { feature: string; usage: number }[];
}

type FeatureFlagAction =
  | { type: 'SET_FLAGS'; payload: FeatureFlags }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ENABLE_FEATURE'; payload: keyof FeatureFlags }
  | { type: 'DISABLE_FEATURE'; payload: keyof FeatureFlags }
  | { type: 'TRACK_USAGE'; payload: keyof FeatureFlags }
  | { type: 'SET_USAGE'; payload: Record<string, number> };

const defaultFlags: FeatureFlags = {
  analyticsDashboard: true,
  teamManagement: true,
  ecommerceModule: true,
  mobileApp: false,
  automationEngine: false,
  supplyChain: false,
  integrations: false,
  viralPrediction: true,
  whatsappBot: true,
  offlineMode: true,
  darkMode: true,
  newUI: false,
};

const initialState: FeatureFlagState = {
  flags: defaultFlags,
  isLoading: false,
  error: null,
  usageTracking: {},
};

const featureFlagReducer = (state: FeatureFlagState, action: FeatureFlagAction): FeatureFlagState => {
  switch (action.type) {
    case 'SET_FLAGS':
      return { ...state, flags: action.payload, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'ENABLE_FEATURE':
      return {
        ...state,
        flags: { ...state.flags, [action.payload]: true },
      };
    case 'DISABLE_FEATURE':
      return {
        ...state,
        flags: { ...state.flags, [action.payload]: false },
      };
    case 'TRACK_USAGE':
      const feature = action.payload;
      const currentCount = state.usageTracking[feature] || 0;
      return {
        ...state,
        usageTracking: {
          ...state.usageTracking,
          [feature]: currentCount + 1,
        },
      };
    case 'SET_USAGE':
      return { ...state, usageTracking: action.payload };
    default:
      return state;
  }
};

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

interface FeatureFlagProviderProps {
  children: React.ReactNode;
  initialFlags?: Partial<FeatureFlags>;
}

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({ 
  children, 
  initialFlags = {} 
}) => {
  const [state, dispatch] = useReducer(featureFlagReducer, {
    ...initialState,
    flags: { ...defaultFlags, ...initialFlags },
  });

  // Load usage tracking from localStorage on init
  useEffect(() => {
    try {
      const savedUsage = localStorage.getItem('featureUsageTracking');
      if (savedUsage) {
        const usage = JSON.parse(savedUsage);
        dispatch({ type: 'SET_USAGE', payload: usage });
      }
    } catch (error) {
      console.error('Failed to load feature usage tracking:', error);
    }
  }, []);

  // Save usage tracking to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('featureUsageTracking', JSON.stringify(state.usageTracking));
    } catch (error) {
      console.error('Failed to save feature usage tracking:', error);
    }
  }, [state.usageTracking]);

  const refreshFlags = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // In a real implementation, this would fetch flags from a remote service
      // For now, we'll just use the default flags
      dispatch({ type: 'SET_FLAGS', payload: { ...defaultFlags, ...initialFlags } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch feature flags' });
    }
  }, [initialFlags]);

  const isEnabled = useCallback(
    (feature: keyof FeatureFlags): boolean => {
      return state.flags[feature] ?? false;
    },
    [state.flags]
  );

  const trackFeatureUsage = useCallback((feature: keyof FeatureFlags) => {
    dispatch({ type: 'TRACK_USAGE', payload: feature });
  }, []);

  const enableFeature = useCallback((feature: keyof FeatureFlags) => {
    dispatch({ type: 'ENABLE_FEATURE', payload: feature });
  }, []);

  const disableFeature = useCallback((feature: keyof FeatureFlags) => {
    dispatch({ type: 'DISABLE_FEATURE', payload: feature });
  }, []);

  const getFeatureUsage = useCallback(
    (feature: keyof FeatureFlags): number => {
      return state.usageTracking[feature] || 0;
    },
    [state.usageTracking]
  );

  const getMostUsedFeatures = useCallback(
    (limit: number = 5): { feature: string; usage: number }[] => {
      return Object.entries(state.usageTracking)
        .map(([feature, usage]) => ({ feature, usage }))
        .sort((a, b) => b.usage - a.usage)
        .slice(0, limit);
    },
    [state.usageTracking]
  );

  const value = useMemo(
    () => ({
      ...state,
      refreshFlags,
      isEnabled,
      trackFeatureUsage,
      enableFeature,
      disableFeature,
      getFeatureUsage,
      getMostUsedFeatures,
    }),
    [
      state,
      refreshFlags,
      isEnabled,
      trackFeatureUsage,
      enableFeature,
      disableFeature,
      getFeatureUsage,
      getMostUsedFeatures,
    ]
  );

  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>;
};

export const useFeatureFlags = (): FeatureFlagContextType => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
};

// Higher-order component for feature flagging
export const withFeatureFlag = <P extends object>(
  Component: React.ComponentType<P>,
  feature: keyof FeatureFlags,
  FallbackComponent?: React.ComponentType<P>
) => {
  return (props: P) => {
    const { isEnabled, trackFeatureUsage } = useFeatureFlags();
    
    useEffect(() => {
      if (isEnabled(feature)) {
        trackFeatureUsage(feature);
      }
    }, [feature, isEnabled, trackFeatureUsage]);

    if (isEnabled(feature)) {
      return <Component {...props} />;
    }
    
    if (FallbackComponent) {
      return <FallbackComponent {...props} />;
    }
    
    return null;
  };
};

// Hook for conditional rendering based on feature flags
export const useFeatureFlag = (feature: keyof FeatureFlags) => {
  const { isEnabled, trackFeatureUsage } = useFeatureFlags();
  
  useEffect(() => {
    if (isEnabled(feature)) {
      trackFeatureUsage(feature);
    }
  }, [feature, isEnabled, trackFeatureUsage]);

  return isEnabled(feature);
};