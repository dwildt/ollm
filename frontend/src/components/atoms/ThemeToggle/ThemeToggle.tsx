import React from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { useDarkMode } from '../../../hooks/useDarkMode';
import './ThemeToggle.css';

export interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'secondary';
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  size = 'sm',
  variant = 'ghost',
  showLabel = false
}) => {
  const { resolvedTheme, toggleTheme, isDark } = useDarkMode();

  const handleToggle = () => {
    toggleTheme();
  };

  const themeIcon = isDark ? 'sun' : 'moon';
  const themeLabel = isDark ? 'Modo claro' : 'Modo escuro';
  const ariaLabel = `Alternar para ${isDark ? 'modo claro' : 'modo escuro'}`;

  const toggleClasses = [
    'theme-toggle',
    `theme-toggle--${resolvedTheme}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      className={toggleClasses}
      aria-label={ariaLabel}
      title={themeLabel}
      leftIcon={<Icon name={themeIcon} size={size} />}
    >
      {showLabel && (
        <span className="theme-toggle__label">
          {themeLabel}
        </span>
      )}
    </Button>
  );
};

export default ThemeToggle;