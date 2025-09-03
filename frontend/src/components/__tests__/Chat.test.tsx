import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatNew from '../ChatNew';
import { apiService } from '../../services/api';

// Mock the API service
jest.mock('../../services/api');
const mockApiService = apiService as jest.Mocked<typeof apiService>;

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'app.title': 'Ollama Chat Interface',
        'app.welcomeTitle': 'Welcome to Ollama Chat!',
        'app.welcomeMessage': 'Start a conversation by typing a message below.',
        'app.ollamaDisconnected': 'Ollama appears to be disconnected',
        'chat.model': 'Model:',
        'chat.noModelsAvailable': 'No models available',
        'chat.clearChat': 'Clear Chat',
        'chat.inputPlaceholder': 'Type your message here...',
        'chat.send': 'Send',
        'chat.sending': 'Sending...',
        'chat.errorMessage': 'Sorry, I encountered an error.',
        'status.connected': '🟢 Connected',
        'status.disconnected': '🔴 Disconnected',
        'status.checking': '🟡 Checking...'
      };
      return translations[key] || key;
    }
  })
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useParams: () => ({ conversationId: undefined }),
  useNavigate: () => jest.fn(),
  useSearchParams: () => [new URLSearchParams(), jest.fn()]
}));

// Mock LanguageSwitcher component - prepared for ChatHeader integration
jest.mock('../LanguageSwitcher', () => {
  return function MockLanguageSwitcher() {
    return <div data-testid="language-switcher">Language Switcher</div>;
  };
});

// Mock ReactMarkdown
jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }: { children: string }) {
    return <div data-testid="markdown-content">{children}</div>;
  };
});

// Mock TemplateSelector component - prepared for ChatHeader integration  
jest.mock('../TemplateSelector', () => {
  return function MockTemplateSelector({ onTemplateSelect: _onTemplateSelect }: { onTemplateSelect: Function }) {
    return <div data-testid="template-selector">Template Selector</div>;
  };
});

// Mock ParameterForm component - prepared for ChatHeader integration
jest.mock('../ParameterForm', () => {
  return function MockParameterForm({ template: _template, onSubmit: _onSubmit }: { template: any, onSubmit: Function }) {
    return <div data-testid="parameter-form">Parameter Form</div>;
  };
});

// Mock ConversationSidebar component - independent of chat modularization
jest.mock('../ConversationSidebar', () => {
  return function MockConversationSidebar() {
    return <div data-testid="conversation-sidebar">Conversation Sidebar</div>;
  };
});

// Mock conversation storage service
jest.mock('../../services/conversationStorage', () => ({
  conversationStorageService: {
    saveConversation: jest.fn(),
    getAllConversations: jest.fn(() => ({})),
    deleteConversation: jest.fn()
  }
}));

// Mock template service
jest.mock('../../services/templateService', () => ({
  templateService: {
    getAllTemplates: jest.fn(() => []),
    getTemplateById: jest.fn()
  }
}));

// Mock scrollIntoView method
window.Element.prototype.scrollIntoView = jest.fn();

describe('Chat Component', () => {
  const mockModels = [
    { name: 'llama2', size: 123456 },
    { name: 'mistral', size: 789012 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockApiService.checkHealth.mockResolvedValue({
      status: 'healthy',
      ollama: 'connected'
    });
    mockApiService.getModels.mockResolvedValue({
      models: mockModels
    });
  });

  test('renders chat interface with all components', async () => {
    render(<ChatNew />);
    
    // Test main chat interface elements (future ChatHeader content)
    expect(screen.getByText('Ollama Chat Interface')).toBeInTheDocument();
    expect(screen.getByText('Welcome to Ollama Chat!')).toBeInTheDocument();
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    expect(screen.getByTestId('template-selector')).toBeInTheDocument();
  });

  test('loads models on mount', async () => {
    render(<ChatNew />);
    
    await waitFor(() => {
      expect(mockApiService.getModels).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue('llama2')).toBeInTheDocument();
    });
  });

  test('checks Ollama health on mount', async () => {
    render(<ChatNew />);
    
    await waitFor(() => {
      expect(mockApiService.checkHealth).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('🟢 Connected')).toBeInTheDocument();
    });
  });

  test('displays disconnected status when health check fails', async () => {
    mockApiService.checkHealth.mockRejectedValue(new Error('Connection failed'));
    
    render(<ChatNew />);
    
    await waitFor(() => {
      expect(screen.getByText('🔴 Disconnected')).toBeInTheDocument();
    });
  });

  test('sends message when send button is clicked (future ChatInput + ChatMessages)', async () => {
    mockApiService.sendMessage.mockResolvedValue({
      response: 'Hello! How can I help you?',
      model: 'llama2'
    });

    render(<ChatNew />);

    // Wait for models to load (future ChatHeader functionality)
    await waitFor(() => {
      expect(screen.getByDisplayValue('llama2')).toBeInTheDocument();
    });

    // Test input and send functionality (future ChatInput component)
    const textarea = screen.getByPlaceholderText('Type your message here...');
    const sendButton = screen.getByText('Send');

    fireEvent.change(textarea, { target: { value: 'Hello, world!' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockApiService.sendMessage).toHaveBeenCalledWith('Hello, world!', 'llama2');
    });

    // Test message display (future ChatMessages component)
    await waitFor(() => {
      expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Hello! How can I help you?')).toBeInTheDocument();
    });
  });

  test('clears chat when clear button is clicked (future ChatHeader + ChatMessages)', async () => {
    mockApiService.sendMessage.mockResolvedValue({
      response: 'Test response',
      model: 'llama2'
    });

    render(<ChatNew />);

    // Wait for models to load and send a message first
    await waitFor(() => {
      expect(screen.getByDisplayValue('llama2')).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText('Type your message here...');
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    fireEvent.click(screen.getByText('Send'));

    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    // Clear the chat (future ChatHeader functionality)
    const clearButton = screen.getByText('Clear Chat');
    fireEvent.click(clearButton);

    // Verify messages are cleared (future ChatMessages state management)
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  test('handles API error gracefully', async () => {
    mockApiService.sendMessage.mockRejectedValue(new Error('API Error'));

    render(<ChatNew />);

    // Wait for models to load
    await waitFor(() => {
      expect(screen.getByDisplayValue('llama2')).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText('Type your message here...');
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    fireEvent.click(screen.getByText('Send'));

    await waitFor(() => {
      expect(screen.getByText('Sorry, I encountered an error.')).toBeInTheDocument();
    });
  });

  test('disables send button when no model is selected', async () => {
    mockApiService.getModels.mockResolvedValue({ models: [] });
    
    render(<ChatNew />);

    await waitFor(() => {
      expect(screen.getByText('No models available')).toBeInTheDocument();
    });

    const sendButton = screen.getByText('Send');
    expect(sendButton).toBeDisabled();
  });

  test('changes model when dropdown selection changes', async () => {
    render(<ChatNew />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('llama2')).toBeInTheDocument();
    });

    const modelSelect = screen.getByDisplayValue('llama2');
    fireEvent.change(modelSelect, { target: { value: 'mistral' } });

    expect(screen.getByDisplayValue('mistral')).toBeInTheDocument();
  });
});