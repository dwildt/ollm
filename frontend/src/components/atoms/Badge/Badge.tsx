import React from 'react';
import './Badge.css';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onRemove?: () => void;
  isSelected?: boolean;
  isClickable?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  onClick,
  onRemove,
  isSelected = false,
  isClickable = false,
  leftIcon,
  rightIcon,
  ...rest
}) => {
  const badgeClasses = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    (onClick || isClickable) && 'badge--clickable',
    isSelected && 'badge--selected',
    onRemove && 'badge--removable',
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (onClick && !onRemove) {
      onClick();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      className={badgeClasses}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...rest}
    >
      <span className="badge__content">
        {leftIcon && (
          <span className="badge__icon badge__icon--left">
            {leftIcon}
          </span>
        )}
        
        <span className="badge__text">
          {children}
        </span>
        
        {rightIcon && !onRemove && (
          <span className="badge__icon badge__icon--right">
            {rightIcon}
          </span>
        )}
        
        {onRemove && (
          <button
            type="button"
            className="badge__remove"
            onClick={handleRemove}
            aria-label="Remover"
            tabIndex={-1}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </span>
    </Component>
  );
};

export default Badge;