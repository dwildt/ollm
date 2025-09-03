import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ConversationTemplate } from '../../../types/templates';
import { templateService } from '../../../services/templateService';
import { Modal } from '../../atoms/Modal';
import './TemplateModalSelector.css';

interface TemplateModalSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateSelect: (template: ConversationTemplate | null) => void;
  selectedTemplate: ConversationTemplate | null;
}

export const TemplateModalSelector: React.FC<TemplateModalSelectorProps> = ({
  isOpen,
  onClose,
  onTemplateSelect,
  selectedTemplate
}) => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<ConversationTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      const allTemplates = templateService.getAllTemplates();
      setTemplates(allTemplates);
    }
  }, [isOpen]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = templates.reduce((acc, template) => {
      if (template.category && !acc.includes(template.category)) {
        acc.push(template.category);
      }
      return acc;
    }, [] as string[]);
    return cats.sort();
  }, [templates]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = searchQuery === '' || 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        template.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchQuery, selectedCategory]);

  const handleTemplateSelect = (template: ConversationTemplate) => {
    onTemplateSelect(template);
    onClose();
  };

  const handleClearTemplate = () => {
    onTemplateSelect(null);
    onClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('templates.selectTemplate')}
      size="large"
    >
      <div className="template-modal-selector">
        {/* Search and Filters */}
        <div className="template-filters">
          <div className="template-search">
            <input
              type="text"
              placeholder={t('templates.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="template-search-input"
            />
          </div>
          
          <div className="template-categories">
            <button
              className={`category-chip ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              {t('templates.allCategories')}
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates List */}
        <div className="templates-list">
          {/* Clear selection option */}
          <div
            className={`template-card ${!selectedTemplate ? 'selected' : ''}`}
            onClick={handleClearTemplate}
          >
            <div className="template-card-header">
              <h3 className="template-name">{t('templates.freeConversation')}</h3>
              <span className="template-category">General</span>
            </div>
            <p className="template-description">
              {t('templates.freeConversationDescription')}
            </p>
          </div>

          {filteredTemplates.length === 0 && searchQuery && (
            <div className="no-templates">
              <p>{t('templates.noTemplatesFound')}</p>
            </div>
          )}

          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="template-card-header">
                <h3 className="template-name">{template.name}</h3>
                {template.category && (
                  <span className="template-category">{template.category}</span>
                )}
              </div>
              <p className="template-description">{template.description}</p>
              {template.parameters.length > 0 && (
                <div className="template-params-count">
                  {t('templates.parametersCount', { count: template.parameters.length })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};