import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { ConversationTemplate, SavedConversation } from '../types/templates';
import { templateService } from '../services/templateService';
import { useTemplateFromUrl } from '../hooks/useTemplateFromUrl';
import { useChat, useChatMessages } from '../hooks';
import './Chat.css';

// Lazy load heavy organism components with named exports
const ChatHeader = React.lazy(() => 
  import('./organisms/ChatHeader/ChatHeader').then(module => ({ default: module.ChatHeader }))
);
const ChatMessages = React.lazy(() => 
  import('./organisms/ChatMessages/ChatMessages').then(module => ({ default: module.ChatMessages }))
);
const ChatInput = React.lazy(() => 
  import('./organisms/ChatInput/ChatInput').then(module => ({ default: module.ChatInput }))
);
const ConversationSidebar = React.lazy(() => import('./ConversationSidebar'));

// Lightweight loading component
const ComponentLoader = ({ name }: { name: string }) => (
  <div style={{ 
    padding: '1rem', 
    textAlign: 'center', 
    color: 'var(--color-text-secondary)',
    fontSize: '0.9rem'
  }}>
    Carregando {name}...
  </div>
);

const ChatNew: React.FC = () => {
  // Local state for template management
  const [selectedTemplate, setSelectedTemplate] = useState<ConversationTemplate | null>(null);
  const [showParameterForm, setShowParameterForm] = useState(false);
  const [templateParameters, setTemplateParameters] = useState<Record<string, string>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // URL template hook
  const { template: urlTemplate, parameters: urlParameters } = useTemplateFromUrl();

  // Main chat hook
  const {
    messages,
    isLoading,
    selectedModel,
    models,
    isOllamaConnected,
    currentConversationId,
    sendMessage,
    clearMessages,
    setSelectedModel,
    loadConversation,
  } = useChat(selectedTemplate);

  // Messages management hook
  const {
    messagesEndRef,
    expandedErrors,
    toggleErrorDetails,
    copyMessageText,
  } = useChatMessages(messages);

  // Handle template selection
  const handleTemplateSelect = useCallback((template: ConversationTemplate | null) => {
    setSelectedTemplate(template);
    setTemplateParameters({});
    
    if (template && template.parameters.length > 0) {
      setShowParameterForm(true);
    } else {
      setShowParameterForm(false);
    }
    
    // Clear active conversation when changing templates
    if (messages.length > 0) {
      clearMessages();
    }
  }, [messages.length, clearMessages]);

  // Handle parameter form submission
  const handleParameterFormSubmit = useCallback(async (finalPrompt: string) => {
    setShowParameterForm(false);
    await sendMessage(finalPrompt);
  }, [sendMessage]);

  // Handle parameters change
  const handleParametersChange = useCallback((params: Record<string, string>) => {
    setTemplateParameters(params);
  }, []);

  // Load conversation from sidebar
  const handleLoadConversation = useCallback((conversation: SavedConversation) => {
    setIsSidebarOpen(false);
    loadConversation(conversation.id);
    
    // Load associated template if exists
    if (conversation.templateId) {
      const template = templateService.getTemplateById(conversation.templateId);
      setSelectedTemplate(template);
    } else {
      setSelectedTemplate(null);
    }
    
    setShowParameterForm(false);
  }, [loadConversation]);

  // Auto-start conversation with prompt helper
  const startConversationWithPrompt = useCallback(async (prompt: string) => {
    if (!prompt.trim()) return;
    
    try {
      await sendMessage(prompt);
    } catch (error) {
      // Silently handle auto-start errors
    }
  }, [sendMessage]);

  // Handle URL template and parameters on mount
  useEffect(() => {
    if (urlTemplate) {
      setSelectedTemplate(urlTemplate);
      setTemplateParameters(urlParameters);
      
      // Auto-start conversation if all parameters are provided
      const validation = templateService.validateParameters(urlTemplate, urlParameters);
      if (validation.isValid && Object.keys(urlParameters).length > 0) {
        try {
          const prompt = templateService.renderPrompt(urlTemplate, urlParameters);
          startConversationWithPrompt(prompt);
        } catch (error) {
          // Silently handle auto-start errors
        }
      } else if (urlTemplate.parameters.length > 0) {
        setShowParameterForm(true);
      }
    }
  }, [urlTemplate, urlParameters, startConversationWithPrompt]);

  return (
    <div className="chat-container">
      <Suspense fallback={<ComponentLoader name="Header" />}>
        <ChatHeader
          selectedModel={selectedModel}
          models={models}
          onModelChange={setSelectedModel}
          isOllamaConnected={isOllamaConnected}
          selectedTemplate={selectedTemplate}
          onTemplateSelect={handleTemplateSelect}
          showParameterForm={showParameterForm}
          templateParameters={templateParameters}
          onParametersChange={handleParametersChange}
          onParameterFormSubmit={handleParameterFormSubmit}
          onClearChat={clearMessages}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          messagesCount={messages.length}
        />
      </Suspense>

      <Suspense fallback={<ComponentLoader name="Mensagens" />}>
        <ChatMessages
          messages={messages}
          messagesEndRef={messagesEndRef}
          expandedErrors={expandedErrors}
          onToggleErrorDetails={toggleErrorDetails}
          onCopyMessage={copyMessageText}
          isLoading={isLoading}
          selectedTemplate={selectedTemplate}
          isOllamaConnected={isOllamaConnected}
        />
      </Suspense>

      <Suspense fallback={<ComponentLoader name="Sidebar" />}>
        <ConversationSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onConversationSelect={handleLoadConversation}
          currentConversationId={currentConversationId}
        />
      </Suspense>

      <Suspense fallback={<ComponentLoader name="Input" />}>
        <ChatInput
          onSendMessage={sendMessage}
          isLoading={isLoading}
          selectedModel={selectedModel}
          showParameterForm={showParameterForm}
        />
      </Suspense>
    </div>
  );
};

export default ChatNew;