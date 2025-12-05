import React from 'react';
import Sidebar from '../components/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-white min-h-screen">
        <main className="flex-1 overflow-y-auto">{children}</main>
        {/* <Footer /> bisa ditambah di sini jika ada */}
      </div>
    </div>
  );
};

export default MainLayout;
