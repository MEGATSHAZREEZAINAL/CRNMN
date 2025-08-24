import React, { createContext, useContext, useReducer, useCallback, useEffect, useMemo } from 'react';
import { api } from '../services/api';

interface BusinessSettings {
  businessName: string;
  monthlyGoal: number;
  currency: string;
  timezone: string;
  language: string;
}

interface AppConfig {
  theme: 'dark' | 'light' | 'auto';
  notifications: boolean;
  soundEnabled: boolean;
  autoSync: boolean;
  syncFrequency: 'manual' | '5min' | '15min' | '30min' | '1hour';
  dataRetention: number; // days
}

interface ConfigState {
  businessSettings: BusinessSettings;
  appConfig: AppConfig;
  loading: boolean;
  error: string | null;
  lastSaved: Date | null;
}

interface ConfigContextType extends ConfigState {
  updateBusinessSetting: <K extends keyof BusinessSettings>(key: K, value: BusinessSettings[K]) => Promise<void>;
  updateAppConfig: <K extends keyof AppConfig>(key: K, value: AppConfig[K]) => Promise<void>;
  resetBusinessSettings: () => Promise<void>;
  resetAppConfig: () => Promise<void>;
  refreshConfig: () => Promise<void>;
  saveAll: () => Promise<void>;
  getFormattedCurrency: (amount: number) => string;
  getFormattedDate: (date: Date | string) => string;
}

type ConfigAction =
  | { type: 'SET_BUSINESS_SETTINGS'; payload: BusinessSettings }
  | { type: 'SET_APP_CONFIG'; payload: AppConfig }
  | { type: 'UPDATE_BUSINESS_SETTING'; payload: { key: string; value: any } }
  | { type: 'UPDATE_APP_CONFIG'; payload: { key: string; value: any } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LAST_SAVED'; payload: Date | null };

const defaultBusinessSettings: BusinessSettings = {
  businessName: 'CORNMAN',
  monthlyGoal: 10000,
  currency: 'RM',
  timezone: 'Asia/Kuala_Lumpur',
  language: 'en',
};

const defaultAppConfig: AppConfig = {
  theme: 'dark',
  notifications: true,
  soundEnabled: true,
  autoSync: true,
  syncFrequency: '15min',
  dataRetention: 30,
};

const initialState: ConfigState = {
  businessSettings: defaultBusinessSettings,
  appConfig: defaultAppConfig,
  loading: false,
  error: null,
  lastSaved: null,
};

const configReducer = (state: ConfigState, action: ConfigAction): ConfigState => {
  switch (action.type) {
    case 'SET_BUSINESS_SETTINGS':
      return { ...state, businessSettings: action.payload, loading: false };
    case 'SET_APP_CONFIG':
      return { ...state, appConfig: action.payload, loading: false };
    case 'UPDATE_BUSINESS_SETTING':
      return {
        ...state,
        businessSettings: {
          ...state.businessSettings,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'UPDATE_APP_CONFIG':
      return {
        ...state,
        appConfig: {
          ...state.appConfig,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_LAST_SAVED':
      return { ...state, lastSaved: action.payload };
    default:
      return state;
  }
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: React.ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(configReducer, initialState);

  // Load config from localStorage on init
  useEffect(() => {
    try {
      const savedBusinessSettings = localStorage.getItem('businessSettings');
      const savedAppConfig = localStorage.getItem('appConfig');
      
      if (savedBusinessSettings) {
        dispatch({ 
          type: 'SET_BUSINESS_SETTINGS', 
          payload: { ...defaultBusinessSettings, ...JSON.parse(savedBusinessSettings) } 
        });
      }
      
      if (savedAppConfig) {
        dispatch({ 
          type: 'SET_APP_CONFIG', 
          payload: { ...defaultAppConfig, ...JSON.parse(savedAppConfig) } 
        });
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  }, []);

  // Save business settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('businessSettings', JSON.stringify(state.businessSettings));
    } catch (error) {
      console.error('Failed to save business settings:', error);
    }
  }, [state.businessSettings]);

  // Save app config to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('appConfig', JSON.stringify(state.appConfig));
    } catch (error) {
      console.error('Failed to save app config:', error);
    }
  }, [state.appConfig]);

  // Load business settings from API
  const loadBusinessSettings = useCallback(async () => {
    try {
      const settings = await api.getBusinessSettings();
      if (settings) {
        dispatch({ 
          type: 'SET_BUSINESS_SETTINGS', 
          payload: { 
            businessName: settings.businessName,
            monthlyGoal: settings.monthlyGoal,
            currency: settings.currency,
            timezone: 'Asia/Kuala_Lumpur', // Default value
            language: 'en', // Default value
          } 
        });
      }
    } catch (error) {
      console.error('Failed to load business settings from API:', error);
    }
  }, []);

  // Initialize by loading business settings from API
  useEffect(() => {
    loadBusinessSettings();
  }, [loadBusinessSettings]);

  const updateBusinessSetting = useCallback(async <K extends keyof BusinessSettings>(
    key: K, 
    value: BusinessSettings[K]
  ) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Update in state first for immediate UI feedback
      dispatch({ 
        type: 'UPDATE_BUSINESS_SETTING', 
        payload: { key, value } 
      });
      
      // Then update in API if online
      if (navigator.onLine) {
        const settingsToUpdate = { 
          businessName: state.businessSettings.businessName,
          monthlyGoal: state.businessSettings.monthlyGoal,
          currency: state.businessSettings.currency,
          [key]: value
        };
        
        await api.updateBusinessSettings(settingsToUpdate);
        dispatch({ type: 'SET_LAST_SAVED', payload: new Date() });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update business setting' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.businessSettings]);

  const updateAppConfig = useCallback(async <K extends keyof AppConfig>(
    key: K, 
    value: AppConfig[K]
  ) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Update in state first for immediate UI feedback
      dispatch({ 
        type: 'UPDATE_APP_CONFIG', 
        payload: { key, value } 
      });
      
      dispatch({ type: 'SET_LAST_SAVED', payload: new Date() });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update app config' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const resetBusinessSettings = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      dispatch({ 
        type: 'SET_BUSINESS_SETTINGS', 
        payload: defaultBusinessSettings 
      });
      
      // Update in API if online
      if (navigator.onLine) {
        await api.updateBusinessSettings(defaultBusinessSettings);
        dispatch({ type: 'SET_LAST_SAVED', payload: new Date() });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to reset business settings' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const resetAppConfig = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      dispatch({ 
        type: 'SET_APP_CONFIG', 
        payload: defaultAppConfig 
      });
      
      dispatch({ type: 'SET_LAST_SAVED', payload: new Date() });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to reset app config' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const refreshConfig = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await loadBusinessSettings();
      
      // Load app config from localStorage
      const savedAppConfig = localStorage.getItem('appConfig');
      if (savedAppConfig) {
        dispatch({ 
          type: 'SET_APP_CONFIG', 
          payload: { ...defaultAppConfig, ...JSON.parse(savedAppConfig) } 
        });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh config' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [loadBusinessSettings]);

  const saveAll = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Save business settings to API if online
      if (navigator.onLine) {
        await api.updateBusinessSettings(state.businessSettings);
      }
      
      // Save app config to localStorage (already done by useEffect)
      
      dispatch({ type: 'SET_LAST_SAVED', payload: new Date() });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save config' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.businessSettings]);

  const getFormattedCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: state.businessSettings.currency,
    }).format(amount);
  }, [state.businessSettings.currency]);

  const getFormattedDate = useCallback((date: Date | string): string => {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: state.businessSettings.timezone,
    }).format(new Date(date));
  }, [state.businessSettings.timezone]);

  const value = useMemo(
    () => ({
      ...state,
      updateBusinessSetting,
      updateAppConfig,
      resetBusinessSettings,
      resetAppConfig,
      refreshConfig,
      saveAll,
      getFormattedCurrency,
      getFormattedDate,
    }),
    [
      state,
      updateBusinessSetting,
      updateAppConfig,
      resetBusinessSettings,
      resetAppConfig,
      refreshConfig,
      saveAll,
      getFormattedCurrency,
      getFormattedDate,
    ]
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

// Hook for business settings
export const useBusinessSettings = () => {
  const { businessSettings, updateBusinessSetting } = useConfig();
  return { settings: businessSettings, updateSetting: updateBusinessSetting };
};

// Hook for app configuration
export const useAppConfig = () => {
  const { appConfig, updateAppConfig } = useConfig();
  return { config: appConfig, updateConfig: updateAppConfig };
};