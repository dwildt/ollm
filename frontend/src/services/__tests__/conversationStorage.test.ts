import { conversationStorage } from '../conversationStorage';
import { Message } from '../../types';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

// Replace global localStorage with mock
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('ConversationStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('generateConversationName', () => {
    test('returns default name for empty messages', () => {
      const name = conversationStorage.generateConversationName([]);
      expect(name).toBe('Nova Conversa');
    });

    test('uses first user message as name', () => {
      const messages: Message[] = [
        {
          id: '1',
          text: 'Hello, how are you?',
          isUser: true,
          timestamp: new Date()
        }
      ];
      
      const name = conversationStorage.generateConversationName(messages);
      expect(name).toBe('Hello, how are you?');
    });

    test('truncates long messages', () => {
      const longMessage = 'A'.repeat(100);
      const messages: Message[] = [
        {
          id: '1',
          text: longMessage,
          isUser: true,
          timestamp: new Date()
        }
      ];
      
      const name = conversationStorage.generateConversationName(messages);
      expect(name).toBe(`${'A'.repeat(50)}...`);
    });

    test('finds first user message when mixed with bot messages', () => {
      const messages: Message[] = [
        {
          id: '1',
          text: 'Bot response',
          isUser: false,
          timestamp: new Date()
        },
        {
          id: '2',
          text: 'User question',
          isUser: true,
          timestamp: new Date()
        }
      ];
      
      const name = conversationStorage.generateConversationName(messages);
      expect(name).toBe('User question');
    });
  });

  describe('saveConversation', () => {
    test('saves new conversation to localStorage', () => {
      const messages: Message[] = [
        {
          id: '1',
          text: 'Test message',
          isUser: true,
          timestamp: new Date()
        }
      ];
      
      const conversationId = conversationStorage.saveConversation(
        messages,
        'llama3.2:latest'
      );
      
      expect(conversationId).toBeDefined();
      expect(conversationId.startsWith('conv_')).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    test('uses provided conversation id', () => {
      const messages: Message[] = [
        {
          id: '1',
          text: 'Test message',
          isUser: true,
          timestamp: new Date()
        }
      ];
      
      const providedId = 'conv_test_123';
      const conversationId = conversationStorage.saveConversation(
        messages,
        'llama3.2:latest',
        undefined,
        providedId
      );
      
      expect(conversationId).toBe(providedId);
    });

    test('saves with template id', () => {
      const messages: Message[] = [
        {
          id: '1',
          text: 'Test message',
          isUser: true,
          timestamp: new Date()
        }
      ];
      
      conversationStorage.saveConversation(
        messages,
        'llama3.2:latest',
        'code-review'
      );
      
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      const conversation = Object.values(savedData.conversations)[0] as any;
      expect(conversation.templateId).toBe('code-review');
    });
  });

  describe('loadConversation', () => {
    test('returns null when conversation not found', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({ conversations: {} }));
      
      const conversation = conversationStorage.loadConversation('non-existent');
      expect(conversation).toBeNull();
    });

    test('loads existing conversation', () => {
      const testConversation = {
        id: 'conv_123',
        name: 'Test Conversation',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        model: 'llama3.2:latest',
        messages: []
      };
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        conversations: {
          'conv_123': testConversation
        }
      }));
      
      const conversation = conversationStorage.loadConversation('conv_123');
      expect(conversation).toEqual(testConversation);
    });
  });

  describe('getAllConversations', () => {
    test('returns empty array when no conversations', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({ conversations: {} }));
      
      const conversations = conversationStorage.getAllConversations();
      expect(conversations).toEqual([]);
    });

    test('returns conversations sorted by update date', () => {
      const olderConv = {
        id: 'conv_old',
        name: 'Older',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        model: 'llama3.2:latest',
        messages: []
      };
      
      const newerConv = {
        id: 'conv_new',
        name: 'Newer',
        createdAt: '2023-01-02T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
        model: 'llama3.2:latest',
        messages: []
      };
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        conversations: {
          'conv_old': olderConv,
          'conv_new': newerConv
        }
      }));
      
      const conversations = conversationStorage.getAllConversations();
      expect(conversations).toHaveLength(2);
      expect(conversations[0].id).toBe('conv_new'); // Newer first
      expect(conversations[1].id).toBe('conv_old');
    });
  });

  describe('deleteConversation', () => {
    test('deletes existing conversation', () => {
      const testConversation = {
        id: 'conv_123',
        name: 'Test',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        model: 'llama3.2:latest',
        messages: []
      };
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        conversations: {
          'conv_123': testConversation
        }
      }));
      
      const result = conversationStorage.deleteConversation('conv_123');
      expect(result).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    test('returns false for non-existent conversation', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({ conversations: {} }));
      
      const result = conversationStorage.deleteConversation('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('updateConversationName', () => {
    test('updates existing conversation name', () => {
      const testConversation = {
        id: 'conv_123',
        name: 'Old Name',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        model: 'llama3.2:latest',
        messages: []
      };
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        conversations: {
          'conv_123': testConversation
        }
      }));
      
      const result = conversationStorage.updateConversationName('conv_123', 'New Name');
      expect(result).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    test('returns false for non-existent conversation', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({ conversations: {} }));
      
      const result = conversationStorage.updateConversationName('non-existent', 'New Name');
      expect(result).toBe(false);
    });
  });

  describe('getStorageStats', () => {
    test('returns correct stats for empty storage', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({ conversations: {} }));
      
      const stats = conversationStorage.getStorageStats();
      expect(stats.totalConversations).toBe(0);
      expect(stats.totalMessages).toBe(0);
      expect(stats.storageSize).toBeGreaterThan(0);
      expect(stats.oldestConversation).toBeNull();
      expect(stats.newestConversation).toBeNull();
    });

    test('calculates stats correctly with conversations', () => {
      const conv1 = {
        id: 'conv_1',
        name: 'Conv 1',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        model: 'llama3.2:latest',
        messages: [{ id: '1', text: 'msg1', isUser: true, timestamp: '2023-01-01T00:00:00.000Z' }]
      };
      
      const conv2 = {
        id: 'conv_2',
        name: 'Conv 2',
        createdAt: '2023-01-02T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
        model: 'llama3.2:latest',
        messages: [
          { id: '2', text: 'msg2', isUser: true, timestamp: '2023-01-02T00:00:00.000Z' },
          { id: '3', text: 'msg3', isUser: false, timestamp: '2023-01-02T00:01:00.000Z' }
        ]
      };
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        conversations: {
          'conv_1': conv1,
          'conv_2': conv2
        }
      }));
      
      const stats = conversationStorage.getStorageStats();
      expect(stats.totalConversations).toBe(2);
      expect(stats.totalMessages).toBe(3);
      expect(stats.oldestConversation).toBe('2023-01-01T00:00:00.000Z');
      expect(stats.newestConversation).toBe('2023-01-02T00:00:00.000Z');
    });
  });

  describe('clearAllConversations', () => {
    test('removes storage key', () => {
      conversationStorage.clearAllConversations();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('ollm_conversations');
    });
  });

  describe('error handling', () => {
    test('handles localStorage getItem errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const conversations = conversationStorage.getAllConversations();
      expect(conversations).toEqual([]);
    });

    test('handles localStorage setItem errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      const messages: Message[] = [
        {
          id: '1',
          text: 'Test message',
          isUser: true,
          timestamp: new Date()
        }
      ];
      
      // Should not throw
      const conversationId = conversationStorage.saveConversation(
        messages,
        'llama3.2:latest'
      );
      
      expect(conversationId).toBeDefined();
    });

    test('handles invalid JSON in storage', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json');
      
      const conversations = conversationStorage.getAllConversations();
      expect(conversations).toEqual([]);
    });
  });
});