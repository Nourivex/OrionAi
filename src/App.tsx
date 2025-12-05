import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Chat from "./pages/chat/ChatPage";
import ToolRoutes from "./pages/tool/ToolRoutes";
import MemoryBank from "./pages/MemoryBank";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/ThemeProvider";

export default function App(): JSX.Element {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:id" element={<Chat />} />
            {/* Redirect legacy /tools to new /tool */}
            <Route path="/tools" element={<Navigate to="/tool" replace />} />
            <Route path="/tools/*" element={<Navigate to="/tool" replace />} />
            {/* Tool routes under /tool/* */}
            <Route path="/tool/*" element={<ToolRoutes />} />
            {/* Global catch-all -> NotFound */}
            <Route path="*" element={<NotFound />} />
            <Route path="/memory" element={<MemoryBank />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}