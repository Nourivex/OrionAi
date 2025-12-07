import React from 'react';
import { MoreHorizontal, Pencil, Share2, Trash2 } from 'lucide-react';
import { Conversation } from '../../api/api';

interface SidebarChatListProps {
  isOpen: boolean;
  filteredChats: Conversation[];
  menuOpen: number | null;
  setMenuOpen: (id: number | null) => void;
  openEditModal: (chat: Conversation) => void;
  openShareModal: (chat: Conversation) => void;
  openDeleteModal: (chat: Conversation) => void;
  navigate: (path: string) => void;
  IconPesanText: React.ElementType;
  activeChatId?: number | null;
}

const SidebarChatList: React.FC<SidebarChatListProps> = ({
  isOpen,
  filteredChats,
  menuOpen,
  setMenuOpen,
  openEditModal,
  openShareModal,
  openDeleteModal,
  navigate,
  IconPesanText,
  activeChatId,
}) => {
  return (
    <div className="space-y-1">
      {filteredChats.map((chat: Conversation) => (
        <div
          key={chat.id}
          // Di sini gue pake 'activeChatId === chat.id' karena ini yang bener sesuai props
          // Duplikasi kode di bawah pake 'chat.is_active' yang mungkin gak ada di `Conversation`
          className={`relative flex items-center ${isOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-3'} rounded-lg cursor-pointer transition-all duration-200 group ${activeChatId === chat.id
              ? 'bg-theme-primary text-theme-onPrimary border border-theme-primary shadow-sm'
              : 'text-theme-text/80 hover:text-theme-primary hover:bg-theme-primary/10'
            }`}
        >
          <div
            onClick={() => {
              try { localStorage.removeItem('orion-selected-character'); } catch { }
              navigate(`/chat/${chat.id}`);
            }}
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            <IconPesanText size={16} className="flex-shrink-0" />
            {isOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{chat.title}</div>
                <div className={`text-xs mt-0.5 ${activeChatId === chat.id ? 'text-theme-onPrimary/70' : 'text-theme-text/60'}`}>{chat.last_updated}</div>
              </div>
            )}
          </div>

          {/* Context Menu Button */}
          {isOpen && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(menuOpen === chat.id ? null : chat.id);
                }}
                className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-all ${activeChatId === chat.id ? 'hover:bg-white/20 text-theme-onPrimary' : 'hover:bg-theme-surface text-theme-text/60'}`}
              >
                <MoreHorizontal size={14} />
              </button>

              {/* Dropdown Menu */}
              {menuOpen === chat.id && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-1 w-40 bg-white text-theme-text border border-theme-primary-dark/10 rounded-lg shadow-lg z-50 overflow-hidden"
                >
                  <button
                    onClick={() => openEditModal(chat)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-theme-text hover:bg-theme-primary/10 transition-colors"
                  >
                    <Pencil size={12} className="text-theme-primary" />
                    <span>Edit Title</span>
                  </button>
                  <button
                    onClick={() => openShareModal(chat)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-theme-text hover:bg-theme-primary/10 transition-colors"
                  >
                    <Share2 size={12} className="text-blue-500" />
                    <span>Share Link</span>
                  </button>
                  <button
                    onClick={() => openDeleteModal(chat)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SidebarChatList;