import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { templateService } from '../../services/templateService';
import TemplateSelector from '../TemplateSelector';
import { ConversationTemplate } from '../../types/templates';

// Mock the template service
jest.mock('../../services/templateService');
const mockTemplateService = templateService as jest.Mocked<typeof templateService>;

const mockTemplates: ConversationTemplate[] = [
  {
    id: 'code-review',
    name: 'Revisor de Código',
    slug: 'code-review',
    description: 'Analisa código e sugere melhorias',
    category: 'Desenvolvimento',
    tags: ['code', 'review'],
    prompt: 'Você é um revisor de código.',
    parameters: [
      {
        name: 'language',
        type: 'string',
        required: true,
        description: 'Linguagem de programação'
      }
    ]
  },
  {
    id: 'english-teacher',
    name: 'Professor de Inglês',
    slug: 'english-teacher',
    description: 'Corrige textos em inglês',
    category: 'Educação',
    tags: ['english', 'grammar'],
    prompt: 'Você é um professor de inglês.',
    parameters: [
      {
        name: 'text',
        type: 'text',
        required: true,
        description: 'Texto para correção'
      }
    ]
  }
];

describe('TemplateSelector', () => {
  const mockOnTemplateSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockTemplateService.getAllTemplates.mockReturnValue(mockTemplates);
    mockTemplateService.getTemplateById.mockImplementation((id) =>
      mockTemplates.find(t => t.id === id) || null
    );
  });

  test('renders without templates', () => {
    mockTemplateService.getAllTemplates.mockReturnValue([]);
    
    render(
      <TemplateSelector
        selectedTemplate={null}
        onTemplateSelect={mockOnTemplateSelect}
      />
    );

    // Should not render anything when no templates
    expect(screen.queryByText('Template de Conversa:')).not.toBeInTheDocument();
  });

  test('renders with templates', () => {
    render(
      <TemplateSelector
        selectedTemplate={null}
        onTemplateSelect={mockOnTemplateSelect}
      />
    );

    expect(screen.getByText('Template de Conversa:')).toBeInTheDocument();
    expect(screen.getByText('Mostrar Templates')).toBeInTheDocument();
  });

  test('expands and shows template selector when toggled', async () => {
    render(
      <TemplateSelector
        selectedTemplate={null}
        onTemplateSelect={mockOnTemplateSelect}
      />
    );

    // Initially collapsed
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(screen.getByText('Mostrar Templates'));

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Ocultar Templates')).toBeInTheDocument();
  });

  test('shows templates in select dropdown', async () => {
    render(
      <TemplateSelector
        selectedTemplate={null}
        onTemplateSelect={mockOnTemplateSelect}
      />
    );

    // Expand the selector
    fireEvent.click(screen.getByText('Mostrar Templates'));

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    // Check options
    expect(screen.getByRole('option', { name: 'Conversa Livre' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Revisor de Código - Desenvolvimento' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Professor de Inglês - Educação' })).toBeInTheDocument();
  });

  test('calls onTemplateSelect when template is selected', async () => {
    render(
      <TemplateSelector
        selectedTemplate={null}
        onTemplateSelect={mockOnTemplateSelect}
      />
    );

    // Expand and select template
    fireEvent.click(screen.getByText('Mostrar Templates'));

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'code-review' } });

    expect(mockOnTemplateSelect).toHaveBeenCalledWith(mockTemplates[0]);
  });

  test('calls onTemplateSelect with null when "Conversa Livre" is selected', async () => {
    render(
      <TemplateSelector
        selectedTemplate={mockTemplates[0]}
        onTemplateSelect={mockOnTemplateSelect}
      />
    );

    // Expand and select "Conversa Livre"
    fireEvent.click(screen.getByText('Mostrar Templates'));

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '' } });

    expect(mockOnTemplateSelect).toHaveBeenCalledWith(null);
  });

  test('shows template preview when template is selected', async () => {
    render(
      <TemplateSelector
        selectedTemplate={mockTemplates[0]}
        onTemplateSelect={mockOnTemplateSelect}
      />
    );

    // Expand to show preview
    fireEvent.click(screen.getByText('Mostrar Templates'));

    await waitFor(() => {
      expect(screen.getByText('Revisor de Código')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Analisa código e sugere melhorias')).toBeInTheDocument();
    expect(screen.getByText('Categoria: Desenvolvimento')).toBeInTheDocument();
    expect(screen.getByText('Parâmetros: 1')).toBeInTheDocument();
    expect(screen.getByText('code')).toBeInTheDocument();
    expect(screen.getByText('review')).toBeInTheDocument();
  });

  test('does not show parameters count when template has no parameters', async () => {
    const templateWithoutParams = {
      ...mockTemplates[0],
      parameters: []
    };

    render(
      <TemplateSelector
        selectedTemplate={templateWithoutParams}
        onTemplateSelect={mockOnTemplateSelect}
      />
    );

    // Expand to show preview
    fireEvent.click(screen.getByText('Mostrar Templates'));

    await waitFor(() => {
      expect(screen.getByText('Revisor de Código')).toBeInTheDocument();
    });
    
    expect(screen.queryByText(/Parâmetros:/)).not.toBeInTheDocument();
  });

  test('does not show tags when template has no tags', async () => {
    const templateWithoutTags = {
      ...mockTemplates[0],
      tags: []
    };

    render(
      <TemplateSelector
        selectedTemplate={templateWithoutTags}
        onTemplateSelect={mockOnTemplateSelect}
      />
    );

    // Expand to show preview
    fireEvent.click(screen.getByText('Mostrar Templates'));

    await waitFor(() => {
      expect(screen.getByText('Revisor de Código')).toBeInTheDocument();
    });
    
    expect(screen.queryByText('code')).not.toBeInTheDocument();
    expect(screen.queryByText('review')).not.toBeInTheDocument();
  });

  test('handles template service errors gracefully', () => {
    mockTemplateService.getAllTemplates.mockImplementation(() => {
      throw new Error('Service error');
    });

    render(
      <TemplateSelector
        selectedTemplate={null}
        onTemplateSelect={mockOnTemplateSelect}
      />
    );

    // Should render without crashing, but no templates shown
    expect(screen.queryByText('Template de Conversa:')).not.toBeInTheDocument();
  });

  test('select shows correct value for selected template', async () => {
    render(
      <TemplateSelector
        selectedTemplate={mockTemplates[1]}
        onTemplateSelect={mockOnTemplateSelect}
      />
    );

    // Expand the selector
    fireEvent.click(screen.getByText('Mostrar Templates'));

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('english-teacher');
  });

  test('select shows empty value when no template selected', async () => {
    render(
      <TemplateSelector
        selectedTemplate={null}
        onTemplateSelect={mockOnTemplateSelect}
      />
    );

    // Expand the selector
    fireEvent.click(screen.getByText('Mostrar Templates'));

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('');
  });
});