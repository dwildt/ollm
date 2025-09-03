import { useState, useCallback } from 'react';

export interface UseChatInputReturn {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSubmit: () => void;
  clearInput: () => void;
  isDisabled: boolean;
}

export interface UseChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  selectedModel: string;
  showParameterForm?: boolean;
}

export const useChatInput = ({
  onSendMessage,
  isLoading,
  selectedModel,
  showParameterForm = false
}: UseChatInputProps): UseChatInputReturn => {
  const [inputMessage, setInputMessage] = useState('');

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
  }, []);

  // Handle keyboard shortcuts
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!inputMessage.trim() || isLoading || !selectedModel || showParameterForm) {
        return;
      }

      const messageToSend = inputMessage.trim();
      setInputMessage('');
      
      onSendMessage(messageToSend).catch(() => {
        setInputMessage(messageToSend);
      });
    }
  }, [inputMessage, onSendMessage, isLoading, selectedModel, showParameterForm]);

  // Handle message submission
  const handleSubmit = useCallback(async () => {
    if (!inputMessage.trim() || isLoading || !selectedModel || showParameterForm) {
      return;
    }

    const messageToSend = inputMessage.trim();
    setInputMessage(''); // Clear input immediately for better UX
    
    try {
      await onSendMessage(messageToSend);
    } catch (error) {
      // If sending fails, restore the message
      setInputMessage(messageToSend);
    }
  }, [inputMessage, onSendMessage, isLoading, selectedModel, showParameterForm]);

  // Clear input
  const clearInput = useCallback(() => {
    setInputMessage('');
  }, []);

  // Determine if input should be disabled
  const isDisabled = isLoading || !selectedModel || showParameterForm;

  return {
    inputMessage,
    setInputMessage,
    handleInputChange,
    handleKeyPress,
    handleSubmit,
    clearInput,
    isDisabled,
  };
};