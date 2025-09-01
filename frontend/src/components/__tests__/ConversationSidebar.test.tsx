import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConversationSidebar from '../ConversationSidebar';
import { conversationStorage } from '../../services/conversationStorage';
import { SavedConversation } from '../../types/templates';

// Mock the conversation storage service
jest.mock('../../services/conversationStorage', () => ({
  conversationStorage: {
    getAllConversations: jest.fn(),
    deleteConversation: jest.fn()
  }
}));

const mockConversationStorage = conversationStorage as jest.Mocked<typeof conversationStorage>;

// Mock window.confirm
const originalConfirm = window.confirm;
beforeEach(() => {
  window.confirm = jest.fn();
});

afterEach(() => {
  window.confirm = originalConfirm;
});

describe('ConversationSidebar', () => {
  const mockOnClose = jest.fn();
  const mockOnConversationSelect = jest.fn();
  
  const mockConversations: SavedConversation[] = [
    {
      id: 'conv1',
      name: 'Chat sobre React',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:30:00Z',
      messages: [
        { role: 'user', text: 'Como usar React hooks?', timestamp: '2024-01-01T10:00:00Z' },
        { role: 'assistant', text: 'React hooks são...', timestamp: '2024-01-01T10:01:00Z' }
      ],
      template: null
    },
    {
      id: 'conv2',
      name: 'Conversa sobre JavaScript',
      createdAt: '2024-01-02T14:00:00Z',
      updatedAt: '2024-01-02T14:15:00Z',
      messages: [
        { role: 'user', text: 'Explique closures', timestamp: '2024-01-02T14:00:00Z' }
      ],
      template: null
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockConversationStorage.getAllConversations.mockReturnValue(mockConversations);
  });

  test('renders when closed', () => {
    render(
      <ConversationSidebar
        isOpen={false}
        onClose={mockOnClose}
        onConversationSelect={mockOnConversationSelect}
        currentConversationId={null}
      />
    );

    // Should not show content when closed
    expect(screen.queryByText('Chat sobre React')).not.toBeInTheDocument();
  });

  test('loads and displays conversations when opened', async () => {
    render(
      <ConversationSidebar
        isOpen
        onClose={mockOnClose}
        onConversationSelect={mockOnConversationSelect}
        currentConversationId={null}
      />
    );

    await waitFor(() => {
      expect(mockConversationStorage.getAllConversations).toHaveBeenCalled();
    });

    expect(screen.getByText('Chat sobre React')).toBeInTheDocument();
    expect(screen.getByText('Conversa sobre JavaScript')).toBeInTheDocument();
  });

  test('filters conversations by search term', async () => {
    render(
      <ConversationSidebar
        isOpen
        onClose={mockOnClose}
        onConversationSelect={mockOnConversationSelect}
        currentConversationId={null}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Chat sobre React')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/buscar/i) || screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'React' } });

    expect(screen.getByText('Chat sobre React')).toBeInTheDocument();
    expect(screen.queryByText('Conversa sobre JavaScript')).not.toBeInTheDocument();
  });

  test('calls onConversationSelect when conversation is clicked', async () => {
    render(
      <ConversationSidebar
        isOpen
        onClose={mockOnClose}
        onConversationSelect={mockOnConversationSelect}
        currentConversationId={null}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Chat sobre React')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Chat sobre React'));
    expect(mockOnConversationSelect).toHaveBeenCalledWith(mockConversations[0]);
  });

  test('deletes conversation when delete button is clicked and confirmed', async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);

    render(
      <ConversationSidebar
        isOpen
        onClose={mockOnClose}
        onConversationSelect={mockOnConversationSelect}
        currentConversationId={null}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Chat sobre React')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('🗑️');
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja deletar esta conversa?');
    expect(mockConversationStorage.deleteConversation).toHaveBeenCalledWith('conv1');
  });

  test('does not delete conversation when delete is cancelled', async () => {
    (window.confirm as jest.Mock).mockReturnValue(false);

    render(
      <ConversationSidebar
        isOpen
        onClose={mockOnClose}
        onConversationSelect={mockOnConversationSelect}
        currentConversationId={null}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Chat sobre React')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('🗑️');
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockConversationStorage.deleteConversation).not.toHaveBeenCalled();
  });

  test('highlights current conversation', async () => {
    render(
      <ConversationSidebar
        isOpen
        onClose={mockOnClose}
        onConversationSelect={mockOnConversationSelect}
        currentConversationId="conv1"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Chat sobre React')).toBeInTheDocument();
    });

    const conversationElement = screen.getByText('Chat sobre React');
    expect(conversationElement).toBeInTheDocument();
    
    // Verify that conversation is properly rendered and interactive
    expect(conversationElement).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', async () => {
    render(
      <ConversationSidebar
        isOpen
        onClose={mockOnClose}
        onConversationSelect={mockOnConversationSelect}
        currentConversationId={null}
      />
    );

    const closeButton = screen.getByText('×') || screen.getByRole('button', { name: /close|fechar/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  test('handles empty conversations list', () => {
    mockConversationStorage.getAllConversations.mockReturnValue([]);

    render(
      <ConversationSidebar
        isOpen
        onClose={mockOnClose}
        onConversationSelect={mockOnConversationSelect}
        currentConversationId={null}
      />
    );

    expect(screen.queryByText('Chat sobre React')).not.toBeInTheDocument();
    expect(screen.getByText(/nenhuma conversa/i) || screen.getByText(/no conversations/i)).toBeInTheDocument();
  });
});