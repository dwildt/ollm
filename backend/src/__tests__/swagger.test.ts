import { specs } from '../swagger';

interface SwaggerSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers: Array<{
    url: string;
    description?: string;
  }>;
  components?: {
    schemas?: Record<string, any>;
  };
  paths?: Record<string, any>;
}

describe('Swagger Configuration', () => {
  const swaggerSpecs = specs as SwaggerSpec;

  test('should generate valid swagger specification', () => {
    expect(swaggerSpecs).toBeDefined();
    expect(swaggerSpecs.openapi).toBe('3.0.0');
    expect(swaggerSpecs.info).toBeDefined();
    expect(swaggerSpecs.info.title).toBe('OLLM API');
    expect(swaggerSpecs.info.version).toBe('1.0.0');
  });

  test('should have correct server configuration', () => {
    expect(swaggerSpecs.servers).toBeDefined();
    expect(swaggerSpecs.servers.length).toBeGreaterThan(0);
    if (swaggerSpecs.servers[0]) {
      expect(swaggerSpecs.servers[0].url).toMatch(/localhost:(3002|4001)/);
    }
  });

  test('should define all required schemas', () => {
    const schemas = swaggerSpecs.components?.schemas;
    expect(schemas).toBeDefined();
    
    if (schemas) {
      // Check if all required schemas are present
      const requiredSchemas = [
        'Model',
        'ChatRequest', 
        'ChatResponse',
        'HealthResponse',
        'TemplateResponse',
        'ErrorResponse'
      ];
      
      requiredSchemas.forEach(schemaName => {
        expect(schemas[schemaName]).toBeDefined();
      });
    }
  });

  test('should define Model schema correctly', () => {
    const modelSchema = swaggerSpecs.components?.schemas?.Model;
    expect(modelSchema).toBeDefined();
    expect(modelSchema.type).toBe('object');
    expect(modelSchema.properties).toBeDefined();
    expect(modelSchema.properties.name).toBeDefined();
    expect(modelSchema.properties.size).toBeDefined();
  });

  test('should define ChatRequest schema correctly', () => {
    const chatRequestSchema = swaggerSpecs.components?.schemas?.ChatRequest;
    expect(chatRequestSchema).toBeDefined();
    expect(chatRequestSchema.type).toBe('object');
    expect(chatRequestSchema.required).toContain('message');
    expect(chatRequestSchema.properties?.message).toBeDefined();
    expect(chatRequestSchema.properties?.model).toBeDefined();
  });

  test('should define ChatResponse schema correctly', () => {
    const chatResponseSchema = swaggerSpecs.components?.schemas?.ChatResponse;
    expect(chatResponseSchema).toBeDefined();
    expect(chatResponseSchema.type).toBe('object');
    expect(chatResponseSchema.properties?.response).toBeDefined();
    expect(chatResponseSchema.properties?.model).toBeDefined();
  });

  test('should define HealthResponse schema correctly', () => {
    const healthResponseSchema = swaggerSpecs.components?.schemas?.HealthResponse;
    expect(healthResponseSchema).toBeDefined();
    expect(healthResponseSchema.type).toBe('object');
    expect(healthResponseSchema.properties?.status).toBeDefined();
    expect(healthResponseSchema.properties?.ollama).toBeDefined();
    expect(healthResponseSchema.properties?.status.enum).toEqual(['healthy', 'unhealthy']);
  });

  test('should define TemplateResponse schema correctly', () => {
    const templateResponseSchema = swaggerSpecs.components?.schemas?.TemplateResponse;
    expect(templateResponseSchema).toBeDefined();
    expect(templateResponseSchema.type).toBe('object');
    expect(templateResponseSchema.properties?.template).toBeDefined();
    expect(templateResponseSchema.properties?.prompt).toBeDefined();
    expect(templateResponseSchema.properties?.response).toBeDefined();
    expect(templateResponseSchema.properties?.model).toBeDefined();
    expect(templateResponseSchema.properties?.parameters).toBeDefined();
  });

  test('should define ErrorResponse schema correctly', () => {
    const errorResponseSchema = swaggerSpecs.components?.schemas?.ErrorResponse;
    expect(errorResponseSchema).toBeDefined();
    expect(errorResponseSchema.type).toBe('object');
    expect(errorResponseSchema.properties?.error).toBeDefined();
  });

  test('should have paths defined', () => {
    expect(swaggerSpecs.paths).toBeDefined();
    if (swaggerSpecs.paths) {
      expect(Object.keys(swaggerSpecs.paths).length).toBeGreaterThan(0);
    }
  });
});