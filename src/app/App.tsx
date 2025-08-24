import React from 'react';
import { ContextComposer } from '../../contexts/ContextComposer';
import { Router } from './Router';
import ContextDevTools from '../../contexts/ContextDevTools';

// Main App with Advanced Context Engineering
function App(): React.ReactNode {
  return (
    <ContextComposer
      config={{
        enablePerformanceMonitoring: true,
        enableErrorBoundaries: true,
        errorReportingEndpoint: import.meta.env.VITE_ERROR_REPORTING_ENDPOINT,
        theme: 'dark',
        enableAutoOptimizations: true,
      }}
    >
      <Router />
      <ContextDevTools />
    </ContextComposer>
  );
}

export default App;
