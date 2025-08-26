import React, { useState, useEffect } from 'react';
import { conversationStorage } from '../services/conversationStorage';
import { SavedConversation } from '../types/templates';
import './ConversationSidebar.css';

interface ConversationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onConversationSelect: (conversation: SavedConversation) => void;
  currentConversationId: string | null;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  isOpen,
  onClose,
  onConversationSelect,
  currentConversationId
}) => {
  const [conversations, setConversations] = useState<SavedConversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen]);

  const loadConversations = () => {
    const allConversations = conversationStorage.getAllConversations();
    setConversations(allConversations);
  };

  const handleDeleteConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onConversationSelect
    
    if (window.confirm('Tem certeza que deseja deletar esta conversa?')) {
      conversationStorage.deleteConversation(conversationId);
      loadConversations();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.messages.some(msg => 
      msg.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="conversation-sidebar-overlay">
      <div className="conversation-sidebar">
        <div className="sidebar-header">
          <h3>Conversas Salvas</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="sidebar-search">
          <input
            type="text"
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="conversations-list">
          {filteredConversations.length === 0 ? (
            <div className="no-conversations">
              {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa salva ainda'}
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`conversation-item ${
                  conversation.id === currentConversationId ? 'active' : ''
                }`}
                onClick={() => onConversationSelect(conversation)}
              >
                <div className="conversation-header">
                  <h4 className="conversation-name">{conversation.name}</h4>
                  <button
                    className="delete-button"
                    onClick={(e) => handleDeleteConversation(conversation.id, e)}
                    title="Deletar conversa"
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="conversation-meta">
                  <span className="conversation-date">
                    {formatDate(conversation.updatedAt)}
                  </span>
                  <span className="conversation-count">
                    {conversation.messages.length} mensagens
                  </span>
                </div>

                {conversation.templateId && (
                  <div className="conversation-template">
                    Template: {conversation.templateId}
                  </div>
                )}

                <div className="conversation-preview">
                  {conversation.messages.length > 0 && conversation.messages[0].text}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="sidebar-stats">
          <div className="stats-item">
            Total: {conversations.length} conversas
          </div>
          <div className="stats-item">
            Mensagens: {conversations.reduce((sum, conv) => sum + conv.messages.length, 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationSidebar;