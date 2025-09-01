import React from 'react';
import { ModeSelector } from '../../organisms/ModeSelector';
import { ThemeToggle } from '../../atoms/ThemeToggle';
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
        <div className="chat-template__header-left">
          <ModeSelector
            selectedMode={currentMode}
            onModeChange={onModeChange}
            disabled={isLoading}
            className="chat-template__mode-selector"
          />
        </div>
        
        <div className="chat-template__header-center">
          {header && (
            <div className="chat-template__header-content">
              {header}
            </div>
          )}
        </div>
        
        <div className="chat-template__header-right">
          <ThemeToggle
            size="sm"
            variant="ghost"
            className="chat-template__theme-toggle"
          />
        </div>
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