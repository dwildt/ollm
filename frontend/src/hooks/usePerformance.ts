import { useEffect, useCallback, useMemo } from 'react';

export interface PerformanceMetrics {
  renderTime: number;
  componentCount: number;
  memoryUsage?: number;
}

// Custom hook for performance monitoring
export const usePerformance = (componentName: string) => {
  const startTime = useMemo(() => Date.now(), []);

  // Measure component render time
  useEffect(() => {
    const renderTime = Date.now() - startTime;
    
    if (renderTime > 100) { // Only log slow renders
      console.debug(`🐌 Slow render detected: ${componentName} took ${renderTime}ms`);
    }
    
    // Log to performance API if available
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(`${componentName}-render-end`);
      if (performance.getEntriesByName(`${componentName}-render-start`).length > 0) {
        performance.measure(
          `${componentName}-render`,
          `${componentName}-render-start`,
          `${componentName}-render-end`
        );
      }
    }
  }, [componentName, startTime]);

  // Mark render start
  useEffect(() => {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(`${componentName}-render-start`);
    }
  }, [componentName]);

  const logPerformanceMetric = useCallback((metric: string, value: number) => {
    console.debug(`📊 ${componentName} - ${metric}: ${value}`);
  }, [componentName]);

  const measureAsync = useCallback(async <T,>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const start = Date.now();
    try {
      const result = await operation();
      const duration = Date.now() - start;
      logPerformanceMetric(`${operationName} duration`, duration);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logPerformanceMetric(`${operationName} failed after`, duration);
      throw error;
    }
  }, [logPerformanceMetric]);

  return {
    logPerformanceMetric,
    measureAsync
  };
};

// Hook for optimizing re-renders
export const useOptimizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
  debugName?: string
) => {
  return useCallback((...args: Parameters<T>) => {
    if (debugName && args.length > 0) {
      console.debug(`🔄 Callback triggered: ${debugName}`);
    }
    return callback(...args);
  }, deps);
};

// Hook for memoizing expensive computations
export const useOptimizedMemo = <T>(
  factory: () => T,
  deps: React.DependencyList,
  debugName?: string
) => {
  return useMemo(() => {
    if (debugName) {
      console.debug(`🧠 Memo computed: ${debugName}`);
    }
    return factory();
  }, deps);
};