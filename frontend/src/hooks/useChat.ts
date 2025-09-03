import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Message, Model } from '../types';
import { ConversationTemplate } from '../types/templates';
import { apiService } from '../services/api';
import { conversationStorage } from '../services/conversationStorage';
import { usePerformance, useOptimizedCallback, useOptimizedMemo } from './usePerformance';

export interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  selectedModel: string;
  models: Model[];
  isOllamaConnected: boolean | null;
  currentConversationId: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  setSelectedModel: (model: string) => void;
  loadConversation: (conversationId: string) => void;
}

export const useChat = (selectedTemplate?: ConversationTemplate | null): UseChatReturn => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { logPerformanceMetric, measureAsync } = usePerformance('useChat');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('');
  const [models, setModels] = useState<Model[]>([]);
  const [isOllamaConnected, setIsOllamaConnected] = useState<boolean | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Memoized best model selection function with performance optimization
  const getBestModel = useOptimizedMemo(() => (models: Model[]) => {
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
    
    return models[0]?.name || '';
  }, [], 'getBestModel');

  // Check Ollama health with performance monitoring
  const checkOllamaHealth = useOptimizedCallback(async () => {
    try {
      const health = await measureAsync(() => apiService.checkHealth(), 'health-check');
      setIsOllamaConnected(health.status === 'healthy');
      setError(null);
    } catch (error) {
      setIsOllamaConnected(false);
      setError('Failed to connect to Ollama service');
    }
  }, [], 'checkOllamaHealth');

  // Load available models with performance monitoring
  const loadModels = useOptimizedCallback(async () => {
    try {
      const modelsResponse = await measureAsync(() => apiService.getModels(), 'load-models');
      setModels(modelsResponse.models);
      logPerformanceMetric('models loaded', modelsResponse.models.length);
      
      if (modelsResponse.models.length > 0 && !selectedModel) {
        setSelectedModel(getBestModel(modelsResponse.models));
      }
      setError(null);
    } catch (error) {
      // Silently handle model loading errors
      setModels([]);
      setError('Failed to load available models');
    }
  }, [selectedModel, getBestModel, measureAsync, logPerformanceMetric], 'loadModels');

  // Send message to API with performance optimization
  const sendMessage = useOptimizedCallback(async (message: string) => {
    if (isLoading || !selectedModel || !message.trim()) return;

    const startTime = Date.now();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await measureAsync(
        () => apiService.sendMessage(message, selectedModel),
        'send-message'
      );
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isUser: false,
        timestamp: new Date(),
        model: response.model,
      };

      setMessages(prev => [...prev, botMessage]);
      logPerformanceMetric('total conversation time', Date.now() - startTime);
    } catch (error: unknown) {
      // Silently handle message sending errors
      
      let errorText = 'Sorry, I encountered an error.';
      let errorType: 'timeout' | 'network' | 'server' | 'unknown' = 'unknown';
      let errorDetails = String(error);
      
      if (error && typeof error === 'object') {
        const err = error as {
          response?: {
            status: number;
            statusText: string;
            data?: {
              error?: string;
              [key: string]: unknown;
            };
          };
          request?: {
            responseURL?: string;
            [key: string]: unknown;
          };
          message?: string;
          code?: string;
          stack?: string;
          timeout?: number;
        };
        
        if (err.response) {
          errorDetails = `HTTP ${err.response.status}: ${err.response.statusText}\n${JSON.stringify(err.response.data, null, 2)}`;
          errorType = err.response.status >= 500 ? 'server' : 'network';
        } else if (err.request) {
          errorDetails = `Network Error: ${err.message}\nRequest: ${err.request.responseURL || 'Unknown URL'}`;
          errorType = 'network';
        } else {
          errorDetails = `Error: ${err.message}\nStack: ${err.stack}`;
        }
        
        if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
          errorText = 'Request timed out. Please try again.';
          errorType = 'timeout';
          errorDetails = `Timeout Error: ${err.message}\nCode: ${err.code}\nTimeout: ${err.timeout}ms`;
        } else if (err.response?.status === 408) {
          errorText = err.response.data?.error || 'Request timed out';
          errorType = 'timeout';
        } else if (err.response?.data?.error) {
          errorText = err.response.data.error;
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        isUser: false,
        timestamp: new Date(),
        error: {
          details: errorDetails,
          type: errorType,
        },
      };

      setMessages(prev => [...prev, errorMessage]);
      setError(errorText);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, selectedModel, measureAsync, logPerformanceMetric], 'sendMessage');

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentConversationId(null);
    setError(null);
    // Remove navigation since '/' now points directly to ChatNew
    // navigate('/', { replace: true });
  }, []);

  // Load conversation by ID
  const loadConversation = useCallback((conversationId: string) => {
    const conversation = conversationStorage.loadConversation(conversationId);
    if (conversation) {
      const loadedMessages: Message[] = conversation.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      
      setMessages(loadedMessages);
      setCurrentConversationId(conversation.id);
      setSelectedModel(conversation.model);
      setError(null);
    }
  }, []);

  // Auto-save conversation
  useEffect(() => {
    if (messages.length > 0) {
      const saveDelay = setTimeout(() => {
        const conversationId = conversationStorage.saveConversation(
          messages,
          selectedModel,
          selectedTemplate?.id,
          currentConversationId || undefined
        );
        if (!currentConversationId) {
          setCurrentConversationId(conversationId);
        }
      }, 1000); // Debounce for 1 second

      return () => clearTimeout(saveDelay);
    }
  }, [messages, selectedModel, selectedTemplate, currentConversationId]);

  // Handle conversation loading from URL
  useEffect(() => {
    if (conversationId && conversationId !== currentConversationId) {
      loadConversation(conversationId);
    } else if (!conversationId && currentConversationId && messages.length === 0) {
      // Only clear if there are no messages to preserve user's conversation
      clearMessages();
    }
  }, [conversationId, currentConversationId, loadConversation, clearMessages, messages.length]);

  // Initialize health check and models
  useEffect(() => {
    checkOllamaHealth();
    loadModels();
  }, [checkOllamaHealth, loadModels]);

  return {
    messages,
    isLoading,
    error,
    selectedModel,
    models,
    isOllamaConnected,
    currentConversationId,
    sendMessage,
    clearMessages,
    setSelectedModel,
    loadConversation,
  };
};