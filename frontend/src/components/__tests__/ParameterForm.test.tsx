import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ParameterForm from '../ParameterForm';
import { templateService } from '../../services/templateService';
import { ConversationTemplate } from '../../types/templates';

// Mock the template service
jest.mock('../../services/templateService', () => ({
  templateService: {
    renderTemplate: jest.fn(),
    validateParameters: jest.fn(),
    renderPrompt: jest.fn()
  }
}));

const mockTemplateService = templateService as jest.Mocked<typeof templateService>;

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'templates.configureParameters': 'Configure os Parâmetros',
        'templates.startConversation': 'Iniciar Conversa',
        'templates.promptPreview': 'Preview do Prompt:',
        'templates.requiredParameter': 'Este parâmetro é obrigatório',
        'templates.fillAllRequired': 'Preencha todos os parâmetros obrigatórios para ver o preview',
        'templates.renderError': 'Erro ao renderizar template'
      };
      return translations[key] || key;
    }
  })
}));

describe('ParameterForm', () => {
  const mockOnParametersChange = jest.fn();
  const mockOnSubmit = jest.fn();

  const mockTemplate: ConversationTemplate = {
    id: 'test-template',
    name: 'Test Template',
    slug: 'test-template',
    description: 'A test template',
    category: 'Test',
    tags: ['test'],
    prompt: 'Hello {{name}}, you are a {{role}}.',
    parameters: [
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Your name'
      },
      {
        name: 'role',
        type: 'string',
        required: false,
        description: 'Your role'
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockTemplateService.renderTemplate.mockReturnValue('Hello John, you are a developer.');
    mockTemplateService.renderPrompt.mockReturnValue('Hello John, you are a developer.');
    mockTemplateService.validateParameters.mockReturnValue({
      isValid: true,
      missingRequired: [],
      invalidTypes: []
    });
  });

  test('renders parameter form when visible', () => {
    render(
      <ParameterForm
        template={mockTemplate}
        onParametersChange={mockOnParametersChange}
        onSubmit={mockOnSubmit}
        isVisible={true}
      />
    );

    expect(screen.getByText('Configure os Parâmetros')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
  });

  test('does not render when not visible', () => {
    render(
      <ParameterForm
        template={mockTemplate}
        onParametersChange={mockOnParametersChange}
        onSubmit={mockOnSubmit}
        isVisible={false}
      />
    );

    expect(screen.queryByText('Configure os Parâmetros')).not.toBeInTheDocument();
  });

  test('shows required indicator for required parameters', () => {
    render(
      <ParameterForm
        template={mockTemplate}
        onParametersChange={mockOnParametersChange}
        onSubmit={mockOnSubmit}
        isVisible={true}
      />
    );

    // Check if fields are rendered with their labels
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your role')).toBeInTheDocument();
    
    // Check if required field has required indicator (the translated key or asterisk)
    expect(screen.getByText('templates.required')).toBeInTheDocument();
  });

  test('calls onParametersChange when parameter values change', () => {
    render(
      <ParameterForm
        template={mockTemplate}
        onParametersChange={mockOnParametersChange}
        onSubmit={mockOnSubmit}
        isVisible={true}
      />
    );

    const nameField = screen.getByPlaceholderText('Your name');
    fireEvent.change(nameField, { target: { value: 'John' } });

    expect(mockOnParametersChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'John' })
    );
  });

  test('validates required parameters', () => {
    // Mock validation to fail for empty required field
    mockTemplateService.validateParameters.mockReturnValue({
      isValid: false,
      missingRequired: ['name'],
      invalidTypes: []
    });

    render(
      <ParameterForm
        template={mockTemplate}
        onParametersChange={mockOnParametersChange}
        onSubmit={mockOnSubmit}
        isVisible={true}
      />
    );

    const submitButton = screen.getByText('Iniciar Conversa');
    fireEvent.click(submitButton);

    expect(screen.getByText('Este parâmetro é obrigatório')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('calls onSubmit with rendered template when all required parameters are filled', () => {
    render(
      <ParameterForm
        template={mockTemplate}
        onParametersChange={mockOnParametersChange}
        onSubmit={mockOnSubmit}
        isVisible={true}
      />
    );

    const nameField = screen.getByPlaceholderText('Your name');
    const roleField = screen.getByPlaceholderText('Your role');

    fireEvent.change(nameField, { target: { value: 'John' } });
    fireEvent.change(roleField, { target: { value: 'developer' } });

    const submitButton = screen.getByText('Iniciar Conversa');
    fireEvent.click(submitButton);

    expect(mockTemplateService.renderPrompt).toHaveBeenCalledWith(
      mockTemplate,
      expect.objectContaining({ name: 'John', role: 'developer' })
    );
    expect(mockOnSubmit).toHaveBeenCalledWith('Hello John, you are a developer.');
  });

  test('shows prompt preview when parameters are filled', async () => {
    render(
      <ParameterForm
        template={mockTemplate}
        onParametersChange={mockOnParametersChange}
        onSubmit={mockOnSubmit}
        isVisible={true}
      />
    );

    const nameField = screen.getByPlaceholderText('Your name');
    fireEvent.change(nameField, { target: { value: 'John' } });

    await waitFor(() => {
      expect(screen.getByText('Preview do Prompt:')).toBeInTheDocument();
      expect(screen.getByText('Hello John, you are a developer.')).toBeInTheDocument();
    });
  });

  test('shows error message when template rendering fails', async () => {
    mockTemplateService.renderPrompt.mockImplementation(() => {
      throw new Error('Render error');
    });

    render(
      <ParameterForm
        template={mockTemplate}
        onParametersChange={mockOnParametersChange}
        onSubmit={mockOnSubmit}
        isVisible={true}
      />
    );

    const nameField = screen.getByPlaceholderText('Your name');
    fireEvent.change(nameField, { target: { value: 'John' } });

    await waitFor(() => {
      expect(screen.getByText('Erro ao renderizar template')).toBeInTheDocument();
    });
  });

  test('loads initial parameters when provided', () => {
    const initialParameters = { name: 'Alice', role: 'designer' };

    render(
      <ParameterForm
        template={mockTemplate}
        initialParameters={initialParameters}
        onParametersChange={mockOnParametersChange}
        onSubmit={mockOnSubmit}
        isVisible={true}
      />
    );

    const nameField = screen.getByPlaceholderText('Your name') as HTMLInputElement;
    const roleField = screen.getByPlaceholderText('Your role') as HTMLInputElement;

    expect(nameField.value).toBe('Alice');
    expect(roleField.value).toBe('designer');
  });

  test('handles template with no parameters', () => {
    const noParamTemplate: ConversationTemplate = {
      ...mockTemplate,
      parameters: []
    };

    render(
      <ParameterForm
        template={noParamTemplate}
        onParametersChange={mockOnParametersChange}
        onSubmit={mockOnSubmit}
        isVisible={true}
      />
    );

    expect(screen.getByText('Iniciar Conversa')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  test('handles different parameter types', () => {
    const multiTypeTemplate: ConversationTemplate = {
      ...mockTemplate,
      parameters: [
        {
          name: 'textParam',
          type: 'string',
          required: true,
          description: 'Text parameter'
        },
        {
          name: 'textareaParam',
          type: 'text',
          required: false,
          description: 'Textarea parameter'
        }
      ]
    };

    render(
      <ParameterForm
        template={multiTypeTemplate}
        onParametersChange={mockOnParametersChange}
        onSubmit={mockOnSubmit}
        isVisible={true}
      />
    );

    expect(screen.getByPlaceholderText('Text parameter')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Textarea parameter')).toBeInTheDocument();

    const textareaField = screen.getByPlaceholderText('Textarea parameter');
    expect(textareaField.tagName.toLowerCase()).toBe('textarea');
  });

  test('clears validation errors when valid input is provided', () => {
    // First render with invalid state to trigger errors
    mockTemplateService.validateParameters
      .mockReturnValueOnce({
        isValid: false,
        missingRequired: ['name'],
        invalidTypes: []
      })
      .mockReturnValue({
        isValid: true,
        missingRequired: [],
        invalidTypes: []
      });

    render(
      <ParameterForm
        template={mockTemplate}
        onParametersChange={mockOnParametersChange}
        onSubmit={mockOnSubmit}
        isVisible={true}
      />
    );

    // First submit with empty required field to trigger error
    const submitButton = screen.getByText('Iniciar Conversa');
    fireEvent.click(submitButton);

    expect(screen.getByText('Este parâmetro é obrigatório')).toBeInTheDocument();

    // Now fill the required field - this should trigger re-validation
    const nameField = screen.getByPlaceholderText('Your name');
    fireEvent.change(nameField, { target: { value: 'John' } });

    // Wait for error to be cleared
    expect(screen.queryByText('Este parâmetro é obrigatório')).not.toBeInTheDocument();
  });
});