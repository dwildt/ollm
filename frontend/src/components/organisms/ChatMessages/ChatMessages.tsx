import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { Message } from '../../../types';
import { ConversationTemplate } from '../../../types/templates';
import './ChatMessages.css';

export interface ChatMessagesProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  expandedErrors: Set<string>;
  onToggleErrorDetails: (messageId: string) => void;
  onCopyMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  selectedTemplate?: ConversationTemplate | null;
  isOllamaConnected?: boolean | null;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  messagesEndRef,
  expandedErrors,
  onToggleErrorDetails,
  onCopyMessage,
  isLoading,
  selectedTemplate,
  isOllamaConnected,
}) => {
  const { t } = useTranslation();

  if (messages.length === 0) {
    return (
      <div className="messages-container" data-testid="messages-container">
        <div className="welcome-message">
          <h2>{t('app.welcomeTitle')}</h2>
          <p>{t('app.welcomeMessage')}</p>
          {selectedTemplate && (
            <div className="active-template-info">
              <h3>Template Ativo: {selectedTemplate.name}</h3>
              <p>{selectedTemplate.description}</p>
            </div>
          )}
          {!isOllamaConnected && (
            <p className="error-message">
              {t('app.ollamaDisconnected')}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="messages-container" data-testid="messages-container">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
          data-testid={message.isUser ? 'user-message' : 'bot-message'}
        >
          <div className="message-content">
            {message.isUser ? (
              <div className="message-text">{message.text}</div>
            ) : (
              <div className="message-text markdown-content">
                <div className="bot-message-header">
                  <button 
                    className="copy-button"
                    onClick={() => onCopyMessage(message.text)}
                    title={t('templates.copyResponse')}
                    aria-label={t('templates.copyResponse')}
                    data-testid="copy-message-button"
                  >
                    📋
                  </button>
                </div>
                <ReactMarkdown>
                  {message.text}
                </ReactMarkdown>
                
                {/* Error details expansion for error messages */}
                {message.error && (
                  <div className="error-details-container">
                    <button 
                      className="error-details-toggle"
                      onClick={() => onToggleErrorDetails(message.id)}
                      title="Ver detalhes do erro"
                      data-testid="error-toggle"
                    >
                      {expandedErrors.has(message.id) 
                        ? '▼ Ocultar detalhes' 
                        : '▶ Ver detalhes do erro'
                      }
                    </button>
                    
                    {expandedErrors.has(message.id) && (
                      <div className="error-details-content" data-testid="error-details">
                        <div className="error-type" data-testid="error-type">
                          <strong>Tipo:</strong> {message.error.type}
                        </div>
                        <div className="error-details">
                          <strong>Detalhes:</strong>
                          <pre className="error-details-text" data-testid="error-details-text">
                            {message.error.details}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <div className="message-meta">
              <span className="message-time">
                {message.timestamp.toLocaleTimeString()}
              </span>
              {message.model && (
                <span className="message-model">({message.model})</span>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="message bot-message" data-testid="loading-message">
          <div className="message-content">
            <div className="typing-indicator">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};