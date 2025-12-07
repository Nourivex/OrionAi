import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Chat from "./pages/chat/ChatPage";
import ToolRoutes from "./pages/tool/ToolRoutes";
import MemoryBank from "./pages/MemoryBank";
import Settings from "./pages/Settings";
import ConversationsPage from "./pages/ConversationsPage";
import CharactersPage from "./pages/CharactersPage";
import CreateCharacterPage from "./pages/CreateCharacterPage";
import CharacterChatPage from "./pages/characterchat/CharacterChatPage";
import CharacterDetailPage from "./pages/characterchat/CharacterDetailPage";
import EditCharacterPage from "./pages/characterchat/EditCharacterPage";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from 'react-hot-toast';

export default function App(): JSX.Element {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <MainLayout>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/conversations" element={<ConversationsPage />} />
            {/* Character Personas Routes */}
            <Route path="/characters" element={<CharactersPage />} />
            <Route path="/character/new" element={<CreateCharacterPage />} />
            <Route path="/character/:characterId/detail" element={<CharacterDetailPage />} />
            <Route path="/character/:characterId/edit" element={<EditCharacterPage />} />
            <Route path="/characterchat/:characterId" element={<CharacterChatPage />} />
            {/* Legacy route redirect */}
            <Route path="/char/:characterId" element={<Navigate to="/characterchat/:characterId" replace />} />
            {/* Redirect legacy /tools to new /tool */}
            <Route path="/tools" element={<Navigate to="/tool" replace />} />
            <Route path="/tools/*" element={<Navigate to="/tool" replace />} />
            {/* Tool routes under /tool/* */}
            <Route path="/tool/*" element={<ToolRoutes />} />
            <Route path="/memory" element={<MemoryBank />} />
            <Route path="/settings" element={<Settings />} />
            {/* Global catch-all -> NotFound */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}