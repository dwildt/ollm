import { useState, useMemo, useCallback } from 'react';
import type { ConversationTemplate } from '../types/templates';
import type { FilterOption } from '../components/molecules/FilterDropdown';
import type { TagOption } from '../components/molecules/TagFilter';

export interface UseTemplateFiltersProps {
  templates: ConversationTemplate[];
}

export interface UseTemplateFiltersReturn {
  // Filter states
  searchQuery: string;
  selectedCategories: string[];
  selectedTags: string[];
  
  // Filter options
  categoryOptions: FilterOption[];
  tagOptions: TagOption[];
  
  // Filtered results
  filteredTemplates: ConversationTemplate[];
  
  // Filter actions
  setSearchQuery: (query: string) => void;
  setSelectedCategories: (categories: string[]) => void;
  setSelectedTags: (tags: string[]) => void;
  clearAllFilters: () => void;
  
  // Stats
  totalTemplates: number;
  filteredCount: number;
  hasActiveFilters: boolean;
}

export const useTemplateFilters = ({ templates }: UseTemplateFiltersProps): UseTemplateFiltersReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Generate category options with counts
  const categoryOptions = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    templates.forEach(template => {
      const count = categoryMap.get(template.category) || 0;
      categoryMap.set(template.category, count + 1);
    });
    
    return Array.from(categoryMap.entries())
      .map(([category, count]) => ({
        value: category,
        label: category,
        count
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [templates]);

  // Generate tag options with counts
  const tagOptions = useMemo(() => {
    const tagMap = new Map<string, number>();
    
    templates.forEach(template => {
      template.tags.forEach(tag => {
        const count = tagMap.get(tag) || 0;
        tagMap.set(tag, count + 1);
      });
    });
    
    return Array.from(tagMap.entries())
      .map(([tag, count]) => ({
        value: tag,
        label: tag,
        count
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  }, [templates]);

  // Filter templates based on all active filters
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = template.name.toLowerCase().includes(query);
        const matchesDescription = template.description.toLowerCase().includes(query);
        const matchesTags = template.tags.some(tag => tag.toLowerCase().includes(query));
        const matchesCategory = template.category.toLowerCase().includes(query);
        
        if (!matchesName && !matchesDescription && !matchesTags && !matchesCategory) {
          return false;
        }
      }
      
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(template.category)) {
        return false;
      }
      
      // Tags filter (template must have at least one selected tag)
      if (selectedTags.length > 0) {
        const hasSelectedTag = selectedTags.some(tag => template.tags.includes(tag));
        if (!hasSelectedTag) {
          return false;
        }
      }
      
      return true;
    });
  }, [templates, searchQuery, selectedCategories, selectedTags]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedTags([]);
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return searchQuery.trim().length > 0 || 
           selectedCategories.length > 0 || 
           selectedTags.length > 0;
  }, [searchQuery, selectedCategories, selectedTags]);

  return {
    // Filter states
    searchQuery,
    selectedCategories,
    selectedTags,
    
    // Filter options
    categoryOptions,
    tagOptions,
    
    // Filtered results
    filteredTemplates,
    
    // Filter actions
    setSearchQuery,
    setSelectedCategories,
    setSelectedTags,
    clearAllFilters,
    
    // Stats
    totalTemplates: templates.length,
    filteredCount: filteredTemplates.length,
    hasActiveFilters
  };
};