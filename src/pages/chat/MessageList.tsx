import React from 'react';
import MessageBubble, { Message } from './MessageBubble';

const MessageList: React.FC<{ messages: Message[]; onReact: (id:number, type:'like'|'dislike') => void; isTyping: boolean }> = ({ messages, onReact, isTyping }) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.map((m) => (
                <MessageBubble key={m.id} m={m} onReact={onReact} />
            ))}

            {isTyping && (
                <div className="flex items-start mb-4">
                    <div className="bg-theme-surface text-theme-text border border-theme-primary-dark/5 rounded-2xl px-4 py-3 shadow-sm max-w-[50%]">
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-theme-text/50 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-theme-text/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-theme-text/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                </div>
            )}

            <div id="messages-end" />
        </div>
    );
};

export default MessageList;