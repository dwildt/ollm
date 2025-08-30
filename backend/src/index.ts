import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { specs, swaggerUi } from './swagger';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4001;
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

app.use(cors());
app.use(express.json());

// Swagger documentation (enabled by default, can be disabled with ENABLE_SWAGGER=false)
const enableSwagger = process.env.ENABLE_SWAGGER !== 'false';
if (enableSwagger) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}


// Helper function to get the best available model
const getBestAvailableModel = async (preferredModel?: string): Promise<string> => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) {
      return 'llama3.2:latest'; // fallback if Ollama is not available
    }
    
    const data: any = await response.json();
    const models = data.models || [];
    
    if (models.length === 0) {
      return 'llama3.2:latest'; // fallback if no models
    }
    
    // If a specific model is requested, use it if available
    if (preferredModel) {
      const exactMatch = models.find((m: any) => m.name === preferredModel);
      if (exactMatch) return preferredModel;
    }
    
    // Look for llama variants in order of preference
    const llamaVariants = [
      'llama',
      'llama3.2:latest',
      'llama3.1:latest', 
      'llama3:latest',
      'llama2:latest',
      'llama2'
    ];
    
    for (const variant of llamaVariants) {
      const found = models.find((m: any) => m.name === variant);
      if (found) return variant;
    }
    
    // Look for any llama model
    const anyLlama = models.find((m: any) => m.name.toLowerCase().includes('llama'));
    if (anyLlama) return anyLlama.name;
    
    // If no llama found, return first available model
    return models[0].name;
    
  } catch (error) {
    console.error('Error getting best model:', error);
    return 'llama3.2:latest'; // fallback
  }
};

/**
 * @swagger
 * /api/models:
 *   get:
 *     summary: Get available AI models
 *     description: Retrieves a list of available models from the Ollama server
 *     tags: [Models]
 *     responses:
 *       200:
 *         description: List of available models
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 models:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Model'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check service health
 *     description: Checks the health status of the API and Ollama connection
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       503:
 *         description: Service is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
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

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Send message to AI model
 *     description: Sends a message to the AI model and returns the response
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatRequest'
 *     responses:
 *       200:
 *         description: AI response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       408:
 *         description: Request timeout
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.post('/api/chat', async (req, res): Promise<any> => {
  const { message, model } = req.body;
  
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const selectedModel = await getBestAvailableModel(model);
    
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

/**
 * @swagger
 * /api/{templateSlug}:
 *   get:
 *     summary: Process template with parameters
 *     description: Processes a template with query parameters and returns AI response
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: templateSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: Template identifier (e.g., english-teacher, code-review)
 *         example: english-teacher
 *       - in: query
 *         name: text
 *         schema:
 *           type: string
 *         description: Text parameter (varies by template)
 *         example: Hello world
 *     responses:
 *       200:
 *         description: Template processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TemplateResponse'
 *       404:
 *         description: Template not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       408:
 *         description: Request timeout
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/api/:templateSlug', async (req, res): Promise<any> => {
  const { templateSlug } = req.params;
  const parameters = req.query as Record<string, string>;
  
  try {
    const template = loadTemplate(templateSlug);
    if (!template) {
      return res.status(404).json({ error: `Template '${templateSlug}' not found` });
    }
    
    const processedPrompt = processTemplatePrompt(template, parameters);
    const selectedModel = await getBestAvailableModel(template.model);
    
    // Set timeout for API calls
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

    const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: selectedModel,
        prompt: processedPrompt,
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
      template: templateSlug,
      prompt: processedPrompt,
      response: data.response,
      model: selectedModel,
      parameters: parameters
    });
    
  } catch (error: any) {
    console.error('Error in template API:', error);
    if (error.name === 'AbortError') {
      return res.status(408).json({ error: 'Request timeout - The model is taking too long to respond. Try a smaller model or a shorter message.' });
    }
    return res.status(500).json({ error: 'Failed to process template request' });
  }
});

// Helper function to load template data
const loadTemplate = (templateSlug: string): any => {
  try {
    const templatePath = path.join(__dirname, 'data', 'templates', `${templateSlug}.json`);
    if (!fs.existsSync(templatePath)) {
      return null;
    }
    const templateData = fs.readFileSync(templatePath, 'utf8');
    return JSON.parse(templateData);
  } catch (error) {
    console.error('Error loading template:', error);
    return null;
  }
};

// Helper function to process template parameters
const processTemplatePrompt = (template: any, parameters: Record<string, string>): string => {
  let prompt = template.prompt;
  
  // Replace parameters in the prompt
  for (const param of template.parameters) {
    const value = parameters[param.name] || param.default || '';
    const placeholder = `{${param.name}}`;
    prompt = prompt.replace(new RegExp(placeholder, 'g'), value);
  }
  
  return prompt;
};


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