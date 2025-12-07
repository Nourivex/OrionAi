import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Plus,
  MessageSquareText,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
  X,
  Calendar,
  Tag
} from 'lucide-react';
import { getConversations, createConversation, updateConversation, deleteConversation, Conversation } from '../api/api';

const ConversationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Context menu state
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  // Modal states
  const [editModal, setEditModal] = useState<{ open: boolean; conv: Conversation | null }>({ open: false, conv: null });
  const [shareModal, setShareModal] = useState<{ open: boolean; conv: Conversation | null }>({ open: false, conv: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; conv: Conversation | null }>({ open: false, conv: null });

  // Edit form state
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.smartTags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group conversations by date
  const groupedConversations = filteredConversations.reduce((acc, conv) => {
    const date = conv.last_updated || 'Unknown';
    if (!acc[date]) acc[date] = [];
    acc[date].push(conv);
    return acc;
  }, {} as Record<string, Conversation[]>);

  const handleNewChat = async () => {
    const now = new Date();
    const res = await createConversation({
      title: 'New Chat',
      smartTags: [],
      is_active: 1,
      last_updated: now.toISOString().split('T')[0],
      messages: [],
    });
    navigate(`/chat/${res.id}`);
  };

  const handleEditSave = async () => {
    if (!editModal.conv) return;
    await updateConversation(editModal.conv.id, { title: editTitle });
    setEditModal({ open: false, conv: null });
    loadConversations();
  };

  const handleDelete = async () => {
    if (!deleteModal.conv) return;
    await deleteConversation(deleteModal.conv.id);
    setDeleteModal({ open: false, conv: null });
    loadConversations();
  };

  const handleShare = () => {
    if (!shareModal.conv) return;
    const shareUrl = `${window.location.origin}/chat/${shareModal.conv.id}`;
    navigator.clipboard.writeText(shareUrl);
    setShareModal({ open: false, conv: null });
    // Toast notification could be added here
  };

  const openEditModal = (conv: Conversation) => {
    setEditTitle(conv.title);
    setEditModal({ open: true, conv });
    setMenuOpen(null);
  };

  const openShareModal = (conv: Conversation) => {
    setShareModal({ open: true, conv });
    setMenuOpen(null);
  };

  const openDeleteModal = (conv: Conversation) => {
    setDeleteModal({ open: true, conv });
    setMenuOpen(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = () => setMenuOpen(null);
    if (menuOpen !== null) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-theme-bg">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-theme-bg/95 backdrop-blur-sm border-b border-theme-primary-dark/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-theme-surface/60 transition-colors text-theme-text/70 hover:text-theme-text"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold text-theme-text">Conversations</h1>
            </div>
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-4 py-2 bg-theme-primary text-theme-onPrimary rounded-xl hover:bg-theme-primary/90 transition-all font-medium shadow-lg hover:shadow-xl"
            >
              <Plus size={18} />
              <span>New Chat</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-text/50" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-theme-surface/60 border border-theme-primary-dark/10 rounded-xl text-theme-text placeholder:text-theme-text/50 focus:outline-none focus:ring-2 focus:ring-theme-primary/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-theme-text/50 hover:text-theme-text"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-theme-primary border-t-transparent rounded-full" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquareText size={48} className="mx-auto mb-4 text-theme-text/30" />
            <p className="text-theme-text/60">No conversations found</p>
            <button
              onClick={handleNewChat}
              className="mt-4 text-theme-primary hover:underline"
            >
              Start a new chat
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedConversations).map(([date, convs]) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-3 px-2">
                  <Calendar size={14} className="text-theme-text/40" />
                  <span className="text-xs font-semibold text-theme-text/50 uppercase tracking-wider">{date}</span>
                </div>
                <div className="space-y-2">
                  {convs.map((conv) => (
                    <div
                      key={conv.id}
                      className="group relative bg-theme-surface/40 hover:bg-theme-surface/80 border border-theme-primary-dark/5 hover:border-theme-primary/20 rounded-xl transition-all duration-200"
                    >
                      <div
                        onClick={() => navigate(`/chat/${conv.id}`)}
                        className="flex items-center gap-4 p-4 cursor-pointer"
                      >
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-theme-primary to-theme-accent flex items-center justify-center text-white shadow-md">
                          <MessageSquareText size={18} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-theme-text truncate">{conv.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {conv.smartTags?.slice(0, 3).map((tag, i) => (
                              <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-theme-primary/10 text-theme-primary text-xs rounded-full">
                                <Tag size={10} />
                                {tag}
                              </span>
                            ))}
                            <span className="text-xs text-theme-text/40">
                              {conv.messages?.length || 0} messages
                            </span>
                          </div>
                        </div>

                        {/* Menu Button */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpen(menuOpen === conv.id ? null : conv.id);
                            }}
                            className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-theme-surface transition-all text-theme-text/60 hover:text-theme-text"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {/* Dropdown Menu */}
                          {menuOpen === conv.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 top-full mt-1 w-48 bg-theme-surface border border-theme-primary-dark/10 rounded-xl shadow-xl z-50 overflow-hidden"
                            >
                              <button
                                onClick={() => openEditModal(conv)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-theme-text hover:bg-theme-primary/10 transition-colors"
                              >
                                <Pencil size={16} className="text-theme-primary" />
                                <span>Edit Title</span>
                              </button>
                              <button
                                onClick={() => openShareModal(conv)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-theme-text hover:bg-theme-primary/10 transition-colors"
                              >
                                <Share2 size={16} className="text-blue-500" />
                                <span>Share Link</span>
                              </button>
                              <button
                                onClick={() => openDeleteModal(conv)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 size={16} />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl ring-1 ring-theme-primary-dark/5">
            <h2 className="text-lg font-bold text-theme-text mb-4">Edit Conversation Title</h2>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-4 py-3 bg-theme-bg border border-theme-primary-dark/10 rounded-xl text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
              placeholder="Enter new title..."
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditModal({ open: false, conv: null })}
                className="px-4 py-2 text-theme-text/70 hover:text-theme-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-theme-primary text-theme-onPrimary rounded-lg hover:bg-theme-primary/90 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl ring-1 ring-theme-primary-dark/5">
            <h2 className="text-lg font-bold text-theme-text mb-2">Share Conversation</h2>
            <p className="text-sm text-theme-text/60 mb-4">Copy the link to share this conversation.</p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/chat/${shareModal.conv?.id}`}
                className="flex-1 px-4 py-3 bg-theme-bg border border-theme-primary-dark/10 rounded-xl text-theme-text text-sm"
              />
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-theme-primary text-theme-onPrimary rounded-lg hover:bg-theme-primary/90 transition-colors"
              >
                Copy
              </button>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShareModal({ open: false, conv: null })}
                className="px-4 py-2 text-theme-text/70 hover:text-theme-text transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl ring-1 ring-theme-primary-dark/5">
            <h2 className="text-lg font-bold text-theme-text mb-2">Delete Conversation</h2>
            <p className="text-sm text-theme-text/60 mb-4">
              Are you sure you want to delete "<span className="font-medium text-theme-text">{deleteModal.conv?.title}</span>"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, conv: null })}
                className="px-4 py-2 text-theme-text/70 hover:text-theme-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationsPage;
