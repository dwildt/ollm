import React from 'react';
import { SearchBar } from '../../molecules/SearchBar';
import { FilterDropdown, FilterOption } from '../../molecules/FilterDropdown';
import { TagFilter, TagOption } from '../../molecules/TagFilter';
import './TemplateFilters.css';

export interface TemplateFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: FilterOption[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  tags: TagOption[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  onClearFilters?: () => void;
  className?: string;
  disabled?: boolean;
}

const TemplateFilters: React.FC<TemplateFiltersProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategories,
  onCategoriesChange,
  tags,
  selectedTags,
  onTagsChange,
  onClearFilters: _onClearFilters,
  className = '',
  disabled = false,
  ...rest
}) => {
  const hasActiveFilters = searchQuery.length > 0 || selectedCategories.length > 0 || selectedTags.length > 0;

  const templateFiltersClasses = [
    'template-filters',
    hasActiveFilters && 'template-filters--active',
    disabled && 'template-filters--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={templateFiltersClasses} {...rest}>
      <div className="template-filters__primary">
        <SearchBar
          placeholder="Buscar templates..."
          value={searchQuery}
          onSearch={onSearchChange}
          disabled={disabled}
          className="template-filters__search"
        />
        
        <FilterDropdown
          label="Categoria"
          options={categories}
          selectedValues={selectedCategories}
          onSelectionChange={onCategoriesChange}
          disabled={disabled}
          className="template-filters__category"
        />
      </div>

      {tags.length > 0 && (
        <TagFilter
          label="Tags"
          tags={tags}
          selectedTags={selectedTags}
          onTagToggle={(tag: string) => {
            const newSelectedTags = selectedTags.includes(tag)
              ? selectedTags.filter(t => t !== tag)
              : [...selectedTags, tag];
            onTagsChange(newSelectedTags);
          }}
          onClearAll={() => onTagsChange([])}
          disabled={disabled}
          className="template-filters__tags"
        />
      )}
    </div>
  );
};

export default TemplateFilters;