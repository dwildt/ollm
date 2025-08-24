import request from 'supertest';
import express from 'express';
import cors from 'cors';

// Mock fetch globally before any imports
global.fetch = jest.fn();

// No LlamaIndex mock needed anymore

// Create a test app similar to the main app
const createTestApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', async (_req, res) => {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      if (response && (response as any).ok) {
        res.json({ status: 'healthy', ollama: 'connected' });
      } else {
        res.status(503).json({ status: 'unhealthy', ollama: 'disconnected' });
      }
    } catch (error: any) {
      res.status(503).json({ 
        status: 'unhealthy', 
        ollama: 'disconnected', 
        error: error.message 
      });
    }
  });

  // Models endpoint
  app.get('/api/models', async (_req, res) => {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      if (!response || !(response as any).ok) {
        throw new Error('Ollama server is not available');
      }
      const data = await (response as any).json();
      res.json({ models: data.models || [] });
    } catch (error: any) {
      console.error('Error fetching models:', error);
      res.status(500).json({ error: 'Failed to fetch models from Ollama' });
    }
  });

  // Chat endpoint
  app.post('/api/chat', async (req, res) => {
    const { message, model } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    try {
      const selectedModel = model || 'llama3.2:latest';
      
      const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          prompt: message,
          stream: false
        }),
      });

      if (!ollamaResponse || !(ollamaResponse as any).ok) {
        throw new Error('Ollama API error');
      }

      const data = await (ollamaResponse as any).json();

      return res.json({ 
        response: data.response,
        model: selectedModel
      });
    } catch (error: any) {
      console.error('Error in chat:', error);
      return res.status(500).json({ error: 'Failed to get response from Ollama' });
    }
  });

  return app;
};

describe('API Endpoints', () => {
  let app: express.Application;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  describe('GET /api/health', () => {
    test('returns healthy status when Ollama is available', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ models: [] })
      } as Response);

      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'healthy',
        ollama: 'connected'
      });
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/tags');
    });

    test('returns unhealthy status when Ollama is not available', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503
      } as Response);

      const response = await request(app)
        .get('/api/health')
        .expect(503);

      expect(response.body).toEqual({
        status: 'unhealthy',
        ollama: 'disconnected'
      });
    });

    test('returns unhealthy status when fetch throws error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

      const response = await request(app)
        .get('/api/health')
        .expect(503);

      expect(response.body).toMatchObject({
        status: 'unhealthy',
        ollama: 'disconnected',
        error: 'Connection refused'
      });
    });
  });

  describe('GET /api/models', () => {
    test('returns available models successfully', async () => {
      const mockModels = [
        { name: 'llama2', size: 123456 },
        { name: 'mistral', size: 789012 }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ models: mockModels })
      } as Response);

      const response = await request(app)
        .get('/api/models')
        .expect(200);

      expect(response.body).toEqual({ models: mockModels });
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/tags');
    });

    test('returns empty models when Ollama returns no models', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ models: [] })
      } as Response);

      const response = await request(app)
        .get('/api/models')
        .expect(200);

      expect(response.body).toEqual({ models: [] });
    });

    test('returns error when Ollama is not available', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503
      } as Response);

      const response = await request(app)
        .get('/api/models')
        .expect(500);

      expect(response.body).toMatchObject({
        error: 'Failed to fetch models from Ollama'
      });
    });

    test('handles fetch error gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const response = await request(app)
        .get('/api/models')
        .expect(500);

      expect(response.body).toMatchObject({
        error: 'Failed to fetch models from Ollama'
      });
    });

    test('handles malformed Ollama response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: 'response' })
      } as Response);

      const response = await request(app)
        .get('/api/models')
        .expect(200);

      expect(response.body).toEqual({ models: [] });
    });
  });

  describe('POST /api/chat', () => {
    test('sends message successfully with default model', async () => {
      const mockOllamaResponse = {
        response: 'Hello! How can I help you today?'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockOllamaResponse
      } as Response);

      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Hello, world!'
        })
        .expect(200);

      expect(response.body).toEqual({
        response: 'Hello! How can I help you today?',
        model: 'llama3.2:latest'
      });

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.2:latest',
          prompt: 'Hello, world!',
          stream: false
        })
      });
    });

    test('sends message successfully with specified model', async () => {
      const mockOllamaResponse = {
        response: 'Response from Mistral'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockOllamaResponse
      } as Response);

      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Test message',
          model: 'mistral'
        })
        .expect(200);

      expect(response.body).toEqual({
        response: 'Response from Mistral',
        model: 'mistral'
      });
    });

    test('returns 400 when message is missing', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        error: 'Message is required'
      });

      expect(mockFetch).toHaveBeenCalledTimes(0);
    });

    test('returns 400 when message is empty string', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: ''
        })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Message is required'
      });
    });

    test('returns 400 when message is only whitespace', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: '   '
        })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Message is required'
      });
    });

    test('handles Ollama error gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Ollama connection failed'));

      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Test message'
        })
        .expect(500);

      expect(response.body).toMatchObject({
        error: 'Failed to get response from Ollama'
      });
    });

    test('handles long messages', async () => {
      const longMessage = 'a'.repeat(10000);
      const mockOllamaResponse = {
        response: 'I received your long message!'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockOllamaResponse
      } as Response);

      const response = await request(app)
        .post('/api/chat')
        .send({
          message: longMessage
        })
        .expect(200);

      expect(response.body.response).toBe('I received your long message!');
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/generate', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining(longMessage)
      }));
    });

    test('handles special characters in message', async () => {
      const specialMessage = 'Hello! 👋 How are you? 🤔 Testing émojis and açcénts.';
      const mockOllamaResponse = {
        response: 'I can handle special characters!'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockOllamaResponse
      } as Response);

      const response = await request(app)
        .post('/api/chat')
        .send({
          message: specialMessage
        })
        .expect(200);

      expect(response.body.response).toBe('I can handle special characters!');
    });
  });

  describe('CORS', () => {
    test('includes CORS headers in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ models: [] })
      } as Response);

      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    test('handles preflight OPTIONS request', async () => {
      await request(app)
        .options('/api/chat')
        .expect(204);
    });
  });

  describe('Error handling', () => {
    test('returns 404 for unknown routes', async () => {
      await request(app)
        .get('/api/unknown')
        .expect(404);
    });
  });
});