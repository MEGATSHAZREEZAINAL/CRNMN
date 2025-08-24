import React, { createContext, useContext, useReducer, useCallback, useMemo, Component, ReactNode } from 'react';

// ============================================================================
// ADVANCED ERROR BOUNDARY CONTEXT ENGINEERING
// ============================================================================

interface ErrorInfo {
  id: string;
  error: Error;
  errorInfo: React.ErrorInfo;
  timestamp: number;
  component: string;
  userId?: string;
  userAgent: string;
  url: string;
  stack?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
  resolved: boolean;
  retryCount: number;
  maxRetries: number;
}

interface ErrorBoundaryState {
  errors: ErrorInfo[];
  globalErrorCount: number;
  isRecoveryMode: boolean;
  recoveryStrategies: {
    autoRetry: boolean;
    fallbackUI: boolean;
    reportToService: boolean;
    localStorageBackup: boolean;
  };
  errorThresholds: {
    criticalErrorLimit: number;
    timeWindow: number; // milliseconds
    autoRecoveryAttempts: number;
  };
  lastErrorTime: number;
  isErrorDialogOpen: boolean;
  currentError: ErrorInfo | null;
}

type ErrorBoundaryAction =
  | { type: 'ERROR_CAUGHT'; payload: Omit<ErrorInfo, 'id' | 'timestamp' | 'resolved' | 'retryCount'> }
  | { type: 'ERROR_RESOLVED'; payload: string }
  | { type: 'ERROR_RETRY'; payload: string }
  | { type: 'ENTER_RECOVERY_MODE' }
  | { type: 'EXIT_RECOVERY_MODE' }
  | { type: 'UPDATE_RECOVERY_STRATEGIES'; payload: Partial<ErrorBoundaryState['recoveryStrategies']> }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'CLEAR_OLD_ERRORS' }
  | { type: 'OPEN_ERROR_DIALOG'; payload: ErrorInfo }
  | { type: 'CLOSE_ERROR_DIALOG' }
  | { type: 'UPDATE_ERROR_CONTEXT'; payload: { errorId: string; context: Record<string, any> } };

const initialState: ErrorBoundaryState = {
  errors: [],
  globalErrorCount: 0,
  isRecoveryMode: false,
  recoveryStrategies: {
    autoRetry: true,
    fallbackUI: true,
    reportToService: true,
    localStorageBackup: true,
  },
  errorThresholds: {
    criticalErrorLimit: 5,
    timeWindow: 300000, // 5 minutes
    autoRecoveryAttempts: 3,
  },
  lastErrorTime: 0,
  isErrorDialogOpen: false,
  currentError: null,
};

const errorBoundaryReducer = (state: ErrorBoundaryState, action: ErrorBoundaryAction): ErrorBoundaryState => {
  switch (action.type) {
    case 'ERROR_CAUGHT': {
      const timestamp = Date.now();
      const errorInfo: ErrorInfo = {
        ...action.payload,
        id: `error-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp,
        resolved: false,
        retryCount: 0,
      };

      // Check if we should enter recovery mode
      const recentErrors = state.errors.filter(
        e => timestamp - e.timestamp < state.errorThresholds.timeWindow
      );
      
      const shouldEnterRecovery = 
        recentErrors.length >= state.errorThresholds.criticalErrorLimit ||
        errorInfo.severity === 'critical';

      return {
        ...state,
        errors: [errorInfo, ...state.errors].slice(0, 100), // Keep last 100 errors
        globalErrorCount: state.globalErrorCount + 1,
        lastErrorTime: timestamp,
        isRecoveryMode: shouldEnterRecovery,
        currentError: errorInfo,
        isErrorDialogOpen: errorInfo.severity === 'critical' || errorInfo.severity === 'high',
      };
    }

    case 'ERROR_RESOLVED':
      return {
        ...state,
        errors: state.errors.map(error =>
          error.id === action.payload ? { ...error, resolved: true } : error
        ),
        currentError: state.currentError?.id === action.payload ? null : state.currentError,
      };

    case 'ERROR_RETRY':
      return {
        ...state,
        errors: state.errors.map(error =>
          error.id === action.payload 
            ? { ...error, retryCount: error.retryCount + 1 }
            : error
        ),
      };

    case 'ENTER_RECOVERY_MODE':
      return {
        ...state,
        isRecoveryMode: true,
      };

    case 'EXIT_RECOVERY_MODE':
      return {
        ...state,
        isRecoveryMode: false,
      };

    case 'UPDATE_RECOVERY_STRATEGIES':
      return {
        ...state,
        recoveryStrategies: {
          ...state.recoveryStrategies,
          ...action.payload,
        },
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: [],
        isRecoveryMode: false,
        currentError: null,
        isErrorDialogOpen: false,
      };

    case 'CLEAR_OLD_ERRORS': {
      const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
      return {
        ...state,
        errors: state.errors.filter(error => error.timestamp > cutoff),
      };
    }

    case 'OPEN_ERROR_DIALOG':
      return {
        ...state,
        isErrorDialogOpen: true,
        currentError: action.payload,
      };

    case 'CLOSE_ERROR_DIALOG':
      return {
        ...state,
        isErrorDialogOpen: false,
      };

    case 'UPDATE_ERROR_CONTEXT':
      return {
        ...state,
        errors: state.errors.map(error =>
          error.id === action.payload.errorId
            ? { ...error, context: { ...error.context, ...action.payload.context } }
            : error
        ),
      };

    default:
      return state;
  }
};

interface ErrorBoundaryContextType {
  state: ErrorBoundaryState;
  dispatch: React.Dispatch<ErrorBoundaryAction>;
  
  // Error Management
  captureError: (error: Error, errorInfo: React.ErrorInfo, component: string, severity?: ErrorInfo['severity']) => void;
  resolveError: (errorId: string) => void;
  retryError: (errorId: string) => void;
  clearErrors: () => void;
  
  // Recovery Management
  enterRecoveryMode: () => void;
  exitRecoveryMode: () => void;
  updateRecoveryStrategies: (strategies: Partial<ErrorBoundaryState['recoveryStrategies']>) => void;
  
  // Error Dialog
  openErrorDialog: (error: ErrorInfo) => void;
  closeErrorDialog: () => void;
  
  // Error Analysis
  getErrorStats: () => {
    totalErrors: number;
    resolvedErrors: number;
    criticalErrors: number;
    recentErrors: number;
    averageResolutionTime: number;
  };
  
  // Error Reporting
  reportError: (error: ErrorInfo) => Promise<void>;
  
  // Context Management
  updateErrorContext: (errorId: string, context: Record<string, any>) => void;
}

const ErrorBoundaryContext = createContext<ErrorBoundaryContextType | undefined>(undefined);

interface ErrorBoundaryProviderProps {
  children: ReactNode;
  onError?: (error: ErrorInfo) => void;
  reportingEndpoint?: string;
}

export const ErrorBoundaryProvider: React.FC<ErrorBoundaryProviderProps> = ({ 
  children, 
  onError,
  reportingEndpoint 
}) => {
  const [state, dispatch] = useReducer(errorBoundaryReducer, initialState);

  // Auto-clear old errors
  React.useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'CLEAR_OLD_ERRORS' });
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  // Error Management Methods
  const captureError = useCallback((
    error: Error, 
    errorInfo: React.ErrorInfo, 
    component: string, 
    severity: ErrorInfo['severity'] = 'medium'
  ) => {
    const errorData: Omit<ErrorInfo, 'id' | 'timestamp' | 'resolved' | 'retryCount'> = {
      error,
      errorInfo,
      component,
      severity,
      userAgent: navigator.userAgent,
      url: window.location.href,
      stack: error.stack,
      maxRetries: 3,
      context: {
        localStorage: Object.keys(localStorage).reduce((acc, key) => {
          acc[key] = localStorage.getItem(key);
          return acc;
        }, {} as Record<string, string | null>),
        sessionStorage: Object.keys(sessionStorage).reduce((acc, key) => {
          acc[key] = sessionStorage.getItem(key);
          return acc;
        }, {} as Record<string, string | null>),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      },
    };

    dispatch({ type: 'ERROR_CAUGHT', payload: errorData });

    if (onError) {
      onError({ ...errorData, id: '', timestamp: Date.now(), resolved: false, retryCount: 0 });
    }
  }, [onError]);

  const resolveError = useCallback((errorId: string) => {
    dispatch({ type: 'ERROR_RESOLVED', payload: errorId });
  }, []);

  const retryError = useCallback((errorId: string) => {
    dispatch({ type: 'ERROR_RETRY', payload: errorId });
  }, []);

  const clearErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ERRORS' });
  }, []);

  const enterRecoveryMode = useCallback(() => {
    dispatch({ type: 'ENTER_RECOVERY_MODE' });
  }, []);

  const exitRecoveryMode = useCallback(() => {
    dispatch({ type: 'EXIT_RECOVERY_MODE' });
  }, []);

  const updateRecoveryStrategies = useCallback((strategies: Partial<ErrorBoundaryState['recoveryStrategies']>) => {
    dispatch({ type: 'UPDATE_RECOVERY_STRATEGIES', payload: strategies });
  }, []);

  const openErrorDialog = useCallback((error: ErrorInfo) => {
    dispatch({ type: 'OPEN_ERROR_DIALOG', payload: error });
  }, []);

  const closeErrorDialog = useCallback(() => {
    dispatch({ type: 'CLOSE_ERROR_DIALOG' });
  }, []);

  const updateErrorContext = useCallback((errorId: string, context: Record<string, any>) => {
    dispatch({ type: 'UPDATE_ERROR_CONTEXT', payload: { errorId, context } });
  }, []);

  // Error Analysis
  const getErrorStats = useCallback(() => {
    const totalErrors = state.errors.length;
    const resolvedErrors = state.errors.filter(e => e.resolved).length;
    const criticalErrors = state.errors.filter(e => e.severity === 'critical').length;
    const recentErrors = state.errors.filter(e => Date.now() - e.timestamp < 3600000).length; // Last hour
    
    const resolvedErrorsWithTime = state.errors.filter(e => e.resolved && e.context?.resolutionTime);
    const averageResolutionTime = resolvedErrorsWithTime.length > 0
      ? resolvedErrorsWithTime.reduce((sum, e) => sum + (e.context?.resolutionTime || 0), 0) / resolvedErrorsWithTime.length
      : 0;

    return {
      totalErrors,
      resolvedErrors,
      criticalErrors,
      recentErrors,
      averageResolutionTime,
    };
  }, [state.errors]);

  // Error Reporting
  const reportError = useCallback(async (error: ErrorInfo) => {
    if (!reportingEndpoint || !state.recoveryStrategies.reportToService) return;

    try {
      await fetch(reportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: error.id,
          message: error.error.message,
          stack: error.stack,
          component: error.component,
          severity: error.severity,
          timestamp: error.timestamp,
          url: error.url,
          userAgent: error.userAgent,
          context: error.context,
        }),
      });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }, [reportingEndpoint, state.recoveryStrategies.reportToService]);

  const contextValue = useMemo<ErrorBoundaryContextType>(() => ({
    state,
    dispatch,
    captureError,
    resolveError,
    retryError,
    clearErrors,
    enterRecoveryMode,
    exitRecoveryMode,
    updateRecoveryStrategies,
    openErrorDialog,
    closeErrorDialog,
    updateErrorContext,
    getErrorStats,
    reportError,
  }), [
    state,
    captureError,
    resolveError,
    retryError,
    clearErrors,
    enterRecoveryMode,
    exitRecoveryMode,
    updateRecoveryStrategies,
    openErrorDialog,
    closeErrorDialog,
    updateErrorContext,
    getErrorStats,
    reportError,
  ]);

  return (
    <ErrorBoundaryContext.Provider value={contextValue}>
      {children}
    </ErrorBoundaryContext.Provider>
  );
};

export const useErrorBoundary = (): ErrorBoundaryContextType => {
  const context = useContext(ErrorBoundaryContext);
  if (!context) {
    throw new Error('useErrorBoundary must be used within an ErrorBoundaryProvider');
  }
  return context;
};

// Advanced Error Boundary Component
interface AdvancedErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  isolate?: boolean;
  component?: string;
}

interface AdvancedErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

export class AdvancedErrorBoundary extends Component<AdvancedErrorBoundaryProps, AdvancedErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: AdvancedErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): AdvancedErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorId: `boundary-${Date.now()}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onError, component = 'Unknown' } = this.props;
    
    if (onError) {
      onError(error, errorInfo);
    }

    // Auto-retry for non-critical errors
    if (!error.message.includes('ChunkLoadError') && !error.message.includes('Loading chunk')) {
      this.retryTimeoutId = setTimeout(() => {
        this.handleRetry();
      }, 3000);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      
      if (Fallback) {
        return <Fallback error={this.state.error!} retry={this.handleRetry} />;
      }

      return (
        <div className="error-boundary-fallback p-8 bg-red-50 border border-red-200 rounded-lg m-4">
          <h2 className="text-xl font-bold text-red-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-red-600 mb-4">
            We encountered an unexpected error. Don't worry, your data is safe.
          </p>
          <details className="mb-4">
            <summary className="cursor-pointer text-red-700 font-medium">Error Details</summary>
            <pre className="mt-2 p-3 bg-red-100 rounded text-sm overflow-auto">
              {this.state.error?.stack}
            </pre>
          </details>
          <div className="space-x-3">
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Error Boundary HOC
export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  errorBoundaryProps?: Omit<AdvancedErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: T) => (
    <AdvancedErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </AdvancedErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hooks for Error Management
export const useErrorHandler = () => {
  const { captureError } = useErrorBoundary();
  
  return useCallback((error: Error, component: string, severity: ErrorInfo['severity'] = 'medium') => {
    captureError(error, { componentStack: '' }, component, severity);
  }, [captureError]);
};

export const useErrorStats = () => {
  const { getErrorStats } = useErrorBoundary();
  return getErrorStats();
};
