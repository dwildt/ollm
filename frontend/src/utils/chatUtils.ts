/**
 * Utility functions for chat operations
 */

/**
 * Start a conversation with a given prompt
 * This is a helper function to maintain consistency with the original Chat component behavior
 */
export const startConversationWithPrompt = async (
  prompt: string,
  sendMessage: (message: string) => Promise<void>
): Promise<void> => {
  if (!prompt.trim()) {
    console.warn('Cannot start conversation with empty prompt');
    return;
  }

  try {
    await sendMessage(prompt);
  } catch (error) {
    console.error('Failed to start conversation with prompt:', error);
    throw error;
  }
};

/**
 * Format error message for display
 */
export const formatErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object') {
    const err = error as any;
    
    if (err.response?.data?.error) {
      return err.response.data.error;
    }
    
    if (err.message) {
      return err.message;
    }
  }
  
  return String(error);
};

/**
 * Check if a message is a system message
 */
export const isSystemMessage = (message: { isUser: boolean; error?: any }): boolean => {
  return !message.isUser && !!message.error;
};

/**
 * Get message display time
 */
export const formatMessageTime = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
};