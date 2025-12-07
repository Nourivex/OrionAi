import React, { useState, useEffect, useRef } from 'react';
import { generateNovel, saveNovel, listNovelFolders } from '../../api/api';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const defaultModels = [
  'orion-12b-it:latest',
  'orion-7b:latest',
  'gpt-4o-mini:latest'
];

const lengthLabels: Record<string, string> = {
  short: 'Short (~1k words)',
  medium: 'Medium (~5k words)',
  long: 'Long (~15k words)',
  epic: 'Epic (~50k+ words)'
};

const NovelGenerator: React.FC = () => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>(['Fantasy']);
  const [tagInput, setTagInput] = useState('');
  const [length, setLength] = useState<'short'|'medium'|'long'|'epic'>('medium');
  const [model, setModel] = useState(defaultModels[0]);
  const [language, setLanguage] = useState('id');
  const [outlineOnly, setOutlineOnly] = useState(false);
  const [pov, setPov] = useState<'third'|'third-omniscient'|'first'|'second'>('third');
  const [corePrompt, setCorePrompt] = useState('');

  const [generating, setGenerating] = useState(false);
  const [novelText, setNovelText] = useState('');
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('default');
  const [filename, setFilename] = useState('');

  const outputRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listNovelFolders().then(r => { setFolders(r.folders || []); }).catch(() => setFolders([]));
  }, []);

  const addTag = (t: string) => {
    const clean = t.trim();
    if (!clean) return;
    if (tags.includes(clean)) return;
    setTags(prev => [...prev, clean]);
    setTagInput('');
  };

  const removeTag = (t: string) => setTags(prev => prev.filter(x => x !== t));

  const handleTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput.replace(/,/g, ''));
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const payload = {
        title,
        genre: tags.join(', '),
        length,
        language,
        model,
        outlineOnly
      };

      // build richer prompt by injecting corePrompt and pov
      if (corePrompt) payload['title'] = (title || '') + '\n\nConcept:\n' + corePrompt + '\nPOV:' + pov;

      const res = await generateNovel(payload as any);
      setNovelText(res.novel || '');
      // scroll output into view
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      toast.success('Generation completed');
    } catch (err:any) {
      console.error(err);
      toast.error('Failed to generate novel.');
      setNovelText('');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!novelText) return;
    const saveName = filename || title || 'untitled';
    try {
      const res = await saveNovel({ title: title || saveName, folder: selectedFolder, filename: saveName, content: novelText });
      if (res.success) {
        toast.success(`Saved to ${res.path}`);
        listNovelFolders().then(r => setFolders(r.folders || [])).catch(() => {});
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to save novel');
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg p-6 md:p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Settings - sticky */}
        <aside className="md:col-span-1">
          <div className="sticky top-20 rounded-lg bg-theme-surface border border-theme-primary-dark/10 p-6 space-y-4">
            <h2 className="text-lg font-bold text-theme-primary">Generator Settings</h2>
            <div>
              <label className="text-xs text-theme-text/60">Title (optional)</label>
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. The Last Coder of Java" className="w-full mt-2 p-3 rounded-lg bg-white border border-theme-primary-dark/10" />
            </div>

            <div>
              <label className="text-xs text-theme-text/60">Genres / Tags</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(t => (
                  <button key={t} onClick={() => removeTag(t)} className="px-2 py-1 text-xs bg-theme-primary/10 text-theme-primary rounded-full">{t} ×</button>
                ))}
              </div>
              <input value={tagInput} onChange={e=>setTagInput(e.target.value)} onKeyDown={handleTagKey} placeholder="Add tag and press Enter" className="w-full mt-2 p-2 rounded-lg bg-white border border-theme-primary-dark/10 text-sm" />
            </div>

            <div>
              <label className="text-xs text-theme-text/60">Length</label>
              <div className="mt-2 flex gap-2">
                {(['short','medium','long','epic'] as const).map(k => (
                  <button key={k} onClick={()=>setLength(k)} className={`px-3 py-2 rounded-lg text-sm ${length===k ? 'bg-theme-primary text-white' : 'bg-theme-surface text-theme-text'}`}>{k.charAt(0).toUpperCase()+k.slice(1)}</button>
                ))}
              </div>
              <div className="text-xs text-theme-text/60 mt-1">{lengthLabels[length]}</div>
            </div>

            <div>
              <label className="text-xs text-theme-text/60">POV</label>
              <select value={pov} onChange={e=>setPov(e.target.value as any)} className="w-full mt-2 p-2 rounded-lg bg-white border border-theme-primary-dark/10 text-sm">
                <option value="first">First person</option>
                <option value="second">Second person</option>
                <option value="third">Third person (limited)</option>
                <option value="third-omniscient">Third person (omniscient)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-theme-text/60">Model</label>
              <select value={model} onChange={e=>setModel(e.target.value)} className="w-full mt-2 p-2 rounded-lg bg-white border border-theme-primary-dark/10 text-sm">
                {defaultModels.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-theme-text/60">Language</label>
              <select value={language} onChange={e=>setLanguage(e.target.value)} className="w-full mt-2 p-2 rounded-lg bg-white border border-theme-primary-dark/10 text-sm">
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-theme-text/60">Core Prompt / Concept</label>
              <textarea value={corePrompt} onChange={e=>setCorePrompt(e.target.value)} placeholder="Describe protagonist, conflict, tone, scenes you want..." rows={6} className="w-full mt-2 p-3 rounded-lg bg-white border border-theme-primary-dark/10 text-sm" />
            </div>

            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={outlineOnly} onChange={e=>setOutlineOnly(e.target.checked)} /> Outline Only</label>
              <div className="text-xs text-theme-text/60">Folders</div>
            </div>

            <div className="flex items-center gap-2">
              <select value={selectedFolder} onChange={e=>setSelectedFolder(e.target.value)} className="flex-1 p-2 rounded-lg bg-white border border-theme-primary-dark/10 text-sm">
                <option value="default">default</option>
                {folders.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="flex gap-2 mt-3">
              <button onClick={handleGenerate} className={`flex-1 px-3 py-2 rounded-lg ${generating ? 'bg-theme-primary/60 text-white' : 'bg-theme-primary text-white shadow'}`} disabled={generating}>{generating ? 'Generating…' : 'Generate'}</button>
              <button onClick={handleSave} className="px-3 py-2 rounded-lg bg-theme-surface border border-theme-primary-dark/10" disabled={!novelText}>Save</button>
            </div>

            <div className="text-xs text-theme-text/60 mt-2">Tip: gunakan CORE PROMPT untuk instruksi gaya, adegan penting, atau dialog contoh.</div>
          </div>
        </aside>

        {/* Right: Output (2/3) */}
        <main className="md:col-span-2">
          <div className="rounded-lg bg-white border border-theme-primary-dark/10 p-6 min-h-screen">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold">{title || 'Untitled'}</h1>
                <div className="text-sm text-theme-text/60">{tags.join(', ')} • {lengthLabels[length]}</div>
              </div>
              <div className="text-sm text-theme-text/60">Model: {model}</div>
            </div>

            <div ref={outputRef} className="prose max-w-none">
              {novelText ? (
                <ReactMarkdown>{novelText}</ReactMarkdown>
              ) : (
                <div className="text-theme-text/60">No output yet — press Generate to create your story. Generated text will render as markdown here.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NovelGenerator;
