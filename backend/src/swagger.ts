import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OLLM API',
      version: '1.0.0',
      description: 'API documentation for Ollama Chat Interface',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'http://localhost:3002'
          : 'http://localhost:4001',
        description: process.env.NODE_ENV === 'production' 
          ? 'Production server' 
          : 'Development server',
      },
    ],
    components: {
      schemas: {
        Model: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the AI model',
              example: 'llama3.2:latest'
            },
            size: {
              type: 'number',
              description: 'Size of the model in bytes',
              example: 2019393792
            }
          }
        },
        ChatRequest: {
          type: 'object',
          required: ['message'],
          properties: {
            message: {
              type: 'string',
              description: 'Message to send to the AI',
              example: 'Hello, how are you?'
            },
            model: {
              type: 'string',
              description: 'Optional model to use',
              example: 'llama3.2:latest'
            }
          }
        },
        ChatResponse: {
          type: 'object',
          properties: {
            response: {
              type: 'string',
              description: 'AI response to the message',
              example: 'Hello! I\'m doing well, thank you for asking. How can I help you today?'
            },
            model: {
              type: 'string',
              description: 'Model used for the response',
              example: 'llama3.2:latest'
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['healthy', 'unhealthy'],
              description: 'Health status of the service'
            },
            ollama: {
              type: 'string',
              enum: ['connected', 'disconnected'],
              description: 'Connection status to Ollama'
            },
            error: {
              type: 'string',
              description: 'Error message if unhealthy',
              example: 'Connection refused'
            }
          }
        },
        TemplateResponse: {
          type: 'object',
          properties: {
            template: {
              type: 'string',
              description: 'Template slug used',
              example: 'english-teacher'
            },
            prompt: {
              type: 'string',
              description: 'Generated prompt with parameters',
              example: 'You are an English teacher. Correct the following text: Hello world'
            },
            response: {
              type: 'string',
              description: 'AI response based on the template',
              example: 'The text looks correct! \"Hello world\" is a proper greeting.'
            },
            model: {
              type: 'string',
              description: 'Model used for the response',
              example: 'llama3.2:latest'
            },
            parameters: {
              type: 'object',
              description: 'Parameters used in the template',
              example: {
                text: 'Hello world'
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Failed to get response from Ollama'
            }
          }
        }
      }
    }
  },
  apis: ['./src/index.ts'], // Path to the API files
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };