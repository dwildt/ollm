import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FreeConversationPage from './pages/FreeConversationPage';
import TemplatePage from './pages/TemplatePage';
import Chat from './components/Chat';
import './App.css';
import './design-system/tokens/colors.css';
import './design-system/tokens/spacing.css';
import './design-system/tokens/typography.css';
import './design-system/tokens/breakpoints.css';
import './design-system/themes/light.css';
import './design-system/utilities/responsive.css';

function App() {
  return (
    <BrowserRouter>
      <main className="App">
        <Routes>
          {/* Default route - redirect to free conversation */}
          <Route path="/" element={<Navigate to="/chat" replace />} />
          
          {/* Free Conversation Mode */}
          <Route path="/chat" element={<FreeConversationPage />} />
          
          {/* Templates Mode */}
          <Route path="/templates" element={<TemplatePage />} />
          
          {/* Specific template chat */}
          <Route path="/chat/:templateSlug" element={<Chat />} />
          
          {/* Conversation history */}
          <Route path="/chat/conversation/:conversationId" element={<Chat />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
