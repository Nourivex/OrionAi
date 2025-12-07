import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface CharacterChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
  characterName: string;
}

const CharacterChatInput: React.FC<CharacterChatInputProps> = ({
  value,
  onChange,
  onSend,
  disabled,
  characterName
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + 'px';
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex-shrink-0 border-t border-theme-primary-dark/10 p-4 bg-theme-surface/20">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-end gap-3 bg-theme-surface/60 border border-theme-primary-dark/10 rounded-2xl px-4 py-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${characterName}...`}
            className="flex-1 bg-transparent text-theme-text placeholder-theme-text/50 resize-none focus:outline-none text-sm py-2 max-h-32"
            rows={1}
            disabled={disabled}
          />
          <button
            onClick={onSend}
            disabled={!value.trim() || disabled}
            className="p-2 bg-theme-primary text-theme-onPrimary rounded-xl hover:bg-theme-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-xs text-theme-text/40 text-center mt-2">
          This is A.I. and not a real person. Treat everything it says as fiction.
        </p>
      </div>
    </div>
  );
};

export default CharacterChatInput;
