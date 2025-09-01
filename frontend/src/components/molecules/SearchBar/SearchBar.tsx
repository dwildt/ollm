import React, { useState, useCallback, useEffect } from 'react';
import { SearchInput } from '../../atoms/Input';
import type { InputSize } from '../../atoms/Input';
import './SearchBar.css';

export interface SearchBarProps {
  placeholder?: string;
  size?: InputSize;
  value?: string;
  defaultValue?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  debounceMs?: number;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Buscar...',
  size = 'md',
  value: controlledValue,
  defaultValue = '',
  onSearch,
  onClear,
  debounceMs = 300,
  className = '',
  disabled = false,
  autoFocus = false,
  ...rest
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  // Determine if component is controlled or uncontrolled
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleSearch = useCallback((query: string) => {
    onSearch(query);
  }, [onSearch]);

  const handleClear = useCallback(() => {
    if (!isControlled) {
      setInternalValue('');
    }
    if (onClear) {
      onClear();
    } else {
      handleSearch('');
    }
  }, [isControlled, onClear, handleSearch]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (!isControlled) {
      setInternalValue(newValue);
    }

    // Clear existing timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      handleSearch(newValue);
    }, debounceMs);

    setDebounceTimeout(timeout);
  }, [isControlled, debounceTimeout, handleSearch, debounceMs]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  const searchBarClasses = [
    'search-bar',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={searchBarClasses}>
      <SearchInput
        value={currentValue}
        onChange={handleChange}
        onClear={handleClear}
        placeholder={placeholder}
        size={size}
        disabled={disabled}
        autoFocus={autoFocus}
        showClearButton={currentValue.length > 0}
        aria-label="Campo de busca"
        {...rest}
      />
    </div>
  );
};

export default SearchBar;