import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Chat from './components/Chat';
import JsonApiRoute from './components/JsonApiRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <main className="App">
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:templateSlug.json" element={<JsonApiRoute />} />
          <Route path="/chat/:templateSlug" element={<Chat />} />
          <Route path="/chat/conversation/:conversationId" element={<Chat />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
