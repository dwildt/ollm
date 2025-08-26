export interface TemplateParameter {
  name: string;
  type: 'string' | 'text' | 'number';
  required: boolean;
  description: string;
  default?: string | number;
}

export interface ConversationTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  model?: string;
  prompt: string;
  parameters: TemplateParameter[];
}

export interface TemplateCollection {
  templates: ConversationTemplate[];
}

export interface SavedConversation {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  model: string;
  templateId?: string;
  messages: Array<{
    id: string;
    text: string;
    isUser: boolean;
    timestamp: string;
    model?: string;
  }>;
}

export interface ConversationStorage {
  conversations: Record<string, SavedConversation>;
}