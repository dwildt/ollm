import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TemplateModalSelector } from '../TemplateModalSelector';
import { templateService } from '../../../../services/templateService';

// Mock the template service
jest.mock('../../../../services/templateService');
const mockTemplateService = templateService as jest.Mocked<typeof templateService>;

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      const translations: { [key: string]: string } = {
        'templates.selectTemplate': 'Select Template',
        'templates.freeConversation': 'Free Conversation',
        'templates.freeConversationDescription': 'Free chat without specific template',
        'templates.searchPlaceholder': 'Search templates...',
        'templates.allCategories': 'All',
        'templates.noTemplatesFound': 'No templates found',
        'templates.parametersCount': `${options?.count} parameters`
      };
      return translations[key] || key;
    }
  })
}));

// Mock Modal component
jest.mock('../../../atoms/Modal', () => ({
  Modal: ({ isOpen, onClose, title, children }: any) => 
    isOpen ? (
      <div data-testid="modal">
        <div data-testid="modal-title">{title}</div>
        <button onClick={onClose} data-testid="modal-close">Close</button>
        {children}
      </div>
    ) : null
}));

describe('TemplateModalSelector', () => {
  const mockTemplates = [
    {
      id: 'template1',
      name: 'Template 1',
      description: 'Description 1',
      category: 'Category A',
      parameters: [{ name: 'param1', description: 'Param 1', required: true }]
    },
    {
      id: 'template2', 
      name: 'Template 2',
      description: 'Description 2',
      category: 'Category B',
      parameters: []
    },
    {
      id: 'template3',
      name: 'Another Template',
      description: 'Description 3',
      category: 'Category A',
      parameters: [
        { name: 'param1', description: 'Param 1', required: true },
        { name: 'param2', description: 'Param 2', required: false }
      ]
    }
  ];

  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onTemplateSelect: jest.fn(),
    selectedTemplate: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockTemplateService.getAllTemplates.mockReturnValue(mockTemplates);
  });

  it('renders modal when isOpen is true', () => {
    render(<TemplateModalSelector {...defaultProps} />);
    
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Select Template');
  });

  it('does not render modal when isOpen is false', () => {
    render(<TemplateModalSelector {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('loads templates when modal opens', () => {
    render(<TemplateModalSelector {...defaultProps} />);
    
    expect(mockTemplateService.getAllTemplates).toHaveBeenCalled();
    expect(screen.getByText('Template 1')).toBeInTheDocument();
    expect(screen.getByText('Template 2')).toBeInTheDocument();
  });

  it('displays free conversation option', () => {
    render(<TemplateModalSelector {...defaultProps} />);
    
    expect(screen.getByText('Free Conversation')).toBeInTheDocument();
    expect(screen.getByText('Free chat without specific template')).toBeInTheDocument();
  });

  it('filters templates by search query', async () => {
    render(<TemplateModalSelector {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search templates...');
    fireEvent.change(searchInput, { target: { value: 'Another' } });
    
    await waitFor(() => {
      expect(screen.getByText('Another Template')).toBeInTheDocument();
      expect(screen.queryByText('Template 1')).not.toBeInTheDocument();
    });
  });

  it('filters templates by category', async () => {
    render(<TemplateModalSelector {...defaultProps} />);
    
    // Click on Category A chip (find it specifically in the filter section)
    const categoryChip = screen.getByRole('button', { name: 'Category A' });
    fireEvent.click(categoryChip);
    
    await waitFor(() => {
      expect(screen.getByText('Template 1')).toBeInTheDocument();
      expect(screen.getByText('Another Template')).toBeInTheDocument();
      expect(screen.queryByText('Template 2')).not.toBeInTheDocument();
    });
  });

  it('displays parameter count for templates with parameters', () => {
    render(<TemplateModalSelector {...defaultProps} />);
    
    expect(screen.getByText('1 parameters')).toBeInTheDocument();
    expect(screen.getByText('2 parameters')).toBeInTheDocument();
  });

  it('calls onTemplateSelect when template is clicked', () => {
    render(<TemplateModalSelector {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Template 1'));
    
    expect(defaultProps.onTemplateSelect).toHaveBeenCalledWith(mockTemplates[0]);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onTemplateSelect with null when free conversation is clicked', () => {
    render(<TemplateModalSelector {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Free Conversation'));
    
    expect(defaultProps.onTemplateSelect).toHaveBeenCalledWith(null);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('highlights selected template', () => {
    render(<TemplateModalSelector {...defaultProps} selectedTemplate={mockTemplates[0]} />);
    
    const selectedCard = screen.getByText('Template 1').closest('.template-card');
    expect(selectedCard).toHaveClass('selected');
  });

  it('shows no templates message when search returns no results', async () => {
    render(<TemplateModalSelector {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search templates...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    await waitFor(() => {
      expect(screen.getByText('No templates found')).toBeInTheDocument();
    });
  });

  it('resets search and category filters when modal closes', () => {
    const { rerender } = render(<TemplateModalSelector {...defaultProps} />);
    
    // Set search query
    const searchInput = screen.getByPlaceholderText('Search templates...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Close modal
    fireEvent.click(screen.getByTestId('modal-close'));
    
    // Reopen modal
    rerender(<TemplateModalSelector {...defaultProps} isOpen={true} />);
    
    // Check that search is cleared
    expect(screen.getByPlaceholderText('Search templates...')).toHaveValue('');
  });
});