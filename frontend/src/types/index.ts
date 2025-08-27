export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  model?: string;
  error?: {
    details: string;
    type?: 'timeout' | 'network' | 'server' | 'unknown';
  };
}

export interface Model {
  name: string;
  size?: number;
  digest?: string;
  modified_at?: string;
}

export interface ApiResponse {
  response: string;
  model: string;
}

export interface HealthResponse {
  status: string;
  ollama: string;
  error?: string;
}

export interface ModelsResponse {
  models: Model[];
}

// Re-export template types for convenience
export * from './templates';