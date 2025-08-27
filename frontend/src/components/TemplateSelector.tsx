import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ConversationTemplate } from '../types/templates';
import { templateService } from '../services/templateService';
import './TemplateSelector.css';

interface TemplateSelectorProps {
  onTemplateSelect: (template: ConversationTemplate | null) => void;
  selectedTemplate: ConversationTemplate | null;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onTemplateSelect,
  selectedTemplate
}) => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<ConversationTemplate[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const loadTemplates = () => {
      try {
        const allTemplates = templateService.getAllTemplates();
        setTemplates(allTemplates);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error loading templates:', error);
        setTemplates([]);
      }
    };

    loadTemplates();
  }, []);

  const handleTemplateChange = (templateId: string) => {
    if (templateId === '') {
      onTemplateSelect(null);
    } else {
      const template = templateService.getTemplateById(templateId);
      onTemplateSelect(template);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (templates.length === 0) {
    return null;
  }

  return (
    <div className="template-selector">
      <div className="template-selector-header">
        <label htmlFor="template-select">{t('templates.conversationTemplate')}</label>
        <button 
          type="button"
          className="template-toggle"
          onClick={toggleExpanded}
          aria-expanded={isExpanded}
        >
          {isExpanded ? t('templates.hideTemplates') : t('templates.showTemplates')}
        </button>
      </div>

      {isExpanded && (
        <div className="template-selector-content">
          <select
            id="template-select"
            value={selectedTemplate?.id || ''}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="template-select"
          >
            <option value="">{t('templates.freeConversation')}</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} - {template.category}
              </option>
            ))}
          </select>

          {selectedTemplate && (
            <div className="template-preview">
              <h4>{selectedTemplate.name}</h4>
              <p className="template-description">{selectedTemplate.description}</p>
              <div className="template-meta">
                <span className="template-category">{t('templates.category')} {selectedTemplate.category}</span>
                {selectedTemplate.parameters.length > 0 && (
                  <span className="template-params">
                    {t('templates.parameters')} {selectedTemplate.parameters.length}
                  </span>
                )}
              </div>
              {selectedTemplate.tags.length > 0 && (
                <div className="template-tags">
                  {selectedTemplate.tags.map((tag) => (
                    <span key={tag} className="template-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;