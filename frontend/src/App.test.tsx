import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the Chat component since it has complex dependencies
jest.mock('./components/Chat', () => {
  return function MockChat() {
    return <div data-testid="chat-component">Chat Component</div>;
  };
});

// Mock the FreeConversationPage component
jest.mock('./pages/FreeConversationPage', () => {
  return function MockFreeConversationPage() {
    return <div data-testid="free-conversation-page">Free Conversation Page</div>;
  };
});

// Mock the TemplatePage component  
jest.mock('./pages/TemplatePage', () => {
  return function MockTemplatePage() {
    return <div data-testid="template-page">Template Page</div>;
  };
});

// Mock i18n
jest.mock('./i18n', () => ({}));

// Mock matchMedia for dark mode hook
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

test('renders free conversation page by default', () => {
  render(<App />);
  const freeConversationElement = screen.getByTestId('free-conversation-page');
  expect(freeConversationElement).toBeInTheDocument();
});

test('renders without crashing', () => {
  render(<App />);
  expect(screen.getByTestId('free-conversation-page')).toBeInTheDocument();
});
