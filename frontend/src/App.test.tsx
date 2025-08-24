import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the Chat component since it has complex dependencies
jest.mock('./components/Chat', () => {
  return function MockChat() {
    return <div data-testid="chat-component">Chat Component</div>;
  };
});

// Mock i18n
jest.mock('./i18n', () => ({}));

test('renders chat component', () => {
  render(<App />);
  const chatElement = screen.getByTestId('chat-component');
  expect(chatElement).toBeInTheDocument();
});

test('renders without crashing', () => {
  render(<App />);
  expect(screen.getByRole('main')).toBeInTheDocument();
});
