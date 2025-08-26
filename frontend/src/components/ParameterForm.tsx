import React, { useState, useEffect } from 'react';
import { ConversationTemplate, TemplateParameter } from '../types/templates';
import { templateService } from '../services/templateService';
import './ParameterForm.css';

interface ParameterFormProps {
  template: ConversationTemplate;
  initialParameters?: Record<string, string>;
  onParametersChange: (parameters: Record<string, string>) => void;
  onSubmit: (finalPrompt: string) => void;
  isVisible: boolean;
}

const ParameterForm: React.FC<ParameterFormProps> = ({
  template,
  initialParameters = {},
  onParametersChange,
  onSubmit,
  isVisible
}) => {
  const [parameters, setParameters] = useState<Record<string, string>>(initialParameters);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewPrompt, setPreviewPrompt] = useState('');

  useEffect(() => {
    setParameters(initialParameters);
  }, [initialParameters, template]);

  useEffect(() => {
    updatePreview();
    onParametersChange(parameters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters, template, onParametersChange]);

  const updatePreview = () => {
    try {
      const validation = templateService.validateParameters(template, parameters);
      if (validation.isValid) {
        const prompt = templateService.renderPrompt(template, parameters);
        setPreviewPrompt(prompt);
        setErrors({});
      } else {
        setPreviewPrompt('Preencha todos os parâmetros obrigatórios para ver o preview');
        const newErrors: Record<string, string> = {};
        validation.missingRequired.forEach(param => {
          newErrors[param] = 'Este parâmetro é obrigatório';
        });
        validation.invalidTypes.forEach(error => {
          const paramName = error.split(' ')[0];
          newErrors[paramName] = error;
        });
        setErrors(newErrors);
      }
    } catch (error) {
      setPreviewPrompt('Erro ao renderizar template');
      // eslint-disable-next-line no-console
      console.error('Error rendering template preview:', error);
    }
  };

  const handleParameterChange = (paramName: string, value: string) => {
    setParameters(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = templateService.validateParameters(template, parameters);
    if (validation.isValid) {
      try {
        const finalPrompt = templateService.renderPrompt(template, parameters);
        onSubmit(finalPrompt);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error rendering final prompt:', error);
      }
    } else {
      // Update errors to show validation issues
      updatePreview();
    }
  };

  const renderParameterInput = (param: TemplateParameter) => {
    const value = parameters[param.name] || '';
    const hasError = errors[param.name];

    const inputProps = {
      id: `param-${param.name}`,
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        handleParameterChange(param.name, e.target.value),
      placeholder: param.default ? `Padrão: ${param.default}` : param.description,
      className: hasError ? 'parameter-input error' : 'parameter-input'
    };

    return (
      <div key={param.name} className="parameter-field">
        <label htmlFor={`param-${param.name}`} className="parameter-label">
          {param.name}
          {param.required && <span className="required">*</span>}
        </label>
        
        <div className="parameter-description">
          {param.description}
        </div>

        {param.type === 'text' ? (
          <textarea
            {...inputProps}
            rows={4}
          />
        ) : (
          <input
            {...inputProps}
            type={param.type === 'number' ? 'number' : 'text'}
          />
        )}

        {hasError && (
          <div className="parameter-error">{errors[param.name]}</div>
        )}
      </div>
    );
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="parameter-form-container">
      <div className="parameter-form">
        <h3>Configure os Parâmetros</h3>
        <p className="template-description">{template.description}</p>

        <form onSubmit={handleSubmit} className="parameters-form">
          {template.parameters.map(renderParameterInput)}

          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={Object.keys(errors).length > 0}
            >
              Iniciar Conversa
            </button>
          </div>
        </form>

        <div className="prompt-preview">
          <h4>Preview do Prompt:</h4>
          <div className="preview-content">
            {previewPrompt}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParameterForm;