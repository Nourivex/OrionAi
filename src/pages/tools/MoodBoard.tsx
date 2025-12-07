import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Move, Type, Image as ImageIcon, Palette, Download, Undo } from 'lucide-react';

interface Note {
  id: number;
  type: 'text' | 'image';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

const colors = ['#fef3c7', '#fce7f3', '#dbeafe', '#d1fae5', '#f3e8ff', '#fed7aa'];

const MoodBoard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('orion-moodboard');
    return saved ? JSON.parse(saved) : [];
  });
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('orion-moodboard', JSON.stringify(notes));
  }, [notes]);

  const addTextNote = () => {
    const newNote: Note = {
      id: Date.now(),
      type: 'text',
      content: 'Double-click to edit...',
      x: 50 + Math.random() * 200,
      y: 50 + Math.random() * 200,
      width: 200,
      height: 120,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setNotes([...notes, newNote]);
  };

  const addImageNote = (imageUrl: string) => {
    const newNote: Note = {
      id: Date.now(),
      type: 'image',
      content: imageUrl,
      x: 50 + Math.random() * 200,
      y: 50 + Math.random() * 200,
      width: 200,
      height: 200,
      color: '#ffffff',
    };
    setNotes([...notes, newNote]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          addImageNote(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const updateNote = (id: number, updates: Partial<Note>) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const handleMouseDown = (e: React.MouseEvent, id: number) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    setDragging(id);
    setDragOffset({
      x: e.clientX - note.x,
      y: e.clientY - note.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging === null || !boardRef.current) return;
    
    const rect = boardRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 200));
    const y = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 120));
    
    updateNote(dragging, { x, y });
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const clearBoard = () => {
    if (confirm('Clear all notes from the board?')) {
      setNotes([]);
    }
  };

  const handleTextEdit = (id: number, content: string) => {
    updateNote(id, { content });
  };

  return (
    <div className="p-6 bg-theme-bg min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/tool" className="p-2 rounded-lg hover:bg-theme-surface/60 transition-colors text-theme-text/70 hover:text-theme-text">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-theme-text">Mood Board</h1>
              <p className="text-sm text-theme-text/60">Free canvas for ideas and visuals</p>
            </div>
          </div>
          
          {/* Toolbar */}
          <div className="flex items-center gap-2">
            <button
              onClick={addTextNote}
              className="flex items-center gap-2 px-3 py-2 bg-theme-surface/60 hover:bg-theme-surface border border-theme-primary-dark/10 rounded-xl text-theme-text transition-colors"
              title="Add Text Note"
            >
              <Type size={18} />
              <span className="hidden sm:inline text-sm">Add Note</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 bg-theme-surface/60 hover:bg-theme-surface border border-theme-primary-dark/10 rounded-xl text-theme-text transition-colors"
              title="Add Image"
            >
              <ImageIcon size={18} />
              <span className="hidden sm:inline text-sm">Add Image</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={clearBoard}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-500 transition-colors"
              title="Clear Board"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={boardRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="relative w-full h-[70vh] bg-theme-surface/20 border-2 border-dashed border-theme-primary-dark/20 rounded-2xl overflow-hidden"
          style={{ 
            backgroundImage: 'radial-gradient(circle, var(--theme-primary-dark) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        >
          {notes.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-theme-text/30">
              <Palette size={48} className="mb-4" />
              <p className="text-lg">Your mood board is empty</p>
              <p className="text-sm">Add notes or images to get started</p>
            </div>
          )}

          {notes.map((note) => (
            <div
              key={note.id}
              style={{
                position: 'absolute',
                left: note.x,
                top: note.y,
                width: note.width,
                minHeight: note.height,
                backgroundColor: note.color,
                cursor: dragging === note.id ? 'grabbing' : 'grab',
              }}
              className="rounded-lg shadow-lg border border-black/10 group"
            >
              {/* Drag Handle */}
              <div
                onMouseDown={(e) => handleMouseDown(e, note.id)}
                className="absolute top-0 left-0 right-0 h-6 flex items-center justify-center cursor-grab bg-black/5 rounded-t-lg"
              >
                <Move size={12} className="text-black/30" />
              </div>

              {/* Delete Button */}
              <button
                onClick={() => deleteNote(note.id)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              >
                <Trash2 size={12} />
              </button>

              {/* Content */}
              <div className="p-3 pt-8">
                {note.type === 'text' ? (
                  <textarea
                    value={note.content}
                    onChange={(e) => handleTextEdit(note.id, e.target.value)}
                    className="w-full h-full min-h-[80px] bg-transparent resize-none outline-none text-gray-800 text-sm"
                    placeholder="Type something..."
                  />
                ) : (
                  <img
                    src={note.content}
                    alt="Mood board image"
                    className="w-full h-full object-cover rounded"
                    draggable={false}
                  />
                )}
              </div>

              {/* Color Picker */}
              {note.type === 'text' && (
                <div className="absolute bottom-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateNote(note.id, { color: c })}
                      className="w-4 h-4 rounded-full border border-black/20"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-4 text-center text-sm text-theme-text/40">
          {notes.length} item{notes.length !== 1 ? 's' : ''} on board • Drag to move • Double-click text to edit
        </div>
      </div>
    </div>
  );
};

export default MoodBoard;
