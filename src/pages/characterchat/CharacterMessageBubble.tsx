import React from 'react';
import { Bot, Volume2, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';

export interface CharacterMessage {
  id: number;
  type: 'user' | 'character';
  content: string;
  timestamp: string;
}

interface CharacterMessageBubbleProps {
  message: CharacterMessage;
  characterName: string;
  onRegenerate?: () => void;
  showActions?: boolean;
}

const CharacterMessageBubble: React.FC<CharacterMessageBubbleProps> = ({
  message,
  characterName,
  onRegenerate,
  showActions = true
}) => {
  if (message.type === 'user') {
    return (
      <div className="flex items-start gap-3 justify-end">
        <div className="bg-theme-primary text-theme-onPrimary rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-[80%]">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-theme-primary to-theme-accent flex items-center justify-center flex-shrink-0">
        <Bot size={16} className="text-white" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-theme-text">{characterName.split(' - ')[0]}</span>
          <span className="text-xs px-1.5 py-0.5 bg-theme-primary/10 text-theme-primary rounded">orion.ai</span>
          <button className="p-1 rounded hover:bg-theme-surface/60 text-theme-text/40 opacity-0 group-hover:opacity-100 transition-all">
            <Volume2 size={14} />
          </button>
        </div>
        <div className="bg-theme-surface/50 rounded-2xl rounded-tl-sm px-4 py-3 text-theme-text/90 text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
        {showActions && (
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-all">
            {onRegenerate && (
              <button 
                onClick={onRegenerate}
                className="p-1.5 rounded-lg hover:bg-theme-surface/60 text-theme-text/40 hover:text-theme-primary transition-colors"
                title="Regenerate"
              >
                <RefreshCw size={14} />
              </button>
            )}
            <button className="p-1.5 rounded-lg hover:bg-theme-surface/60 text-theme-text/40 hover:text-green-500 transition-colors">
              <ThumbsUp size={14} />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-theme-surface/60 text-theme-text/40 hover:text-red-500 transition-colors">
              <ThumbsDown size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterMessageBubble;
