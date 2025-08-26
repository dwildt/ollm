import { SavedConversation, ConversationStorage } from '../types/templates';
import { Message } from '../types';

const STORAGE_KEY = 'ollm_conversations';
const MAX_CONVERSATIONS = 50;

class ConversationStorageService {
  private getStorage(): ConversationStorage {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return { conversations: {} };
      }
      return JSON.parse(stored) as ConversationStorage;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error reading conversation storage:', error);
      return { conversations: {} };
    }
  }

  private saveStorage(storage: ConversationStorage): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving conversation storage:', error);
    }
  }

  private cleanupOldConversations(storage: ConversationStorage): void {
    const conversations = Object.values(storage.conversations);
    if (conversations.length <= MAX_CONVERSATIONS) {
      return;
    }

    // Sort by updatedAt and keep only the most recent ones
    const sorted = conversations.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    const toKeep = sorted.slice(0, MAX_CONVERSATIONS);
    const newConversations: Record<string, SavedConversation> = {};
    
    toKeep.forEach(conv => {
      newConversations[conv.id] = conv;
    });

    storage.conversations = newConversations;
  }

  generateConversationName(messages: Message[]): string {
    if (messages.length === 0) {
      return 'Nova Conversa';
    }

    const firstUserMessage = messages.find(m => m.isUser);
    if (firstUserMessage) {
      // Take first 50 characters and add ellipsis if needed
      const text = firstUserMessage.text.trim();
      return text.length > 50 ? `${text.substring(0, 50)}...` : text;
    }

    return `Conversa de ${new Date().toLocaleDateString()}`;
  }

  saveConversation(
    messages: Message[], 
    model: string, 
    templateId?: string,
    conversationId?: string
  ): string {
    const storage = this.getStorage();
    const now = new Date().toISOString();
    
    const id = conversationId || `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const existingConversation = storage.conversations[id];

    const conversation: SavedConversation = {
      id,
      name: existingConversation?.name || this.generateConversationName(messages),
      createdAt: existingConversation?.createdAt || now,
      updatedAt: now,
      model,
      templateId,
      messages: messages.map(msg => ({
        id: msg.id,
        text: msg.text,
        isUser: msg.isUser,
        timestamp: msg.timestamp.toISOString(),
        model: msg.model
      }))
    };

    storage.conversations[id] = conversation;
    this.cleanupOldConversations(storage);
    this.saveStorage(storage);

    return id;
  }

  loadConversation(id: string): SavedConversation | null {
    const storage = this.getStorage();
    return storage.conversations[id] || null;
  }

  getAllConversations(): SavedConversation[] {
    const storage = this.getStorage();
    return Object.values(storage.conversations)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  deleteConversation(id: string): boolean {
    const storage = this.getStorage();
    if (storage.conversations[id]) {
      delete storage.conversations[id];
      this.saveStorage(storage);
      return true;
    }
    return false;
  }

  updateConversationName(id: string, name: string): boolean {
    const storage = this.getStorage();
    if (storage.conversations[id]) {
      storage.conversations[id].name = name;
      storage.conversations[id].updatedAt = new Date().toISOString();
      this.saveStorage(storage);
      return true;
    }
    return false;
  }

  getStorageStats() {
    const storage = this.getStorage();
    const conversations = Object.values(storage.conversations);
    
    return {
      totalConversations: conversations.length,
      totalMessages: conversations.reduce((sum, conv) => sum + conv.messages.length, 0),
      storageSize: JSON.stringify(storage).length,
      oldestConversation: conversations.length > 0 
        ? conversations.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0].createdAt
        : null,
      newestConversation: conversations.length > 0
        ? conversations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
        : null
    };
  }

  clearAllConversations(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const conversationStorage = new ConversationStorageService();