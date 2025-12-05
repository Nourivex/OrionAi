import React, { useState } from 'react';
import { useTheme, themes as availableThemes } from '../components/ThemeProvider';
// Import ikon yang relevan untuk setiap tab/section
import { Check, Palette, Settings as SettingsIcon, Info, User, Zap } from 'lucide-react'; 

const Settings: React.FC = () => {
  const { themeId, setTheme } = useTheme();
  // Gunakan state untuk menampung tab yang aktif
  const [activeTab, setActiveTab] = useState('appearance');

  const themes = availableThemes;

  // Definisikan struktur navigasi sidebar
  const navItems = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'agent', label: 'AI Agent', icon: Zap }, // Mengganti 'agent' dengan ikon Zap (atau User jika lebih fokus ke persona)
    { id: 'profile', label: 'Profile', icon: User }, // Menambah tab Profile (hipotetis)
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <>
      {/* 1. HEADER: Dibuat lebih sederhana, fokus pada judul */}
      <header className="sticky top-0 z-20 bg-theme-bg/95 backdrop-blur-sm shadow-sm border-b border-theme-primary-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-theme-primary">Settings</h1>
        </div>
      </header>

      <main className={`flex-1 bg-theme-bg text-theme-text`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* 2. MAIN CONTENT LAYOUT: Dibuat Grid (Sidebar + Content) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* 2a. SIDEBAR NAV (Kolom Kiri) */}
            <nav className="md:col-span-3 lg:col-span-2 space-y-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center w-full px-4 py-2 rounded-lg text-left transition-colors duration-200 ${
                      activeTab === item.id
                        ? 'bg-theme-primary/10 text-theme-primary font-semibold'
                        : 'text-theme-text/80 hover:bg-theme-surface/60'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            
            {/* 2b. SECTION CONTENT (Kolom Kanan) */}
            <div className="md:col-span-9 lg:col-span-10">
              <div className="max-w-4xl mx-auto">
                
                {/* RENDER CONTENT SESUAI activeTab */}

                {activeTab === 'appearance' && (
                  <section className="section-card rounded-xl p-8 bg-theme-surface shadow-lg">
                    <h2 className={`text-2xl font-extrabold mb-6 text-theme-primary border-b pb-2 border-theme-primary-dark/20`}>🎨 Appearance</h2>
                    <h3 className="text-lg font-semibold mb-4">Color Themes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {themes.map((t) => {
                          const light = (t as any).previewColors?.light ?? (t as any).colors?.surface ?? '#e5e7eb';
                          const def = (t as any).previewColors?.default ?? (t as any).colors?.background ?? '#d1d5db';
                          const dark = (t as any).previewColors?.dark ?? (t as any).colors?.accent ?? '#9ca3af';
                          return (
                          <button
                            key={t.id}
                            onClick={() => setTheme(t.id)}
                            className={`p-4 rounded-xl border-2 transition-transform duration-300 transform hover:scale-[1.02] shadow-lg text-lg font-medium text-left ${
                                themeId === t.id
                                  ? `bg-theme-primary text-theme-onPrimary border-theme-primary shadow-2xl`
                                  : 'bg-theme-bg/5 text-theme-text/80 hover:bg-theme-bg/10 border-theme-primary-dark/20'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{t.name}</span>
                                {themeId === t.id && <Check className="w-5 h-5 text-theme-onPrimary font-bold" />}
                            </div>
                            <div className="flex mt-3 space-x-2 items-center">
                              <span className="w-5 h-5 rounded-full border border-gray-400" style={{ backgroundColor: light }} />
                              <span className="w-5 h-5 rounded-full border border-gray-400" style={{ backgroundColor: def }} />
                              <span className="w-5 h-5 rounded-full border border-gray-400" style={{ backgroundColor: dark }} />
                            </div>
                          </button>
                          );
                        })}
                    </div>
                  </section>
                )}

                {activeTab === 'agent' && (
                  <section className="section-card rounded-xl p-8 bg-theme-surface shadow-lg">
                    <h2 className={`text-2xl font-extrabold mb-6 text-theme-primary border-b pb-2 border-theme-primary-dark/20`}>🤖 AI Agent</h2>
                    <p className={`text-theme-text`}>Manage your AI assistant settings here. Customize persona and behavior.</p>
                  </section>
                )}
                
                {activeTab === 'profile' && (
                  <section className="section-card rounded-xl p-8 bg-theme-surface shadow-lg">
                    <h2 className={`text-2xl font-extrabold mb-6 text-theme-primary border-b pb-2 border-theme-primary-dark/20`}>👤 User Profile</h2>
                    <p className={`text-theme-text`}>Manage your account details and personalization settings.</p>
                  </section>
                )}

                {activeTab === 'about' && (
                  <section className="section-card rounded-xl p-8 bg-theme-surface shadow-lg">
                    <h2 className={`text-2xl font-extrabold mb-6 text-theme-primary border-b pb-2 border-theme-primary-dark/20`}>💡 About</h2>
                    <p className={`text-theme-text`}>Learn more about this application, version number, and licensing information.</p>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Settings;