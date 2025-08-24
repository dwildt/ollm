export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  model?: string;
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