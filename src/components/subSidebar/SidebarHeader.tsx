import React from 'react';
import { LayoutPanelLeft, Plus, Search, X } from 'lucide-react';

interface SidebarHeaderProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleNewChat: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isNewChatActive?: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isOpen,
  setIsOpen,
  handleNewChat,
  searchQuery,
  setSearchQuery,
  isNewChatActive,
}) => {
  return (
    <div className="p-4 border-b border-theme-primary-dark/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          {isOpen && (
            <div className="text-xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, var(--theme-primary-light), var(--theme-accent))' }}>
              Orion Ai Studio
            </div>
          )}
        </div>
        <button
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-md hover:bg-theme-surface/60 transition-colors text-theme-text/80"
          title={isOpen ? 'Collapse' : 'Expand'}
        >
          <LayoutPanelLeft size={18} />
        </button>
      </div>

      {/* New Chat Button - show full when open, compact when collapsed */}
      <div className="mt-0 flex items-center justify-center">
        {isOpen ? (
          <button
            onClick={handleNewChat}
            className={`w-full flex items-center gap-3 px-4 py-3 border border-theme-primary-dark/10 rounded-xl font-medium transition-all duration-200 group ${isNewChatActive ? 'bg-theme-primary text-theme-onPrimary' : 'bg-theme-primary/10 hover:bg-theme-primary/15 text-theme-primary'}`}
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
            <span>New Chat</span>
          </button>
        ) : (
          <button
            onClick={handleNewChat}
            aria-label="New Chat"
            className={`w-10 h-10 flex items-center justify-center rounded-md border border-theme-primary-dark/10 transition-all duration-200 p-3 ${isNewChatActive ? 'bg-theme-primary text-theme-onPrimary' : 'bg-theme-primary/10 hover:bg-theme-primary/15 text-theme-primary'}`}
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      {/* Search Section */}
      {isOpen && (
        <div className="px-0 py-3 border-b-0">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-text/60"
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-theme-surface/60 border border-theme-primary-dark/10 rounded-lg text-theme-text placeholder-theme-text/60 focus:outline-none focus:ring-2 focus:ring-theme-primary/30 focus:border-transparent transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-theme-text/60 hover:text-theme-primary transition-colors"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;
