import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, Upload, Repeat, Shuffle, ChevronDown } from 'lucide-react';

interface Track {
  id: number;
  name: string;
  artist: string;
  duration: string;
  url?: string;
}

// ... (defaultTracks, formatTime, dan semua fungsi logika JavaScript/TypeScript tetap sama)
const defaultTracks: Track[] = [
    { id: 1, name: 'Lo-Fi Beats', artist: 'Chill Studio', duration: '3:24' },
    { id: 2, name: 'Ambient Dreams', artist: 'Relax Wave', duration: '4:12' },
    { id: 3, name: 'Focus Mode', artist: 'Work Flow', duration: '5:01' },
];

const MediaPlayer: React.FC = () => {
    const [tracks, setTracks] = useState<Track[]>(defaultTracks);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(defaultTracks[0]); // Auto-select track pertama
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [currentTime, setCurrentTime] = useState('0:00');
    
    const audioRef = useRef<HTMLAudioElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const createdUrlsRef = useRef<Set<string>>(new Set());

    // --- Semua Logika useEffect, handlePlay, handlePrevious, handleNext, handleFileUpload, formatTime dsb. SAMA PERSIS dengan kode yang Anda berikan. ---
    
    // Helper to format seconds to mm:ss
    const formatTime = (seconds: number) => {
        if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // (Sisipkan semua useEffects, handle functions dari kode Anda di sini)
    // ...
    // Control audio element when track has a URL
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onTimeUpdate = () => {
            const duration = audio.duration || 0;
            const current = audio.currentTime || 0;
            const pct = duration ? (current / duration) * 100 : 0;
            setProgress(pct);
            setCurrentTime(formatTime(current));
        };

        const onLoadedMetadata = () => {
            const duration = audio.duration || 0;
            if (currentTrack) {
                const formatted = duration ? formatTime(duration) : currentTrack.duration;
                setTracks((prev) => prev.map(t => t.id === currentTrack.id ? { ...t, duration: formatted } : t));
            }
        };

        const onEnded = () => {
            if (isRepeat) {
                audio.currentTime = 0;
                audio.play();
            } else {
                handleNext();
            }
        };

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', onEnded);
        };
    }, [currentTrack, isRepeat]);

    // Play/pause when `isPlaying` or `currentTrack` changes (only for tracks with URL)
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (currentTrack?.url) {
            if (audio.src !== currentTrack.url) {
                audio.src = currentTrack.url;
            }
            if (isPlaying) {
                const p = audio.play();
                if (p && typeof p.catch === 'function') p.catch(() => {});
            } else {
                audio.pause();
            }
        }
    }, [isPlaying, currentTrack]);

    // Sync volume/mute
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = isMuted ? 0 : volume;
        audio.muted = isMuted;
    }, [volume, isMuted]);

    // Cleanup created object URLs on unmount
    useEffect(() => {
        return () => {
            createdUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
            createdUrlsRef.current.clear();
        };
    }, []);

    const handlePlay = (track: Track) => {
        if (currentTrack?.id === track.id) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentTrack(track);
            setProgress(0);
            setCurrentTime('0:00');
            // If track has no URL, still allow toggling isPlaying to trigger simulation fallback
            setIsPlaying(true);
        }
    };

    const handlePrevious = () => {
        if (!currentTrack) return;
        const idx = tracks.findIndex(t => t.id === currentTrack.id);
        const prevIdx = idx <= 0 ? tracks.length - 1 : idx - 1;
        setCurrentTrack(tracks[prevIdx]);
        setProgress(0);
        setCurrentTime('0:00');
    };

    const handleNext = () => {
        if (!currentTrack) return;
        const idx = tracks.findIndex(t => t.id === currentTrack.id);
        let nextIdx: number;
        
        if (isShuffle) {
            nextIdx = Math.floor(Math.random() * tracks.length);
        } else {
            nextIdx = idx >= tracks.length - 1 ? 0 : idx + 1;
        }
        
        setCurrentTrack(tracks[nextIdx]);
        setProgress(0);
        setCurrentTime('0:00');
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newTracks: Track[] = [];
        Array.from(files).forEach((file, i) => {
            const url = URL.createObjectURL(file);
            createdUrlsRef.current.add(url);
            newTracks.push({
                id: Date.now() + i,
                name: file.name.replace(/\.[^/.]+$/, ''),
                artist: 'Local File',
                duration: '--:--',
                url,
            });
        });
        setTracks([...tracks, ...newTracks]);
    };
    // ...

    return (
        <div className="relative pt-10 pb-20 bg-theme-bg min-h-screen"> 
            <audio ref={audioRef} />

            <div className="max-w-xl mx-auto px-4">
                
                {/* Header (Minimalis) */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/tools" className="p-2 rounded-full hover:bg-theme-surface/60 transition-colors text-theme-text/70 hover:text-theme-text">
                        <ChevronDown size={20} /> {/* Ganti ArrowLeft ke ChevronDown (ala mobile player) */}
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-theme-text">My Library</h1>
                        <p className="text-sm text-theme-text/60">Music for Focus and Creativity</p>
                    </div>
                </div>

                {/* Playlist Section */}
                <div className="bg-theme-surface rounded-2xl shadow-xl overflow-hidden border border-theme-primary-dark/10">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-theme-primary-dark/10">
                        <h3 className="font-bold text-lg text-theme-primary">All Tracks ({tracks.length})</h3>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-3 py-1.5 bg-theme-primary/10 hover:bg-theme-primary/20 rounded-full text-sm text-theme-primary transition-colors font-medium"
                        >
                            <Upload size={16} />
                            Add Files
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="audio/*"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </div>
                    
                    {/* Track List */}
                    <div className="divide-y divide-theme-primary-dark/5 max-h-[50vh] overflow-y-auto">
                        {tracks.map((track) => (
                            <button
                                key={track.id}
                                onClick={() => handlePlay(track)}
                                className={`w-full flex items-center gap-4 p-4 text-left hover:bg-theme-surface/60 transition-colors ${
                                    currentTrack?.id === track.id ? 'bg-theme-primary/10' : ''
                                }`}
                            >
                                {/* Track Indicator/Icon */}
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                    currentTrack?.id === track.id 
                                        ? 'bg-theme-primary text-theme-onPrimary shadow-md' 
                                        : 'bg-theme-bg/5 text-theme-text/50'
                                }`}>
                                    {currentTrack?.id === track.id && isPlaying ? (
                                        // ANIMATION: Visualizer Bar
                                        <div className="flex gap-0.5">
                                            <span className="w-1 h-3 bg-current animate-pulse delay-0" />
                                            <span className="w-1 h-4 bg-current animate-pulse delay-100" />
                                            <span className="w-1 h-2 bg-current animate-pulse delay-200" />
                                        </div>
                                    ) : (
                                        <Music size={18} />
                                    )}
                                </div>
                                
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className={`font-medium truncate ${currentTrack?.id === track.id ? 'text-theme-primary' : 'text-theme-text'}`}>
                                        {track.name}
                                    </div>
                                    <div className="text-sm text-theme-text/60 truncate">{track.artist}</div>
                                </div>
                                
                                <span className="text-sm text-theme-text/40 flex-shrink-0">{track.duration}</span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
            
            {/* --- FIXED MINI-PLAYER (Footer Keren) --- */}
            <div className="fixed bottom-0 left-0 right-0 z-30 bg-theme-surface/95 backdrop-blur-md border-t border-theme-primary-dark/20 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
                <div className="max-w-2xl mx-auto px-4 py-3">
                    
                    {/* Top Row: Progress Bar & Time */}
                    <div className="flex items-center gap-4 mb-2">
                        <div className="text-xs text-theme-text/50 w-8 flex-shrink-0">{currentTime}</div>
                        <div className="h-1 bg-theme-bg/80 rounded-full flex-1 overflow-hidden cursor-pointer">
                            {/* NOTE: Untuk membuat progress bar bisa di-klik, Anda perlu menambahkan event handler onMouseDown/onTouchStart di sini */}
                            <div 
                                className="h-full bg-gradient-to-r from-theme-primary to-theme-accent transition-all duration-100"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="text-xs text-theme-text/50 w-8 text-right flex-shrink-0">{currentTrack?.duration || '0:00'}</div>
                    </div>
                    
                    {/* Bottom Row: Info, Controls, Volume */}
                    <div className="flex items-center justify-between">
                        
                        {/* Track Info (Left) */}
                        <div className="flex items-center min-w-0 pr-4">
                            <div className="w-10 h-10 rounded-lg bg-theme-primary/10 flex items-center justify-center text-theme-primary mr-3 flex-shrink-0">
                                <Music size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="font-medium text-sm truncate">{currentTrack?.name || 'Nothing Playing'}</p>
                                <p className="text-xs text-theme-text/60 truncate">{currentTrack?.artist || '--'}</p>
                            </div>
                        </div>
                        
                        {/* Main Controls (Center) */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handlePrevious}
                                className="p-1 text-theme-text/70 hover:text-theme-primary transition-colors"
                            >
                                <SkipBack size={18} />
                            </button>
                            <button
                                onClick={() => currentTrack && handlePlay(currentTrack)}
                                disabled={!currentTrack}
                                className="p-2 bg-theme-primary text-theme-onPrimary rounded-full hover:bg-theme-primary/90 disabled:opacity-30 transition-all shadow-lg"
                            >
                                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                            </button>
                            <button
                                onClick={handleNext}
                                className="p-1 text-theme-text/70 hover:text-theme-primary transition-colors"
                            >
                                <SkipForward size={18} />
                            </button>
                        </div>

                        {/* Secondary Controls (Right: Volume/Shuffle/Repeat) */}
                        <div className="hidden sm:flex items-center gap-3 pl-4">
                            <button
                                onClick={() => setIsShuffle(!isShuffle)}
                                className={`p-1 rounded-lg transition-colors ${isShuffle ? 'text-theme-primary' : 'text-theme-text/40 hover:text-theme-text'}`}
                            >
                                <Shuffle size={16} />
                            </button>
                            <button
                                onClick={() => setIsRepeat(!isRepeat)}
                                className={`p-1 rounded-lg transition-colors ${isRepeat ? 'text-theme-primary' : 'text-theme-text/40 hover:text-theme-text'}`}
                            >
                                <Repeat size={16} />
                            </button>
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="p-1 text-theme-text/60 hover:text-theme-text transition-colors"
                            >
                                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={isMuted ? 0 : volume}
                                onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
                                className="w-16 accent-theme-primary cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaPlayer;