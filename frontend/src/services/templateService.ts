import { ConversationTemplate, TemplateCollection } from '../types/templates';
import templateData from '../data/conversation-templates.json';

class TemplateService {
  private templates: ConversationTemplate[] = [];

  constructor() {
    this.loadTemplates();
  }

  private loadTemplates(): void {
    try {
      const data = templateData as TemplateCollection;
      this.templates = data.templates;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading templates:', error);
      this.templates = [];
    }
  }

  getTemplate(slug: string): ConversationTemplate | null {
    return this.templates.find(template => template.slug === slug) || null;
  }

  getTemplateById(id: string): ConversationTemplate | null {
    return this.templates.find(template => template.id === id) || null;
  }

  getAllTemplates(): ConversationTemplate[] {
    return [...this.templates];
  }

  getTemplatesByCategory(category: string): ConversationTemplate[] {
    return this.templates.filter(template => 
      template.category.toLowerCase() === category.toLowerCase()
    );
  }

  getCategories(): string[] {
    const categories = new Set(this.templates.map(template => template.category));
    return Array.from(categories).sort();
  }

  searchTemplates(query: string): ConversationTemplate[] {
    const searchTerm = query.toLowerCase();
    return this.templates.filter(template =>
      template.name.toLowerCase().includes(searchTerm) ||
      template.description.toLowerCase().includes(searchTerm) ||
      template.category.toLowerCase().includes(searchTerm) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  renderPrompt(template: ConversationTemplate, parameters: Record<string, unknown>): string {
    let prompt = template.prompt;

    // Replace parameters in the prompt
    template.parameters.forEach(param => {
      const value = parameters[param.name];
      const paramPlaceholder = `{${param.name}}`;
      
      if (value !== undefined && value !== null && value !== '') {
        prompt = prompt.replace(new RegExp(paramPlaceholder, 'g'), String(value));
      } else if (param.default !== undefined) {
        prompt = prompt.replace(new RegExp(paramPlaceholder, 'g'), String(param.default));
      } else if (param.required) {
        throw new Error(`Required parameter '${param.name}' is missing`);
      } else {
        // Remove the placeholder if parameter is optional and not provided
        prompt = prompt.replace(new RegExp(paramPlaceholder, 'g'), '');
      }
    });

    // Clean up any extra whitespace
    return prompt.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
  }

  validateParameters(template: ConversationTemplate, parameters: Record<string, unknown>): {
    isValid: boolean;
    missingRequired: string[];
    invalidTypes: string[];
  } {
    const missingRequired: string[] = [];
    const invalidTypes: string[] = [];

    template.parameters.forEach(param => {
      const value = parameters[param.name];
      
      // Check required parameters
      if (param.required && (value === undefined || value === null || value === '')) {
        missingRequired.push(param.name);
        return;
      }

      // Check types if value is provided
      if (value !== undefined && value !== null && value !== '') {
        switch (param.type) {
          case 'number':
            if (isNaN(Number(value))) {
              invalidTypes.push(`${param.name} must be a number`);
            }
            break;
          case 'string':
          case 'text':
            if (typeof value !== 'string') {
              invalidTypes.push(`${param.name} must be a string`);
            }
            break;
        }
      }
    });

    return {
      isValid: missingRequired.length === 0 && invalidTypes.length === 0,
      missingRequired,
      invalidTypes
    };
  }

  getTemplateUsageStats(): Record<string, number> {
    // This would track usage in real implementation
    // For now, return empty stats
    return {};
  }
}

export const templateService = new TemplateService();