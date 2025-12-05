import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import MessageBubble, { Message } from './MessageBubble';
import { conversations } from '../../data/mockup_data';

const ChatPage: React.FC = () => {
    const params = useParams();
    const routeId = params.id ? parseInt(params.id, 10) : undefined;
    const convFromData = conversations.find(c => c.id === routeId);
    const initialConv = convFromData || conversations.find(c => c.isActive) || conversations[0];
    const [messages, setMessages] = useState<Message[]>((initialConv && (initialConv.messages as unknown as Message[])) || []);
    const [isNewConversation, setIsNewConversation] = useState<boolean>(!convFromData);

    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const timerRef = useRef<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    useEffect(() => {
        const id = params.id ? parseInt(params.id, 10) : undefined;
        const conv = conversations.find(c => c.id === id);
        if (conv) {
            setMessages(conv.messages as unknown as Message[]);
            setIsNewConversation(false);
        } else {
            setMessages([]);
            setIsNewConversation(true);
        }
    }, [params.id]);

    const suggestions = [
        'Summarize my last message',
        'Find potential memory leaks',
        'Explain the code snippet',
        'Generate a checklist',
        'Optimize this function for performance',
    ];
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

    const stopGeneration = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setIsTyping(false);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || isTyping) return;

        const newMsg: Message = {
            id: Date.now(),
            type: 'sent',
            content: inputMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reactions: { likes: 0, dislikes: 0 },
        };

        setMessages(prev => [...prev, newMsg]);
        setIsNewConversation(false);
        setInputMessage('');

        setIsTyping(true);
        timerRef.current = window.setTimeout(() => {
            const ai: Message = {
                id: Date.now() + 1,
                type: 'received',
                content: 'Your diagnosis is correct. The "Out of Memory" error points directly to a serious memory leak. Focus on asynchronous operations and closures.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                reactions: { likes: 0, dislikes: 0 },
            };
            setMessages(prev => [...prev, ai]);
            setIsTyping(false);
            timerRef.current = null;
        }, 1400);
    };

    const handleVoiceInput = () => console.log('voice');

    const handleReaction = (id: number, type: 'like'|'dislike') => {
        setMessages(prev => prev.map(m => {
            if (m.id !== id) return m;
            const copy = { ...m };
            if (type === 'like') { copy.reactions.likes = copy.reactions.likes > 0 ? 0 : 1; copy.reactions.dislikes = 0; }
            else { copy.reactions.dislikes = copy.reactions.dislikes > 0 ? 0 : 1; copy.reactions.likes = 0; }
            return copy;
        }));
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <ChatHeader />

            {isNewConversation && messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-4xl">
                        <div className="mb-6 text-center">
                            <h2 className="text-3xl font-semibold" style={{ color: 'var(--theme-text)' }}>Ready when you are.</h2>
                            <p className="text-sm text-theme-text/60 mt-2">Start a new conversation. Try typing a question or choose a suggestion.</p>
                        </div>

                        <div>
                            <ChatInput inputMessage={inputMessage} setInputMessage={setInputMessage} handleSendMessage={handleSendMessage} handleVoiceInput={handleVoiceInput} stopGeneration={stopGeneration} isTyping={isTyping} suggestions={suggestions} filteredSuggestions={filteredSuggestions} setFilteredSuggestions={setFilteredSuggestions} isNewConversation />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <MessageList messages={messages} onReact={handleReaction} isTyping={isTyping} />

                    <div ref={messagesEndRef} />
                </>
            )}

            {!isNewConversation && (
                <div className="max-w-full sm:max-w-2xl lg:max-w-3xl mx-auto w-full p-4 md:p-6 bg-theme-bg/95">
                    <ChatInput inputMessage={inputMessage} setInputMessage={setInputMessage} handleSendMessage={handleSendMessage} handleVoiceInput={handleVoiceInput} stopGeneration={stopGeneration} isTyping={isTyping} suggestions={suggestions} filteredSuggestions={filteredSuggestions} setFilteredSuggestions={setFilteredSuggestions} />
                </div>
            )}
        </div>
    );
};

export default ChatPage;
