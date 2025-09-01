import React from 'react';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import './ModeSelector.css';

export type Mode = 'free-conversation' | 'templates';

export interface ModeOption {
  value: Mode;
  label: string;
  description: string;
  icon: 'chat' | 'template';
}

export interface ModeSelectorProps {
  selectedMode: Mode;
  onModeChange: (mode: Mode) => void;
  className?: string;
  disabled?: boolean;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({
  selectedMode,
  onModeChange,
  className = '',
  disabled = false,
  ...rest
}) => {
  const modes: ModeOption[] = [
    {
      value: 'free-conversation',
      label: 'Conversa Livre',
      description: 'Chat direto sem templates',
      icon: 'chat'
    },
    {
      value: 'templates',
      label: 'Templates',
      description: 'Use templates para conversas específicas',
      icon: 'template'
    }
  ];

  const handleModeChange = (mode: Mode) => {
    if (!disabled && mode !== selectedMode) {
      onModeChange(mode);
    }
  };

  const modeSelectorClasses = [
    'mode-selector',
    disabled && 'mode-selector--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={modeSelectorClasses} role="tablist" {...rest}>
      {modes.map((mode) => (
        <Button
          key={mode.value}
          variant="tab"
          onClick={() => handleModeChange(mode.value)}
          disabled={disabled}
          className="mode-selector__tab"
          aria-selected={selectedMode === mode.value}
          role="tab"
          aria-controls={`${mode.value}-panel`}
        >
          <Icon name={mode.icon} size="sm" />
          <span className="mode-selector__tab-content">
            <span className="mode-selector__tab-label">{mode.label}</span>
            <span className="mode-selector__tab-description">{mode.description}</span>
          </span>
        </Button>
      ))}
    </div>
  );
};

export default ModeSelector;