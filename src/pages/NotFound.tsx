import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Small accessibility focus when component mounts
    const el = document.getElementById('notfound-heading');
    if (el) (el as HTMLElement).focus();
  }, []);

  const handleBack = () => {
    try {
      if (window.history.length > 1) {
        navigate(-1);
        return;
      }
    } catch (e) {
      // ignore
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--theme-bg)' }}>
      <div className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl p-6 md:p-12 animate-fadeIn" style={{ background: 'linear-gradient(135deg, var(--theme-surface), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Illustration */}
          <div className="flex-shrink-0 flex items-center justify-center w-full md:w-1/3">
            <div className="relative">
              <div className="w-56 h-56 md:w-64 md:h-64 rounded-xl flex items-center justify-center animate-float" style={{ backgroundColor: 'var(--theme-surface)' }}>
                {/* Simple robot SVG */}
                <svg width="140" height="140" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-lg">
                  <rect x="8" y="14" width="48" height="36" rx="6" fill="var(--theme-primary)" />
                  <rect x="18" y="22" width="28" height="18" rx="3" fill="var(--theme-bg)" />
                  <circle cx="26" cy="31" r="2.6" fill="var(--theme-primary)" />
                  <circle cx="38" cy="31" r="2.6" fill="var(--theme-primary)" />
                  <rect x="28" y="36" width="8" height="2" rx="1" fill="var(--theme-primary)" />
                  <rect x="28" y="10" width="8" height="6" rx="2" fill="var(--theme-primary)" />
                  <circle cx="32" cy="12" r="1.2" fill="var(--theme-bg)" />
                </svg>
              </div>

              {/* Stars */}
              <div className="absolute -top-3 -left-4 opacity-80 animate-pulseStar">
                <div className="w-3 h-3 rounded-full bg-white/90" />
              </div>
              <div className="absolute -bottom-3 -right-6 opacity-70 animate-pulseStar animation-delay-200">
                <div className="w-2 h-2 rounded-full bg-white/80" />
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="flex-1 text-center md:text-left">
            <h1 id="notfound-heading" tabIndex={-1} className="text-6xl md:text-8xl font-extrabold leading-tight" style={{ color: 'var(--theme-text)' }}>404</h1>
            <p className="mt-2 text-lg md:text-xl max-w-2xl" style={{ color: 'var(--theme-text)' }}>Halaman tidak ditemukan. Mungkin alamatnya salah atau halaman belum dibuat.</p>

            <div className="mt-6 flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md font-semibold transition-shadow shadow-md"
                style={{ backgroundColor: 'var(--theme-primary)', color: 'var(--theme-onPrimary)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--theme-primary-light)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--theme-primary)'; }}
              >
                Kembali
              </button>

              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md transition-all"
                style={{ border: '1px solid var(--theme-primary)', color: 'var(--theme-primary)' }}
              >
                Beranda
              </Link>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="ml-0 sm:ml-3 text-sm text-slate-300 hover:text-white transition-colors"
              >
                Scroll to top
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-400">If you think this is an error, contact the admin or try returning to the homepage.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
