import { templateService } from '../templateService';

describe('TemplateService', () => {
  describe('getAllTemplates', () => {
    test('returns array of templates', () => {
      const templates = templateService.getAllTemplates();
      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
    });

    test('each template has required properties', () => {
      const templates = templateService.getAllTemplates();
      templates.forEach(template => {
        expect(template).toHaveProperty('id');
        expect(template).toHaveProperty('name');
        expect(template).toHaveProperty('slug');
        expect(template).toHaveProperty('description');
        expect(template).toHaveProperty('category');
        expect(template).toHaveProperty('prompt');
        expect(template).toHaveProperty('parameters');
        expect(Array.isArray(template.parameters)).toBe(true);
      });
    });
  });

  describe('getTemplate', () => {
    test('returns template by slug', () => {
      const template = templateService.getTemplate('code-review');
      expect(template).not.toBeNull();
      expect(template?.slug).toBe('code-review');
      expect(template?.name).toBe('Revisor de Código');
    });

    test('returns null for non-existent slug', () => {
      const template = templateService.getTemplate('non-existent-slug');
      expect(template).toBeNull();
    });
  });

  describe('getTemplateById', () => {
    test('returns template by id', () => {
      const template = templateService.getTemplateById('english-teacher');
      expect(template).not.toBeNull();
      expect(template?.id).toBe('english-teacher');
      expect(template?.name).toBe('Professor de Inglês');
    });

    test('returns null for non-existent id', () => {
      const template = templateService.getTemplateById('non-existent-id');
      expect(template).toBeNull();
    });
  });

  describe('getCategories', () => {
    test('returns unique categories', () => {
      const categories = templateService.getCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain('Desenvolvimento');
      expect(categories).toContain('Educação');
    });

    test('categories are sorted', () => {
      const categories = templateService.getCategories();
      const sortedCategories = [...categories].sort();
      expect(categories).toEqual(sortedCategories);
    });
  });

  describe('getTemplatesByCategory', () => {
    test('returns templates for existing category', () => {
      const templates = templateService.getTemplatesByCategory('Desenvolvimento');
      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
      templates.forEach(template => {
        expect(template.category).toBe('Desenvolvimento');
      });
    });

    test('returns empty array for non-existent category', () => {
      const templates = templateService.getTemplatesByCategory('Non-existent');
      expect(templates).toEqual([]);
    });
  });

  describe('searchTemplates', () => {
    test('finds templates by name', () => {
      const templates = templateService.searchTemplates('código');
      expect(templates.length).toBeGreaterThan(0);
      expect(templates.some(t => t.name.toLowerCase().includes('código'))).toBe(true);
    });

    test('finds templates by description', () => {
      const templates = templateService.searchTemplates('inglês');
      expect(templates.length).toBeGreaterThan(0);
      expect(templates.some(t => t.description.toLowerCase().includes('inglês'))).toBe(true);
    });

    test('finds templates by tags', () => {
      const templates = templateService.searchTemplates('code');
      expect(templates.length).toBeGreaterThan(0);
      expect(templates.some(t => t.tags.some(tag => tag.includes('code')))).toBe(true);
    });

    test('returns empty array for no matches', () => {
      const templates = templateService.searchTemplates('xyzabc123nonexistent');
      expect(templates).toEqual([]);
    });
  });

  describe('renderPrompt', () => {
    test('replaces parameters in prompt', () => {
      const template = templateService.getTemplate('english-teacher');
      expect(template).not.toBeNull();
      
      expect(templateService.renderPrompt(template!, {
        text: 'Hello world'
      })).toContain('Hello world');
      
      expect(templateService.renderPrompt(template!, {
        text: 'Hello world'
      })).not.toContain('{text}');
    });

    test('uses default values for optional parameters', () => {
      const template = templateService.getTemplate('brainstorm');
      expect(template).not.toBeNull();
      
      const params = { topic: 'AI technology' };
      
      expect(templateService.renderPrompt(template!, params)).toContain('AI technology');
      expect(templateService.renderPrompt(template!, params)).toContain('explorar possibilidades'); // default goal
      expect(templateService.renderPrompt(template!, params)).toContain('geral'); // default audience
    });

    test('throws error for missing required parameters', () => {
      const template = templateService.getTemplate('code-review');
      expect(template).not.toBeNull();
      
      expect(() => {
        templateService.renderPrompt(template!, {}); // Missing required parameters
      }).toThrow();
    });
  });

  describe('validateParameters', () => {
    test('validates required parameters', () => {
      const template = templateService.getTemplate('code-review');
      expect(template).not.toBeNull();
      
      const validation = templateService.validateParameters(template!, {});
      expect(validation.isValid).toBe(false);
      expect(validation.missingRequired).toContain('language');
      expect(validation.missingRequired).toContain('code');
    });

    test('validates with all required parameters', () => {
      const template = templateService.getTemplate('code-review');
      expect(template).not.toBeNull();
      
      const validation = templateService.validateParameters(template!, {
        language: 'javascript',
        code: 'console.log("hello");'
      });
      expect(validation.isValid).toBe(true);
      expect(validation.missingRequired).toEqual([]);
    });

    test('validates optional parameters', () => {
      const template = templateService.getTemplate('brainstorm');
      expect(template).not.toBeNull();
      
      const validation = templateService.validateParameters(template!, {
        topic: 'New product ideas'
      });
      expect(validation.isValid).toBe(true);
      expect(validation.missingRequired).toEqual([]);
    });
  });
});