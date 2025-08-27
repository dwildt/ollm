import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3002;
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

app.use(cors());
app.use(express.json());

// Get available models
app.get('/api/models', async (_req, res) => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) {
      throw new Error('Ollama server is not available');
    }
    const data: any = await response.json();
    res.json({ models: data.models || [] });
  } catch (error: any) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Failed to fetch models from Ollama' });
  }
});

// Health check for Ollama
app.get('/api/health', async (_req, res) => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (response.ok) {
      res.json({ status: 'healthy', ollama: 'connected' });
    } else {
      res.status(503).json({ status: 'unhealthy', ollama: 'disconnected' });
    }
  } catch (error: any) {
    res.status(503).json({ status: 'unhealthy', ollama: 'disconnected', error: error.message });
  }
});

// Chat endpoint
app.post('/api/chat', async (req, res): Promise<any> => {
  const { message, model } = req.body;
  
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const selectedModel = model || 'llama3.2:latest';
    
    // Set a longer timeout for larger models (5 minutes)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

    const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: selectedModel,
        prompt: message,
        stream: false
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API error: ${ollamaResponse.status}`);
    }

    const data: any = await ollamaResponse.json();

    return res.json({ 
      response: data.response,
      model: selectedModel
    });
  } catch (error: any) {
    console.error('Error in chat:', error);
    if (error.name === 'AbortError') {
      return res.status(408).json({ error: 'Request timeout - The model is taking too long to respond. Try a smaller model or a shorter message.' });
    }
    return res.status(500).json({ error: 'Failed to get response from Ollama' });
  }
});

// Handle 404 errors
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Ollama URL: ${OLLAMA_BASE_URL}`);
  });
}

export default app;