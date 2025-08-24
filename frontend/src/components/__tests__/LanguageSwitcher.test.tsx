import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSwitcher from '../LanguageSwitcher';

// Mock react-i18next
const mockChangeLanguage = jest.fn();
const mockUseTranslation = {
  t: jest.fn((key: string) => key),
  i18n: {
    language: 'en',
    changeLanguage: mockChangeLanguage
  }
};

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation
}));

describe('LanguageSwitcher Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTranslation.i18n.language = 'en';
  });

  test('renders language switcher buttons', () => {
    render(<LanguageSwitcher />);
    
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('PT')).toBeInTheDocument();
  });

  test('shows active state for current language (English)', () => {
    mockUseTranslation.i18n.language = 'en';
    
    render(<LanguageSwitcher />);
    
    const enButton = screen.getByText('EN');
    const ptButton = screen.getByText('PT');
    
    expect(enButton).toHaveClass('active');
    expect(ptButton).not.toHaveClass('active');
  });

  test('shows active state for current language (Portuguese)', () => {
    mockUseTranslation.i18n.language = 'pt';
    
    render(<LanguageSwitcher />);
    
    const enButton = screen.getByText('EN');
    const ptButton = screen.getByText('PT');
    
    expect(ptButton).toHaveClass('active');
    expect(enButton).not.toHaveClass('active');
  });

  test('calls changeLanguage when English button is clicked', () => {
    mockUseTranslation.i18n.language = 'pt';
    
    render(<LanguageSwitcher />);
    
    const enButton = screen.getByText('EN');
    fireEvent.click(enButton);
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
    expect(mockChangeLanguage).toHaveBeenCalledTimes(1);
  });

  test('calls changeLanguage when Portuguese button is clicked', () => {
    mockUseTranslation.i18n.language = 'en';
    
    render(<LanguageSwitcher />);
    
    const ptButton = screen.getByText('PT');
    fireEvent.click(ptButton);
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('pt');
    expect(mockChangeLanguage).toHaveBeenCalledTimes(1);
  });

  test('applies correct CSS classes', () => {
    render(<LanguageSwitcher />);
    
    const container = screen.getByRole('group');
    const enButton = screen.getByText('EN');
    const ptButton = screen.getByText('PT');
    
    expect(container).toHaveClass('language-switcher');
    expect(enButton).toHaveClass('lang-button');
    expect(ptButton).toHaveClass('lang-button');
  });

  test('handles multiple language switches', () => {
    render(<LanguageSwitcher />);
    
    const enButton = screen.getByText('EN');
    const ptButton = screen.getByText('PT');
    
    // Switch to Portuguese
    fireEvent.click(ptButton);
    expect(mockChangeLanguage).toHaveBeenCalledWith('pt');
    
    // Switch to English
    fireEvent.click(enButton);
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
    
    expect(mockChangeLanguage).toHaveBeenCalledTimes(2);
  });

  test('clicking active language button still calls changeLanguage', () => {
    mockUseTranslation.i18n.language = 'en';
    
    render(<LanguageSwitcher />);
    
    const enButton = screen.getByText('EN');
    fireEvent.click(enButton);
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });

  test('has accessible button structure', () => {
    render(<LanguageSwitcher />);
    
    const enButton = screen.getByRole('button', { name: 'EN' });
    const ptButton = screen.getByRole('button', { name: 'PT' });
    
    expect(enButton).toBeInTheDocument();
    expect(ptButton).toBeInTheDocument();
  });

  test('handles unknown language gracefully', () => {
    mockUseTranslation.i18n.language = 'fr';
    
    render(<LanguageSwitcher />);
    
    const enButton = screen.getByText('EN');
    const ptButton = screen.getByText('PT');
    
    // Neither should be active for unknown language
    expect(enButton).not.toHaveClass('active');
    expect(ptButton).not.toHaveClass('active');
  });
});