import axios from 'axios';
import { ApiResponse, HealthResponse, ModelsResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const apiService = {
  async sendMessage(message: string, model: string): Promise<ApiResponse> {
    const response = await api.post('/chat', { message, model });
    return response.data;
  },

  async getModels(): Promise<ModelsResponse> {
    const response = await api.get('/models');
    return response.data;
  },

  async checkHealth(): Promise<HealthResponse> {
    const response = await api.get('/health');
    return response.data;
  },
};