import React from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'tab' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...rest
}, ref) => {
  const baseClasses = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--full-width',
    isLoading && 'btn--loading',
    disabled && 'btn--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      className={baseClasses}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      <span className="btn__content">
        {leftIcon && !isLoading && (
          <span className="btn__icon btn__icon--left">
            {leftIcon}
          </span>
        )}
        
        {isLoading && (
          <span className="btn__spinner" aria-hidden="true">
            <span className="btn__spinner-dot" />
            <span className="btn__spinner-dot" />
            <span className="btn__spinner-dot" />
          </span>
        )}
        
        <span className="btn__text">
          {children}
        </span>
        
        {rightIcon && !isLoading && (
          <span className="btn__icon btn__icon--right">
            {rightIcon}
          </span>
        )}
      </span>
    </button>
  );
});

Button.displayName = 'Button';

export default Button;