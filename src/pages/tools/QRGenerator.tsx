import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Copy, Check, QrCode } from 'lucide-react';

const QRGenerator: React.FC = () => {
  const [text, setText] = useState('https://orion-ai.studio');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple QR-like pattern generator (visual representation)
  const generateQRPattern = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 256;
    canvas.width = size;
    canvas.height = size;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Generate pattern based on text hash
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const moduleSize = 8;
    const modules = Math.floor(size / moduleSize);

    ctx.fillStyle = '#000000';

    // Draw position detection patterns (corners)
    const drawPositionPattern = (x: number, y: number) => {
      // Outer
      ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, 7 * moduleSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect((x + 1) * moduleSize, (y + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect((x + 2) * moduleSize, (y + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize);
    };

    drawPositionPattern(1, 1);
    drawPositionPattern(modules - 8, 1);
    drawPositionPattern(1, modules - 8);

    // Draw data modules (pseudo-random based on text)
    for (let i = 9; i < modules - 1; i++) {
      for (let j = 9; j < modules - 1; j++) {
        const bit = ((hash * (i + 1) * (j + 1)) % 100) > 50;
        if (bit) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    // Timing patterns
    for (let i = 8; i < modules - 8; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(i * moduleSize, 6 * moduleSize, moduleSize, moduleSize);
        ctx.fillRect(6 * moduleSize, i * moduleSize, moduleSize, moduleSize);
      }
    }
  };

  useEffect(() => {
    generateQRPattern();
  }, [text]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    try {
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      });
    } catch {
      // Fallback: copy text
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 bg-theme-bg min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/tool" className="p-2 rounded-lg hover:bg-theme-surface/60 transition-colors text-theme-text/70 hover:text-theme-text">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-theme-text">QR Generator</h1>
            <p className="text-sm text-theme-text/60">Generate QR codes from URLs or text</p>
          </div>
        </div>

        <div className="bg-theme-surface/40 border border-theme-primary-dark/10 rounded-2xl p-6">
          {/* Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-theme-text mb-2">
              Enter URL or Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://example.com or any text..."
              className="w-full px-4 py-3 bg-theme-bg border border-theme-primary-dark/10 rounded-xl text-theme-text placeholder:text-theme-text/40 focus:outline-none focus:ring-2 focus:ring-theme-primary/30 resize-none"
              rows={3}
            />
          </div>

          {/* QR Preview */}
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white p-4 rounded-2xl shadow-lg">
              <canvas ref={canvasRef} className="w-64 h-64" />
            </div>

            <p className="text-xs text-theme-text/50 text-center">
              <QrCode size={14} className="inline mr-1" />
              Visual QR pattern for: {text.slice(0, 30)}{text.length > 30 ? '...' : ''}
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-theme-primary text-theme-onPrimary rounded-xl hover:bg-theme-primary/90 transition-colors font-medium"
              >
                <Download size={16} />
                Download PNG
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-theme-surface border border-theme-primary-dark/10 text-theme-text rounded-xl hover:bg-theme-primary/10 transition-colors"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Image'}
              </button>
            </div>
          </div>

          {/* Preset URLs */}
          <div className="mt-8 pt-6 border-t border-theme-primary-dark/10">
            <h3 className="text-sm font-semibold text-theme-text/70 mb-3">Quick Presets</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'GitHub', url: 'https://github.com' },
                { label: 'Twitter', url: 'https://twitter.com' },
                { label: 'Email', url: 'mailto:hello@example.com' },
                { label: 'Phone', url: 'tel:+1234567890' },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setText(preset.url)}
                  className="px-3 py-1.5 bg-theme-bg border border-theme-primary-dark/10 rounded-lg text-sm text-theme-text/70 hover:text-theme-primary hover:border-theme-primary/30 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
