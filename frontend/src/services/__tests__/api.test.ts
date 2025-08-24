import { AxiosResponse } from 'axios';
import { ApiResponse, HealthResponse, ModelsResponse } from '../types';

const mockAxiosInstance = {
  post: jest.fn(),
  get: jest.fn(),
};

const mockAxios = {
  create: jest.fn(() => mockAxiosInstance),
};

jest.doMock('axios', () => mockAxios);

// Import the service after mocking axios
const { apiService } = require('../api');

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  describe('sendMessage', () => {
    test('sends message successfully', async () => {
      const mockResponse: AxiosResponse<ApiResponse> = {
        data: {
          response: 'Hello! How can I help you?',
          model: 'llama2'
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await apiService.sendMessage('Hello', 'llama2');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/chat', {
        message: 'Hello',
        model: 'llama2'
      });
      expect(result).toEqual({
        response: 'Hello! How can I help you?',
        model: 'llama2'
      });
    });

    test('handles sendMessage error', async () => {
      const mockError = new Error('Network Error');
      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(apiService.sendMessage('Hello', 'llama2')).rejects.toThrow('Network Error');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/chat', {
        message: 'Hello',
        model: 'llama2'
      });
    });

    test('sends message with different models', async () => {
      const mockResponse: AxiosResponse<ApiResponse> = {
        data: {
          response: 'Response from Mistral',
          model: 'mistral'
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      await apiService.sendMessage('Test message', 'mistral');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/chat', {
        message: 'Test message',
        model: 'mistral'
      });
    });
  });

  describe('getModels', () => {
    test('fetches models successfully', async () => {
      const mockModels = [
        { name: 'llama2', size: 123456, digest: 'abc123', modified_at: '2024-01-01' },
        { name: 'mistral', size: 789012, digest: 'def456', modified_at: '2024-01-02' }
      ];
      const mockResponse: AxiosResponse<ModelsResponse> = {
        data: {
          models: mockModels
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await apiService.getModels();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/models');
      expect(result).toEqual({ models: mockModels });
    });

    test('handles getModels error', async () => {
      const mockError = new Error('Failed to fetch models');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(apiService.getModels()).rejects.toThrow('Failed to fetch models');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/models');
    });

    test('handles empty models response', async () => {
      const mockResponse: AxiosResponse<ModelsResponse> = {
        data: {
          models: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await apiService.getModels();

      expect(result).toEqual({ models: [] });
    });
  });

  describe('checkHealth', () => {
    test('returns healthy status', async () => {
      const mockResponse: AxiosResponse<HealthResponse> = {
        data: {
          status: 'healthy',
          ollama: 'connected'
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await apiService.checkHealth();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/health');
      expect(result).toEqual({
        status: 'healthy',
        ollama: 'connected'
      });
    });

    test('returns unhealthy status', async () => {
      const mockResponse: AxiosResponse<HealthResponse> = {
        data: {
          status: 'unhealthy',
          ollama: 'disconnected',
          error: 'Connection timeout'
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await apiService.checkHealth();

      expect(result).toEqual({
        status: 'unhealthy',
        ollama: 'disconnected',
        error: 'Connection timeout'
      });
    });

    test('handles checkHealth error', async () => {
      const mockError = new Error('Health check failed');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(apiService.checkHealth()).rejects.toThrow('Health check failed');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/health');
    });
  });


  describe('error response handling', () => {
    test('propagates axios error response data', async () => {
      const mockError = {
        response: {
          status: 500,
          data: {
            error: 'Internal Server Error'
          }
        }
      };
      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(apiService.sendMessage('Hello', 'llama2')).rejects.toEqual(mockError);
    });

    test('propagates network errors', async () => {
      const networkError = new Error('Network Error');
      networkError.name = 'NetworkError';
      mockAxiosInstance.get.mockRejectedValue(networkError);

      await expect(apiService.checkHealth()).rejects.toThrow('Network Error');
    });
  });
});