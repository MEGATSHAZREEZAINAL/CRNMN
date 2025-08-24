import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from '../components/auth/LoginForm';
import { OfflineIndicator } from '../components/feedback/OfflineIndicator';
import { useOffline } from '../hooks/useOffline';
import { AppLoader } from './AppLoader';

// Lazy load all feature components
const DashboardPage = React.lazy(() => import('../features/dashboard/DashboardPage'));
const AnalyticsPage = React.lazy(() => import('../features/analytics/AnalyticsPage'));
const SalesPage = React.lazy(() => import('../features/sales/SalesPage'));
const InventoryPage = React.lazy(() => import('../features/inventory/InventoryPage'));
const WhatsAppPage = React.lazy(() => import('../features/whatsapp/WhatsAppPage'));
const ProjectsPage = React.lazy(() => import('../features/projects/ProjectsPage'));
const SettingsPage = React.lazy(() => import('../features/settings/SettingsPage'));

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <AppLoader />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Main router component
export const Router: React.FC = () => {
  const { isOnline } = useOffline();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark-900">
        <Suspense fallback={<AppLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginForm />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/analytics" element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/sales" element={
              <ProtectedRoute>
                <SalesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/inventory" element={
              <ProtectedRoute>
                <InventoryPage />
              </ProtectedRoute>
            } />
            
            <Route path="/whatsapp" element={
              <ProtectedRoute>
                <WhatsAppPage />
              </ProtectedRoute>
            } />
            
            <Route path="/projects" element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        
        {/* Global components */}
        <OfflineIndicator />
        
        {/* Real-time status in dev mode */}
        {import.meta.env.DEV && (
          <div className="fixed bottom-4 left-4 z-50 bg-dark-800 border border-dark-600 rounded-lg p-3 font-mono text-xs space-y-1">
            <div
              className={`flex items-center gap-2 ${isOnline ? 'text-status-success' : 'text-status-error'}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${isOnline ? 'bg-status-success' : 'bg-status-error'} animate-pulse`}
              ></div>
              {isOnline ? 'Online' : 'Offline'}
            </div>
            <div className="text-dark-300">Context System: Active</div>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
};
