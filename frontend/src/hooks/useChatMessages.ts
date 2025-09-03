import { useEffect, useRef, useState } from 'react';
import { Message } from '../types';

export interface UseChatMessagesReturn {
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  expandedErrors: Set<string>;
  toggleErrorDetails: (messageId: string) => void;
  copyMessageText: (text: string) => Promise<void>;
  scrollToBottom: () => void;
}

export const useChatMessages = (messages: Message[]): UseChatMessagesReturn => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set());

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Toggle error details expansion
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

  // Copy message text to clipboard
  const copyMessageText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here if needed
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (fallbackErr) {
        // Silent fail - copy feature is not critical
      }
      document.body.removeChild(textArea);
    }
  };

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return {
    messagesEndRef,
    expandedErrors,
    toggleErrorDetails,
    copyMessageText,
    scrollToBottom,
  };
};