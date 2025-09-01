import React from 'react';
import { TemplateCard } from '../../molecules/TemplateCard';
import { Text } from '../../atoms/Typography';
import { LoadingDots } from '../../atoms/Loading';
import type { ConversationTemplate } from '../../../types/templates';
import './TemplateGrid.css';

export interface TemplateGridProps {
  templates: ConversationTemplate[];
  onTemplateSelect: (template: ConversationTemplate) => void;
  onTemplatePreview?: (template: ConversationTemplate) => void;
  selectedTemplateId?: string;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
}

const TemplateGrid: React.FC<TemplateGridProps> = ({
  templates,
  onTemplateSelect,
  onTemplatePreview,
  selectedTemplateId,
  isLoading = false,
  emptyMessage = 'Nenhum template encontrado',
  className = '',
  disabled = false,
  ...rest
}) => {
  const templateGridClasses = [
    'template-grid',
    isLoading && 'template-grid--loading',
    disabled && 'template-grid--disabled',
    className
  ].filter(Boolean).join(' ');

  if (isLoading) {
    return (
      <div className={templateGridClasses}>
        <div className="template-grid__loading">
          <LoadingDots size="lg" />
          <Text variant="body-sm" color="secondary">
            Carregando templates...
          </Text>
        </div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className={templateGridClasses}>
        <div className="template-grid__empty">
          <Text variant="body" color="tertiary" align="center">
            {emptyMessage}
          </Text>
          <Text variant="body-sm" color="tertiary" align="center">
            Tente ajustar seus filtros para encontrar templates.
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className={templateGridClasses} {...rest}>
      <div className="template-grid__container">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={onTemplateSelect}
            onPreview={onTemplatePreview}
            isSelected={selectedTemplateId === template.id}
            disabled={disabled}
            className="template-grid__card"
          />
        ))}
      </div>
    </div>
  );
};

export default TemplateGrid;