import React, { useState, useEffect } from 'react';
import { UploadCloud, Folder, FileText, Globe, Zap, Trash2, Settings2, Loader2, Plus, X } from 'lucide-react';
import { getMemoryItems, createMemoryItem, deleteMemoryItem, MemoryItem } from '../api/api';

const MemoryBank: React.FC = () => {
    const [items, setItems] = useState<MemoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', type: 'Text', size: '', source: '' });

    // Load data dari backend
    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        setIsLoading(true);
        try {
            const data = await getMemoryItems();
            setItems(data);
        } catch (err) {
            console.error('Failed to load memory items:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddItem = async () => {
        if (!newItem.name.trim()) return;
        try {
            await createMemoryItem({
                name: newItem.name,
                type: newItem.type,
                size: newItem.size || 'N/A',
                source: newItem.source || 'Manual Entry',
                status: 'Pending',
            });
            setNewItem({ name: '', type: 'Text', size: '', source: '' });
            setShowAddModal(false);
            loadItems();
        } catch (err) {
            console.error('Failed to add item:', err);
        }
    };

    const handleDeleteItem = async (id: number) => {
        if (!confirm('Hapus item ini?')) return;
        try {
            await deleteMemoryItem(id);
            loadItems();
        } catch (err) {
            console.error('Failed to delete item:', err);
        }
    };

    // --- Data Statistik Cepat ---
    const totalItems = items.length;
    const indexedCount = items.filter(item => item.status === 'Indexed').length;
    const totalSize = items.reduce((acc, item) => {
        const num = parseFloat(item.size) || 0;
        return acc + num;
    }, 0);

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
                        <h3 className="text-2xl font-extrabold">{totalSize > 0 ? `${totalSize.toFixed(1)} MB` : 'N/A'}</h3>
                    </div>
                </div>
                
                {/* 2. ACTIONS & FILTER */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Knowledge Sources ({totalItems})</h2>
                    <div className="flex space-x-3">
                        <button 
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-theme-primary text-white rounded-lg font-medium shadow-md hover:bg-theme-primary-dark transition-colors"
                        >
                            <Plus size={18} />
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

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-theme-primary" />
                        </div>
                    )}

                    {/* Baris Dokumen */}
                    {!isLoading && items.map(item => (
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
                                    item.status === 'Indexed' ? 'bg-green-100 text-green-700' : item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {item.status}
                                </span>
                            </span>
                            
                            {/* Size */}
                            <span className="text-sm">{item.size}</span>

                            {/* Actions */}
                            <div className="text-right space-x-2">
                                <button title="Settings" className="p-1 rounded hover:bg-theme-bg/10 text-theme-text/70"><Settings2 size={16} /></button>
                                <button 
                                    title="Delete" 
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="p-1 rounded hover:bg-red-100 text-red-500"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {!isLoading && items.length === 0 && (
                         <p className="p-6 text-center text-theme-text/60">No sources added yet. Start by adding a document or link!</p>
                    )}
                </div>
            </main>

            {/* ADD MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-theme-surface rounded-xl shadow-2xl w-full max-w-md p-6 relative">
                        <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-theme-text/60 hover:text-theme-text">
                            <X size={20} />
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-theme-primary">Add New Source</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    value={newItem.name}
                                    onChange={e => setNewItem(n => ({ ...n, name: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-lg border border-theme-primary-dark/20 bg-theme-bg focus:ring-2 focus:ring-theme-primary outline-none"
                                    placeholder="Project Documentation"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select
                                    value={newItem.type}
                                    onChange={e => setNewItem(n => ({ ...n, type: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-lg border border-theme-primary-dark/20 bg-theme-bg focus:ring-2 focus:ring-theme-primary outline-none"
                                >
                                    <option value="Text">Text</option>
                                    <option value="PDF">PDF</option>
                                    <option value="Folder">Folder</option>
                                    <option value="Link">Link</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Source</label>
                                <input
                                    type="text"
                                    value={newItem.source}
                                    onChange={e => setNewItem(n => ({ ...n, source: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-lg border border-theme-primary-dark/20 bg-theme-bg focus:ring-2 focus:ring-theme-primary outline-none"
                                    placeholder="Local Upload, URL, Manual Entry"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Size (optional)</label>
                                <input
                                    type="text"
                                    value={newItem.size}
                                    onChange={e => setNewItem(n => ({ ...n, size: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-lg border border-theme-primary-dark/20 bg-theme-bg focus:ring-2 focus:ring-theme-primary outline-none"
                                    placeholder="5 MB"
                                />
                            </div>
                            <button
                                onClick={handleAddItem}
                                className="w-full py-2 bg-theme-primary text-white rounded-lg font-medium hover:bg-theme-primary-dark transition-colors"
                            >
                                Add Source
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemoryBank;