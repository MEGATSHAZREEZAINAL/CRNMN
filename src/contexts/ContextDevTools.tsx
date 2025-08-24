import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppState } from './AppStateContext';
import { usePerformance } from './PerformanceContext';
import { useErrorBoundary } from './ErrorBoundaryContext';
import { useAuth } from './AuthContext';

// ============================================================================
// ADVANCED CONTEXT DEVELOPMENT TOOLS & DEBUGGING
// ============================================================================

interface DevToolsState {
  isOpen: boolean;
  activeTab: 'state' | 'performance' | 'errors' | 'auth' | 'network';
  inspectedObject: any;
  historyEnabled: boolean;
  stateHistory: Array<{ timestamp: number; state: any; action?: string }>;
  maxHistorySize: number;
}

export const ContextDevTools: React.FC = () => {
  const [devState, setDevState] = useState<DevToolsState>({
    isOpen: false,
    activeTab: 'state',
    inspectedObject: null,
    historyEnabled: true,
    stateHistory: [],
    maxHistorySize: 50,
  });

  // Only render in development
  if (import.meta.env.PROD) return null;

  const toggleDevTools = useCallback(() => {
    setDevState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const setActiveTab = useCallback((tab: DevToolsState['activeTab']) => {
    setDevState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  // Keyboard shortcut to toggle dev tools
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggleDevTools();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleDevTools]);

  if (!devState.isOpen) {
    return (
      <button
        onClick={toggleDevTools}
        className="fixed bottom-4 right-4 z-[9999] bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Open Context DevTools (Ctrl+Shift+D)"
      >
        🔧
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* DevTools Panel */}
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gray-900 text-white border-t-2 border-blue-500 pointer-events-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <h3 className="font-bold text-blue-400">Context DevTools</h3>
            <div className="flex space-x-1">
              {(['state', 'performance', 'errors', 'auth', 'network'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded text-xs font-medium capitalize transition-colors ${
                    devState.activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={toggleDevTools}
            className="text-gray-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="h-full overflow-auto p-4">
          {devState.activeTab === 'state' && <StateInspector />}
          {devState.activeTab === 'performance' && <PerformanceMonitor />}
          {devState.activeTab === 'errors' && <ErrorMonitor />}
          {devState.activeTab === 'auth' && <AuthInspector />}
          {devState.activeTab === 'network' && <NetworkMonitor />}
        </div>
      </div>
    </div>
  );
};

// State Inspector Component
const StateInspector: React.FC = () => {
  const { state, metrics } = useAppState();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  }, []);

  const sections = [
    { key: 'overview', title: 'Overview', data: metrics },
    { key: 'sales', title: 'Sales', data: state.sales },
    { key: 'inventory', title: 'Inventory', data: state.inventory },
    { key: 'customers', title: 'Customers', data: state.customers },
    { key: 'financials', title: 'Financials', data: {
      totalRevenue: state.totalRevenue,
      cogs: state.cogs,
      profit: state.profit,
      expenses: state.fixedExpenses,
    }},
    { key: 'ui', title: 'UI State', data: {
      activeView: state.activeView,
      sidebarCollapsed: state.sidebarCollapsed,
      notifications: state.notifications.length,
    }},
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-green-400">Application State</h4>
        <span className="text-xs text-gray-400">
          Last updated: {new Date(state.lastUpdated).toLocaleTimeString()}
        </span>
      </div>
      
      {sections.map(({ key, title, data }) => (
        <div key={key} className="border border-gray-700 rounded">
          <button
            onClick={() => toggleSection(key)}
            className="w-full text-left p-3 bg-gray-800 hover:bg-gray-750 flex items-center justify-between"
          >
            <span className="font-medium">{title}</span>
            <span className={`transform transition-transform ${
              expandedSections.has(key) ? 'rotate-90' : ''
            }`}>
              ▶
            </span>
          </button>
          
          {expandedSections.has(key) && (
            <div className="p-3 bg-gray-850">
              <pre className="text-xs text-green-300 overflow-auto max-h-40">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Performance Monitor Component
const PerformanceMonitor: React.FC = () => {
  const { state: perfState, getPerformanceReport } = usePerformance();
  const [report, setReport] = useState(getPerformanceReport());

  useEffect(() => {
    const interval = setInterval(() => {
      setReport(getPerformanceReport());
    }, 1000);

    return () => clearInterval(interval);
  }, [getPerformanceReport]);

  const formatTime = (ms: number) => `${ms.toFixed(2)}ms`;
  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-yellow-400">Performance Metrics</h4>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-3 rounded">
          <div className="text-xs text-gray-400">Total Renders</div>
          <div className="text-lg font-bold text-yellow-400">{report.renderCount}</div>
        </div>
        <div className="bg-gray-800 p-3 rounded">
          <div className="text-xs text-gray-400">Avg Render Time</div>
          <div className="text-lg font-bold text-yellow-400">{formatTime(report.averageRenderTime)}</div>
        </div>
        <div className="bg-gray-800 p-3 rounded">
          <div className="text-xs text-gray-400">Memory Usage</div>
          <div className="text-lg font-bold text-yellow-400">{formatPercentage(report.memoryUsage)}</div>
        </div>
        <div className="bg-gray-800 p-3 rounded">
          <div className="text-xs text-gray-400">Cache Hit Rate</div>
          <div className="text-lg font-bold text-yellow-400">{formatPercentage(report.cacheHitRate)}</div>
        </div>
      </div>

      {/* Component Performance */}
      <div>
        <h5 className="font-medium text-yellow-300 mb-2">Component Performance</h5>
        <div className="space-y-2 max-h-40 overflow-auto">
          {Object.entries(report.componentPerformance).map(([component, stats]) => (
            <div key={component} className="bg-gray-800 p-2 rounded text-xs">
              <div className="flex justify-between items-center">
                <span className="font-medium">{component}</span>
                <span className="text-yellow-400">{stats.renders} renders</span>
              </div>
              <div className="text-gray-400 mt-1">
                Avg: {formatTime(stats.avgTime)} | Slowest: {formatTime(stats.slowest)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Metrics */}
      <div>
        <h5 className="font-medium text-yellow-300 mb-2">API Performance</h5>
        <div className="bg-gray-800 p-3 rounded">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>Total Calls: <span className="text-yellow-400">{report.apiCallMetrics.total}</span></div>
            <div>Success Rate: <span className="text-green-400">
              {report.apiCallMetrics.total > 0 
                ? formatPercentage(report.apiCallMetrics.successful / report.apiCallMetrics.total)
                : '0%'
              }
            </span></div>
            <div>Failed: <span className="text-red-400">{report.apiCallMetrics.failed}</span></div>
            <div>Avg Response: <span className="text-yellow-400">{formatTime(report.apiCallMetrics.averageResponseTime)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Error Monitor Component
const ErrorMonitor: React.FC = () => {
  const { state: errorState, getErrorStats, clearErrors } = useErrorBoundary();
  const stats = getErrorStats();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-red-400">Error Monitoring</h4>
        <button
          onClick={clearErrors}
          className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
        >
          Clear All
        </button>
      </div>

      {/* Error Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-3 rounded">
          <div className="text-xs text-gray-400">Total Errors</div>
          <div className="text-lg font-bold text-red-400">{stats.totalErrors}</div>
        </div>
        <div className="bg-gray-800 p-3 rounded">
          <div className="text-xs text-gray-400">Critical Errors</div>
          <div className="text-lg font-bold text-red-400">{stats.criticalErrors}</div>
        </div>
        <div className="bg-gray-800 p-3 rounded">
          <div className="text-xs text-gray-400">Recent Errors</div>
          <div className="text-lg font-bold text-red-400">{stats.recentErrors}</div>
        </div>
        <div className="bg-gray-800 p-3 rounded">
          <div className="text-xs text-gray-400">Resolved</div>
          <div className="text-lg font-bold text-green-400">{stats.resolvedErrors}</div>
        </div>
      </div>

      {/* Recent Errors */}
      <div>
        <h5 className="font-medium text-red-300 mb-2">Recent Errors</h5>
        <div className="space-y-2 max-h-48 overflow-auto">
          {errorState.errors.slice(0, 10).map(error => (
            <div key={error.id} className="bg-gray-800 p-3 rounded">
              <div className="flex items-center justify-between mb-1">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  error.severity === 'critical' ? 'bg-red-600 text-white' :
                  error.severity === 'high' ? 'bg-orange-600 text-white' :
                  error.severity === 'medium' ? 'bg-yellow-600 text-black' :
                  'bg-blue-600 text-white'
                }`}>
                  {error.severity}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(error.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-sm font-medium text-red-300">{error.error.message}</div>
              <div className="text-xs text-gray-400 mt-1">Component: {error.component}</div>
              {error.resolved && (
                <div className="text-xs text-green-400 mt-1">✓ Resolved</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Auth Inspector Component
const AuthInspector: React.FC = () => {
  const { user, isAuthenticated, isOwner, isManager, isCrew } = useAuth();

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-blue-400">Authentication State</h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-3 rounded">
          <div className="text-xs text-gray-400">Status</div>
          <div className={`text-lg font-bold ${isAuthenticated ? 'text-green-400' : 'text-red-400'}`}>
            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </div>
        </div>
        <div className="bg-gray-800 p-3 rounded">
          <div className="text-xs text-gray-400">Role</div>
          <div className="text-lg font-bold text-blue-400">
            {user?.role || 'None'}
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div>
        <h5 className="font-medium text-blue-300 mb-2">Permissions</h5>
        <div className="bg-gray-800 p-3 rounded">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className={`flex items-center ${isOwner ? 'text-green-400' : 'text-gray-500'}`}>
              {isOwner ? '✓' : '✗'} Owner
            </div>
            <div className={`flex items-center ${isManager ? 'text-green-400' : 'text-gray-500'}`}>
              {isManager ? '✓' : '✗'} Manager
            </div>
            <div className={`flex items-center ${isCrew ? 'text-green-400' : 'text-gray-500'}`}>
              {isCrew ? '✓' : '✗'} Crew
            </div>
          </div>
        </div>
      </div>

      {/* User Details */}
      {user && (
        <div>
          <h5 className="font-medium text-blue-300 mb-2">User Details</h5>
          <div className="bg-gray-800 p-3 rounded">
            <pre className="text-xs text-green-300 overflow-auto">
              {JSON.stringify({
                uid: user.uid,
                email: user.email,
                businessId: user.businessId,
                businessName: user.businessName,
                role: user.role,
              }, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

// Network Monitor Component
const NetworkMonitor: React.FC = () => {
  const [networkRequests, setNetworkRequests] = useState<Array<{
    id: string;
    url: string;
    method: string;
    status: number;
    duration: number;
    timestamp: number;
  }>>([]);

  // Mock network monitoring (in real app, this would hook into fetch/axios)
  useEffect(() => {
    // This would be implemented to monitor actual network requests
    const mockRequest = () => {
      const request = {
        id: Math.random().toString(36),
        url: '/api/sales',
        method: 'GET',
        status: 200,
        duration: Math.random() * 1000,
        timestamp: Date.now(),
      };
      setNetworkRequests(prev => [request, ...prev.slice(0, 49)]);
    };

    const interval = setInterval(mockRequest, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-purple-400">Network Activity</h4>
      
      <div className="space-y-2 max-h-64 overflow-auto">
        {networkRequests.map(request => (
          <div key={request.id} className="bg-gray-800 p-3 rounded">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-purple-300">
                {request.method} {request.url}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(request.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className={`px-2 py-1 rounded ${
                request.status >= 200 && request.status < 300 ? 'bg-green-600' :
                request.status >= 400 ? 'bg-red-600' : 'bg-yellow-600'
              } text-white`}>
                {request.status}
              </span>
              <span className="text-gray-400">{request.duration.toFixed(0)}ms</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContextDevTools;
