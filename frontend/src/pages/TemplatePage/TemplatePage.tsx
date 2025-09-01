import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatTemplate } from '../../components/templates/ChatTemplate';
import { TemplateSelectionTemplate } from '../../components/templates/TemplateSelectionTemplate';
import { useModeSwitch } from '../../hooks/useModeSwitch';
import { useTemplateFilters } from '../../hooks/useTemplateFilters';
import { templateService } from '../../services/templateService';
import type { ConversationTemplate } from '../../types/templates';
import './TemplatePage.css';

const TemplatePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentMode, switchMode, isTransitioning } = useModeSwitch();
  const [templates, setTemplates] = useState<ConversationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ConversationTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    searchQuery,
    selectedCategories,
    selectedTags,
    categoryOptions,
    tagOptions,
    filteredTemplates,
    setSearchQuery,
    setSelectedCategories,
    setSelectedTags,
    clearAllFilters,
    filteredCount,
    totalTemplates,
    hasActiveFilters
  } = useTemplateFilters({ templates });

  // Load templates on mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setIsLoading(true);
        const allTemplates = templateService.getAllTemplates();
        setTemplates(allTemplates);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error loading templates:', error);
        // TODO: Show error toast/notification
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const handleTemplateSelect = (template: ConversationTemplate) => {
    setSelectedTemplate(template);
    
    // Navigate to chat with template
    navigate(`/chat/${template.slug}`, { 
      replace: false,
      state: { template } 
    });
  };

  const handleTemplatePreview = (template: ConversationTemplate) => {
    // TODO: Show template preview modal/drawer
    // eslint-disable-next-line no-console
    console.log('Preview template:', template);
  };

  const handleStartFreeConversation = () => {
    switchMode('free-conversation');
  };

  return (
    <div className="template-page">
      <ChatTemplate
        currentMode={currentMode}
        onModeChange={switchMode}
        isLoading={isTransitioning}
        className="template-page__template"
      >
        <TemplateSelectionTemplate
          templates={filteredTemplates}
          selectedTemplateId={selectedTemplate?.id}
          onTemplateSelect={handleTemplateSelect}
          onTemplatePreview={handleTemplatePreview}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryOptions={categoryOptions}
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
          tagOptions={tagOptions}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          onClearFilters={clearAllFilters}
          isLoading={isLoading}
          hasActiveFilters={hasActiveFilters}
          filteredCount={filteredCount}
          totalCount={totalTemplates}
          onStartFreeConversation={handleStartFreeConversation}
        />
      </ChatTemplate>
    </div>
  );
};

export default TemplatePage;