import React from 'react';
import { useTranslation } from 'react-i18next';
import { Model } from '../../../types';
import { ConversationTemplate } from '../../../types/templates';
import LanguageSwitcher from '../../LanguageSwitcher';
import TemplateSelector from '../../TemplateSelector';
import ParameterForm from '../../ParameterForm';
import './ChatHeader.css';

export interface ChatHeaderProps {
  // Model selection
  selectedModel: string;
  models: Model[];
  onModelChange: (model: string) => void;
  modelsLoading?: boolean;

  // Connection status
  isOllamaConnected: boolean | null;

  // Template management
  selectedTemplate: ConversationTemplate | null;
  onTemplateSelect: (template: ConversationTemplate | null) => void;
  showParameterForm: boolean;
  templateParameters: Record<string, string>;
  onParametersChange: (params: Record<string, string>) => void;
  onParameterFormSubmit: (finalPrompt: string) => void;

  // Actions
  onClearChat: () => void;
  onOpenSidebar: () => void;

  // State
  messagesCount: number;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedModel,
  models,
  onModelChange,
  modelsLoading = false,
  isOllamaConnected,
  selectedTemplate,
  onTemplateSelect,
  showParameterForm,
  templateParameters,
  onParametersChange,
  onParameterFormSubmit,
  onClearChat,
  onOpenSidebar,
  messagesCount,
}) => {
  const { t } = useTranslation();

  return (
    <div className="chat-header" data-testid="chat-header">
      <div className="header-top">
        <h1>{t('app.title')}</h1>
        <LanguageSwitcher />
      </div>
      
      <TemplateSelector
        selectedTemplate={selectedTemplate}
        onTemplateSelect={onTemplateSelect}
      />
      
      <ParameterForm
        template={selectedTemplate!}
        initialParameters={templateParameters}
        onParametersChange={onParametersChange}
        onSubmit={onParameterFormSubmit}
        isVisible={showParameterForm && selectedTemplate !== null}
      />
      
      <div className="chat-controls">
        <button 
          onClick={onOpenSidebar}
          className="hamburger-menu"
          title="Ver conversas salvas"
          aria-label="Abrir menu de conversas"
          data-testid="sidebar-toggle"
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
            onChange={(e) => onModelChange(e.target.value)}
            disabled={models.length === 0 || modelsLoading}
            data-testid="model-select"
          >
            {modelsLoading ? (
              <option value="">{t('chat.loadingModels', 'Loading models...')}</option>
            ) : models.length === 0 ? (
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
          <span 
            className={`status ${
              isOllamaConnected === true 
                ? 'connected' 
                : isOllamaConnected === false 
                  ? 'disconnected' 
                  : 'checking'
            }`}
            data-testid="ollama-status"
          >
            {isOllamaConnected === true 
              ? t('status.connected') 
              : isOllamaConnected === false 
                ? t('status.disconnected') 
                : t('status.checking')
            }
          </span>
        </div>
        
        <button 
          onClick={onClearChat} 
          className="clear-button"
          disabled={messagesCount === 0}
          data-testid="clear-chat-button"
        >
          {t('chat.clearChat')}
        </button>
      </div>
    </div>
  );
};