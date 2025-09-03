import React from 'react';
import { useTranslation } from 'react-i18next';
import { useChatInput } from '../../../hooks/useChatInput';
import './ChatInput.css';

export interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  selectedModel: string;
  showParameterForm?: boolean;
  placeholder?: string;
  rows?: number;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  selectedModel,
  showParameterForm = false,
  placeholder,
  rows = 3,
}) => {
  const { t } = useTranslation();
  
  const {
    inputMessage,
    handleInputChange,
    handleKeyPress,
    handleSubmit,
    isDisabled,
  } = useChatInput({
    onSendMessage,
    isLoading,
    selectedModel,
    showParameterForm,
  });

  const inputPlaceholder = placeholder || t('chat.inputPlaceholder');

  return (
    <div className="chat-input-container" data-testid="chat-input-container">
      <textarea
        value={inputMessage}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={inputPlaceholder}
        rows={rows}
        disabled={isDisabled}
        data-testid="message-input"
        className="message-textarea"
      />
      <button
        onClick={handleSubmit}
        disabled={isDisabled || !inputMessage.trim()}
        className="send-button"
        data-testid="send-button"
      >
        {isLoading ? t('chat.sending') : t('chat.send')}
      </button>
    </div>
  );
};