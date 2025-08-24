import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  interactionTime?: number;
}

interface UsePerformanceOptions {
  trackRenderTime?: boolean;
  trackMemoryUsage?: boolean;
  trackInteractions?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

export const usePerformance = (options: UsePerformanceOptions = {}) => {
  const {
    trackRenderTime = true,
    trackMemoryUsage = false,
    trackInteractions = false,
    onMetricsUpdate
  } = options;

  const renderStartTime = useRef<number>(0);
  const interactionStartTime = useRef<number>(0);
  const metrics = useRef<PerformanceMetrics>({ renderTime: 0 });

  // Track render performance
  useEffect(() => {
    if (trackRenderTime) {
      renderStartTime.current = performance.now();
      
      return () => {
        const renderTime = performance.now() - renderStartTime.current;
        metrics.current.renderTime = renderTime;
        
        if (onMetricsUpdate) {
          onMetricsUpdate(metrics.current);
        }
        
        // Log in development
        if (import.meta.env.DEV) {
          console.log(`🔄 Component render time: ${renderTime.toFixed(2)}ms`);
        }
      };
    }
  });

  // Track memory usage (if available)
  useEffect(() => {
    if (trackMemoryUsage && 'memory' in performance) {
      const memory = (performance as any).memory;
      metrics.current.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
      
      if (onMetricsUpdate) {
        onMetricsUpdate(metrics.current);
      }
    }
  }, [trackMemoryUsage, onMetricsUpdate]);

  // Track user interactions
  const trackInteraction = useCallback(() => {
    if (trackInteractions) {
      interactionStartTime.current = performance.now();
    }
  }, [trackInteractions]);

  const endInteraction = useCallback(() => {
    if (trackInteractions && interactionStartTime.current > 0) {
      const interactionTime = performance.now() - interactionStartTime.current;
      metrics.current.interactionTime = interactionTime;
      
      if (onMetricsUpdate) {
        onMetricsUpdate(metrics.current);
      }
      
      // Log in development
      if (import.meta.env.DEV) {
        console.log(`👆 Interaction time: ${interactionTime.toFixed(2)}ms`);
      }
      
      interactionStartTime.current = 0;
    }
  }, [trackInteractions, onMetricsUpdate]);

  // Performance optimization suggestions
  const getOptimizationSuggestions = useCallback(() => {
    const suggestions: string[] = [];
    
    if (metrics.current.renderTime > 16) { // 60fps threshold
      suggestions.push('Consider using React.memo or useMemo for expensive renders');
    }
    
    if (metrics.current.renderTime > 100) {
      suggestions.push('Component is taking too long to render. Consider code splitting or virtualization');
    }
    
    if (metrics.current.memoryUsage && metrics.current.memoryUsage > 50) {
      suggestions.push('High memory usage detected. Check for memory leaks or large objects');
    }
    
    return suggestions;
  }, []);

  return {
    metrics: metrics.current,
    trackInteraction,
    endInteraction,
    getOptimizationSuggestions,
    // Utility to measure specific operations
    measureOperation: (operationName: string, operation: () => void) => {
      const start = performance.now();
      operation();
      const duration = performance.now() - start;
      
      if (import.meta.env.DEV) {
        console.log(`⏱️ ${operationName}: ${duration.toFixed(2)}ms`);
      }
      
      return duration;
    }
  };
};
