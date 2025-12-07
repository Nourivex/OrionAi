import React, { useState, useEffect } from 'react';
import SidebarHeader from './subSidebar/SidebarHeader';
import SidebarChatList from './subSidebar/SidebarChatList';
import SidebarModals from './subSidebar/SidebarModals';
import SidebarCharacterList from './subSidebar/SidebarCharacterList';
import SidebarTools from './subSidebar/SidebarTools';
import toast from 'react-hot-toast';
import { useTheme } from './ThemeProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Plus,
  Search,
  Settings,
  Brain,
  User,
  LogOut,
  MessageSquare,
  MessageSquareText as IconPesanText,
  LayoutPanelLeft,
  ChevronRight,
  X,
  Wrench,
  Bot,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2
} from 'lucide-react';

import { getConversations, createConversation, getCharacters, updateConversation, deleteConversation, Conversation, CharacterPersona } from '../api/api';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { themeId } = useTheme();

  const [chats, setChats] = useState<Conversation[]>([]);
  const [characters, setCharacters] = useState<CharacterPersona[]>([]);
  const location = useLocation();

  // Context menu state
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [editModal, setEditModal] = useState<{ open: boolean; chat: Conversation | null }>({ open: false, chat: null });
  const [shareModal, setShareModal] = useState<{ open: boolean; chat: Conversation | null }>({ open: false, chat: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; chat: Conversation | null }>({ open: false, chat: null });
  const [editTitle, setEditTitle] = useState('');

  // Fetch recent conversations dan characters dari backend
  useEffect(() => {
    loadConversations();
    getCharacters().then(data => setCharacters(data)).catch(() => setCharacters([]));
  }, []);

  // Update active states based on current route (conversation id or selected character)
  useEffect(() => {
    const path = location.pathname;

    // Character chat route: /characterchat/:characterId
    const charMatch = path.match(/^\/characterchat\/([a-zA-Z0-9-]+)$/);
    if (charMatch) {
      const charId = charMatch[1];
      setCharacters(prev => prev.map(ch => ({ ...ch, isActive: ch.character_id === charId })));
      setChats(prev => prev.map(c => ({ ...c, is_active: 0 })));
      return;
    }

    // Conversation chat route: /chat/{id} (only one active)
    const chatMatch = path.match(/^\/chat\/(\d+)$/);
    if (chatMatch) {
      const id = Number(chatMatch[1]);
      setChats(prev => prev.map((c) => ({ ...c, is_active: c.id === id ? 1 : 0 })));
      setCharacters(prev => prev.map(ch => ({ ...ch, isActive: false })));
      return;
    }

    // New chat page: /chat (no id)
    if (path === '/chat') {
      setChats(prev => prev.map(c => ({ ...c, is_active: 0 })));
      setCharacters(prev => prev.map(ch => ({ ...ch, isActive: false })));
      return;
    }

    // All other routes: clear all active states
    setChats(prev => prev.map(c => ({ ...c, is_active: 0 })));
    setCharacters(prev => prev.map(ch => ({ ...ch, isActive: false })));
  }, [location.pathname]);

  const loadConversations = () => {
    getConversations().then(data => {
      // generate smart titles for new/generic conversations
      const enhanced = data.map(conv => {
        const isGeneric = !conv.title || conv.title.toLowerCase().includes('new chat') || conv.title.toLowerCase().includes('untitled');
        if (!isGeneric) return conv;

        // find first user-sent message or fallback to first message
        const firstMsg = conv.messages?.find(m => m.type === 'sent') || conv.messages?.[0];
        if (!firstMsg || !firstMsg.content) return conv;
        const snippet = firstMsg.content.replace(/\s+/g, ' ').trim().slice(0, 48);
        const nice = snippet.length >= 48 ? snippet.slice(0, 45).trim() + '...' : snippet;
        return { ...conv, title: nice || 'New Chat' };
      });
      setChats(enhanced);
    }).catch(() => setChats([]));
  };

  // Refresh conversations when route changes so sidebar reflects created/deleted conversations in real-time
  useEffect(() => {
    loadConversations();
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = () => setMenuOpen(null);
    if (menuOpen !== null) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [menuOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setIsSearching(false);
  };

  // Make sidebar collapsed by default on small/medium screens (mobile & tablet)
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleNewChat = async () => {
    // Open a new blank conversation UI without creating server-side resource yet.
    // Conversation will be created on first message send (handled in ChatPage).
    try {
      navigate('/chat');
      // optionally clear selection
      setChats(prev => prev.map(c => ({ ...c, is_active: 0 })));
    } catch (err) {
      console.error('Failed to open new chat', err);
    }
  };

  const handleSearchToggle = () => {
    setIsSearching(!isSearching);
    if (isSearching) setSearchQuery('');
  };

  // Context menu handlers
  const openEditModal = (chat: Conversation) => {
    setEditTitle(chat.title);
    setEditModal({ open: true, chat });
    setMenuOpen(null);
  };

  const openShareModal = (chat: Conversation) => {
    setShareModal({ open: true, chat });
    setMenuOpen(null);
  };

  const openDeleteModal = (chat: Conversation) => {
    setDeleteModal({ open: true, chat });
    setMenuOpen(null);
  };

  const handleEditSave = async () => {
    if (!editModal.chat) return;
    await updateConversation(editModal.chat.id, { title: editTitle });
    setEditModal({ open: false, chat: null });
    loadConversations();
  };

  const handleShare = () => {
    if (!shareModal.chat) return;
    const shareUrl = `${window.location.origin}/chat/${shareModal.chat.id}`;
    navigator.clipboard.writeText(shareUrl);
    setShareModal({ open: false, chat: null });
  };

  const handleDelete = async () => {
    if (!deleteModal.chat) return;
    const id = deleteModal.chat.id;
    try {
      await deleteConversation(id);
      setDeleteModal({ open: false, chat: null });
      // Feedback ke user
      try { toast.success('Percakapan dihapus.'); } catch { }

      // Jika user sedang melihat conversation yang dihapus, redirect ke new chat
      const path = location.pathname;
      if (path === `/chat/${id}`) {
        navigate('/chat');
      }

      // Refresh list
      loadConversations();
    } catch (err) {
      console.error('Failed to delete conversation', err);
      try { toast.error('Gagal menghapus percakapan'); } catch { }
    }
  };

  const visibleChats = chats.slice(0, 3);
  const hasMoreChats = chats.length > 3;
  const filteredChats = visibleChats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <aside
      className={`transition-all duration-300 ease-in-out ${isOpen ? 'w-80' : 'w-16'} bg-gradient-to-b from-theme-bg via-theme-surface to-theme-bg text-theme-text h-full flex flex-col border-r border-theme-primary-dark/10 overflow-hidden`}
    >
      {/* Sidebar Content */}
      <div className="flex-1 flex flex-col">
        <SidebarHeader
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleNewChat={handleNewChat}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isNewChatActive={location.pathname === '/chat'}
        />

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
                  <button
                    onClick={() => navigate('/conversations')}
                    className="text-xs text-theme-primary hover:text-theme-primary/80 font-medium transition-colors"
                    title="View all conversations"
                  >
                    View All
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/conversations')}
                    title="View all conversations"
                    aria-label="View all conversations"
                    className="p-2 rounded-md text-theme-text/60 hover:bg-theme-surface/60 hover:text-theme-primary transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                )
              )}
            </div>

            <SidebarChatList
              isOpen={isOpen}
              filteredChats={filteredChats}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              openEditModal={openEditModal}
              openShareModal={openShareModal}
              openDeleteModal={openDeleteModal}
              navigate={navigate}
              IconPesanText={IconPesanText}
              activeChatId={(() => {
                const match = location.pathname.match(/^\/chat\/(\d+)$/);
                return match ? Number(match[1]) : null;
              })()}
            />

            <SidebarTools
              isOpen={isOpen}
              navigate={navigate}
              Brain={Brain}
              Wrench={Wrench}
              isMemoryActive={location.pathname === '/memory'}
              isToolsActive={location.pathname === '/tool'}
            />

            {/* Characters Section */}
            <SidebarCharacterList
              isOpen={isOpen}
              characters={characters}
              navigate={navigate}
              Plus={Plus}
              Bot={Bot}
            />
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="border-t border-theme-primary-dark/10">
          {/* Memory Bank & Tools */}
          <div className="mt-6">
            <div className="space-y-1">
              {!isOpen && (
                <button
                  onClick={() => navigate('/settings')}
                  title="Settings"
                  className={`w-full flex items-center justify-center p-4 rounded-lg transition-colors ${location.pathname === '/settings' ? 'bg-theme-primary text-theme-onPrimary' : 'text-theme-text/80 hover:text-theme-primary hover:bg-theme-surface/60'}`}
                >
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
                  <div className="text-sm font-medium text-theme-onPrimary">Lycus Bendln</div>
                  <div className="text-xs text-theme-text/60">Author</div>
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

      <SidebarModals
        editModal={editModal}
        setEditModal={setEditModal}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        handleEditSave={handleEditSave}
        shareModal={shareModal}
        setShareModal={setShareModal}
        handleShare={handleShare}
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        handleDelete={handleDelete}
      />
    </aside>
  );
};

export default Sidebar;
