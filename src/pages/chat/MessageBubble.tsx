import React from 'react';
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { ThumbsUp, ThumbsDown, MoreVertical, FileText, FileCode, FileJson, FileCheck, File, Copy, Check } from 'lucide-react';

export type Message = {
    id: number;
    type: 'sent' | 'received';
    content: string;
    timestamp: string;
    reactions: { likes: number; dislikes: number };
};

const MessageBubble: React.FC<{ m: Message; onReact: (id: number, type: 'like' | 'dislike') => void }> = ({ m, onReact }) => {
    const isUser = m.type === 'sent';

        // Helper: map language ke ikon & warna
        const getLanguageIcon = (lang: string | null) => {
            if (!lang) return { icon: FileText, color: 'text-gray-500', bgColor: 'bg-gray-100' };
            const langLower = lang.toLowerCase();
            switch (langLower) {
                case 'javascript':
                case 'js':
                    return { icon: FileCode, color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
                case 'typescript':
                case 'ts':
                    return { icon: FileCode, color: 'text-blue-600', bgColor: 'bg-blue-50' };
                case 'python':
                case 'py':
                    return { icon: FileCode, color: 'text-green-600', bgColor: 'bg-green-50' };
                case 'html':
                    return { icon: FileCode, color: 'text-orange-600', bgColor: 'bg-orange-50' };
                case 'css':
                    return { icon: FileCode, color: 'text-blue-500', bgColor: 'bg-blue-50' };
                case 'json':
                    return { icon: FileJson, color: 'text-purple-600', bgColor: 'bg-purple-50' };
                case 'bash':
                case 'sh':
                    return { icon: FileCheck, color: 'text-emerald-600', bgColor: 'bg-emerald-50' };
                default:
                    return { icon: File, color: 'text-gray-500', bgColor: 'bg-gray-100' };
            }
        };

        // Code block renderer ala Qwen/modern
        const CodeRenderer = ({ node, inline, className, children, ...props }: any) => {
            const [copied, setCopied] = useState(false);
            const match = /language-(\w+)/.exec(className || "");
            const lang = match ? match[1] : null;

            // Deteksi filename dari komentar di baris pertama
            let filename = '';
            if (Array.isArray(children) && typeof children[0] === 'string') {
                const firstLine = children[0].split('\n')[0].trim();
                const fileMatch = firstLine.match(/^([#\/\-]+)\s*([\w\-.]+\.(py|js|ts|html|css|sh|bash|json|md|txt))/i);
                if (fileMatch) filename = fileMatch[2];
            }

            const { icon: LangIcon, color, bgColor } = getLanguageIcon(lang);

            if (inline) {
                return (
                    <code
                        className="px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-800 font-mono text-sm"
                        {...props}
                    >
                        {children}
                    </code>
                );
            }

            const handleCopy = () => {
                navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            };

            return (
                <div className="my-6 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                    {/* Header ala Qwen: ramping, ikon + filename, tombol copy melayang */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50">
                        <div className="flex items-center gap-3">
                            <div className={`flex items-center justify-center w-7 h-7 rounded-md ${bgColor} ${color}`}>
                                <LangIcon size={16} />
                            </div>
                            {filename && (
                                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                    {filename}
                                </span>
                            )}
                        </div>

                        {/* Tombol Copy - melayang di kanan, muncul saat hover */}
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 px-2.5 py-1 rounded-md hover:bg-gray-100 transition-colors"
                            aria-label="Copy code"
                        >
                            {copied ? (
                                <>
                                    <Check size={14} className="text-green-500" />
                                    <span className="text-green-500">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={14} />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Body Code */}
                    <pre className="p-4 overflow-x-auto text-sm leading-relaxed bg-white text-gray-800">
                        <code className={`font-mono whitespace-pre ${className}`} {...props}>
                            {children}
                        </code>
                    </pre>
                </div>
            );
        };


    // State untuk expand/collapse bubble user jika terlalu panjang
    const [expanded, setExpanded] = useState(false);
    const MAX_LENGTH = 220;
    const isLong = isUser && m.content.length > MAX_LENGTH;
    const displayContent = isLong && !expanded ? m.content.slice(0, MAX_LENGTH) + '...' : m.content;

    return (
        <div key={m.id} className={`mb-4 ${isUser ? 'flex justify-end' : 'flex justify-start'}`}>
            <div className={`max-w-[80%] md:max-w-[70%] ${isUser ? 'ml-auto' : ''}`}>
                {/* USER BUBBLE: putih, border, text gelap, smart truncate */}
                {isUser ? (
                    <div className="py-2 px-5 rounded-2xl bg-white text-gray-900 border border-gray-200 shadow-sm relative">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={{ code: CodeRenderer }}
                        >
                            {displayContent}
                        </ReactMarkdown>
                        {/* Expand/collapse button jika panjang */}
                        {isLong && (
                            <button
                                className="absolute right-3 bottom-2 text-xs text-blue-500 hover:underline bg-white px-1.5 py-0.5 rounded"
                                onClick={() => setExpanded(e => !e)}
                            >
                                {expanded ? 'Tutup' : 'Lihat lengkap'}
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                    <div className={`py-2 rounded-2xl bg-theme-surface text-theme-text`}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={{ code: CodeRenderer }}
                        >
                            {m.content}
                        </ReactMarkdown>
                    </div>
                    {/* Reactions + timestamp sejajar untuk AI */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-theme-text/60">
                        <span>{m.timestamp}</span>
                        <div className="flex items-center gap-1">
                            <button onClick={() => onReact(m.id, 'like')} className={`p-2 rounded-md ${m.reactions.likes > 0 ? 'text-green-500 bg-green-500/10' : 'text-theme-text/60 hover:bg-theme-surface/40 hover:text-theme-primary'} transition-colors`} title="Like response">
                                <ThumbsUp size={14} />
                            </button>
                            <span className="text-xs">{m.reactions.likes > 0 ? 1 : ''}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => onReact(m.id, 'dislike')} className={`p-2 rounded-md ${m.reactions.dislikes > 0 ? 'text-red-500 bg-red-500/10' : 'text-theme-text/60 hover:bg-theme-surface/40 hover:text-theme-accent'} transition-colors`} title="Dislike response">
                                <ThumbsDown size={14} />
                            </button>
                            <span className="text-xs">{m.reactions.dislikes > 0 ? 1 : ''}</span>
                        </div>
                        <button className="ml-2 p-1 rounded text-theme-text/60 hover:bg-theme-surface/60 transition-colors" title="More options"><MoreVertical size={14} /></button>
                    </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;