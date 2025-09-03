import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Model } from '../../../types';
import { ConversationTemplate } from '../../../types/templates';
import { TemplateModalSelector } from '../../molecules/TemplateModalSelector';
import { DarkModeToggle } from '../../atoms/DarkModeToggle';
import LanguageSwitcher from '../../LanguageSwitcher';
import ParameterForm from '../../ParameterForm';
import './ChatHeaderMobile.css';

export interface ChatHeaderMobileProps {
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

export const ChatHeaderMobile: React.FC<ChatHeaderMobileProps> = ({
  selectedModel: _selectedModel,
  models: _models,
  onModelChange: _onModelChange,
  modelsLoading: _modelsLoading = false,
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
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const handleTemplateButtonClick = () => {
    setIsTemplateModalOpen(true);
  };

  const handleClearChat = () => {
    onClearChat();
  };

  const getStatusIcon = () => {
    if (isOllamaConnected === true) return '🟢';
    if (isOllamaConnected === false) return '🔴';
    return '🟡';
  };

  const getStatusText = () => {
    if (isOllamaConnected === true) return t('status.connected');
    if (isOllamaConnected === false) return t('status.disconnected');
    return t('status.checking');
  };

  return (
    <>
      <div className="chat-header-mobile">
        {/* Main header row - simplified */}
        <div className="header-main-row">
          {/* Left side - Core controls */}
          <div className="header-left">
            <div className="status-section">
              <span className="status-indicator" title={getStatusText()}>
                {getStatusIcon()}
              </span>
            </div>

            <button
              className="template-button"
              onClick={handleTemplateButtonClick}
            >
              <span className="template-icon">📝</span>
              <span className="template-text">
                {selectedTemplate?.name || t('templates.selectTemplate')}
              </span>
            </button>
          </div>

          {/* Right side - Settings and actions */}
          <div className="header-right">
            <DarkModeToggle size="sm" />
            <LanguageSwitcher />
            
            {messagesCount > 0 && (
              <button
                className="action-button clear-button"
                onClick={handleClearChat}
                title={t('chat.clearChat')}
              >
                🗑️
              </button>
            )}
            
            <button
              className="action-button history-button"
              onClick={onOpenSidebar}
              title={t('chat.openHistory')}
            >
              📋
            </button>
          </div>
        </div>

        {/* Parameter form if needed */}
        {showParameterForm && selectedTemplate && (
          <div className="parameter-form-section">
            <ParameterForm
              template={selectedTemplate}
              initialParameters={templateParameters}
              onParametersChange={onParametersChange}
              onSubmit={onParameterFormSubmit}
              isVisible={showParameterForm}
            />
          </div>
        )}
      </div>

      {/* Template Modal */}
      <TemplateModalSelector
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onTemplateSelect={onTemplateSelect}
        selectedTemplate={selectedTemplate}
      />
    </>
  );
};