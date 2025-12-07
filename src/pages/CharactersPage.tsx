import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Plus,
  Bot,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Tag,
  Users,
  Sparkles
} from 'lucide-react';
import { getCharacters, deleteCharacter, CharacterPersona } from '../api/api';

const CharactersPage: React.FC = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<CharacterPersona[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Context menu state
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Modal states
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; char: CharacterPersona | null }>({ open: false, char: null });

  useEffect(() => {
    loadCharacters();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = () => setMenuOpen(null);
    if (menuOpen !== null) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [menuOpen]);

  const loadCharacters = async () => {
    setLoading(true);
    try {
      const data = await getCharacters();
      setCharacters(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = [...new Set(characters.map(c => c.category))];

  const filteredCharacters = characters.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async () => {
    if (!deleteModal.char) return;
    await deleteCharacter(deleteModal.char.character_id);
    setDeleteModal({ open: false, char: null });
    loadCharacters();
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      fantasy: 'from-purple-500 to-pink-500',
      scifi: 'from-cyan-500 to-blue-500',
      cyberpunk: 'from-yellow-500 to-red-500',
      romance: 'from-pink-500 to-rose-500',
      horror: 'from-gray-700 to-red-900',
      general: 'from-gray-500 to-gray-600',
    };
    return colors[category] || 'from-theme-primary to-theme-accent';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-theme-bg overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-theme-primary-dark/10 bg-theme-surface/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-theme-surface/60 text-theme-text/60 hover:text-theme-primary transition-colors"
                title="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-theme-text flex items-center gap-2">
                  <Users size={24} className="text-theme-primary" />
                  Character Personas
                </h1>
                <p className="text-sm text-theme-text/60 mt-0.5">
                  {characters.length} characters available
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/character/new')}
              className="flex items-center gap-2 px-4 py-2 bg-theme-primary text-theme-onPrimary rounded-lg hover:bg-theme-primary/90 transition-colors font-medium"
            >
              <Plus size={18} />
              <span>Create Character</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-text/60" />
              <input
                type="text"
                placeholder="Search characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-theme-surface/60 border border-theme-primary-dark/10 rounded-lg text-theme-text placeholder-theme-text/60 focus:outline-none focus:ring-2 focus:ring-theme-primary/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-theme-text/60 hover:text-theme-primary transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-theme-primary text-theme-onPrimary'
                    : 'bg-theme-surface/60 text-theme-text/70 hover:bg-theme-surface'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                    selectedCategory === cat
                      ? 'bg-theme-primary text-theme-onPrimary'
                      : 'bg-theme-surface/60 text-theme-text/70 hover:bg-theme-surface'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Characters Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-theme-primary border-t-transparent"></div>
            </div>
          ) : filteredCharacters.length === 0 ? (
            <div className="text-center py-20">
              <Bot size={48} className="mx-auto text-theme-text/30 mb-4" />
              <p className="text-theme-text/60">No characters found</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-sm text-theme-primary hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCharacters.map((char) => (
                <div
                  key={char.character_id}
                  className="group relative bg-theme-surface/50 border border-theme-primary-dark/10 rounded-xl overflow-hidden hover:border-theme-primary/30 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(`/characterchat/${char.character_id}`)}
                >
                  {/* Gradient Header */}
                  <div className={`h-20 bg-gradient-to-r ${getCategoryColor(char.category)} opacity-80`} />
                  
                  {/* Avatar */}
                  <div className="absolute top-10 left-4">
                    <div className="w-16 h-16 rounded-full bg-theme-surface border-4 border-theme-surface flex items-center justify-center shadow-lg">
                      <Bot size={28} className="text-theme-primary" />
                    </div>
                  </div>

                  {/* Context Menu */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(menuOpen === char.character_id ? null : char.character_id);
                      }}
                      className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    
                    {menuOpen === char.character_id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-full mt-1 w-36 bg-theme-surface border border-theme-primary-dark/10 rounded-lg shadow-xl z-50 overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            navigate(`/character/${char.character_id}/edit`);
                            setMenuOpen(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-theme-text hover:bg-theme-primary/10 transition-colors"
                        >
                          <Pencil size={12} className="text-theme-primary" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            setDeleteModal({ open: true, char });
                            setMenuOpen(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="px-4 pt-10 pb-4">
                    <h3 className="font-semibold text-theme-text truncate">{char.name}</h3>
                    <p className="text-xs text-theme-text/60 mt-0.5">{char.character_role}</p>
                    
                    <p className="text-sm text-theme-text/70 mt-3 line-clamp-2">
                      {char.short_description}
                    </p>

                    {/* Tags */}
                    {char.tags && char.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {char.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-theme-primary/10 text-theme-primary text-xs rounded-full"
                          >
                            <Tag size={10} />
                            {tag}
                          </span>
                        ))}
                        {char.tags.length > 3 && (
                          <span className="text-xs text-theme-text/50">+{char.tags.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* Relationship Badge */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-theme-primary-dark/10">
                      <Sparkles size={12} className="text-theme-accent" />
                      <span className="text-xs text-theme-text/60">{char.user_relationship}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl ring-1 ring-theme-primary-dark/5">
            <h2 className="text-base font-bold text-theme-text mb-2">Delete Character</h2>
            <p className="text-sm text-theme-text/60 mb-4">
              Are you sure you want to delete "<span className="font-medium text-theme-text">{deleteModal.char?.name}</span>"? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, char: null })}
                className="px-3 py-1.5 text-sm bg-transparent border border-theme-primary-dark/10 text-theme-text rounded-lg hover:bg-theme-surface/60 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
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

export default CharactersPage;
