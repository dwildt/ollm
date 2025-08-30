export interface TemplateParameter {
  name: string;
  type: 'string' | 'text' | 'number' | 'boolean';
  required: boolean;
  description: string;
  default?: string;
}

export interface ConversationTemplate {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  prompt: string;
  parameters: TemplateParameter[];
  model?: string;
}

export interface TemplateCollection {
  templates: ConversationTemplate[];
}