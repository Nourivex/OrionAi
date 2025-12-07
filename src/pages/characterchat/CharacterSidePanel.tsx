import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Pencil,
  Volume2,
  History,
  Palette,
  Pin,
  UserCircle,
  Sliders,
  ChevronRight,
  ChevronLeft,
  ThumbsUp,
  ThumbsDown,
  Bot,
  Sparkles,
  User,
  Check,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { CharacterPersona } from '../../api/api';

interface CharacterSidePanelProps {
  character: CharacterPersona;
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  messageCount: number;
}

type SubPanel = 'voice' | 'history' | 'customize' | 'pinned' | 'persona' | 'style' | null;

const CharacterSidePanel: React.FC<CharacterSidePanelProps> = ({
  character,
  isOpen,
  onClose,
  onNewChat,
  messageCount
}) => {
  const navigate = useNavigate();
  const [activeSubPanel, setActiveSubPanel] = useState<SubPanel>(null);
  const [selectedVoice, setSelectedVoice] = useState('default');
  const [selectedStyle, setSelectedStyle] = useState('default');

  const handleAvatarClick = () => {
    navigate(`/character/${character.character_id}/detail`);
  };

  const handleEditClick = () => {
    navigate(`/character/${character.character_id}/edit`);
  };

  const voiceOptions = [
    { id: 'default', name: 'Default', description: 'Natural voice' },
    { id: 'soft', name: 'Soft', description: 'Gentle and calm' },
    { id: 'energetic', name: 'Energetic', description: 'Upbeat and lively' },
    { id: 'serious', name: 'Serious', description: 'Professional tone' },
  ];

  const styleOptions = [
    { id: 'default', name: 'Default', description: 'Balanced responses' },
    { id: 'creative', name: 'Creative', description: 'More imaginative' },
    { id: 'precise', name: 'Precise', description: 'Factual and direct' },
    { id: 'friendly', name: 'Friendly', description: 'Casual and warm' },
  ];

  const renderSubPanel = () => {
    switch (activeSubPanel) {
      case 'voice':
        return (
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setActiveSubPanel(null)} className="p-1.5 rounded-lg hover:bg-theme-surface/60 text-theme-text/60">
                <ChevronLeft size={18} />
              </button>
              <h3 className="font-semibold text-theme-text">Voice Settings</h3>
            </div>
            <div className="space-y-2">
              {voiceOptions.map(voice => (
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    selectedVoice === voice.id 
                      ? 'border-theme-primary bg-theme-primary/10' 
                      : 'border-theme-primary-dark/10 hover:bg-theme-surface/60'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium text-theme-text text-sm">{voice.name}</div>
                    <div className="text-xs text-theme-text/60">{voice.description}</div>
                  </div>
                  {selectedVoice === voice.id && <Check size={18} className="text-theme-primary" />}
                </button>
              ))}
            </div>
          </div>
        );

      case 'style':
        return (
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setActiveSubPanel(null)} className="p-1.5 rounded-lg hover:bg-theme-surface/60 text-theme-text/60">
                <ChevronLeft size={18} />
              </button>
              <h3 className="font-semibold text-theme-text">Response Style</h3>
            </div>
            <div className="space-y-2">
              {styleOptions.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    selectedStyle === style.id 
                      ? 'border-theme-primary bg-theme-primary/10' 
                      : 'border-theme-primary-dark/10 hover:bg-theme-surface/60'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium text-theme-text text-sm">{style.name}</div>
                    <div className="text-xs text-theme-text/60">{style.description}</div>
                  </div>
                  {selectedStyle === style.id && <Check size={18} className="text-theme-primary" />}
                </button>
              ))}
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setActiveSubPanel(null)} className="p-1.5 rounded-lg hover:bg-theme-surface/60 text-theme-text/60">
                <ChevronLeft size={18} />
              </button>
              <h3 className="font-semibold text-theme-text">Chat History</h3>
            </div>
            <div className="text-center py-8 text-theme-text/60">
              <History size={32} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">History feature coming soon</p>
              <p className="text-xs mt-1">Your conversations will be saved here</p>
            </div>
          </div>
        );

      case 'customize':
        return (
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setActiveSubPanel(null)} className="p-1.5 rounded-lg hover:bg-theme-surface/60 text-theme-text/60">
                <ChevronLeft size={18} />
              </button>
              <h3 className="font-semibold text-theme-text">Customize</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-theme-surface/50 border border-theme-primary-dark/10">
                <h4 className="font-medium text-theme-text text-sm mb-2">Character Avatar</h4>
                <p className="text-xs text-theme-text/60 mb-3">Upload a custom avatar for this character</p>
                <button className="px-4 py-2 bg-theme-primary/10 text-theme-primary rounded-lg text-sm hover:bg-theme-primary/20 transition-colors">
                  Upload Image
                </button>
              </div>
              <div className="p-4 rounded-lg bg-theme-surface/50 border border-theme-primary-dark/10">
                <h4 className="font-medium text-theme-text text-sm mb-2">Chat Background</h4>
                <p className="text-xs text-theme-text/60 mb-3">Choose a background theme</p>
                <div className="flex gap-2">
                  {['default', 'dark', 'light', 'gradient'].map(bg => (
                    <button key={bg} className="px-3 py-1.5 text-xs rounded-lg border border-theme-primary-dark/20 hover:border-theme-primary capitalize">
                      {bg}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'pinned':
        return (
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setActiveSubPanel(null)} className="p-1.5 rounded-lg hover:bg-theme-surface/60 text-theme-text/60">
                <ChevronLeft size={18} />
              </button>
              <h3 className="font-semibold text-theme-text">Pinned Messages</h3>
            </div>
            <div className="text-center py-8 text-theme-text/60">
              <Pin size={32} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">No pinned messages yet</p>
              <p className="text-xs mt-1">Long press a message to pin it</p>
            </div>
          </div>
        );

      case 'persona':
        return (
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setActiveSubPanel(null)} className="p-1.5 rounded-lg hover:bg-theme-surface/60 text-theme-text/60">
                <ChevronLeft size={18} />
              </button>
              <h3 className="font-semibold text-theme-text">Your Persona</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-theme-text/60 mb-1.5">Display Name</label>
                <input 
                  type="text" 
                  placeholder="Your name in this chat"
                  defaultValue={character.user_persona_nickname || ''}
                  className="w-full px-3 py-2 rounded-lg border border-theme-primary-dark/20 bg-theme-bg text-sm focus:ring-2 focus:ring-theme-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-theme-text/60 mb-1.5">Your Role</label>
                <input 
                  type="text" 
                  placeholder="e.g., Traveler, Student, Friend"
                  className="w-full px-3 py-2 rounded-lg border border-theme-primary-dark/20 bg-theme-bg text-sm focus:ring-2 focus:ring-theme-primary outline-none"
                />
              </div>
              <button className="w-full py-2 bg-theme-primary text-theme-onPrimary rounded-lg text-sm font-medium hover:bg-theme-primary/90 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderMainPanel = () => (
    <>
      {/* Panel Header */}
      <div className="flex-shrink-0 p-4 border-b border-theme-primary-dark/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Clickable Avatar - Opens Detail Page */}
            <button
              onClick={handleAvatarClick}
              className="relative group"
              title="View character details"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-theme-primary to-theme-accent flex items-center justify-center group-hover:ring-2 group-hover:ring-theme-primary/50 transition-all">
                <Bot size={24} className="text-white" />
              </div>
              <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <ExternalLink size={14} className="text-white" />
              </div>
            </button>
            <div>
              <button 
                onClick={handleAvatarClick}
                className="font-semibold text-theme-text text-sm hover:text-theme-primary transition-colors text-left"
              >
                {character.name}
              </button>
              <p className="text-xs text-theme-text/50">By @OrionAi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-theme-surface/60 text-theme-text/60"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 text-xs text-theme-text/60">
          <span className="flex items-center gap-1">
            <ThumbsUp size={12} />
            475
          </span>
          <span className="flex items-center gap-1">
            <ThumbsDown size={12} />
            54
          </span>
          <span className="flex items-center gap-1 text-theme-primary">
            <MessageSquare size={12} />
            {messageCount} messages
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {(Array.isArray(character.tags)
            ? character.tags
            : typeof character.tags === 'string'
              ? (() => { try { return JSON.parse(character.tags); } catch { return []; } })()
              : []
          ).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-theme-primary/10 text-theme-primary text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Panel Actions */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {/* Action Buttons */}
          <div className="flex gap-2 mb-2">
            <button
              onClick={onNewChat}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-theme-primary text-theme-primary hover:bg-theme-primary/10 transition-colors"
            >
              <Pencil size={18} />
              <span className="font-medium">New chat</span>
            </button>
            <button
              onClick={handleEditClick}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-theme-primary/10 text-theme-primary hover:bg-theme-primary/20 transition-colors"
              title="Edit character"
            >
              <Pencil size={18} />
            </button>
          </div>

          {/* Menu Items */}
          <div className="space-y-1">
            <button 
              onClick={() => setActiveSubPanel('voice')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-theme-surface/60 text-theme-text/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Volume2 size={18} />
                <span>Voice</span>
              </div>
              <div className="flex items-center gap-1 text-theme-text/50">
                <span className="text-sm capitalize">{selectedVoice}</span>
                <ChevronRight size={16} />
              </div>
            </button>

            <button 
              onClick={() => setActiveSubPanel('history')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-theme-surface/60 text-theme-text/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <History size={18} />
                <span>History</span>
              </div>
              <ChevronRight size={16} className="text-theme-text/50" />
            </button>

            <button 
              onClick={() => setActiveSubPanel('customize')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-theme-surface/60 text-theme-text/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Palette size={18} />
                <span>Customize</span>
              </div>
              <ChevronRight size={16} className="text-theme-text/50" />
            </button>

            <button 
              onClick={() => setActiveSubPanel('pinned')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-theme-surface/60 text-theme-text/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Pin size={18} />
                <span>Pinned</span>
              </div>
              <ChevronRight size={16} className="text-theme-text/50" />
            </button>

            <button 
              onClick={() => setActiveSubPanel('persona')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-theme-surface/60 text-theme-text/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <UserCircle size={18} />
                <span>Persona</span>
              </div>
              <ChevronRight size={16} className="text-theme-text/50" />
            </button>

            <button 
              onClick={() => setActiveSubPanel('style')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-theme-surface/60 text-theme-text/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sliders size={18} />
                <span>Style</span>
              </div>
              <div className="flex items-center gap-1 text-theme-text/50">
                <span className="text-sm capitalize">{selectedStyle}</span>
                <ChevronRight size={16} />
              </div>
            </button>
          </div>
        </div>

        {/* Character Details */}
        <div className="p-4 border-t border-theme-primary-dark/10 mt-2">
          <h4 className="text-xs font-semibold text-theme-text/60 uppercase tracking-wider mb-3">About</h4>
          <p className="text-sm text-theme-text/70 leading-relaxed">
            {character.short_description}
          </p>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Sparkles size={14} className="text-theme-accent" />
              <span className="text-theme-text/60">Relationship:</span>
              <span className="text-theme-text">{character.user_relationship}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <UserCircle size={14} className="text-theme-primary" />
              <span className="text-theme-text/60">Role:</span>
              <span className="text-theme-text">{character.character_role}</span>
            </div>
            {character.user_persona_nickname && (
              <div className="flex items-center gap-2 text-xs">
                <User size={14} className="text-theme-primary" />
                <span className="text-theme-text/60">Calls you:</span>
                <span className="text-theme-text">{character.user_persona_nickname}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Backdrop for mobile/tablet - closes panel when clicked */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Side Panel - responsive overlay on mobile/tablet, inline on desktop */}
      <div
        className={`
          fixed lg:relative inset-y-0 right-0 z-50 lg:z-auto
          ${isOpen ? 'w-80 translate-x-0' : 'w-0 translate-x-full lg:translate-x-0'}
          flex-shrink-0 border-l border-theme-primary-dark/10 bg-theme-surface 
          transition-all duration-300 overflow-hidden
          shadow-xl lg:shadow-none
        `}
      >
        <div className="w-80 h-full flex flex-col">
          {activeSubPanel ? renderSubPanel() : renderMainPanel()}
        </div>
      </div>
    </>
  );
};

export default CharacterSidePanel;
