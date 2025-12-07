import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, themes as availableThemes } from '../components/ThemeProvider';
import { getCharacterPersonas, CharacterPersona, deleteCharacterPersona } from '../api/api';
import { Check, Palette, Info, User, Zap, Save, Plus, Loader2, Bot, Trash2, MessageSquare } from 'lucide-react'; 

const Settings: React.FC = () => {
  const { themeId, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');
  const navigate = useNavigate();
  const themes = availableThemes;

  // State untuk persona
  const [personas, setPersonas] = useState<Persona[]>([]);
  // (removed persona state)
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Character Personas state
  const [characters, setCharacters] = useState<CharacterPersona[]>([]);
  const [charactersLoading, setCharactersLoading] = useState(false);

  // Load personas saat tab agent aktif
  useEffect(() => {
    if (activeTab === 'agent') {
      loadPersonas();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'characters') {
      loadCharacters();
    }
  }, [activeTab]);

  const loadPersonas = async () => {
    setIsLoading(true);
    try {
      const [all, active] = await Promise.all([getPersonas(), getActivePersona()]);
      setPersonas(all);
      setActivePersona(active);
      if (active) {
        setEditPersona(active);
      } else if (all.length > 0) {
        setEditPersona(all[0]);
      } else {
        setEditPersona({ ai_name: '', persona: '', user_nickname: '', greeting: '', style: '', is_active: 1 });
      }
    } catch {
      setSaveStatus('Gagal memuat persona');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePersona = async () => {
    setIsLoading(true);
    setSaveStatus(null);
    try {
      if (editPersona.id) {
        await updatePersona(editPersona.id, editPersona);
        await activatePersona(editPersona.id);
      } else {
        const res = await createPersona({
          ai_name: editPersona.ai_name || '',
          persona: editPersona.persona || '',
          user_nickname: editPersona.user_nickname || '',
          greeting: editPersona.greeting || '',
          style: editPersona.style || '',
          is_active: 1,
        });
        await activatePersona(res.id);
      }
      setSaveStatus('Persona tersimpan!');
      loadPersonas();
    } catch {
      setSaveStatus('Gagal menyimpan persona');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCharacters = async () => {
    setCharactersLoading(true);
    try {
      const data = await getCharacterPersonas();
      setCharacters(data);
    } catch (err) {
      console.error('Failed to load characters:', err);
    } finally {
      setCharactersLoading(false);
    }
  };

  const handleDeleteCharacter = async (id: string) => {
    if (!confirm('Hapus karakter ini?')) return;
    try {
      await deleteCharacterPersona(id);
      loadCharacters();
    } catch (err) {
      console.error('Failed to delete character:', err);
    }
  };

  const navItems = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'characters', label: 'Characters', icon: Bot },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <>
      <header className="sticky top-0 z-20 bg-theme-bg/95 backdrop-blur-sm shadow-sm border-b border-theme-primary-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-theme-primary">Settings</h1>
        </div>
      </header>

      <main className="flex-1 bg-theme-bg text-theme-text">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* SIDEBAR NAV */}
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
            
            {/* SECTION CONTENT */}
            <div className="md:col-span-9 lg:col-span-10">
              <div className="max-w-4xl mx-auto">
                
                {/* APPEARANCE TAB */}
                {activeTab === 'appearance' && (
                  <section className="section-card rounded-xl p-8 bg-theme-surface shadow-lg">
                    <h2 className="text-2xl font-extrabold mb-6 text-theme-primary border-b pb-2 border-theme-primary-dark/20">🎨 Appearance</h2>
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
                                ? 'bg-theme-primary text-theme-onPrimary border-theme-primary shadow-2xl'
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


                {/* CHARACTERS TAB */}
                {activeTab === 'characters' && (
                  <section className="section-card rounded-xl p-8 bg-theme-surface shadow-lg">
                    <div className="flex items-center justify-between mb-6 border-b pb-2 border-theme-primary-dark/20">
                      <h2 className="text-2xl font-extrabold text-theme-primary">🎭 Character Roleplay</h2>
                      <button
                        onClick={() => navigate('/character/new')}
                        className="flex items-center gap-2 px-4 py-2 bg-theme-primary text-theme-onPrimary rounded-lg hover:bg-theme-primary/90 transition-colors"
                      >
                        <Plus size={18} />
                        <span>New Character</span>
                      </button>
                    </div>

                    {charactersLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-theme-primary" />
                      </div>
                    ) : characters.length === 0 ? (
                      <div className="text-center py-12">
                        <Bot size={48} className="mx-auto text-theme-text/30 mb-4" />
                        <p className="text-theme-text/60 mb-4">Belum ada karakter roleplay</p>
                        <button
                          onClick={() => navigate('/character/new')}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-theme-primary/10 text-theme-primary rounded-lg hover:bg-theme-primary/20 transition-colors"
                        >
                          <Plus size={16} />
                          Buat karakter pertama
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {characters.map((char) => (
                          <div
                            key={char.character_id}
                            className="p-4 rounded-xl border border-theme-primary-dark/10 bg-theme-bg/50 hover:bg-theme-bg/80 transition-colors"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-theme-primary to-theme-accent flex items-center justify-center flex-shrink-0">
                                <Bot size={24} className="text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-theme-text truncate">{char.name}</h3>
                                <p className="text-sm text-theme-text/60 line-clamp-2 mt-1">{char.short_description}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {char.tags?.slice(0, 3).map((tag, idx) => (
                                    <span key={idx} className="px-2 py-0.5 text-xs bg-theme-primary/10 text-theme-primary rounded-full">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-theme-primary-dark/10">
                              <button
                                onClick={() => navigate(`/characterchat/${char.character_id}`)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-theme-primary text-theme-onPrimary rounded-lg hover:bg-theme-primary/90 transition-colors"
                              >
                                <MessageSquare size={16} />
                                Chat
                              </button>
                              <button
                                onClick={() => handleDeleteCharacter(char.character_id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                  <section className="section-card rounded-xl p-8 bg-theme-surface shadow-lg">
                    <h2 className="text-2xl font-extrabold mb-6 text-theme-primary border-b pb-2 border-theme-primary-dark/20">👤 User Profile</h2>
                    <p className="text-theme-text">Manage your account details and personalization settings.</p>
                  </section>
                )}

                {/* ABOUT TAB */}
                {activeTab === 'about' && (
                  <section className="section-card rounded-xl p-8 bg-theme-surface shadow-lg">
                    <h2 className="text-2xl font-extrabold mb-6 text-theme-primary border-b pb-2 border-theme-primary-dark/20">💡 About</h2>
                    <p className="text-theme-text">Learn more about this application, version number, and licensing information.</p>
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
