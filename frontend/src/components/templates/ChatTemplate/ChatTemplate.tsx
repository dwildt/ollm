import React from 'react';
import { ModeSelector } from '../../organisms/ModeSelector';
import type { Mode } from '../../organisms/ModeSelector';
import './ChatTemplate.css';

export interface ChatTemplateProps {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

const ChatTemplate: React.FC<ChatTemplateProps> = ({
  currentMode,
  onModeChange,
  header,
  sidebar,
  children,
  isLoading = false,
  className = '',
  ...rest
}) => {
  const templateClasses = [
    'chat-template',
    isLoading && 'chat-template--loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={templateClasses} {...rest}>
      <div className="chat-template__header">
        <ModeSelector
          selectedMode={currentMode}
          onModeChange={onModeChange}
          disabled={isLoading}
          className="chat-template__mode-selector"
        />
        {header && (
          <div className="chat-template__header-content">
            {header}
          </div>
        )}
      </div>

      <div className="chat-template__body">
        {sidebar && (
          <aside className="chat-template__sidebar">
            {sidebar}
          </aside>
        )}
        
        <main className="chat-template__main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ChatTemplate;