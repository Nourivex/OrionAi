import React, { useState } from 'react';
import { UploadCloud, Folder, FileText, Globe, Zap, Trash2, Settings2 } from 'lucide-react';

// Data simulasi untuk demonstrasi
const mockData = [
    { id: 1, name: 'Project Zeus Documentation', type: 'Folder', size: '1.2 GB', source: 'Local Upload', status: 'Indexed' },
    { id: 2, name: 'Lycus-Coding-Styles.pdf', type: 'PDF', size: '5 MB', source: 'Local Upload', status: 'Error' },
    { id: 3, name: 'API Reference v3', type: 'Link', size: 'N/A', source: 'https://api.ref', status: 'Indexed' },
    { id: 4, name: 'Personal Notes Q4', type: 'Text', size: '100 KB', source: 'Manual Entry', status: 'Indexed' },
];

const MemoryBank: React.FC = () => {
    // --- Data Statistik Cepat ---
    const totalItems = mockData.length;
    const totalSize = mockData.reduce((acc, item) => acc + (parseInt(item.size) || 0), 0);
    const indexedCount = mockData.filter(item => item.status === 'Indexed').length;

    return (
        <div className="min-h-screen bg-theme-bg text-theme-text flex flex-col">
            
            {/* HEADER (Minimalis & Tegas) */}
            <header className="sticky top-0 z-20 bg-theme-bg/95 backdrop-blur-sm shadow-sm border-b border-theme-primary-dark/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-3xl font-bold text-theme-primary">🧠 Memory Bank</h1>
                    <p className="text-sm text-theme-text/70 mt-1">Manage and connect knowledge sources for the AI assistant.</p>
                </div>
            </header>
            
            {/* MAIN CONTENT */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                
                {/* 1. STATUS CARDS (Dashboard Mini) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-theme-surface p-6 rounded-xl shadow-md border border-theme-primary-dark/10">
                        <Zap className="w-6 h-6 text-theme-accent mb-2" />
                        <p className="text-sm text-theme-text/70">Total Sources</p>
                        <h3 className="text-2xl font-extrabold">{totalItems}</h3>
                    </div>
                    <div className="bg-theme-surface p-6 rounded-xl shadow-md border border-theme-primary-dark/10">
                        <FileText className="w-6 h-6 text-theme-primary mb-2" />
                        <p className="text-sm text-theme-text/70">Indexed & Ready</p>
                        <h3 className="text-2xl font-extrabold">{indexedCount}</h3>
                    </div>
                    <div className="bg-theme-surface p-6 rounded-xl shadow-md border border-theme-primary-dark/10">
                        <Folder className="w-6 h-6 text-theme-text/50 mb-2" />
                        <p className="text-sm text-theme-text/70">Storage Used (Approx)</p>
                        <h3 className="text-2xl font-extrabold">{mockData.find(m => m.id === 1)?.size}</h3> {/* Menggunakan data simulasi */}
                    </div>
                </div>
                
                {/* 2. ACTIONS & FILTER */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Knowledge Sources ({totalItems})</h2>
                    <div className="flex space-x-3">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-theme-primary text-white rounded-lg font-medium shadow-md hover:bg-theme-primary-dark transition-colors">
                            <UploadCloud size={18} />
                            <span>Add New Source</span>
                        </button>
                    </div>
                </div>
                
                {/* 3. DOCUMENT LIST (Modern Table Layout) */}
                <div className="bg-theme-surface rounded-xl shadow-xl overflow-hidden border border-theme-primary-dark/10">
                    
                    {/* Header Tabel */}
                    <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-3 border-b bg-theme-bg/5 text-sm font-semibold text-theme-text/70">
                        <span className="col-span-2">Name / Type</span>
                        <span>Source</span>
                        <span>Status</span>
                        <span>Size</span>
                        <span className="text-right">Actions</span>
                    </div>

                    {/* Baris Dokumen */}
                    {mockData.map(item => (
                        <div key={item.id} className="grid grid-cols-6 gap-4 items-center px-6 py-4 border-b border-theme-primary-dark/5 hover:bg-theme-bg/5 transition-colors">
                            
                            {/* Nama & Ikon */}
                            <div className="col-span-2 flex items-center space-x-3">
                                <div className="p-2 rounded-full bg-theme-primary/10 text-theme-primary">
                                    {item.type === 'Folder' ? <Folder size={18} /> : item.type === 'Link' ? <Globe size={18} /> : <FileText size={18} />}
                                </div>
                                <div>
                                    <p className="font-medium truncate">{item.name}</p>
                                    <p className="text-xs text-theme-text/60">{item.type}</p>
                                </div>
                            </div>
                            
                            {/* Source */}
                            <span className="truncate text-sm">{item.source}</span>
                            
                            {/* Status */}
                            <span className="text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    item.status === 'Indexed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {item.status}
                                </span>
                            </span>
                            
                            {/* Size */}
                            <span className="text-sm">{item.size}</span>

                            {/* Actions */}
                            <div className="text-right space-x-2">
                                <button title="Settings" className="p-1 rounded hover:bg-theme-bg/10 text-theme-text/70"><Settings2 size={16} /></button>
                                <button title="Delete" className="p-1 rounded hover:bg-red-100 text-red-500"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                    
                    {mockData.length === 0 && (
                         <p className="p-6 text-center text-theme-text/60">No sources added yet. Start by adding a document or link!</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MemoryBank;