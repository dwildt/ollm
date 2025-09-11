import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './design-system/tokens/colors.css';
import './design-system/tokens/spacing.css';
import './design-system/tokens/typography.css';
import './design-system/tokens/breakpoints.css';
import './design-system/themes/light.css';
import './design-system/utilities/responsive.css';

// Lazy load components for better performance
const TemplatePage = React.lazy(() => import('./pages/TemplatePage'));
const ChatNew = React.lazy(() => import('./components/ChatNew'));

// Loading component
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '50vh',
    fontSize: '1.2rem',
    color: 'var(--color-text-secondary)'
  }}>
    Carregando...
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <main className="App">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Default route - go directly to chat interface */}
            <Route path="/" element={<ChatNew />} />
            
            {/* Free Conversation Mode */}
            <Route path="/chat" element={<ChatNew />} />
            
            {/* Templates Mode */}
            <Route path="/templates" element={<TemplatePage />} />
            
            {/* Specific template chat */}
            <Route path="/chat/:templateSlug" element={<ChatNew />} />
            
            {/* Conversation history */}
            <Route path="/chat/conversation/:conversationId" element={<ChatNew />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/chat" replace />} />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  );
}

export default App;
// Test comment
