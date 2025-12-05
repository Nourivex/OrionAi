import React from 'react';
import { Link } from 'react-router-dom';
import { Music, List, Image, Repeat, Palette, QrCode } from 'lucide-react';

// Note: individual tool pages are stubs under `pages/tools/*` — you can replace them with full implementations later.

const tools = [
  { id: 'media-player', title: 'Media Player', desc: 'Play audio and video files quickly.', icon: Music, path: '/tools/media-player' },
  { id: 'todo-list', title: 'Todo List', desc: 'Manage tasks and track progress.', icon: List, path: '/tools/todo-list' },
  { id: 'mood-board', title: 'Mood Board', desc: 'Quick scratchpad for ideas and visuals.', icon: Image, path: '/tools/mood-board' },
  { id: 'unit-converter', title: 'Unit Converter', desc: 'Convert units like length, mass, and temperature.', icon: Repeat, path: '/tools/unit-converter' },
  { id: 'color-picker', title: 'Color Picker', desc: 'Pick colors and generate palettes (HEX/RGB).', icon: Palette, path: '/tools/color-picker' },
  { id: 'qr-generator', title: 'QR Generator', desc: 'Generate QR codes from URLs or text.', icon: QrCode, path: '/tools/qr-generator' }
];

const Tools: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Tools Dashboard</h1>
        <p className="text-sm text-theme-text/70 mb-6">Quick access to utility tools for productivity and creativity.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tools.map(t => {
            const Icon = t.icon;
            return (
              <Link to={t.path} key={t.id} className="group block p-4 bg-theme-surface border border-theme-primary-dark/5 rounded-lg hover:shadow-md transform hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-theme-primary to-theme-accent flex items-center justify-center text-white">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.title}</div>
                    <div className="text-xs text-theme-text/60">{t.desc}</div>
                  </div>
                </div>
                <div className="text-xs text-theme-text/50">Open</div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Tools;
