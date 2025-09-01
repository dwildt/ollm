import React from 'react';
import { TemplateFilters } from '../../organisms/TemplateFilters';
import { TemplateGrid } from '../../organisms/TemplateGrid';
import { Text } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import type { ConversationTemplate } from '../../../types/templates';
import type { FilterOption } from '../../molecules/FilterDropdown';
import type { TagOption } from '../../molecules/TagFilter';
import './TemplateSelectionTemplate.css';

export interface TemplateSelectionTemplateProps {
  // Templates
  templates: ConversationTemplate[];
  selectedTemplateId?: string;
  onTemplateSelect: (template: ConversationTemplate) => void;
  onTemplatePreview?: (template: ConversationTemplate) => void;
  
  // Filters
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryOptions: FilterOption[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  tagOptions: TagOption[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  onClearFilters: () => void;
  
  // State
  isLoading?: boolean;
  hasActiveFilters?: boolean;
  filteredCount: number;
  totalCount: number;
  
  // Actions
  onStartFreeConversation?: () => void;
  
  className?: string;
}

const TemplateSelectionTemplate: React.FC<TemplateSelectionTemplateProps> = ({
  templates,
  selectedTemplateId,
  onTemplateSelect,
  onTemplatePreview,
  searchQuery,
  onSearchChange,
  categoryOptions,
  selectedCategories,
  onCategoriesChange,
  tagOptions,
  selectedTags,
  onTagsChange,
  onClearFilters,
  isLoading = false,
  hasActiveFilters = false,
  filteredCount,
  totalCount,
  onStartFreeConversation,
  className = '',
  ...rest
}) => {
  const templateSelectionClasses = [
    'template-selection',
    isLoading && 'template-selection--loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={templateSelectionClasses} {...rest}>
      <div className="template-selection__header">
        <div className="template-selection__title-section">
          <Text variant="body" color="secondary">
            Escolha um template para começar sua conversa ou{' '}
            {onStartFreeConversation && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onStartFreeConversation}
                className="template-selection__free-chat-link"
              >
                <Icon name="chat" size="xs" />
                inicie uma conversa livre
              </Button>
            )}
          </Text>
        </div>
        
        <div className="template-selection__stats">
          <Text variant="body-sm" color="tertiary">
            {hasActiveFilters ? (
              <>
                {filteredCount} de {totalCount} templates
                {filteredCount !== totalCount && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="template-selection__clear-filters"
                  >
                    <Icon name="clear" size="xs" />
                    Limpar filtros
                  </Button>
                )}
              </>
            ) : (
              `${totalCount} templates disponíveis`
            )}
          </Text>
        </div>
      </div>

      <div className="template-selection__filters">
        <TemplateFilters
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          categories={categoryOptions}
          selectedCategories={selectedCategories}
          onCategoriesChange={onCategoriesChange}
          tags={tagOptions}
          selectedTags={selectedTags}
          onTagsChange={onTagsChange}
          onClearFilters={onClearFilters}
          disabled={isLoading}
        />
      </div>

      <div className="template-selection__content">
        <TemplateGrid
          templates={templates}
          selectedTemplateId={selectedTemplateId}
          onTemplateSelect={onTemplateSelect}
          onTemplatePreview={onTemplatePreview}
          isLoading={isLoading}
          emptyMessage={
            hasActiveFilters 
              ? "Nenhum template encontrado com os filtros aplicados"
              : "Nenhum template disponível"
          }
        />
      </div>
    </div>
  );
};

export default TemplateSelectionTemplate;