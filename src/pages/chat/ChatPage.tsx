import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import { sendChat, getConversation, createConversation, addMessageToConversation, Conversation, ConversationMessage } from '../../api/api';

const ChatPage: React.FC = () => {
    const params = useParams();
    const routeId = params.id ? parseInt(params.id, 10) : undefined;
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<ConversationMessage[]>([]);
    const [isNewConversation, setIsNewConversation] = useState<boolean>(!routeId);

    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const abortRef = useRef<AbortController | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        return () => {
            if (abortRef.current) abortRef.current.abort();
        };
    }, []);

    useEffect(() => {
        let mounted = true;
        async function loadConv() {
            const id = params.id ? parseInt(params.id, 10) : undefined;
            if (id) {
                try {
                    const conv = await getConversation(id);
                    if (!mounted) return;
                    setConversation(conv);
                    setMessages(conv.messages || []);
                    setIsNewConversation(false);
                } catch (err) {
                    // conversation not found or error -> treat as new
                    setConversation(null);
                    setMessages([]);
                    setIsNewConversation(true);
                }
            } else {
                setConversation(null);
                setMessages([]);
                setIsNewConversation(true);
            }
        }
        loadConv();
        return () => { mounted = false; };
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
        if (abortRef.current) {
            abortRef.current.abort();
            abortRef.current = null;
        }
        setIsTyping(false);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || isTyping) return;
        const userMsg: ConversationMessage = {
            id: Date.now(),
            type: 'sent',
            content: inputMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reactions: { likes: 0, dislikes: 0 },
            tool_action: null,
        };

        // Optimistically show user's message
        setMessages(prev => [...prev, userMsg]);
        setIsNewConversation(false);
        const promptText = inputMessage;
        setInputMessage('');

        setIsTyping(true);
        abortRef.current = new AbortController();
        try {
            const res = await sendChat(promptText, "orion-12b-it:latest", conversation?.id);
            // Pastikan content AI selalu dari response, bukan tool_action
            const aiMsg: ConversationMessage = {
                id: Date.now() + 1,
                type: 'received',
                content: typeof res.response === 'string' ? res.response : '',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                reactions: { likes: 0, dislikes: 0 },
                tool_action: res.tool_action || null,
            };

            // Persist messages to backend
            if (conversation && conversation.id) {
                try {
                    await addMessageToConversation(conversation.id, userMsg);
                    await addMessageToConversation(conversation.id, aiMsg);
                    const updated = await getConversation(conversation.id);
                    setConversation(updated);
                    setMessages(updated.messages || []);
                } catch (err) {
                    console.error('Error persisting messages', err);
                    // fallback: show ai message locally
                    setMessages(prev => [...prev, aiMsg]);
                }
            } else {
                // create new conversation with both messages, then navigate/replace URL
                try {
                    const payload: Omit<Conversation, 'id'> = {
                        title: 'New Chat',
                        smartTags: [],
                        is_active: 1,
                        last_updated: new Date().toISOString(),
                        messages: [userMsg, aiMsg],
                    };
                    const created = await createConversation(payload);
                    const full = await getConversation(created.id);
                    setConversation(full);
                    setMessages(full.messages || []);
                    // update URL without reload
                    window.history.replaceState({}, '', `/chat/${full.id}`);
                } catch (err) {
                    console.error('Error creating conversation', err);
                    setMessages(prev => [...prev, aiMsg]);
                }
            }
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                const errMsg: ConversationMessage = {
                    id: Date.now() + 1,
                    type: 'received',
                    content: '⚠️ Gagal menghubungi AI. Pastikan backend berjalan.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    reactions: { likes: 0, dislikes: 0 },
                };
                setMessages(prev => [...prev, errMsg]);
            }
        } finally {
            setIsTyping(false);
            abortRef.current = null;
        }
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
