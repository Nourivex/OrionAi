import React from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  Plus,
  MessageSquare
} from 'lucide-react';

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-gradient-to-r from-theme-bg via-theme-surface to-theme-primary text-theme-onPrimary border-b border-theme-primary-dark/10 backdrop-blur-sm">
      {/* Left Section - Title & Actions */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button className="p-2 rounded-lg bg-theme-surface/60 hover:bg-theme-surface/80 transition-colors md:hidden">
          <Menu size={20} />
        </button>
        
        {/* Current Chat Info */}
          <div className="hidden md:flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <MessageSquare size={20} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold">Debug Server Production</div>
            <div className="text-xs text-gray-400">Active conversation</div>
          </div>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="hidden md:flex items-center w-full max-w-md">
        <div className="relative w-full">
          <Search 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-text/60" 
          />
          <input
            type="text"
            placeholder="Search in conversation..."
            className="w-full pl-10 pr-4 py-2 bg-theme-surface/60 border border-theme-primary-dark/10 rounded-xl text-theme-text placeholder-theme-text/60 focus:outline-none focus:ring-2 focus:ring-theme-primary/30 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        {/* New Chat Button */}
        <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-theme-primary/10 hover:bg-theme-primary/15 border border-theme-primary-dark/10 rounded-xl text-theme-primary hover:text-theme-onPrimary font-medium transition-all duration-200 group">
          <Plus size={16} className="group-hover:rotate-90 transition-transform duration-200" />
          <span className="text-sm">New Chat</span>
        </button>
        
        {/* Mobile New Chat Button */}
        <button className="md:hidden p-2 rounded-lg bg-theme-primary/10 hover:bg-theme-primary/15 border border-theme-primary-dark/10 transition-colors">
          <Plus size={20} className="text-theme-primary" />
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg bg-theme-surface/60 hover:bg-theme-surface/80 relative transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        {/* Settings */}
        <button className="p-2 rounded-lg bg-theme-surface/60 hover:bg-theme-surface/80 transition-colors">
          <Settings size={20} />
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 bg-gradient-to-r from-theme-primary to-theme-primary-dark rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
          <span className="text-xs font-semibold">JD</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
