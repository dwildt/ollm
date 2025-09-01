import React, { useState } from 'react';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Text } from '../../atoms/Typography';
import './TagFilter.css';

export interface TagOption {
  value: string;
  label: string;
  count?: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

export interface TagFilterProps {
  label?: string;
  tags: TagOption[];
  selectedTags: string[];
  onTagToggle: (tagValue: string) => void;
  onClearAll?: () => void;
  maxVisibleTags?: number;
  showCounts?: boolean;
  allowMultiple?: boolean;
  className?: string;
  disabled?: boolean;
}

const TagFilter: React.FC<TagFilterProps> = ({
  label = 'Tags',
  tags,
  selectedTags,
  onTagToggle,
  onClearAll,
  maxVisibleTags = 8,
  showCounts = true,
  allowMultiple = true,
  className = '',
  disabled = false,
  ...rest
}) => {
  const [showAllTags, setShowAllTags] = useState(false);

  const hasSelection = selectedTags.length > 0;
  const visibleTags = showAllTags ? tags : tags.slice(0, maxVisibleTags);
  const hasMoreTags = tags.length > maxVisibleTags;
  const hiddenTagsCount = tags.length - maxVisibleTags;

  const handleTagClick = (tagValue: string) => {
    if (disabled) return;

    if (!allowMultiple) {
      // Single selection mode - deselect if already selected, select if not
      onTagToggle(tagValue);
    } else {
      // Multiple selection mode
      onTagToggle(tagValue);
    }
  };

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    }
  };

  const handleToggleShowAll = () => {
    setShowAllTags(!showAllTags);
  };

  const isTagSelected = (tagValue: string) => {
    return selectedTags.includes(tagValue);
  };

  const getTagVariant = (tag: TagOption, isSelected: boolean) => {
    if (isSelected) {
      return tag.color || 'primary';
    }
    return 'default';
  };

  const tagFilterClasses = [
    'tag-filter',
    hasSelection && 'tag-filter--has-selection',
    disabled && 'tag-filter--disabled',
    className
  ].filter(Boolean).join(' ');

  if (tags.length === 0) {
    return (
      <div className={tagFilterClasses}>
        <Text variant="body-sm" color="tertiary">
          Nenhuma tag disponível
        </Text>
      </div>
    );
  }

  return (
    <div className={tagFilterClasses} {...rest}>
      {label && (
        <div className="tag-filter__header">
          <Text variant="body-sm" weight="medium" color="secondary">
            {label}
          </Text>
          {hasSelection && onClearAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              disabled={disabled}
              className="tag-filter__clear"
            >
              <Icon name="clear" size="xs" />
              Limpar
            </Button>
          )}
        </div>
      )}

      <div className="tag-filter__content">
        <div className="tag-filter__tags">
          {visibleTags.map((tag) => {
            const isSelected = isTagSelected(tag.value);
            const variant = getTagVariant(tag, isSelected);

            return (
              <Badge
                key={tag.value}
                variant={variant}
                onClick={() => handleTagClick(tag.value)}
                isSelected={isSelected}
                isClickable={!disabled}
                className="tag-filter__tag"
                aria-pressed={isSelected}
                aria-label={`${tag.label}${showCounts && tag.count ? ` (${tag.count} items)` : ''}`}
              >
                <span className="tag-filter__tag-label">
                  {tag.label}
                </span>
                {showCounts && tag.count !== undefined && (
                  <span className="tag-filter__tag-count">
                    {tag.count}
                  </span>
                )}
              </Badge>
            );
          })}
        </div>

        {hasMoreTags && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleShowAll}
            disabled={disabled}
            className="tag-filter__toggle"
            aria-expanded={showAllTags}
            aria-label={showAllTags ? 'Mostrar menos tags' : `Mostrar mais ${hiddenTagsCount} tags`}
          >
            <Icon 
              name={showAllTags ? 'chevron-up' : 'chevron-down'} 
              size="sm" 
            />
            {showAllTags ? 'Mostrar menos' : `+${hiddenTagsCount} mais`}
          </Button>
        )}
      </div>

      {hasSelection && selectedTags.length > 0 && (
        <div className="tag-filter__summary">
          <Text variant="caption" color="secondary">
            {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selecionada{selectedTags.length !== 1 ? 's' : ''}
          </Text>
        </div>
      )}
    </div>
  );
};

export default TagFilter;