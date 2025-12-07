import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, RefreshCw } from 'lucide-react';

const ColorPicker: React.FC = () => {
  const [color, setColor] = useState('#6366f1');
  const [copied, setCopied] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);

  // Generate color palette
  const generatePalette = () => {
    const newPalette: string[] = [];
    
    // Generate variations
    for (let i = 0; i < 6; i++) {
      const hue = Math.floor(Math.random() * 360);
      const sat = 60 + Math.floor(Math.random() * 30);
      const light = 40 + Math.floor(Math.random() * 30);
      newPalette.push(`hsl(${hue}, ${sat}%, ${light}%)`);
    }
    setPalette(newPalette);
  };

  useEffect(() => {
    generatePalette();
  }, []);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
      : '';
  };

  const hexToHsl = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-6 bg-theme-bg min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/tool" className="p-2 rounded-lg hover:bg-theme-surface/60 transition-colors text-theme-text/70 hover:text-theme-text">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-theme-text">Color Picker</h1>
            <p className="text-sm text-theme-text/60">Pick colors and generate palettes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Color Picker */}
          <div className="bg-theme-surface/40 border border-theme-primary-dark/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-theme-text mb-4">Pick a Color</h2>
            
            <div className="flex flex-col items-center gap-4">
              {/* Color Preview */}
              <div 
                className="w-full h-40 rounded-xl shadow-inner border border-theme-primary-dark/10"
                style={{ backgroundColor: color }}
              />
              
              {/* Color Input */}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-12 cursor-pointer rounded-lg"
              />
              
              {/* Color Values */}
              <div className="w-full space-y-3">
                {[
                  { label: 'HEX', value: color.toUpperCase() },
                  { label: 'RGB', value: hexToRgb(color) },
                  { label: 'HSL', value: hexToHsl(color) },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-theme-text/60 w-10">{item.label}</span>
                    <code className="flex-1 px-3 py-2 bg-theme-bg rounded-lg text-sm text-theme-text font-mono">
                      {item.value}
                    </code>
                    <button
                      onClick={() => copyToClipboard(item.value, item.label)}
                      className="p-2 rounded-lg hover:bg-theme-primary/10 transition-colors text-theme-text/60 hover:text-theme-primary"
                    >
                      {copied === item.label ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Palette Generator */}
          <div className="bg-theme-surface/40 border border-theme-primary-dark/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-theme-text">Color Palette</h2>
              <button
                onClick={generatePalette}
                className="flex items-center gap-2 px-3 py-1.5 bg-theme-primary/10 hover:bg-theme-primary/20 rounded-lg text-sm text-theme-primary transition-colors"
              >
                <RefreshCw size={14} />
                Generate
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {palette.map((c, i) => (
                <button
                  key={i}
                  onClick={() => copyToClipboard(c, `palette-${i}`)}
                  className="group relative h-20 rounded-xl shadow-sm border border-theme-primary-dark/10 overflow-hidden transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: c }}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                    <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-mono transition-opacity">
                      {copied === `palette-${i}` ? 'Copied!' : c}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Colors */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-theme-text/70 mb-3">Quick Colors</h3>
              <div className="flex flex-wrap gap-2">
                {['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className="w-8 h-8 rounded-lg border-2 border-transparent hover:border-white shadow-md transition-all hover:scale-110"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
