import React, { useState, useRef, useEffect } from 'react';
import { Plus, Mic, Send, X, Paperclip } from 'lucide-react'; 

// NOTE: Tambahkan fungsi handleVoiceInput di komponen parent (Chat.tsx) lo

const ChatInput: React.FC<{
    inputMessage: string;
    setInputMessage: (v: string) => void;
    handleSendMessage: (e: React.FormEvent) => void;
    handleVoiceInput: () => void;
    stopGeneration: () => void;
    isTyping: boolean;
    suggestions?: string[];
    filteredSuggestions?: string[];
    setFilteredSuggestions?: (s: string[]) => void;
    isNewConversation?: boolean;
}> = ({ inputMessage, setInputMessage, handleSendMessage, handleVoiceInput, stopGeneration, isTyping, suggestions = [], filteredSuggestions = [], setFilteredSuggestions, isNewConversation = false }) => {

    // Auto-resize textarea
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputMessage(e.target.value);
        if (setFilteredSuggestions) {
            const q = e.target.value.trim().toLowerCase();
            // setFilteredSuggestions(q ? suggestions.filter(s => s.toLowerCase().includes(q)) : suggestions);
        }
    };

    // Logika Auto-Resize Textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [inputMessage]);


    // --- 1. Mode New Conversation (Multi-baris seperti History) ---
    if (isNewConversation) {
        // Kita gunakan layout yang sama dengan history chat (kotak tumpul)
        // tapi dengan tombol Mic dan Paperclip tambahan
        return (
            <form onSubmit={handleSendMessage} className="relative">
                {/* CONTAINER UTAMA: Maksimal lebar 4xl untuk new chat area + centering */}
                <div className="flex items-end w-full max-w-4xl mx-auto">
                    
                    <div className="flex-1">
                        <div className={
                            // Styling Kotak Tumpul Multi-baris (Bukan Pil Penuh)
                            `flex items-end w-full p-4 rounded-2xl transition-colors shadow-lg
                            bg-white border border-gray-300 focus-within:border-blue-500 focus-within:shadow-md`
                        }>
                            {/* Tombol PLUS (Kiri) */}
                            <button 
                                type="button" 
                                className="mr-3 text-gray-500 p-1.5 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0" 
                                title="Add Files"
                            >
                                <Plus size={20} />
                            </button>
                            
                            {/* TEXTAREA (Pusat) */}
                            <textarea
                                ref={textareaRef} // Gunakan ref yang sama untuk resize
                                autoFocus
                                value={inputMessage}
                                onChange={onInputChange}
                                placeholder="Ask anything — e.g. 'How to debug memory leaks?'"
                                // Styling untuk perataan yang sama
                                className="flex-1 bg-transparent outline-none border-0 pt-2 pb-0.5 leading-6 text-gray-800 placeholder:text-gray-500 text-base resize-none max-h-60"
                                rows={1}
                                style={{ overflowY: 'hidden' }}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                            />
                            
                            

                            {/* Tombol Send (Kanan, Hitam) */}
                            <div className="flex-shrink-0 ml-3">
                                <button 
                                    type="submit" 
                                    disabled={!inputMessage.trim()} 
                                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-150 ${
                                        inputMessage.trim() ? 'bg-black text-white hover:opacity-90' : 'bg-gray-200 text-gray-500 opacity-60 cursor-not-allowed'
                                    }`}
                                >
                                    <Send size={20} />
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Suggestions (Dipertahankan di New Chat) */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-4xl mx-auto">
                    {(filteredSuggestions.length > 0 ? filteredSuggestions : suggestions).slice(0, 6).map((sug) => (
                        <button key={sug} type="button" onClick={() => setInputMessage(sug)} className="text-left px-4 py-2 rounded-md bg-theme-surface border border-theme-primary-dark/8 hover:bg-theme-primary/5 transition-colors">{sug}</button>
                    ))}
                </div>
            </form>
        );
    }

    // --- 2. Mode Active Chat Input (Melebar, Multi-baris, Icon di Dalam, Ikon di Dasar) --- (Kode yang sudah di-fix)
    return (
        <form onSubmit={handleSendMessage} className="relative">
            {/* CONTAINER UTAMA: Hanya untuk centering/lebar */}
            <div className="flex items-end w-full max-w-3xl mx-auto">
                
                {/* INPUT FIELD CONTAINER: Flex utama. KEMBALI KE items-end */}
                <div className="flex-1">
                    <div className={
                        // Ikon akan menempel di bawah
                        `flex items-end w-full p-4 rounded-2xl transition-colors shadow-lg
                        bg-white border border-gray-300 focus-within:border-blue-500 focus-within:shadow-md
                        dark:bg-gray-800 dark:border-gray-700`
                    }>
                        
                        {/* 1. Icon PLUS (Kiri) */}
                        <button 
                            type="button" 
                            className="mr-3 text-gray-500 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0" 
                            title="Add Files"
                        >
                            <Plus size={20} />
                        </button>
                        
                        {/* 2. TEXTAREA (Pusat, Meregang) */}
                        <textarea
                            ref={textareaRef}
                            value={inputMessage}
                            onChange={onInputChange}
                            placeholder="Message the AI..."
                            className="flex-1 bg-transparent outline-none border-0 pt-2 pb-0.5 leading-6 text-gray-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-base resize-none max-h-60"
                            rows={1}
                            style={{ overflowY: 'hidden' }}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                        />
                        
                        {/* 3. Icon SEND/MIC/STOP (Kanan) */}
                        <div className="flex-shrink-0 ml-4">
                            {isTyping ? (
                                <button type="button" onClick={stopGeneration} className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-md hover:bg-gray-800 transition-colors" title="Stop generation" aria-label="Stop AI"><X size={16} /></button>
                            ) : (
                                <button 
                                    type={inputMessage.trim() ? 'submit' : 'button'} 
                                    onClick={inputMessage.trim() ? undefined : handleVoiceInput} 
                                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-150 ${'bg-black text-white hover:opacity-90'}`} 
                                    title={inputMessage.trim() ? 'Send message' : 'Voice input'} 
                                    aria-label={inputMessage.trim() ? 'Send message' : 'Voice input'}
                                >
                                    {inputMessage.trim() ? <Send size={16} /> : <Mic size={16} />}
                                </button>
                            )}
                        </div>

                    </div>
                </div>

            </div>
            <div className="mt-3 text-[10px] text-gray-500 text-center leading-4">AI responses may vary. Verify critical information.</div>
        </form>
    );
}

export default ChatInput;