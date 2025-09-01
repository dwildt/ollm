import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { Text } from '../../atoms/Typography';
import './FilterDropdown.css';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onSelectionChange: (selectedValues: string[]) => void;
  placeholder?: string;
  multiSelect?: boolean;
  maxSelectedDisplay?: number;
  className?: string;
  disabled?: boolean;
  showCounts?: boolean;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  selectedValues,
  onSelectionChange,
  placeholder = 'Selecionar...',
  multiSelect = true,
  maxSelectedDisplay = 2,
  className = '',
  disabled = false,
  showCounts = true,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const hasSelection = selectedValues.length > 0;
  const selectedOptions = options.filter(option => selectedValues.includes(option.value));

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (optionValue: string) => {
    if (multiSelect) {
      const newSelectedValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(value => value !== optionValue)
        : [...selectedValues, optionValue];
      
      onSelectionChange(newSelectedValues);
    } else {
      onSelectionChange(selectedValues.includes(optionValue) ? [] : [optionValue]);
      setIsOpen(false);
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case 'ArrowDown':
        if (!isOpen) {
          setIsOpen(true);
        }
        e.preventDefault();
        break;
      case 'ArrowUp':
        e.preventDefault();
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getButtonText = () => {
    if (!hasSelection) {
      return placeholder;
    }

    if (selectedOptions.length === 1) {
      return selectedOptions[0].label;
    }

    if (selectedOptions.length <= maxSelectedDisplay) {
      return selectedOptions.map(opt => opt.label).join(', ');
    }

    const displayedOptions = selectedOptions.slice(0, maxSelectedDisplay);
    const remainingCount = selectedOptions.length - maxSelectedDisplay;
    return `${displayedOptions.map(opt => opt.label).join(', ')} +${remainingCount}`;
  };

  const dropdownClasses = [
    'filter-dropdown',
    isOpen && 'filter-dropdown--open',
    hasSelection && 'filter-dropdown--has-selection',
    disabled && 'filter-dropdown--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={dropdownRef}
      className={dropdownClasses}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <Button
        ref={buttonRef}
        variant="secondary"
        onClick={handleToggle}
        disabled={disabled}
        className="filter-dropdown__trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`${label}: ${getButtonText()}`}
      >
        <span className="filter-dropdown__label">
          {label}
        </span>
        <span className="filter-dropdown__value">
          {getButtonText()}
        </span>
        {hasSelection && (
          <Badge
            variant="primary"
            size="sm"
            className="filter-dropdown__count"
          >
            {selectedValues.length}
          </Badge>
        )}
        <Icon
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size="sm"
          className="filter-dropdown__icon"
        />
      </Button>

      {isOpen && (
        <div
          className="filter-dropdown__menu"
          role="listbox"
          aria-multiselectable={multiSelect}
          aria-label={`${label} options`}
        >
          {hasSelection && multiSelect && (
            <div className="filter-dropdown__header">
              <Text variant="body-sm" color="secondary">
                {selectedValues.length} selecionado{selectedValues.length !== 1 ? 's' : ''}
              </Text>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="filter-dropdown__clear"
              >
                Limpar
              </Button>
            </div>
          )}

          <ul className="filter-dropdown__options">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              
              return (
                <li key={option.value} className="filter-dropdown__option-item">
                  <button
                    type="button"
                    className={`filter-dropdown__option ${isSelected ? 'filter-dropdown__option--selected' : ''}`}
                    onClick={() => handleOptionClick(option.value)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="filter-dropdown__option-content">
                      <span className="filter-dropdown__option-label">
                        {option.label}
                      </span>
                      {showCounts && option.count !== undefined && (
                        <span className="filter-dropdown__option-count">
                          {option.count}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Icon
                        name="check"
                        size="sm"
                        className="filter-dropdown__option-check"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {options.length === 0 && (
            <div className="filter-dropdown__empty">
              <Text variant="body-sm" color="tertiary" align="center">
                Nenhuma opção disponível
              </Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;