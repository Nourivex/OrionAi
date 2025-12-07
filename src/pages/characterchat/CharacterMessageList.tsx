import React, { useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import CharacterMessageBubble, { CharacterMessage } from './CharacterMessageBubble';

interface CharacterMessageListProps {
  messages: CharacterMessage[];
  characterName: string;
  isTyping: boolean;
  onRegenerate?: () => void;
  messageCount?: number; // number of user messages (used to decide initial layout)
}

const CharacterMessageList: React.FC<CharacterMessageListProps> = ({
  messages,
  characterName,
  isTyping,
  onRegenerate,
  messageCount
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const shouldCenter = (messageCount ?? 0) === 0; // center when there are no user messages

  return (
    <div className={`flex-1 ${shouldCenter ? 'flex items-center justify-center' : 'overflow-y-auto'} px-4 py-4`}>
      <div className={`max-w-2xl mx-auto space-y-4 ${shouldCenter ? 'text-center' : ''}`}>
        {messages.map((msg, index) => (
          <CharacterMessageBubble
            key={msg.id}
            message={msg}
            characterName={characterName}
            onRegenerate={index === messages.length - 1 && msg.type === 'character' ? onRegenerate : undefined}
            showActions={msg.type === 'character'}
          />
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-theme-primary to-theme-accent flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-theme-surface/50 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="typing-dots text-theme-primary">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default CharacterMessageList;
