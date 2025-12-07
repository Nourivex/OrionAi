import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Loader2,
  Bot,
  Sparkles,
  UserCircle,
  Tag,
  MessageSquare,
  FileText,
  Wand2
} from 'lucide-react';
import { createCharacter, CharacterPersonaCreateInput } from '../api/api';

const CreateCharacterPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CharacterPersonaCreateInput>({
    name: '',
    short_description: '',
    user_relationship: '',
    character_role: '',
    user_persona_nickname: '',
    tags: []
  });
  
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useSmartGeneration, setUseSmartGeneration] = useState(true);

  const handleChange = (field: keyof CharacterPersonaCreateInput, value: string) => {
    setFormData((prev: CharacterPersonaCreateInput) => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value.split(',').map(t => t.trim()).filter(t => t.length > 0);
    setFormData((prev: CharacterPersonaCreateInput) => ({ ...prev, tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Nama karakter wajib diisi');
      return;
    }

    if (!formData.short_description.trim()) {
      setError('Deskripsi singkat wajib diisi');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await createCharacter(formData);
      navigate(`/characterchat/${result.character_id}`);
    } catch (err: any) {
      console.error('Failed to create character:', err);
      setError(err.message || 'Gagal membuat karakter. Pastikan backend dan Ollama berjalan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestedTags = ['Fantasy', 'Sci-Fi', 'Romance', 'Adventure', 'Mystery', 'Comedy', 'Drama', 'Action'];
  const suggestedRelationships = ['Best Friend', 'Mentor', 'Rival', 'Partner', 'Guide', 'Companion', 'Teacher', 'Guardian'];
  const suggestedRoles = ['Helper', 'Storyteller', 'Advisor', 'Entertainer', 'Coach', 'Confidant', 'Explorer'];

  return (
    <div className="flex-1 flex flex-col h-full bg-theme-bg overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 sticky top-0 z-20 bg-theme-bg/95 backdrop-blur-sm shadow-sm border-b border-theme-primary-dark/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-theme-surface/60 text-theme-text/60 hover:text-theme-primary transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-theme-primary">Create New Character</h1>
              <p className="text-sm text-theme-text/60">Buat karakter roleplay baru dengan AI</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Smart Generation Toggle */}
            <div className="bg-theme-surface/50 rounded-xl p-6 border border-theme-primary-dark/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-theme-primary/10 flex items-center justify-center">
                    <Wand2 size={20} className="text-theme-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-theme-text">Smart Generation</h3>
                    <p className="text-sm text-theme-text/60">AI akan generate definition & greeting otomatis</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUseSmartGeneration(!useSmartGeneration)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    useSmartGeneration ? 'bg-theme-primary' : 'bg-theme-text/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      useSmartGeneration ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="bg-theme-surface rounded-xl p-6 shadow-lg space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Bot size={24} className="text-theme-primary" />
                <h2 className="text-xl font-bold text-theme-primary">Basic Information</h2>
              </div>

              {/* Character Name */}
              <div>
                <label className="block text-sm font-medium text-theme-text mb-2">
                  <span className="text-red-500">*</span> Nama Karakter
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Contoh: Luna - Mystical Guardian"
                  className="w-full px-4 py-3 rounded-lg border border-theme-primary-dark/20 bg-theme-bg focus:ring-2 focus:ring-theme-primary outline-none transition-all"
                />
                <p className="mt-1 text-xs text-theme-text/50">Bisa menggunakan format "Nama - Title"</p>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-theme-text mb-2">
                  <span className="text-red-500">*</span> Deskripsi Singkat
                </label>
                <textarea
                  value={formData.short_description}
                  onChange={(e) => handleChange('short_description', e.target.value)}
                  placeholder="Jelaskan karakter dalam 1-2 kalimat..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg border border-theme-primary-dark/20 bg-theme-bg focus:ring-2 focus:ring-theme-primary outline-none transition-all resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-theme-text mb-2">
                  <Tag size={16} />
                  Tags
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="Fantasy, Adventure, Romance (pisahkan dengan koma)"
                  className="w-full px-4 py-3 rounded-lg border border-theme-primary-dark/20 bg-theme-bg focus:ring-2 focus:ring-theme-primary outline-none transition-all"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {suggestedTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (!tagsInput.toLowerCase().includes(tag.toLowerCase())) {
                          handleTagsChange(tagsInput ? `${tagsInput}, ${tag}` : tag);
                        }
                      }}
                      className="px-2 py-1 text-xs bg-theme-primary/10 text-theme-primary rounded-full hover:bg-theme-primary/20 transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Relationship Settings */}
            <div className="bg-theme-surface rounded-xl p-6 shadow-lg space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles size={24} className="text-theme-accent" />
                <h2 className="text-xl font-bold text-theme-primary">Relationship Settings</h2>
              </div>

              {/* User Relationship */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-theme-text mb-2">
                  <UserCircle size={16} />
                  Hubungan dengan User
                </label>
                <input
                  type="text"
                  value={formData.user_relationship}
                  onChange={(e) => handleChange('user_relationship', e.target.value)}
                  placeholder="Contoh: Best Friend, Mentor, Partner..."
                  className="w-full px-4 py-3 rounded-lg border border-theme-primary-dark/20 bg-theme-bg focus:ring-2 focus:ring-theme-primary outline-none transition-all"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {suggestedRelationships.map(rel => (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => handleChange('user_relationship', rel)}
                      className={`px-2 py-1 text-xs rounded-full transition-colors ${
                        formData.user_relationship === rel 
                          ? 'bg-theme-primary text-theme-onPrimary' 
                          : 'bg-theme-primary/10 text-theme-primary hover:bg-theme-primary/20'
                      }`}
                    >
                      {rel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Character Role */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-theme-text mb-2">
                  <FileText size={16} />
                  Peran Karakter
                </label>
                <input
                  type="text"
                  value={formData.character_role}
                  onChange={(e) => handleChange('character_role', e.target.value)}
                  placeholder="Contoh: Helper, Storyteller, Guide..."
                  className="w-full px-4 py-3 rounded-lg border border-theme-primary-dark/20 bg-theme-bg focus:ring-2 focus:ring-theme-primary outline-none transition-all"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {suggestedRoles.map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleChange('character_role', role)}
                      className={`px-2 py-1 text-xs rounded-full transition-colors ${
                        formData.character_role === role 
                          ? 'bg-theme-primary text-theme-onPrimary' 
                          : 'bg-theme-primary/10 text-theme-primary hover:bg-theme-primary/20'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* User Persona Nickname */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-theme-text mb-2">
                  <MessageSquare size={16} />
                  Panggilan untuk User
                </label>
                <input
                  type="text"
                  value={formData.user_persona_nickname}
                  onChange={(e) => handleChange('user_persona_nickname', e.target.value)}
                  placeholder="Bagaimana karakter memanggil user? (Tuan, Kak, Boss...)"
                  className="w-full px-4 py-3 rounded-lg border border-theme-primary-dark/20 bg-theme-bg focus:ring-2 focus:ring-theme-primary outline-none transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-lg border border-theme-primary-dark/20 text-theme-text hover:bg-theme-surface/60 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-theme-primary text-theme-onPrimary rounded-lg hover:bg-theme-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Creating with AI...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Create Character</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCharacterPage;
