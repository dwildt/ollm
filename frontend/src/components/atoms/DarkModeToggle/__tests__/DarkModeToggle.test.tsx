import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DarkModeToggle } from '../DarkModeToggle';
import { useDarkMode } from '../../../../hooks/useDarkMode';

// Mock the useDarkMode hook
jest.mock('../../../../hooks/useDarkMode');
const mockUseDarkMode = useDarkMode as jest.MockedFunction<typeof useDarkMode>;

describe('DarkModeToggle', () => {
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dark mode toggle button', () => {
    mockUseDarkMode.mockReturnValue({
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: jest.fn(),
      toggleTheme: mockToggleTheme,
      isDark: false
    });

    render(<DarkModeToggle />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
  });

  it('shows moon icon in light mode', () => {
    mockUseDarkMode.mockReturnValue({
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: jest.fn(),
      toggleTheme: mockToggleTheme,
      isDark: false
    });

    render(<DarkModeToggle />);
    
    expect(screen.getByText('🌙')).toBeInTheDocument();
    expect(screen.getByTitle('Modo escuro')).toBeInTheDocument();
  });

  it('shows sun icon in dark mode', () => {
    mockUseDarkMode.mockReturnValue({
      theme: 'dark',
      resolvedTheme: 'dark',
      setTheme: jest.fn(),
      toggleTheme: mockToggleTheme,
      isDark: true
    });

    render(<DarkModeToggle />);
    
    expect(screen.getByText('☀️')).toBeInTheDocument();
    expect(screen.getByTitle('Modo claro')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
  });

  it('calls toggleTheme when clicked', () => {
    mockUseDarkMode.mockReturnValue({
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: jest.fn(),
      toggleTheme: mockToggleTheme,
      isDark: false
    });

    render(<DarkModeToggle />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('renders with different sizes', () => {
    mockUseDarkMode.mockReturnValue({
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: jest.fn(),
      toggleTheme: mockToggleTheme,
      isDark: false
    });

    const { rerender } = render(<DarkModeToggle size="sm" />);
    expect(screen.getByRole('button')).toHaveClass('dark-mode-toggle--sm');

    rerender(<DarkModeToggle size="lg" />);
    expect(screen.getByRole('button')).toHaveClass('dark-mode-toggle--lg');
  });

  it('applies custom className', () => {
    mockUseDarkMode.mockReturnValue({
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: jest.fn(),
      toggleTheme: mockToggleTheme,
      isDark: false
    });

    render(<DarkModeToggle className="custom-class" />);
    
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});