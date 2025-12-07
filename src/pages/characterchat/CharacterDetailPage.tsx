import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Pencil,
  ChevronRight,
  Bot
} from 'lucide-react';
import { getCharacter, CharacterPersona } from '../../api/api';

const CharacterDetailPage: React.FC = () => {
  const { characterId } = useParams<{ characterId: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<CharacterPersona | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'starters'>('about');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!characterId) return;
      try {
        const data = await getCharacter(characterId);
        setCharacter(data);
      } catch (error) {
        console.error('Error fetching character:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacter();
  }, [characterId]);

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

  // Generate chat starters based on character
  const chatStarters = [
    `Can you tell me more about yourself, ${character.name}?`,
    `What's your story, ${character.name}?`,
    `How can you help me today?`,
    `What do you enjoy doing the most?`,
  ];

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-theme-bg min-h-screen">
      {/* Left Section - Character Profile */}
      <div className="w-full lg:w-96 flex-shrink-0 border-r border-theme-primary-dark/10 p-6 flex flex-col items-center">
        {/* Back Button */}
        <div className="w-full flex justify-start mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-theme-surface/60 text-theme-text/60"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* Avatar */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-theme-primary to-theme-accent flex items-center justify-center">
            <Bot size={48} className="text-white" />
          </div>
        </div>

        {/* Name & Creator */}
        <h1 className="text-xl font-bold text-theme-text">{character.name}</h1>
        <p className="text-sm text-theme-text/50 mb-4">By @OrionAi</p>

        {/* Chat Button */}
        <button
          onClick={() => navigate(`/characterchat/${characterId}`)}
          className="w-full max-w-xs px-6 py-3 bg-theme-text text-theme-bg rounded-full font-medium hover:opacity-90 transition-opacity mb-4"
        >
          Chat
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setLiked(!liked)}
            className={`p-2 rounded-lg border ${
              liked
                ? 'border-theme-primary bg-theme-primary/10 text-theme-primary'
                : 'border-theme-primary-dark/20 text-theme-text/60 hover:bg-theme-surface/60'
            }`}
          >
            <ThumbsUp size={18} />
          </button>
          <button className="p-2 rounded-lg border border-theme-primary-dark/20 text-theme-text/60 hover:bg-theme-surface/60">
            <ThumbsDown size={18} />
          </button>
          <button className="p-2 rounded-lg border border-theme-primary-dark/20 text-theme-text/60 hover:bg-theme-surface/60">
            <Share2 size={18} />
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-theme-text/60 mb-4">
          <span className="flex items-center gap-1">
            <MessageSquare size={14} />
            6,731 Interactions
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-theme-text/60">
          <ThumbsUp size={14} />
          <span>1 Like</span>
        </div>

        {/* Description */}
        <div className="mt-6 w-full text-sm text-theme-text/70 leading-relaxed">
          <p>{character.short_description}</p>
        </div>
      </div>

      {/* Right Section - About & Chat Starters */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-theme-primary-dark/10 mb-6">
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === 'about'
                ? 'text-theme-text border-b-2 border-theme-text'
                : 'text-theme-text/50 hover:text-theme-text/70'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('starters')}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === 'starters'
                ? 'text-theme-text border-b-2 border-theme-text'
                : 'text-theme-text/50 hover:text-theme-text/70'
            }`}
          >
            Chat Starters
          </button>
        </div>

        {activeTab === 'about' ? (
          <div className="max-w-2xl">
            {/* About Header */}
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-semibold text-theme-text">About</h2>
              <span className="px-2 py-0.5 bg-theme-surface/60 text-theme-text/60 text-xs rounded">
                Content by OrionAi
              </span>
            </div>

            {/* About Character */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-theme-text mb-2">
                About {character.name}
              </h3>
              <p className="text-sm text-theme-text/70 leading-relaxed">
                {character.short_description}
              </p>
            </div>

            {/* Area of Expertise */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-theme-text mb-2">
                {character.name}'s Area of Expertise
              </h3>
              <p className="text-sm text-theme-text/70 leading-relaxed">
                {character.character_role}. This character can provide support and guidance
                to people with similar interests or challenges.
              </p>
            </div>

            {/* I geek out on... */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-theme-text/70 italic mb-2">
                I geek out on...
              </h3>
              <p className="text-sm text-theme-text/60 italic leading-relaxed">
                {character.definition?.slice(0, 200)}...
              </p>
            </div>

            {/* Tags */}
            {character.tags && character.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-theme-text mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {character.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-theme-primary/10 text-theme-primary text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Character Info */}
            <div className="p-4 bg-theme-surface/30 rounded-lg space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-theme-text/60">Relationship</span>
                <span className="text-theme-text">{character.user_relationship}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-theme-text/60">Role</span>
                <span className="text-theme-text">{character.character_role}</span>
              </div>
              {character.user_persona_nickname && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-theme-text/60">Calls you</span>
                  <span className="text-theme-text">{character.user_persona_nickname}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-theme-text/60">Category</span>
                <span className="text-theme-text capitalize">{character.category}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-theme-text/60">Visibility</span>
                <span className="text-theme-text capitalize">{character.visibility}</span>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => navigate(`/character/${characterId}/edit`)}
              className="mt-6 flex items-center gap-2 px-4 py-2 bg-theme-primary/10 text-theme-primary rounded-lg hover:bg-theme-primary/20 transition-colors"
            >
              <Pencil size={16} />
              <span>Edit Character</span>
            </button>
          </div>
        ) : (
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-theme-text mb-4">Chat Starters</h2>
            <p className="text-sm text-theme-text/60 mb-6">
              Click on a starter to begin chatting with {character.name}
            </p>

            <div className="space-y-3">
              {chatStarters.map((starter, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(`/characterchat/${characterId}`, { state: { starter } })}
                  className="w-full flex items-center justify-between p-4 bg-theme-surface/30 rounded-lg hover:bg-theme-surface/50 transition-colors text-left group"
                >
                  <span className="text-sm text-theme-text/80 group-hover:text-theme-text">
                    {starter}
                  </span>
                  <ChevronRight size={18} className="text-theme-text/40 group-hover:text-theme-text/60" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterDetailPage;
