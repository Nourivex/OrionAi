import React from 'react';
import { Link } from 'react-router-dom';
import { Music, List, Image, Repeat, Palette, QrCode } from 'lucide-react';

const tools = [
    // Struktur data tools tetap sama
    { id: 'media-player', title: 'Media Player', desc: 'Play audio and video files quickly.', icon: Music, path: '/tools/media-player' },
    { id: 'todo-list', title: 'Todo List', desc: 'Manage tasks and track progress.', icon: List, path: '/tools/todo-list' },
    { id: 'mood-board', title: 'Mood Board', desc: 'Quick scratchpad for ideas and visuals.', icon: Image, path: '/tools/mood-board' },
    { id: 'unit-converter', title: 'Unit Converter', desc: 'Convert units like length, mass, and temperature.', icon: Repeat, path: '/tools/unit-converter' },
    { id: 'color-picker', title: 'Color Picker', desc: 'Pick colors and generate palettes (HEX/RGB).', icon: Palette, path: '/tools/color-picker' },
    { id: 'qr-generator', title: 'QR Generator', desc: 'Generate QR codes from URLs or text.', icon: QrCode, path: '/tools/qr-generator' }
];

const Tools: React.FC = () => {
    return (
        <div className="p-6 md:p-10 bg-theme-bg min-h-screen">
            <div className="max-w-7xl mx-auto">
                
                {/* 1. HEADER IMPROVEMENT */}
                <h1 className="text-4xl font-extrabold mb-2 text-theme-primary">🛠️ Utilities Hub</h1>
                <p className="text-lg text-theme-text/70 mb-8 max-w-2xl">A curated collection of productivity and creative tools integrated seamlessly into your workflow.</p>

                {/* 2. CARD GRID (GRID DITINGKATKAN) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tools.map(t => {
                        const Icon = t.icon;
                        return (
                            <Link 
                                to={t.path} 
                                key={t.id} 
                                // CARD STYLE V2: Shadow, Border, dan Transform di Hover
                                className={`
                                    group block p-6 h-full 
                                    bg-theme-surface border border-theme-primary-dark/10 rounded-xl 
                                    shadow-lg hover:shadow-2xl hover:border-theme-primary 
                                    transform hover:scale-[1.01] transition-all duration-300 relative
                                `}
                            >
                                {/* ICON & TITLE */}
                                <div className="flex flex-col items-start">
                                    {/* Icon Container: Lebih besar, solid, dan gradien */}
                                    <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-tr from-theme-primary to-theme-accent flex items-center justify-center text-white shadow-xl">
                                        <Icon size={24} />
                                    </div>
                                    
                                    {/* Title */}
                                    <h2 className="text-xl font-bold mb-2 text-theme-text group-hover:text-theme-primary transition-colors">
                                        {t.title}
                                    </h2>
                                    
                                    {/* Description */}
                                    <p className="text-sm text-theme-text/70">
                                        {t.desc}
                                    </p>
                                </div>
                                
                                {/* Overlay/Indicator (Opsional, memberikan efek "Open" modern) */}
                                <div className="absolute bottom-4 right-4 text-theme-primary/60 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                    Open →
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Tools;