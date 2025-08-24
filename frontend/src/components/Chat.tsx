import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { Message, Model } from '../types';
import { apiService } from '../services/api';
import LanguageSwitcher from './LanguageSwitcher';
import './Chat.css';

const Chat: React.FC = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [models, setModels] = useState<Model[]>([]);
  const [isOllamaConnected, setIsOllamaConnected] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkOllamaHealth = useCallback(async () => {
    try {
      const health = await apiService.checkHealth();
      setIsOllamaConnected(health.status === 'healthy');
    } catch (error) {
      setIsOllamaConnected(false);
    }
  }, []);

  const loadModels = useCallback(async () => {
    try {
      const modelsResponse = await apiService.getModels();
      setModels(modelsResponse.models);
      if (modelsResponse.models.length > 0 && !selectedModel) {
        setSelectedModel(modelsResponse.models[0].name);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load models:', error);
      setModels([]);
    }
  }, [selectedModel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkOllamaHealth();
    loadModels();
  }, [checkOllamaHealth, loadModels]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !selectedModel) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await apiService.sendMessage(inputMessage, selectedModel);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isUser: false,
        timestamp: new Date(),
        model: response.model,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to send message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t('chat.errorMessage'),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-top">
          <h1>{t('app.title')}</h1>
          <LanguageSwitcher />
        </div>
        <div className="chat-controls">
          <div className="model-selector">
            <label htmlFor="model-select">{t('chat.model')}</label>
            <select
              id="model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={models.length === 0}
            >
              {models.length === 0 ? (
                <option value="">{t('chat.noModelsAvailable')}</option>
              ) : (
                models.map((model) => (
                  <option key={model.name} value={model.name}>
                    {model.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="status-indicator">
            <span className={`status ${isOllamaConnected === true ? 'connected' : isOllamaConnected === false ? 'disconnected' : 'checking'}`}>
              {isOllamaConnected === true ? t('status.connected') : isOllamaConnected === false ? t('status.disconnected') : t('status.checking')}
            </span>
          </div>
          <button onClick={clearChat} className="clear-button">
            {t('chat.clearChat')}
          </button>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <h2>{t('app.welcomeTitle')}</h2>
            <p>{t('app.welcomeMessage')}</p>
            {!isOllamaConnected && (
              <p className="error-message">
                {t('app.ollamaDisconnected')}
              </p>
            )}
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-content">
                {message.isUser ? (
                  <div className="message-text">{message.text}</div>
                ) : (
                  <div className="message-text markdown-content">
                    <ReactMarkdown>
                      {message.text}
                    </ReactMarkdown>
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
          ))
        )}
        {isLoading && (
          <div className="message bot-message">
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

      <div className="input-container">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('chat.inputPlaceholder')}
          rows={3}
          disabled={isLoading || !selectedModel}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !inputMessage.trim() || !selectedModel}
          className="send-button"
        >
          {isLoading ? t('chat.sending') : t('chat.send')}
        </button>
      </div>
    </div>
  );
};

export default Chat;