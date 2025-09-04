import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatHeaderMobile } from '../ChatHeaderMobile';

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'status.connected': 'Connected',
        'status.disconnected': 'Disconnected', 
        'status.checking': 'Checking...',
        'models.selectModel': 'Select model...',
        'templates.selectTemplate': 'Select Template',
        'chat.clearChat': 'Clear Chat',
        'chat.openHistory': 'Open History'
      };
      return translations[key] || key;
    }
  })
}));

// Mock TemplateModalSelector
jest.mock('../../../molecules/TemplateModalSelector', () => ({
  TemplateModalSelector: ({ isOpen, onClose }: any) => 
    isOpen ? <div data-testid="template-modal" onClick={onClose}>Template Modal</div> : null
}));

// Mock ParameterForm
jest.mock('../../../ParameterForm', () => {
  return function MockParameterForm({ onSubmit }: any) {
    return (
      <div data-testid="parameter-form">
        <button onClick={() => onSubmit('test prompt')}>Submit</button>
      </div>
    );
  };
});

// Mock DarkModeToggle
jest.mock('../../../atoms/DarkModeToggle', () => ({
  DarkModeToggle: ({ size }: any) => (
    <div data-testid="dark-mode-toggle" className={`dark-mode-toggle--${size}`}>
      🌙
    </div>
  )
}));

// Mock LanguageSwitcher
jest.mock('../../../LanguageSwitcher', () => {
  return function MockLanguageSwitcher() {
    return (
      <div data-testid="language-switcher">
        <button>EN</button>
        <button>PT</button>
      </div>
    );
  };
});

describe('ChatHeaderMobile', () => {
  const mockModels = [
    { name: 'llama3.2:latest', size: 123456 },
    { name: 'llama3:latest', size: 789012 }
  ];

  const mockTemplate = {
    id: 'test-template',
    name: 'Test Template',
    description: 'Test description',
    parameters: [{ name: 'param1', description: 'Param 1', required: true }]
  };

  const defaultProps = {
    selectedModel: 'llama3.2:latest',
    models: mockModels,
    onModelChange: jest.fn(),
    isOllamaConnected: true,
    selectedTemplate: null,
    onTemplateSelect: jest.fn(),
    showParameterForm: false,
    templateParameters: {},
    onParametersChange: jest.fn(),
    onParameterFormSubmit: jest.fn(),
    onClearChat: jest.fn(),
    onOpenSidebar: jest.fn(),
    messagesCount: 0
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders simplified header with core elements', () => {
    render(<ChatHeaderMobile {...defaultProps} />);
    
    expect(screen.getByTestId('dark-mode-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    expect(screen.getByText('Select Template')).toBeInTheDocument();
  });

  it('shows connected status icon', () => {
    render(<ChatHeaderMobile {...defaultProps} />);
    
    const statusIcon = screen.getByTitle('Connected');
    expect(statusIcon).toHaveTextContent('🟢');
  });

  it('shows disconnected status when Ollama is disconnected', () => {
    render(<ChatHeaderMobile {...defaultProps} isOllamaConnected={false} />);
    
    const statusIcon = screen.getByTitle('Disconnected');
    expect(statusIcon).toHaveTextContent('🔴');
  });

  it('shows checking status when connection is unknown', () => {
    render(<ChatHeaderMobile {...defaultProps} isOllamaConnected={null} />);
    
    const statusIcon = screen.getByTitle('Checking...');
    expect(statusIcon).toHaveTextContent('🟡');
  });

  it('renders dark mode toggle with correct size', () => {
    render(<ChatHeaderMobile {...defaultProps} />);
    
    const darkModeToggle = screen.getByTestId('dark-mode-toggle');
    expect(darkModeToggle).toHaveClass('dark-mode-toggle--sm');
  });

  it('renders language switcher', () => {
    render(<ChatHeaderMobile {...defaultProps} />);
    
    const languageSwitcher = screen.getByTestId('language-switcher');
    expect(languageSwitcher).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('PT')).toBeInTheDocument();
  });

  it('displays template button with default text', () => {
    render(<ChatHeaderMobile {...defaultProps} />);
    
    expect(screen.getByText('Select Template')).toBeInTheDocument();
    expect(screen.getByText('📝')).toBeInTheDocument();
  });

  it('displays selected template name', () => {
    render(<ChatHeaderMobile {...defaultProps} selectedTemplate={mockTemplate} />);
    
    expect(screen.getByText('Test Template')).toBeInTheDocument();
  });

  it('opens template modal when template button is clicked', () => {
    render(<ChatHeaderMobile {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Select Template'));
    
    expect(screen.getByTestId('template-modal')).toBeInTheDocument();
  });

  it('shows clear button when there are messages', () => {
    render(<ChatHeaderMobile {...defaultProps} messagesCount={5} />);
    
    const clearButton = screen.getByTitle('Clear Chat');
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).toHaveTextContent('🗑️');
  });

  it('hides clear button when there are no messages', () => {
    render(<ChatHeaderMobile {...defaultProps} messagesCount={0} />);
    
    expect(screen.queryByTitle('Clear Chat')).not.toBeInTheDocument();
  });

  it('calls onClearChat when clear button is clicked', () => {
    render(<ChatHeaderMobile {...defaultProps} messagesCount={5} />);
    
    fireEvent.click(screen.getByTitle('Clear Chat'));
    
    expect(defaultProps.onClearChat).toHaveBeenCalled();
  });

  it('shows history button', () => {
    render(<ChatHeaderMobile {...defaultProps} />);
    
    const historyButton = screen.getByTitle('Open History');
    expect(historyButton).toBeInTheDocument();
    expect(historyButton).toHaveTextContent('📋');
  });

  it('calls onOpenSidebar when history button is clicked', () => {
    render(<ChatHeaderMobile {...defaultProps} />);
    
    fireEvent.click(screen.getByTitle('Open History'));
    
    expect(defaultProps.onOpenSidebar).toHaveBeenCalled();
  });

  it('shows parameter form when showParameterForm is true', () => {
    render(<ChatHeaderMobile {...defaultProps} 
      showParameterForm 
      selectedTemplate={mockTemplate} 
    />);
    
    expect(screen.getByTestId('parameter-form')).toBeInTheDocument();
  });

  it('calls onParameterFormSubmit when form is submitted', () => {
    render(<ChatHeaderMobile {...defaultProps} 
      showParameterForm 
      selectedTemplate={mockTemplate} 
    />);
    
    fireEvent.click(screen.getByText('Submit'));
    
    expect(defaultProps.onParameterFormSubmit).toHaveBeenCalledWith('test prompt');
  });

  // Parameter form cancel functionality is handled at the parent level
  // through template selection/deselection

  it('maintains all core functionality in simplified layout', () => {
    render(<ChatHeaderMobile {...defaultProps} messagesCount={5} />);
    
    // Status indicator should be visible
    expect(screen.getByTitle('Connected')).toBeInTheDocument();
    
    // Template button should be visible
    expect(screen.getByText('Select Template')).toBeInTheDocument();
    
    // Clear button should be visible when messages exist
    expect(screen.getByTitle('Clear Chat')).toBeInTheDocument();
    
    // History button should be visible
    expect(screen.getByTitle('Open History')).toBeInTheDocument();
    
    // Settings should be visible
    expect(screen.getByTestId('dark-mode-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
  });
});