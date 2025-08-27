import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { Message, Model } from '../types';
import { ConversationTemplate, SavedConversation } from '../types/templates';
import { apiService } from '../services/api';
import { conversationStorage } from '../services/conversationStorage';
import { templateService } from '../services/templateService';
import { useTemplateFromUrl } from '../hooks/useTemplateFromUrl';
import LanguageSwitcher from './LanguageSwitcher';
import TemplateSelector from './TemplateSelector';
import ConversationSidebar from './ConversationSidebar';
import ParameterForm from './ParameterForm';
import './Chat.css';

const Chat: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { template: urlTemplate, parameters: urlParameters } = useTemplateFromUrl();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [models, setModels] = useState<Model[]>([]);
  const [isOllamaConnected, setIsOllamaConnected] = useState<boolean | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ConversationTemplate | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showParameterForm, setShowParameterForm] = useState(false);
  const [templateParameters, setTemplateParameters] = useState<Record<string, string>>({});
  const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleErrorDetails = (messageId: string) => {
    setExpandedErrors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
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

  // Handle URL template and parameters
  useEffect(() => {
    if (urlTemplate) {
      setSelectedTemplate(urlTemplate);
      setTemplateParameters(urlParameters);
      
      // If we have all required parameters, auto-start the conversation
      const validation = templateService.validateParameters(urlTemplate, urlParameters);
      if (validation.isValid && Object.keys(urlParameters).length > 0) {
        try {
          const prompt = templateService.renderPrompt(urlTemplate, urlParameters);
          startConversationWithPrompt(prompt);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error auto-starting conversation:', error);
        }
      } else if (urlTemplate.parameters.length > 0) {
        // Show parameter form if template has parameters but not all are provided
        setShowParameterForm(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlTemplate, urlParameters]);

  // Handle conversation loading from URL
  useEffect(() => {
    if (conversationId) {
      // Sempre carregar se a URL tem um conversationId diferente do atual
      if (conversationId !== currentConversationId) {
        loadConversationById(conversationId);
      }
    } else {
      // Se não há conversationId na URL, limpar a conversa atual se necessário
      if (currentConversationId) {
        clearChat();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // Auto-save conversation whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      const saveDelay = setTimeout(() => {
        const conversationId = conversationStorage.saveConversation(
          messages,
          selectedModel,
          selectedTemplate?.id,
          currentConversationId || undefined
        );
        if (!currentConversationId) {
          setCurrentConversationId(conversationId);
        }
      }, 1000); // Debounce for 1 second

      return () => clearTimeout(saveDelay);
    }
  }, [messages, selectedModel, selectedTemplate, currentConversationId]);

  const startConversationWithPrompt = async (prompt: string) => {
    if (isLoading || !selectedModel) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: prompt,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages([userMessage]);
    setIsLoading(true);
    setShowParameterForm(false);

    try {
      const response = await apiService.sendMessage(prompt, selectedModel);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isUser: false,
        timestamp: new Date(),
        model: response.model,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('Failed to send message:', error);
      
      let errorText = t('chat.errorMessage');
      let errorType: 'timeout' | 'network' | 'server' | 'unknown' = 'unknown';
      let errorDetails = String(error);
      
      // Handle specific error types and extract detailed information
      if (error && typeof error === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = error as any;
        
        // Extract detailed error information
        if (err.response) {
          errorDetails = `HTTP ${err.response.status}: ${err.response.statusText}\n${JSON.stringify(err.response.data, null, 2)}`;
          errorType = err.response.status >= 500 ? 'server' : 'network';
        } else if (err.request) {
          errorDetails = `Network Error: ${err.message}\nRequest: ${err.request.responseURL || 'Unknown URL'}`;
          errorType = 'network';
        } else {
          errorDetails = `Error: ${err.message}\nStack: ${err.stack}`;
        }
        
        // Determine user-friendly message
        if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
          errorText = t('chat.timeoutError');
          errorType = 'timeout';
          errorDetails = `Timeout Error: ${err.message}\nCode: ${err.code}\nTimeout: ${err.timeout}ms`;
        } else if (err.response?.status === 408) {
          errorText = err.response.data?.error || t('chat.timeoutError');
          errorType = 'timeout';
        } else if (err.response?.data?.error) {
          errorText = err.response.data.error;
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        isUser: false,
        timestamp: new Date(),
        error: {
          details: errorDetails,
          type: errorType,
        },
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

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
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('Failed to send message:', error);
      
      let errorText = t('chat.errorMessage');
      let errorType: 'timeout' | 'network' | 'server' | 'unknown' = 'unknown';
      let errorDetails = String(error);
      
      // Handle specific error types and extract detailed information
      if (error && typeof error === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = error as any;
        
        // Extract detailed error information
        if (err.response) {
          errorDetails = `HTTP ${err.response.status}: ${err.response.statusText}\n${JSON.stringify(err.response.data, null, 2)}`;
          errorType = err.response.status >= 500 ? 'server' : 'network';
        } else if (err.request) {
          errorDetails = `Network Error: ${err.message}\nRequest: ${err.request.responseURL || 'Unknown URL'}`;
          errorType = 'network';
        } else {
          errorDetails = `Error: ${err.message}\nStack: ${err.stack}`;
        }
        
        // Determine user-friendly message
        if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
          errorText = t('chat.timeoutError');
          errorType = 'timeout';
          errorDetails = `Timeout Error: ${err.message}\nCode: ${err.code}\nTimeout: ${err.timeout}ms`;
        } else if (err.response?.status === 408) {
          errorText = err.response.data?.error || t('chat.timeoutError');
          errorType = 'timeout';
        } else if (err.response?.data?.error) {
          errorText = err.response.data.error;
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        isUser: false,
        timestamp: new Date(),
        error: {
          details: errorDetails,
          type: errorType,
        },
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = useCallback(() => {
    // Clear all chat-related state
    setMessages([]);
    setCurrentConversationId(null);
    setSelectedTemplate(null);
    setShowParameterForm(false);
    setTemplateParameters({});
    
    // Always navigate to root to ensure URL is cleared of any conversation/template parameters
    navigate('/', { replace: true });
  }, [navigate]);

  const handleTemplateSelect = (template: ConversationTemplate | null) => {
    setSelectedTemplate(template);
    setTemplateParameters({});
    
    // Show parameter form if template has parameters
    if (template && template.parameters.length > 0) {
      setShowParameterForm(true);
    } else {
      setShowParameterForm(false);
    }
    
    // If we have an active conversation, clear it when changing templates
    if (messages.length > 0) {
      clearChat();
    }
  };

  const loadConversationById = (id: string) => {
    const conversation = conversationStorage.loadConversation(id);
    if (conversation) {
      loadConversation(conversation);
    }
  };

  const loadConversation = (conversation: SavedConversation) => {
    // Fechar menu lateral automaticamente
    setIsSidebarOpen(false);
    
    // Limpar chat atual apenas se for uma conversa diferente
    if (currentConversationId !== conversation.id) {
      setMessages([]);
    }
    
    const loadedMessages: Message[] = conversation.messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
    
    setMessages(loadedMessages);
    setCurrentConversationId(conversation.id);
    setSelectedModel(conversation.model);
    
    if (conversation.templateId) {
      const template = templateService.getTemplateById(conversation.templateId);
      setSelectedTemplate(template);
    } else {
      setSelectedTemplate(null);
    }
    
    setShowParameterForm(false);
    navigate(`/chat/conversation/${conversation.id}`);
  };

  const handleParameterFormSubmit = (finalPrompt: string) => {
    startConversationWithPrompt(finalPrompt);
  };

  const handleParametersChange = (params: Record<string, string>) => {
    setTemplateParameters(params);
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
        
        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onTemplateSelect={handleTemplateSelect}
        />
        
        <ParameterForm
          template={selectedTemplate!}
          initialParameters={templateParameters}
          onParametersChange={handleParametersChange}
          onSubmit={handleParameterFormSubmit}
          isVisible={showParameterForm && selectedTemplate !== null}
        />
        
        <div className="chat-controls">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="hamburger-menu"
            title="Ver conversas salvas"
            aria-label="Abrir menu de conversas"
          >
            <div className="hamburger-lines">
              <span />
              <span />
              <span />
            </div>
          </button>
          
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
                    
                    {/* Error details expansion for error messages */}
                    {message.error && (
                      <div className="error-details-container">
                        <button 
                          className="error-details-toggle"
                          onClick={() => toggleErrorDetails(message.id)}
                          title="Ver detalhes do erro"
                        >
                          {expandedErrors.has(message.id) ? '▼ Ocultar detalhes' : '▶ Ver detalhes do erro'}
                        </button>
                        
                        {expandedErrors.has(message.id) && (
                          <div className="error-details-content">
                            <div className="error-type">
                              <strong>Tipo:</strong> {message.error.type}
                            </div>
                            <div className="error-details">
                              <strong>Detalhes:</strong>
                              <pre className="error-details-text">{message.error.details}</pre>
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

      <ConversationSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onConversationSelect={loadConversation}
        currentConversationId={currentConversationId}
      />

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
          disabled={isLoading || !inputMessage.trim() || !selectedModel || showParameterForm}
          className="send-button"
        >
          {isLoading ? t('chat.sending') : t('chat.send')}
        </button>
      </div>
    </div>
  );
};

export default Chat;