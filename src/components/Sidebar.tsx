import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Settings,
  Brain,
  User,
  LogOut,
  MessageSquare,
  MessageSquareText as IconPesanText,
  LayoutPanelLeft ,
  ChevronRight,
  X,
  Wrench,
  Bot
} from 'lucide-react';
import { chats as mockChats, characters as mockCharacters } from '../data/mockup_data';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { themeId } = useTheme();

  const [chats, setChats] = useState(mockChats);
  const [characters, setCharacters] = useState(mockCharacters);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setIsSearching(false);
  };

  // Make sidebar collapsed by default on small screens
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Chat',
      date: new Date().toISOString().split('T')[0],
      isActive: true
    };
    setChats(prev => [newChat, ...prev.map(c => ({ ...c, isActive: false }))]);
    navigate(`/chat/${newChat.id}`);
  };

  const handleSearchToggle = () => {
    setIsSearching(!isSearching);
    if (isSearching) setSearchQuery('');
  };

  const visibleChats = chats.slice(0, 3);
  const hasMoreChats = chats.length > 3;
  const filteredChats = visibleChats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={`transition-all duration-300 ease-in-out ${isOpen ? 'w-80' : 'w-16'
        } bg-gradient-to-b from-theme-bg via-theme-surface to-theme-bg text-theme-text h-full flex flex-col border-r border-theme-primary-dark/10 overflow-hidden`}
    >
      {/* Sidebar Content */}
      <div className="flex-1 flex flex-col">
        {/* Header - single block, toggle button always visible */}
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
              onClick={() => setIsOpen(prev => !prev)}
              className="p-1 rounded-md hover:bg-theme-surface/60 transition-colors text-theme-text/80"
              title={isOpen ? 'Collapse' : 'Expand'}
            >
              <LayoutPanelLeft size={18} />
            </button>
          </div>

          {/* New Chat Button - show full when open, compact when collapsed */}
          <div className="mt-0">
            <div className="mt-0 flex items-center justify-center">
              {isOpen ? (
                <button
                  onClick={handleNewChat}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-theme-primary/10 hover:bg-theme-primary/15 border border-theme-primary-dark/10 rounded-xl text-theme-primary font-medium transition-all duration-200 group"
                >
                  <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
                  <span>New Chat</span>
                </button>
              ) : (
                <button
                  onClick={handleNewChat}
                  aria-label="New Chat"
                  className="w-10 h-10 flex items-center justify-center rounded-md bg-theme-primary/10 hover:bg-theme-primary/15 border border-theme-primary-dark/10 text-theme-primary transition-all duration-200 p-3"
                >
                  <Plus size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search Section */}
        {isOpen && (
          <div className="px-4 py-3 border-b border-theme-primary-dark/10">
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

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-2">
          <div>
            <div className="flex items-center justify-between px-2 py-3">
              {isOpen ? (
                <div className="text-xs font-semibold text-theme-text/60 uppercase tracking-wider">
                  Recent Conversations
                </div>
              ) : (
                <div />
              )}
              {hasMoreChats && (
                isOpen ? (
                  <button className="text-xs text-theme-primary hover:text-theme-primary/80 font-medium transition-colors" title="View all conversations">
                    View All
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/chat')}
                    title="View all conversations"
                    aria-label="View all conversations"
                    className="p-2 rounded-md text-theme-text/60 hover:bg-theme-surface/60 hover:text-theme-primary transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                )
              )}
            </div>

            <div className="space-y-1">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    setChats(prev => prev.map(c => ({ ...c, isActive: c.id === chat.id })));
                    navigate(`/chat/${chat.id}`);
                  }}
                  className={`flex items-center ${isOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-3'} rounded-lg cursor-pointer transition-all duration-200 group ${chat.isActive
                    ? 'bg-theme-primary text-theme-onPrimary border border-theme-primary shadow-sm'
                    : 'text-theme-text/80 hover:text-theme-primary hover:bg-theme-primary/10'
                    }`}
                >
                  <IconPesanText size={16} className="flex-shrink-0" />
                  {isOpen && (
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{chat.title}</div>
                      <div className="text-xs text-theme-text/60 mt-0.5">{chat.date}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Memory Bank & Tools */}
            <div className="mt-6">
              <div className="space-y-1">
                <button onClick={() => navigate('/memory')} className={`flex items-center ${isOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-3'} w-full rounded-lg text-theme-text/80 hover:text-theme-primary hover:bg-theme-surface/60 transition-all duration-200 group`}>
                  <Brain size={16} className="flex-shrink-0" />
                  {isOpen && <span className="font-medium">Memory Bank</span>}
                </button>
                <button onClick={() => navigate('/tool')} className={`flex items-center ${isOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-3'} w-full rounded-lg text-theme-text/80 hover:text-theme-primary hover:bg-theme-surface/60 transition-all duration-200 group`}>
                  <Wrench size={16} className="flex-shrink-0" />
                  {isOpen && <span className="font-medium">Tools</span>}
                </button>
              </div>
            </div>

            {/* Characters Section */}
            <div className="mt-6">
              {isOpen && (
                <div className="px-2 py-3 text-xs font-semibold text-theme-text/60 uppercase tracking-wider">
                  Characters
                </div>
              )}
              <div className="space-y-2">
                {characters.map((character) => (
                  <div
                    key={character.id}
                    onClick={() => {
                      setCharacters(prev => prev.map(ch => ({ ...ch, isActive: ch.id === character.id })));
                      navigate('/chat');
                    }}
                    className={`flex items-center ${isOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-3'} rounded-lg cursor-pointer transition-all duration-200 group ${character.isActive
                      ? 'bg-theme-primary text-theme-onPrimary border border-theme-primary'
                      : 'text-theme-text/80 hover:text-theme-accent hover:bg-theme-primary/10'
                      }`}
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(90deg, var(--theme-primary), var(--theme-accent))' }}>
                      <Bot size={12} className="text-theme-onPrimary" />
                    </div>
                    {isOpen && (
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{character.name}</div>
                        <div className="text-xs text-theme-text/60 mt-0.5">{character.role}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="border-t border-theme-primary-dark/10">
          {/* Memory Bank & Tools */}
            <div className="mt-6">
              <div className="space-y-1">
                {!isOpen && (
                  <button onClick={() => navigate('/settings')} title="Settings" className="w-full flex items-center justify-center p-4 rounded-lg text-theme-text/80 hover:text-theme-primary hover:bg-theme-surface/60 transition-colors">
                    <Settings size={18} />
                  </button>
                )}
              </div>
            </div>

          {/* Profile Section */}
          <div className="px-4 py-4 border-t border-theme-primary-dark/10">
            {isOpen ? (
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-theme-surface/60 transition-all duration-200 cursor-pointer group">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(90deg, var(--theme-primary), var(--theme-accent))' }}>
                  <User size={16} className="text-theme-onPrimary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-theme-onPrimary">John Developer</div>
                  <div className="text-xs text-theme-text/60">Premium Plan</div>
                </div>
                <button onClick={() => navigate('/settings')} title="Settings" className="p-1.5 rounded-md hover:bg-theme-surface/60 transition-colors">
                  <Settings size={16} className="text-theme-text/60 group-hover:text-theme-primary transition-colors" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center p-2">
                <button title="Profile" className="p-1 rounded-md hover:bg-theme-surface/60 transition-colors">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(90deg, var(--theme-primary), var(--theme-accent))' }}>
                    <User size={16} className="text-theme-onPrimary" />
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
