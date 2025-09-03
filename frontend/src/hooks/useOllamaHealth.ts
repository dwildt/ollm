import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export interface UseOllamaHealthReturn {
  isOllamaConnected: boolean | null;
  checkHealth: () => Promise<void>;
  healthError: string | null;
}

export const useOllamaHealth = (): UseOllamaHealthReturn => {
  const [isOllamaConnected, setIsOllamaConnected] = useState<boolean | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    try {
      const health = await apiService.checkHealth();
      setIsOllamaConnected(health.status === 'healthy');
      setHealthError(null);
    } catch (error) {
      setIsOllamaConnected(false);
      setHealthError(error instanceof Error ? error.message : 'Health check failed');
    }
  }, []);

  // Initial health check and periodic checks
  useEffect(() => {
    checkHealth();
    
    // Check health every 30 seconds
    const healthInterval = setInterval(checkHealth, 30000);
    
    return () => clearInterval(healthInterval);
  }, [checkHealth]);

  return {
    isOllamaConnected,
    checkHealth,
    healthError,
  };
};