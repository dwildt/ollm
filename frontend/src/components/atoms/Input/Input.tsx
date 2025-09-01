import React from 'react';
import './Input.css';

export type InputVariant = 'default' | 'search';
export type InputSize = 'sm' | 'md' | 'lg';

interface BaseInputProps {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export interface TextInputProps extends BaseInputProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  type?: 'text' | 'email' | 'password' | 'url' | 'tel';
}

export interface TextAreaProps extends BaseInputProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  minRows?: number;
  maxRows?: number;
}

export interface SearchInputProps extends BaseInputProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  onClear?: () => void;
  showClearButton?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  variant = 'default',
  size = 'md',
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  fullWidth = false,
  isLoading = false,
  className = '',
  id,
  ...rest
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const containerClasses = [
    'input-container',
    fullWidth && 'input-container--full-width',
    error && 'input-container--error',
    className
  ].filter(Boolean).join(' ');

  const inputClasses = [
    'input',
    `input--${variant}`,
    `input--${size}`,
    leftIcon && 'input--with-left-icon',
    rightIcon && 'input--with-right-icon',
    isLoading && 'input--loading'
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {rest.required && <span className="input-label__required">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {leftIcon && (
          <div className="input-icon input-icon--left">
            {leftIcon}
          </div>
        )}
        
        <input
          id={inputId}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            [
              error && `${inputId}-error`,
              hint && `${inputId}-hint`
            ].filter(Boolean).join(' ') || undefined
          }
          {...rest}
        />
        
        {(rightIcon || isLoading) && (
          <div className="input-icon input-icon--right">
            {isLoading ? (
              <div className="input-spinner" aria-hidden="true">
                <div className="input-spinner__dot"></div>
                <div className="input-spinner__dot"></div>
                <div className="input-spinner__dot"></div>
              </div>
            ) : rightIcon}
          </div>
        )}
      </div>
      
      {hint && !error && (
        <div id={`${inputId}-hint`} className="input-hint">
          {hint}
        </div>
      )}
      
      {error && (
        <div id={`${inputId}-error`} className="input-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

const TextArea: React.FC<TextAreaProps> = ({
  variant = 'default',
  size = 'md',
  label,
  error,
  hint,
  fullWidth = false,
  resize = 'vertical',
  minRows = 3,
  maxRows,
  className = '',
  id,
  ...rest
}) => {
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  const containerClasses = [
    'input-container',
    fullWidth && 'input-container--full-width',
    error && 'input-container--error',
    className
  ].filter(Boolean).join(' ');

  const textareaClasses = [
    'textarea',
    `textarea--${variant}`,
    `textarea--${size}`,
    `textarea--resize-${resize}`
  ].filter(Boolean).join(' ');

  const textareaStyle = {
    minHeight: `${minRows * 1.5}rem`,
    maxHeight: maxRows ? `${maxRows * 1.5}rem` : undefined
  };

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {rest.required && <span className="input-label__required">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        <textarea
          id={inputId}
          className={textareaClasses}
          style={textareaStyle}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            [
              error && `${inputId}-error`,
              hint && `${inputId}-hint`
            ].filter(Boolean).join(' ') || undefined
          }
          {...rest}
        />
      </div>
      
      {hint && !error && (
        <div id={`${inputId}-hint`} className="input-hint">
          {hint}
        </div>
      )}
      
      {error && (
        <div id={`${inputId}-error`} className="input-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

const SearchInput: React.FC<SearchInputProps> = ({
  variant = 'search',
  size = 'md',
  onClear,
  showClearButton = true,
  value,
  rightIcon,
  ...props
}) => {
  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  const searchIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5 5.806 2 10.5 2 19 5.806 19 10.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const clearIcon = (
    <button
      type="button"
      className="input-clear-button"
      onClick={handleClear}
      aria-label="Limpar busca"
      tabIndex={-1}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18 6L6 18M6 6L18 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );

  return (
    <TextInput
      {...props}
      variant={variant}
      size={size}
      value={value}
      leftIcon={searchIcon}
      rightIcon={showClearButton && value ? clearIcon : rightIcon}
      type="search"
    />
  );
};

export { TextInput, TextArea, SearchInput };
export default TextInput;