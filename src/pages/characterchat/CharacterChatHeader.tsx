import React from 'react';
import { Menu, Bot, RotateCcw, Trash2 } from 'lucide-react';
import { CharacterPersona } from '../../api/api';

interface CharacterChatHeaderProps {
  character: CharacterPersona;
  onMenuClick: () => void;
  onResetChat: () => void;
  onDeleteChat: () => void;
  hasMessages: boolean;
}

const CharacterChatHeader: React.FC<CharacterChatHeaderProps> = ({ 
  character, 
  onMenuClick,
  onResetChat,
  onDeleteChat,
  hasMessages
}) => {
  return (
    <div className="flex-shrink-0 border-b border-theme-primary-dark/10 bg-theme-surface/30 backdrop-blur-sm px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Character Info in Header */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-theme-primary to-theme-accent flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-theme-text line-clamp-1">{character.name}</h2>
              <p className="text-xs text-theme-text/50">{character.character_role}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Reset Chat Button */}
          {hasMessages && (
            <button
              onClick={onResetChat}
              className="p-2 rounded-lg hover:bg-theme-surface/60 text-theme-text/60 hover:text-theme-primary transition-colors"
              title="Reset chat (start from greeting)"
            >
              <RotateCcw size={18} />
            </button>
          )}
          
          {/* Delete Chat Button */}
          {hasMessages && (
            <button
              onClick={onDeleteChat}
              className="p-2 rounded-lg hover:bg-red-500/10 text-theme-text/60 hover:text-red-500 transition-colors"
              title="Delete all messages"
            >
              <Trash2 size={18} />
            </button>
          )}
          
          {/* Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-theme-surface/60 text-theme-text/60 hover:text-theme-primary transition-colors"
            title="Character info"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterChatHeader;
