import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { ThumbsUp, ThumbsDown, MoreVertical, FileText, FileCode, FileJson, FileCheck, File, Copy, Check } from 'lucide-react';

export type Message = {
    id: number;
    type: 'sent' | 'received' | 'typing';
    content: string;
    timestamp: string;
    reactions: { likes: number; dislikes: number };
    tool_action?: {
        type: string;
        tool: string;
        action_required?: boolean;
        message?: string;
        app_name?: string;
        result?: string;
    };
};

const MessageBubble: React.FC<{ m: Message; onReact: (id: number, type: 'like' | 'dislike') => void }> = ({ m, onReact }) => {
    const [toolStatus, setToolStatus] = useState<string | null>(null);
    const isUser = m.type === 'sent';
    const isTyping = m.type === 'typing';

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

    // --- TOOL ACTION BUBBLE ---
    // Untuk hasil terbaik: abaikan tool_action.result, hanya tampilkan response (m.content) di bubble AI.
    // Jika ingin konfirmasi (action_required), bisa tambahkan bubble khusus, tapi default: hanya response.
    const renderToolAction = () => {
        if (!m.tool_action) return null;
        // Hanya render konfirmasi jika action_required
        if (m.tool_action.action_required) {
            return (
                <div className="py-2 px-4 rounded-2xl bg-blue-50 text-blue-900 border border-blue-200 shadow-sm flex flex-col gap-2">
                    <span>{m.tool_action.message}</span>
                    <div className="flex gap-2 mt-2">
                        <button
                            className="px-4 py-1 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                            onClick={async () => {
                                setToolStatus('Memproses...');
                                try {
                                    const res = await fetch('/api/tools/open_app', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ app_name: m.tool_action?.app_name, confirm: true })
                                    });
                                    const data = await res.json();
                                    setToolStatus(data.success ? data.message : (data.message || 'Gagal mengeksekusi.'));
                                } catch (e) {
                                    setToolStatus('Gagal terhubung ke backend.');
                                }
                            }}
                        >Ya</button>
                        <button
                            className="px-4 py-1 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                            onClick={() => setToolStatus('Aksi dibatalkan.')}
                        >Tidak</button>
                    </div>
                </div>
            );
        }
        // Default: tidak render apapun untuk tool_action.result
        return null;
    };

    return (
        <div key={m.id} className={`mb-4 ${isUser ? 'flex justify-end' : 'flex justify-start'} animate-fadein`}>
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
                        {/* Jika message bertipe 'typing' tampilkan indikator mengetik */}
                        {isTyping ? (
                            <div className="py-2 px-4 rounded-2xl bg-gray-100 text-gray-700 flex items-center gap-3">
                                <div className="typing-dots">
                                    <span />
                                    <span />
                                    <span />
                                </div>
                                <span className="text-xs text-gray-500">Mengetik...</span>
                            </div>
                        ) : (
                            <>
                                {/* Bubble konfirmasi tool-action (jika ada) */}
                                {renderToolAction()}
                                {/* Bubble utama: selalu tampilkan response (m.content) */}
                                <div className="py-2 px-4 rounded-2xl bg-gray-100 text-gray-800">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeHighlight]}
                                        components={{ code: CodeRenderer }}
                                    >
                                        {m.content}
                                    </ReactMarkdown>
                                </div>
                            </>
                        )}

                        {/* Reactions + timestamp sejajar untuk AI (sembunyikan saat typing) */}
                        {!isTyping && (
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                <span>{m.timestamp}</span>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => onReact(m.id, 'like')} className={`p-2 rounded-md ${m.reactions.likes > 0 ? 'text-green-500 bg-green-500/10' : 'text-gray-500 hover:bg-gray-200'} transition-colors`} title="Like response">
                                        <ThumbsUp size={14} />
                                    </button>
                                    <span className="text-xs">{m.reactions.likes > 0 ? 1 : ''}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => onReact(m.id, 'dislike')} className={`p-2 rounded-md ${m.reactions.dislikes > 0 ? 'text-red-500 bg-red-500/10' : 'text-gray-500 hover:bg-gray-200'} transition-colors`} title="Dislike response">
                                        <ThumbsDown size={14} />
                                    </button>
                                    <span className="text-xs">{m.reactions.dislikes > 0 ? 1 : ''}</span>
                                </div>
                                <button className="ml-2 p-1 rounded text-gray-500 hover:bg-gray-200 transition-colors" title="More options"><MoreVertical size={14} /></button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

// 👇 Tambahkan CSS untuk .typing-dots (bisa ditaruh di file CSS atau dalam tag <style>)
// Jika Anda menggunakan Tailwind, tambahkan ini di global CSS atau component style

// --- START CSS INJECTION (BISA DITAMBAHKAN DI FILE GLOBAl ATAU DALAM TAG STYLE) ---
// Jika Anda ingin inline, gunakan <style> di dalam JSX (tidak disarankan untuk produksi)
// Tapi jika Anda menggunakan Tailwind, pastikan Anda sudah mengaktifkan `@tailwind base`, `@tailwind components`, `@tailwind utilities`

// Alternatif: tambahkan style langsung di dalam komponen (untuk prototyping)
const TypingDotsStyle = () => {
    return null;
};

// Gunakan di dalam komponen jika tidak bisa inject CSS global
// Atau lebih baik: tambahkan ke file CSS global Anda!

export default MessageBubble;