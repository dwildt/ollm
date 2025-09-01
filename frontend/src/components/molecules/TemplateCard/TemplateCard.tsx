import React from 'react';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Heading, Text } from '../../atoms/Typography';
import type { ConversationTemplate } from '../../../types/templates';
import './TemplateCard.css';

export interface TemplateCardProps {
  template: ConversationTemplate;
  onSelect: (template: ConversationTemplate) => void;
  onPreview?: (template: ConversationTemplate) => void;
  isSelected?: boolean;
  showDescription?: boolean;
  showParameterCount?: boolean;
  showTags?: boolean;
  className?: string;
  disabled?: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onSelect,
  onPreview,
  isSelected = false,
  showDescription = true,
  showParameterCount = true,
  showTags = true,
  className = '',
  disabled = false,
  ...rest
}) => {
  const hasParameters = template.parameters && template.parameters.length > 0;
  const parameterCount = template.parameters?.length || 0;
  const requiredParams = template.parameters?.filter(p => p.required).length || 0;

  const handleSelect = () => {
    if (!disabled) {
      onSelect(template);
    }
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onPreview) {
      onPreview(template);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect();
    }
  };

  const cardClasses = [
    'template-card',
    isSelected && 'template-card--selected',
    disabled && 'template-card--disabled',
    className
  ].filter(Boolean).join(' ');

  const getCategoryColor = (category: string): 'primary' | 'success' | 'warning' | 'info' => {
    switch (category.toLowerCase()) {
      case 'educação':
      case 'education':
        return 'info';
      case 'criatividade':
      case 'creativity':
        return 'warning';
      case 'desenvolvimento':
      case 'development':
        return 'success';
      case 'marketing':
        return 'primary';
      default:
        return 'primary';
    }
  };

  return (
    <div
      className={cardClasses}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={`Template: ${template.name}. ${showDescription ? template.description : ''}`}
      aria-pressed={isSelected}
      {...rest}
    >
      <div className="template-card__header">
        <div className="template-card__title-section">
          <Heading level={4} className="template-card__title">
            {template.name}
          </Heading>
          
          <div className="template-card__meta">
            <Badge
              variant={getCategoryColor(template.category)}
              size="sm"
              className="template-card__category"
            >
              {template.category}
            </Badge>
            
            {showParameterCount && hasParameters && (
              <div className="template-card__params-info">
                <Icon name="settings" size="xs" />
                <Text variant="caption" color="tertiary">
                  {parameterCount} parâmetro{parameterCount !== 1 ? 's' : ''}
                  {requiredParams > 0 && (
                    <span className="template-card__required-params">
                      {' '}({requiredParams} obrigatório{requiredParams !== 1 ? 's' : ''})
                    </span>
                  )}
                </Text>
              </div>
            )}
          </div>
        </div>

        {onPreview && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreview}
            disabled={disabled}
            className="template-card__preview-btn"
            aria-label="Visualizar template"
            tabIndex={-1}
          >
            <Icon name="external-link" size="sm" />
          </Button>
        )}
      </div>

      {showDescription && (
        <div className="template-card__body">
          <Text 
            variant="body-sm" 
            color="secondary" 
            className="template-card__description"
          >
            {template.description}
          </Text>
        </div>
      )}

      {showTags && template.tags && template.tags.length > 0 && (
        <div className="template-card__footer">
          <div className="template-card__tags">
            {template.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="default"
                size="sm"
                className="template-card__tag"
              >
                {tag}
              </Badge>
            ))}
            {template.tags.length > 3 && (
              <Text variant="caption" color="tertiary" className="template-card__tag-overflow">
                +{template.tags.length - 3} mais
              </Text>
            )}
          </div>
        </div>
      )}

      {hasParameters && (
        <div className="template-card__indicator">
          <Icon name="template" size="sm" className="template-card__indicator-icon" />
        </div>
      )}

      {isSelected && (
        <div className="template-card__selection-indicator">
          <Icon name="check" size="sm" className="template-card__check-icon" />
        </div>
      )}
    </div>
  );
};

export default TemplateCard;