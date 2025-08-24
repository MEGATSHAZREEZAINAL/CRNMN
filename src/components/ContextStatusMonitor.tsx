import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppState } from '../contexts/AppStateContext';
import { useSales } from '../contexts/SalesContext';
import { useInventory } from '../contexts/InventoryContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { useEcommerce } from '../contexts/EcommerceContext';
import { useTeam } from '../contexts/TeamContext';
import { useDataSync } from '../contexts/DataSyncContext';
import { useFeatureFlags } from '../contexts/FeatureFlagContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useConfig } from '../contexts/ConfigContext';

export const ContextStatusMonitor: React.FC = () => {
  // Get status from all contexts
  const { 
    user, 
    isAuthenticated, 
    loading: authLoading,
    error: authError
  } = useAuth();
  
  const { 
    state: appState, 
    metrics: appMetrics,
    state: { lastUpdated: appLastUpdated }
  } = useAppState();
  
  const { 
    sales, 
    loading: salesLoading,
    error: salesError
  } = useSales();
  
  const { 
    inventory, 
    loading: inventoryLoading,
    error: inventoryError
  } = useInventory();
  
  const { 
    revenueData, 
    salesData,
    loading: analyticsLoading,
    error: analyticsError
  } = useAnalytics();
  
  const { 
    products, 
    orders,
    loading: ecommerceLoading,
    error: ecommerceError
  } = useEcommerce();
  
  const { 
    members, 
    tasks,
    loading: teamLoading,
    error: teamError
  } = useTeam();
  
  const { 
    isOnline, 
    syncStatus,
    offlineDataCount
  } = useDataSync();
  
  const { 
    flags: featureFlags,
    isLoading: featureFlagsLoading
  } = useFeatureFlags();
  
  const { 
    notifications,
    unreadCount: unreadNotifications
  } = useNotifications();
  
  const { 
    businessSettings,
    appConfig
  } = useConfig();

  // Helper function to get status color
  const getStatusColor = (isOk: boolean) => {
    return isOk ? 'text-green-500' : 'text-red-500';
  };

  // Helper function to get loading status
  const getLoadingStatus = (loading: boolean) => {
    return loading ? 'Loading...' : 'Ready';
  };

  // Helper function to count enabled features
  const getEnabledFeaturesCount = () => {
    return Object.values(featureFlags).filter(flag => flag).length;
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] bg-gray-900 text-white p-4 rounded-lg shadow-lg text-xs font-mono max-w-md">
      <div className="font-bold mb-2 text-sm">Context Status Monitor</div>
      <div className="space-y-2">
        {/* Auth Context */}
        <div className="flex items-center justify-between">
          <span>Auth</span>
          <span className={getStatusColor(!!user && isAuthenticated)}>
            {authError ? `Error: ${authError}` : isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </span>
        </div>
        
        {/* App State Context */}
        <div className="flex items-center justify-between">
          <span>App State</span>
          <span className={getStatusColor(!!appState)}>
            {appLastUpdated ? `Updated: ${new Date(appLastUpdated).toLocaleTimeString()}` : 'No data'}
          </span>
        </div>
        
        {/* Sales Context */}
        <div className="flex items-center justify-between">
          <span>Sales</span>
          <span className={getStatusColor(!salesLoading && !salesError)}>
            {salesLoading ? 'Loading...' : salesError ? `Error: ${salesError}` : `${sales.length} records`}
          </span>
        </div>
        
        {/* Inventory Context */}
        <div className="flex items-center justify-between">
          <span>Inventory</span>
          <span className={getStatusColor(!inventoryLoading && !inventoryError)}>
            {inventoryLoading ? 'Loading...' : inventoryError ? `Error: ${inventoryError}` : `${inventory.length} items`}
          </span>
        </div>
        
        {/* Analytics Context */}
        <div className="flex items-center justify-between">
          <span>Analytics</span>
          <span className={getStatusColor(!analyticsLoading && !analyticsError)}>
            {analyticsLoading ? 'Loading...' : analyticsError ? `Error: ${analyticsError}` : 'Ready'}
          </span>
        </div>
        
        {/* E-commerce Context */}
        <div className="flex items-center justify-between">
          <span>E-commerce</span>
          <span className={getStatusColor(!ecommerceLoading && !ecommerceError)}>
            {ecommerceLoading ? 'Loading...' : ecommerceError ? `Error: ${ecommerceError}` : `${products.length} products`}
          </span>
        </div>
        
        {/* Team Context */}
        <div className="flex items-center justify-between">
          <span>Team</span>
          <span className={getStatusColor(!teamLoading && !teamError)}>
            {teamLoading ? 'Loading...' : teamError ? `Error: ${teamError}` : `${members.length} members`}
          </span>
        </div>
        
        {/* Data Sync Context */}
        <div className="flex items-center justify-between">
          <span>Data Sync</span>
          <span className={getStatusColor(isOnline)}>
            {isOnline ? 'Online' : 'Offline'} | {syncStatus} | {offlineDataCount} items
          </span>
        </div>
        
        {/* Feature Flags Context */}
        <div className="flex items-center justify-between">
          <span>Feature Flags</span>
          <span className={getStatusColor(!featureFlagsLoading)}>
            {featureFlagsLoading ? 'Loading...' : `${getEnabledFeaturesCount()} enabled`}
          </span>
        </div>
        
        {/* Notifications Context */}
        <div className="flex items-center justify-between">
          <span>Notifications</span>
          <span className={getStatusColor(true)}>
            {notifications.length} total | {unreadNotifications} unread
          </span>
        </div>
        
        {/* Config Context */}
        <div className="flex items-center justify-between">
          <span>Config</span>
          <span className={getStatusColor(!!businessSettings && !!appConfig)}>
            {businessSettings?.businessName || 'Not loaded'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContextStatusMonitor;