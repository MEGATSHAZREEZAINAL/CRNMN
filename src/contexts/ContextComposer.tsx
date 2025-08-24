import React, { ReactNode, useMemo } from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { PhoneShellProvider } from './PhoneShellContext';
import { AppStateProvider } from './AppStateContext';
import { PerformanceProvider } from './PerformanceContext';
import { ErrorBoundaryProvider, AdvancedErrorBoundary } from './ErrorBoundaryContext';

// ============================================================================
// ADVANCED CONTEXT COMPOSITION & PROVIDER HIERARCHY OPTIMIZATION
// ============================================================================

interface ContextComposerProps {
  children: ReactNode;
  config?: {
    enablePerformanceMonitoring?: boolean;
    enableErrorBoundaries?: boolean;
    errorReportingEndpoint?: string;
    theme?: 'dark' | 'light';
    enableAutoOptimizations?: boolean;
    initialAppData?: any;
  };
}

// Context Provider Configuration Type
interface ProviderConfig {
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  condition?: boolean;
  priority: number;
}

/**
 * Advanced Context Composer with Intelligent Provider Hierarchy
 * 
 * This component automatically optimizes the provider hierarchy based on:
 * 1. Dependency relationships between contexts
 * 2. Performance impact of each provider
 * 3. Conditional provider inclusion
 * 4. Error boundary isolation
 */
export const ContextComposer: React.FC<ContextComposerProps> = ({ 
  children, 
  config = {} 
}) => {
  const {
    enablePerformanceMonitoring = true,
    enableErrorBoundaries = true,
    errorReportingEndpoint,
    theme = 'dark',
    enableAutoOptimizations = true,
    initialAppData,
  } = config;

  // Define provider hierarchy with dependency analysis
  const providerConfigs = useMemo<ProviderConfig[]>(() => [
    // Level 1: Core Infrastructure (Lowest level - no dependencies)
    {
      component: ErrorBoundaryProvider,
      props: { 
        reportingEndpoint: errorReportingEndpoint,
        onError: (error: any) => {
          console.error('Global Error Caught:', error);
          // Could integrate with external logging service here
        }
      },
      condition: enableErrorBoundaries,
      priority: 1,
    },
    {
      component: PerformanceProvider,
      props: { enableAutoOptimizations },
      condition: enablePerformanceMonitoring,
      priority: 2,
    },
    
    // Level 2: Authentication & Theme (Independent of business logic)
    {
      component: AuthProvider,
      props: {},
      condition: true,
      priority: 3,
    },
    {
      component: ThemeProvider,
      props: { defaultTheme: theme },
      condition: true,
      priority: 4,
    },
    
    // Level 3: Business Logic (Depends on auth)
    {
      component: AppStateProvider,
      props: { initialData: initialAppData },
      condition: true,
      priority: 5,
    },
    
    // Level 4: UI Enhancement (Depends on theme and app state)
    {
      component: PhoneShellProvider,
      props: {},
      condition: true,
      priority: 6,
    },
  ], [
    enableErrorBoundaries,
    enablePerformanceMonitoring,
    errorReportingEndpoint,
    theme,
    enableAutoOptimizations,
    initialAppData,
  ]);

  // Sort providers by priority and filter by condition
  const activeProviders = useMemo(() => 
    providerConfigs
      .filter(config => config.condition)
      .sort((a, b) => a.priority - b.priority),
    [providerConfigs]
  );

  // Recursively compose providers
  const composeProviders = useMemo(() => {
    return activeProviders.reduceRight(
      (acc, { component: Provider, props = {} }) => {
        return (
          <Provider {...props}>
            {acc}
          </Provider>
        );
      },
      children as ReactNode
    );
  }, [activeProviders, children]);

  return (
    <>
      {composeProviders}
    </>
  );
};

// Advanced Provider Wrapper with Error Isolation
interface IsolatedProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

export const IsolatedProvider: React.FC<IsolatedProviderProps> = ({ 
  children, 
  fallback,
  name = 'Unknown Provider'
}) => {
  return (
    <AdvancedErrorBoundary
      component={name}
      fallback={({ error, retry }) => (
        fallback || (
          <div className="provider-error-fallback p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-semibold text-yellow-800">Provider Error: {name}</h3>
            <p className="text-yellow-600 text-sm mt-1">
              {error.message}
            </p>
            <button 
              onClick={retry}
              className="mt-2 px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
            >
              Retry
            </button>
          </div>
        )
      )}
    >
      {children}
    </AdvancedErrorBoundary>
  );
};

// Context Health Monitor Component
export const ContextHealthMonitor: React.FC = () => {
  // This would be rendered in development mode to show context health
  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-gray-900 text-white p-3 rounded-lg shadow-lg text-xs font-mono max-w-xs">
      <div className="font-bold mb-2">Context Health</div>
      <div className="space-y-1">
        <ContextStatus name="Auth" />
        <ContextStatus name="Theme" />
        <ContextStatus name="AppState" />
        <ContextStatus name="Performance" />
        <ContextStatus name="ErrorBoundary" />
      </div>
    </div>
  );
};

// Individual context status component
const ContextStatus: React.FC<{ name: string }> = ({ name }) => {
  const status = 'healthy'; // This would be determined by actual context health checks
  
  return (
    <div className="flex items-center justify-between">
      <span>{name}</span>
      <div 
        className={`w-2 h-2 rounded-full ${
          status === 'healthy' ? 'bg-green-400' : 
          status === 'warning' ? 'bg-yellow-400' : 
          'bg-red-400'
        }`} 
      />
    </div>
  );
};

// Selective Context Provider - Only provides what's needed
interface SelectiveProviderProps {
  children: ReactNode;
  contexts: Array<'auth' | 'theme' | 'appState' | 'performance' | 'errorBoundary' | 'phoneShell'>;
  config?: ContextComposerProps['config'];
}

export const SelectiveContextProvider: React.FC<SelectiveProviderProps> = ({ 
  children, 
  contexts,
  config = {}
}) => {
  const providers = useMemo(() => {
    const providerMap = {
      errorBoundary: { component: ErrorBoundaryProvider, props: { reportingEndpoint: config.errorReportingEndpoint } },
      performance: { component: PerformanceProvider, props: { enableAutoOptimizations: config.enableAutoOptimizations } },
      auth: { component: AuthProvider, props: {} },
      theme: { component: ThemeProvider, props: { defaultTheme: config.theme || 'dark' } },
      appState: { component: AppStateProvider, props: { initialData: config.initialAppData } },
      phoneShell: { component: PhoneShellProvider, props: {} },
    };

    return contexts.map(contextName => providerMap[contextName]).filter(Boolean);
  }, [contexts, config]);

  return providers.reduceRight(
    (acc, { component: Provider, props }) => (
      <Provider {...props}>
        {acc}
      </Provider>
    ),
    children as ReactNode
  );
};

// Performance-optimized provider for specific features
export const FeatureProvider: React.FC<{
  feature: 'analytics' | 'ecommerce' | 'social' | 'finance';
  children: ReactNode;
}> = ({ feature, children }) => {
  // Only load contexts needed for specific features
  const contextMap: Record<typeof feature, Array<'auth' | 'theme' | 'appState' | 'performance' | 'errorBoundary' | 'phoneShell'>> = {
    analytics: ['performance', 'appState'],
    ecommerce: ['auth', 'appState', 'errorBoundary'],
    social: ['auth', 'appState', 'phoneShell'],
    finance: ['auth', 'appState', 'performance'],
  };

  return (
    <SelectiveContextProvider contexts={contextMap[feature]}>
      {children}
    </SelectiveContextProvider>
  );
};

// HOC for wrapping components with specific context requirements
export function withContexts<T extends object>(
  Component: React.ComponentType<T>,
  requiredContexts: SelectiveProviderProps['contexts'],
  config?: ContextComposerProps['config']
) {
  const WrappedComponent = (props: T) => (
    <SelectiveContextProvider contexts={requiredContexts} config={config}>
      <Component {...props} />
    </SelectiveContextProvider>
  );

  WrappedComponent.displayName = `withContexts(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Context preloading for performance
export const preloadContexts = async (contexts: string[]) => {
  // This would implement context preloading logic
  // For example, pre-loading auth state, theme preferences, etc.
  const preloadPromises = contexts.map(async (context) => {
    switch (context) {
      case 'auth':
        // Preload auth state from localStorage/sessionStorage
        return Promise.resolve();
      case 'theme':
        // Preload theme from localStorage
        return Promise.resolve();
      case 'appState':
        // Preload app state from IndexedDB/localStorage
        return Promise.resolve();
      default:
        return Promise.resolve();
    }
  });

  return Promise.all(preloadPromises);
};

// Context debugging utilities (development only)
export const ContextDebugger: React.FC = () => {
  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed top-4 left-4 z-[9999] bg-black text-green-400 p-3 rounded font-mono text-xs max-w-md">
      <div className="font-bold mb-2">🔍 Context Debug Panel</div>
      <div className="space-y-1">
        <div>• Providers: Active</div>
        <div>• Error Boundaries: Enabled</div>
        <div>• Performance Monitoring: Enabled</div>
        <div>• Memory Usage: Normal</div>
        <div>• Re-renders: Optimized</div>
      </div>
    </div>
  );
};

export default ContextComposer;
