import React from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import './DarkModeToggle.css';

export interface DarkModeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ 
  size = 'md',
  className = ''
}) => {
  const { isDark, toggleTheme } = useDarkMode();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`dark-mode-toggle dark-mode-toggle--${size} ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Modo claro' : 'Modo escuro'}
    >
      <span className="dark-mode-toggle__icon">
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  );
};

export default DarkModeToggle;