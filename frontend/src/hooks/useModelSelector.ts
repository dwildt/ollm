import { useState, useEffect, useCallback, useMemo } from 'react';
import { Model } from '../types';
import { apiService } from '../services/api';

export interface UseModelSelectorReturn {
  models: Model[];
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  loadModels: () => Promise<void>;
  modelsLoading: boolean;
  modelsError: string | null;
}

export const useModelSelector = (initialModel?: string): UseModelSelectorReturn => {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState(initialModel || '');
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsError, setModelsError] = useState<string | null>(null);

  // Memoized model selection logic
  const getBestModel = useMemo(() => (models: Model[]): string => {
    const llamaVariants = [
      'llama3.2:latest',
      'llama3.1:latest', 
      'llama3:latest',
      'llama2:latest',
      'llama2',
      'llama'
    ];
    
    for (const variant of llamaVariants) {
      const found = models.find(m => m.name === variant);
      if (found) return variant;
    }
    
    const anyLlama = models.find(m => m.name.toLowerCase().includes('llama'));
    if (anyLlama) return anyLlama.name;
    
    return models.length > 0 ? models[0].name : '';
  }, []);

  // Load available models from API
  const loadModels = useCallback(async () => {
    setModelsLoading(true);
    setModelsError(null);
    
    try {
      const modelsResponse = await apiService.getModels();
      setModels(modelsResponse.models);
      
      // Auto-select best model if none is selected
      if (modelsResponse.models.length > 0 && !selectedModel) {
        const bestModel = getBestModel(modelsResponse.models);
        setSelectedModel(bestModel);
      }
    } catch (error) {
      // Silently handle model loading errors
      setModels([]);
      setModelsError(error instanceof Error ? error.message : 'Failed to load models');
    } finally {
      setModelsLoading(false);
    }
  }, [selectedModel, getBestModel]);

  // Load models on mount
  useEffect(() => {
    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Validate selected model exists in available models
  useEffect(() => {
    if (models.length > 0 && selectedModel && !models.find(m => m.name === selectedModel)) {
      const bestModel = getBestModel(models);
      setSelectedModel(bestModel);
    }
  }, [models, selectedModel, getBestModel]);

  return {
    models,
    selectedModel,
    setSelectedModel,
    loadModels,
    modelsLoading,
    modelsError,
  };
};