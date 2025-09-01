import React, { useState } from 'react';
import { ChatTemplate } from '../../components/templates/ChatTemplate';
import { useModeSwitch } from '../../hooks/useModeSwitch';
import { Button } from '../../components/atoms/Button';
import { Icon } from '../../components/atoms/Icon';
import { Heading, Text } from '../../components/atoms/Typography';
import Chat from '../../components/Chat'; // Import existing Chat component
import './FreeConversationPage.css';

const FreeConversationPage: React.FC = () => {
  const { currentMode, switchMode, isTransitioning } = useModeSwitch();
  const [showChat, setShowChat] = useState(false);

  const handleStartConversation = () => {
    setShowChat(true);
  };

  const handleExploreTemplates = () => {
    switchMode('templates');
  };

  const handleNewConversation = () => {
    // Reset chat state by reloading
    window.location.reload();
  };

  if (showChat) {
    return (
      <div className="free-conversation-page">
        <ChatTemplate
          currentMode={currentMode}
          onModeChange={switchMode}
          isLoading={isTransitioning}
          header={
            <div className="free-conversation-page__chat-header">
              <Text variant="body-sm" color="secondary">
                Conversa livre - Digite sua mensagem abaixo
              </Text>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewConversation}
                className="free-conversation-page__new-chat"
              >
                <Icon name="plus" size="sm" />
                Nova conversa
              </Button>
            </div>
          }
        >
          <div className="free-conversation-page__chat-container">
            <Chat />
          </div>
        </ChatTemplate>
      </div>
    );
  }

  return (
    <div className="free-conversation-page">
      <ChatTemplate
        currentMode={currentMode}
        onModeChange={switchMode}
        isLoading={isTransitioning}
      >
        <div className="free-conversation-page__welcome">
          <div className="free-conversation-page__welcome-content">
            <div className="free-conversation-page__icon">
              <Icon name="chat" size="xl" />
            </div>
            
            <Heading level={2} align="center" className="free-conversation-page__title">
              Conversa Livre
            </Heading>
            
            <Text variant="body" color="secondary" align="center" className="free-conversation-page__description">
              Inicie uma conversa direta com a IA. Faça perguntas, peça ajuda ou simplesmente converse sobre qualquer tópico.
            </Text>
            
            <div className="free-conversation-page__actions">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartConversation}
                className="free-conversation-page__start-btn"
              >
                <Icon name="chat" size="sm" />
                Iniciar Conversa
              </Button>
              
              <Button
                variant="secondary"
                size="lg"
                onClick={handleExploreTemplates}
                className="free-conversation-page__templates-btn"
              >
                <Icon name="template" size="sm" />
                Explorar Templates
              </Button>
            </div>
            
            <div className="free-conversation-page__features">
              <div className="free-conversation-page__feature">
                <Icon name="chat" size="sm" />
                <Text variant="body-sm" color="tertiary">
                  Conversas naturais e flexíveis
                </Text>
              </div>
              <div className="free-conversation-page__feature">
                <Icon name="edit" size="sm" />
                <Text variant="body-sm" color="tertiary">
                  Sem limitações de formato
                </Text>
              </div>
              <div className="free-conversation-page__feature">
                <Icon name="success" size="sm" />
                <Text variant="body-sm" color="tertiary">
                  Respostas rápidas e precisas
                </Text>
              </div>
            </div>
          </div>
        </div>
      </ChatTemplate>
    </div>
  );
};

export default FreeConversationPage;