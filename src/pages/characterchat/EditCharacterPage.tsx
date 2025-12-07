import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  Bot,
  Save,
  MessageSquare,
  Volume2,
  Globe,
  Lock,
  Eye
} from 'lucide-react';
import { getCharacter, updateCharacter, CharacterPersona } from '../../api/api';

interface FormData {
  name: string;
  short_description: string;  // Tagline
  greeting: string;
  definition: string;
  tags: string[];
  user_relationship: string;
  character_role: string;
  user_persona_nickname: string;
  voice_id: string;
  visibility: string;
  category: string;
}

const EditCharacterPage: React.FC = () => {
  const { characterId } = useParams<{ characterId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [character, setCharacter] = useState<CharacterPersona | null>(null);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    short_description: '',
    greeting: '',
    definition: '',
    tags: [],
    user_relationship: '',
    character_role: '',
    user_persona_nickname: '',
    voice_id: '',
    visibility: 'private',
    category: 'general'
  });

  // Character limits
  const limits = {
    name: 20,
    short_description: 50,
    greeting: 4096,
    definition: 32000,
    tags: 20
  };

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!characterId) return;
      try {
        const data = await getCharacter(characterId);
        setCharacter(data);
        setFormData({
          name: data.name || '',
          short_description: data.short_description || '',
          greeting: data.greeting || '',
          definition: data.definition || '',
          tags: data.tags || [],
          user_relationship: data.user_relationship || '',
          character_role: data.character_role || '',
          user_persona_nickname: data.user_persona_nickname || '',
          voice_id: data.voice_id || '',
          visibility: data.visibility || 'private',
          category: data.category || 'general'
        });
      } catch (error) {
        console.error('Error fetching character:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacter();
  }, [characterId]);

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && formData.tags.length < 10) {
      const newTags = [...formData.tags, tagInput.trim()];
      handleInputChange('tags', newTags);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    handleInputChange('tags', newTags);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async () => {
    if (!characterId) return;
    setSaving(true);
    try {
      await updateCharacter(characterId, formData);
      setHasChanges(false);
      // Show success feedback
    } catch (error) {
      console.error('Error saving character:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndChat = async () => {
    if (!characterId) return;
    setSaving(true);
    try {
      await updateCharacter(characterId, formData);
      navigate(`/characterchat/${characterId}`);
    } catch (error) {
      console.error('Error saving character:', error);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-theme-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-primary"></div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="flex-1 flex items-center justify-center bg-theme-bg">
        <div className="text-center">
          <Bot size={48} className="mx-auto mb-4 text-theme-text/30" />
          <p className="text-theme-text/60">Character not found</p>
          <button
            onClick={() => navigate('/characters')}
            className="mt-4 px-4 py-2 bg-theme-primary text-theme-onPrimary rounded-lg"
          >
            Back to Characters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-theme-bg min-h-screen overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-theme-surface/60 text-theme-text/60"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-theme-text">Edit Character</h1>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-theme-primary to-theme-accent flex items-center justify-center">
                <Bot size={40} className="text-white" />
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 p-1.5 bg-theme-surface rounded-full shadow-lg hover:bg-theme-surface/80"
              >
                <Pencil size={14} className="text-theme-text" />
              </button>
            </div>
          </div>

          {/* Character Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-theme-text">
              Character name
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                maxLength={limits.name}
                placeholder="e.g. Albert Einstein"
                className="w-full px-4 py-3 rounded-lg border border-theme-primary-dark/20 bg-theme-bg text-theme-text focus:ring-2 focus:ring-theme-primary outline-none"
              />
            </div>
            <div className="flex justify-end">
              <span className="text-xs text-theme-text/50">
                {formData.name.length}/{limits.name}
              </span>
            </div>
          </div>

          {/* Tagline (short_description) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-theme-text">
              Tagline
            </label>
            <input
              type="text"
              value={formData.short_description}
              onChange={(e) => handleInputChange('short_description', e.target.value)}
              maxLength={limits.short_description}
              placeholder="Add a short tagline of your Character"
              className="w-full px-4 py-3 rounded-lg border border-theme-primary-dark/20 bg-theme-bg text-theme-text focus:ring-2 focus:ring-theme-primary outline-none"
            />
            <div className="flex justify-end">
              <span className="text-xs text-theme-text/50">
                {formData.short_description.length}/{limits.short_description}
              </span>
            </div>
          </div>

          {/* Relationship */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-theme-text">
              Relationship with User
            </label>
            <input
              type="text"
              value={formData.user_relationship}
              onChange={(e) => handleInputChange('user_relationship', e.target.value)}
              placeholder="e.g. Friend, Mentor, Partner"
              className="w-full px-4 py-3 rounded-lg border border-theme-primary-dark/20 bg-theme-bg text-theme-text focus:ring-2 focus:ring-theme-primary outline-none"
            />
          </div>

          {/* Character Role */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-theme-text">
              Character Role
            </label>
            <input
              type="text"
              value={formData.character_role}
              onChange={(e) => handleInputChange('character_role', e.target.value)}
              placeholder="e.g. Guide, Teacher, Companion"
              className="w-full px-4 py-3 rounded-lg border border-theme-primary-dark/20 bg-theme-bg text-theme-text focus:ring-2 focus:ring-theme-primary outline-none"
            />
          </div>

          {/* User Nickname */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-theme-text">
              What should character call you?
            </label>
            <input
              type="text"
              value={formData.user_persona_nickname}
              onChange={(e) => handleInputChange('user_persona_nickname', e.target.value)}
              placeholder="e.g. Master, Friend, Dear"
              className="w-full px-4 py-3 rounded-lg border border-theme-primary-dark/20 bg-theme-bg text-theme-text focus:ring-2 focus:ring-theme-primary outline-none"
            />
          </div>

          {/* Greeting */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-theme-text">
              Greeting
            </label>
            <textarea
              value={formData.greeting}
              onChange={(e) => handleInputChange('greeting', e.target.value)}
              maxLength={limits.greeting}
              placeholder="What does your character say when starting a conversation?"
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-theme-primary-dark/20 bg-theme-bg text-theme-text focus:ring-2 focus:ring-theme-primary outline-none resize-none"
            />
            <div className="flex justify-end">
              <span className="text-xs text-theme-text/50">
                {formData.greeting.length}/{limits.greeting}
              </span>
            </div>
          </div>

          {/* Voice Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-theme-text">
              Voice
            </label>
            <button
              type="button"
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-theme-surface/50 border border-theme-primary-dark/20 hover:bg-theme-surface/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Volume2 size={18} className="text-theme-text/60" />
                <span className="text-theme-text">
                  {formData.voice_id || 'Select a voice'}
                </span>
              </div>
              <ChevronDown size={18} className="text-theme-text/50" />
            </button>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-theme-text">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-theme-primary-dark/20 bg-theme-bg min-h-[56px]">
              {formData.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-theme-surface/60 text-theme-text text-sm rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(idx)}
                    className="hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                maxLength={limits.tags}
                placeholder={formData.tags.length < 10 ? 'Add a tag...' : ''}
                disabled={formData.tags.length >= 10}
                className="flex-1 min-w-[100px] bg-transparent outline-none text-theme-text placeholder:text-theme-text/40"
              />
            </div>
            <p className="text-xs text-theme-text/50">Press Enter to add tag (max 10)</p>
          </div>

          {/* More Options Toggle */}
          <button
            type="button"
            onClick={() => setShowMoreOptions(!showMoreOptions)}
            className="flex items-center gap-2 text-theme-primary hover:text-theme-primary/80 text-sm font-medium"
          >
            More options
            {showMoreOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* More Options Content */}
          {showMoreOptions && (
            <div className="space-y-6 pt-4 border-t border-theme-primary-dark/10">
              {/* Definition */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-theme-text">
                    Definition
                  </label>
                  <a
                    href="#"
                    className="text-xs text-theme-primary hover:underline flex items-center gap-1"
                  >
                    Best practices
                  </a>
                </div>
                <textarea
                  value={formData.definition}
                  onChange={(e) => handleInputChange('definition', e.target.value)}
                  maxLength={limits.definition}
                  placeholder="What's your Character's backstory? How do you want it to talk or act?"
                  rows={10}
                  className="w-full px-4 py-3 rounded-lg border border-theme-primary-dark/20 bg-theme-bg text-theme-text focus:ring-2 focus:ring-theme-primary outline-none resize-y"
                />
                <div className="flex justify-end">
                  <span className="text-xs text-theme-text/50">
                    {formData.definition.length}/{limits.definition}
                  </span>
                </div>
              </div>

              {/* Definition Quick Add Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-theme-surface/60 text-theme-text rounded-lg border border-theme-primary-dark/20 hover:bg-theme-surface/80"
                >
                  <Plus size={14} />
                  User message
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-theme-surface/60 text-theme-text rounded-lg border border-theme-primary-dark/20 hover:bg-theme-surface/80"
                >
                  <Plus size={14} />
                  Character message
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-theme-surface/60 text-theme-text rounded-lg border border-theme-primary-dark/20 hover:bg-theme-surface/80"
                >
                  <Plus size={14} />
                  End of dialog
                </button>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-theme-text">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-theme-primary-dark/20 bg-theme-bg text-theme-text focus:ring-2 focus:ring-theme-primary outline-none"
                >
                  <option value="general">General</option>
                  <option value="fantasy">Fantasy</option>
                  <option value="scifi">Sci-Fi</option>
                  <option value="romance">Romance</option>
                  <option value="adventure">Adventure</option>
                  <option value="horror">Horror</option>
                  <option value="comedy">Comedy</option>
                  <option value="anime">Anime</option>
                  <option value="historical">Historical</option>
                </select>
              </div>
            </div>
          )}

          {/* Visibility */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-theme-text">
              Visibility
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleInputChange('visibility', 'public')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  formData.visibility === 'public'
                    ? 'border-theme-primary bg-theme-primary/10 text-theme-primary'
                    : 'border-theme-primary-dark/20 text-theme-text/60 hover:bg-theme-surface/60'
                }`}
              >
                <Globe size={16} />
                Public
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('visibility', 'unlisted')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  formData.visibility === 'unlisted'
                    ? 'border-theme-primary bg-theme-primary/10 text-theme-primary'
                    : 'border-theme-primary-dark/20 text-theme-text/60 hover:bg-theme-surface/60'
                }`}
              >
                <Eye size={16} />
                Unlisted
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('visibility', 'private')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  formData.visibility === 'private'
                    ? 'border-theme-primary bg-theme-primary/10 text-theme-primary'
                    : 'border-theme-primary-dark/20 text-theme-text/60 hover:bg-theme-surface/60'
                }`}
              >
                <Lock size={16} />
                Private
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-theme-primary-dark/10">
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg border transition-colors ${
                hasChanges && !saving
                  ? 'border-theme-primary text-theme-primary hover:bg-theme-primary/10'
                  : 'border-theme-primary-dark/20 text-theme-text/40 cursor-not-allowed'
              }`}
            >
              <Save size={16} />
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleSaveAndChat}
              disabled={!hasChanges || saving}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-colors ${
                hasChanges && !saving
                  ? 'bg-theme-primary text-theme-onPrimary hover:bg-theme-primary/90'
                  : 'bg-theme-primary/50 text-theme-onPrimary/50 cursor-not-allowed'
              }`}
            >
              <MessageSquare size={16} />
              Save and Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCharacterPage;
