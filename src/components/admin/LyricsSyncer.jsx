import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

// --- UTILITIES ---
const formatLrcTime = (timeInSeconds) => {
    const min = Math.floor(timeInSeconds / 60);
    const sec = (timeInSeconds % 60).toFixed(2);
    return `[${min.toString().padStart(2, '0')}:${sec.padStart(5, '0')}]`;
};

// New: Smart parser that detects if the text already has [mm:ss.xx] timestamps
const parseLrcText = (rawText) => {
    const lines = rawText.split('\n');
    const parsed = [];
    const lrcRegex = /^\[(\d{2}):(\d{2}\.\d{2,3})\](.*)/;

    lines.forEach(line => {
        const match = line.match(lrcRegex);
        if (match) {
            // It's an existing timed line!
            const minutes = parseInt(match[1], 10);
            const seconds = parseFloat(match[2]);
            parsed.push({ 
                time: (minutes * 60) + seconds, 
                text: match[3].trim() 
            });
        } else if (line.trim().length > 0) {
            // It's just a raw text line
            parsed.push({ time: null, text: line.trim() });
        }
    });

    return parsed;
};

const LyricsSyncer = ({ songId, songTitle, songArtist, audioUrl, initialLyrics, onCancel, onSaveSuccess }) => {
    const { authFetch } = useAuth();
    const { addToast } = useToast();

    const [phase, setPhase] = useState(1);
    const [rawText, setRawText] = useState(initialLyrics || '');
    
    const [syncLines, setSyncLines] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const audioRef = useRef(null);
    const activeLineRef = useRef(null);

    // --- PHASE 1: PARSE AND START ---
    const handleStartSync = () => {
        if (!rawText.trim()) return addToast("Please paste some lyrics first", "error");

        const parsedLines = parseLrcText(rawText);
        setSyncLines(parsedLines);

        // Smart Indexing: Find the first line that doesn't have a timestamp yet
        const firstUnsynced = parsedLines.findIndex(l => l.time === null);
        
        // If all lines are already synced (e.g. from AI), put cursor at the end so they can just review
        setActiveIndex(firstUnsynced !== -1 ? firstUnsynced : parsedLines.length);
        
        setPhase(2);
    };

    // --- PHASE 2: THE STUDIO & KEYBOARD SHORTCUTS ---
    useEffect(() => {
        if (activeLineRef.current) {
            activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [activeIndex]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (phase !== 2) return;
            
            // 1. Audio Scrubbing (Left/Right Arrows for -5s / +5s)
            if (e.code === 'ArrowLeft') {
                e.preventDefault();
                if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
            }
            if (e.code === 'ArrowRight') {
                e.preventDefault();
                if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 5);
            }

            // 2. Line Navigation (Up/Down Arrows to manually change the active line!)
            if (e.code === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex(prev => Math.max(0, prev - 1));
            }
            if (e.code === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex(prev => Math.min(syncLines.length - 1, prev + 1));
            }

            // 3. Stamping Time (Spacebar)
            if (e.code === 'Space') {
                e.preventDefault(); 
                
                if (!isPlaying) {
                    audioRef.current.play();
                    setIsPlaying(true);
                    return;
                }

                if (activeIndex < syncLines.length) {
                    stampTime();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [phase, activeIndex, isPlaying, syncLines]);

    const stampTime = () => {
        if (!audioRef.current) return;
        
        const currentTime = audioRef.current.currentTime;
        
        setSyncLines(prev => {
            const newLines = [...prev];
            newLines[activeIndex].time = currentTime;
            return newLines;
        });
        
        setActiveIndex(prev => prev + 1); 
    };

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleAutoGenerate = async () => {
        setIsGenerating(true);
        addToast("Summoning lyrics...", "info");
        
        try {
            // Build safe URL query parameters
            const queryParams = new URLSearchParams({ 
                title: songTitle, 
                artist: songArtist 
            }).toString();

            // Append them to the GET request!
            const res = await authFetch(`/admin/songs/auto-lyrics?${queryParams}`);
            const json = await res.json();
            console.log(json);
            if (json.success && json.lyrics) {
                setRawText(json.lyrics); 
                addToast("Lyrics successfully generated!", "success");
            } else {
                addToast(json.message || "Could not find/generate lyrics", "error");
            }
        } catch (err) {
            addToast("Network error during generation", "error");
        } finally {
            setIsGenerating(false);
        }
    };

    // --- PHASE 3: SAVE TO DB ---
    const handleSave = async () => {
        setIsSaving(true);
        
        const finalLrc = syncLines
            .map(line => `${formatLrcTime(line.time || 0)} ${line.text}`)
            .join('\n');

        try {
            const res = await authFetch(`/admin/songs/${songId}/lyrics`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }, // We DO need JSON header here!
                body: JSON.stringify({ lyrics: finalLrc })
            });
            const json = await res.json();
            
            if (json.success) {
                addToast("Timed lyrics saved successfully!", "success");
                onSaveSuccess();
            } else {
                addToast("Failed to save lyrics", "error");
            }
        } catch (err) {
            addToast("Network error while saving", "error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="animate-fade-in max-w-4xl mx-auto bg-white/5 border border-white/5 rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Lyrics Studio</h2>
                <button onClick={onCancel} className="text-white/50 hover:text-white">Close</button>
            </div>

            <audio 
                ref={audioRef} 
                src={audioUrl.startsWith('http') ? audioUrl : `http://localhost:5000${audioUrl}`} 
                onEnded={() => setIsPlaying(false)} 
            />

            {phase === 1 && (
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-white/50">Paste raw text OR existing .lrc data here. We will auto-detect timestamps.</p>
                    <button 
        onClick={handleAutoGenerate} 
        disabled={isGenerating}
        className="text-xs bg-purple-500/20 text-purple-300 px-4 py-2 rounded-md hover:bg-purple-500/30 transition-colors flex items-center gap-2 font-bold"
    >
        {isGenerating ? '⏳ Processing...' : '✨ Auto-Generate'}
    </button>
                    <textarea 
                        value={rawText}
                        onChange={(e) => setRawText(e.target.value)}
                        placeholder="[00:15.30] Oshiete oshiete yo..."
                        className="w-full h-96 bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-accent-primary outline-none resize-none font-mono text-sm leading-relaxed"
                    />
                    <button onClick={handleStartSync} className="bg-accent-primary text-black py-3 rounded-full font-bold hover:bg-accent-hover self-end px-8 transition-transform active:scale-95">
                        Proceed to Studio →
                    </button>
                </div>
            )}

            {phase === 2 && (
                <div className="flex flex-col h-[600px]">
                    
                    <div className="flex justify-between items-start bg-black/40 p-4 rounded-xl mb-4 border border-white/10 shrink-0">
                        <div className="flex gap-4">
                            <button onClick={togglePlay} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-bold transition-colors">
                                {isPlaying ? '⏸ Pause' : '▶️ Play'}
                            </button>
                        </div>
                        <div className="text-right flex flex-col gap-1 text-sm text-white/60">
                            <p><kbd className="bg-white/10 px-2 rounded text-accent-primary font-mono">SPACE</kbd> Stamp Line</p>
                            <p><kbd className="bg-white/10 px-2 rounded text-accent-primary font-mono">◀</kbd> <kbd className="bg-white/10 px-2 rounded text-accent-primary font-mono">▶</kbd> Scrub ±5s</p>
                            <p><kbd className="bg-white/10 px-2 rounded text-accent-primary font-mono">▲</kbd> <kbd className="bg-white/10 px-2 rounded text-accent-primary font-mono">▼</kbd> Move Cursor</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-black/20 rounded-xl p-6 space-y-4 border border-white/5 relative">
                        {syncLines.map((line, idx) => {
                            const isActive = idx === activeIndex;
                            const isDone = line.time !== null && !isActive;

                            return (
                                <div 
                                    key={idx} 
                                    ref={isActive ? activeLineRef : null}
                                    onClick={() => setActiveIndex(idx)} // Allow mouse clicking to change lines too!
                                    className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 cursor-pointer ${
                                        isActive ? 'bg-accent-primary/20 border border-accent-primary/50 shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-105 origin-left' : 
                                        isDone ? 'opacity-50 hover:opacity-80' : 'opacity-100 hover:bg-white/5'
                                    }`}
                                >
                                    <div className={`font-mono text-sm w-20 shrink-0 ${isDone ? 'text-accent-primary' : 'text-white/30'}`}>
                                        {line.time !== null ? formatLrcTime(line.time) : '[--:--.--]'}
                                    </div>
                                    <div className={`text-lg font-bold ${isActive ? 'text-white' : 'text-white/80'}`}>
                                        {line.text}
                                    </div>
                                </div>
                            );
                        })}
                        
                        <div className="text-center py-12 border-t border-white/10 mt-8 pt-8">
                            <h3 className="text-xl font-bold text-white mb-4">Done syncing?</h3>
                            <button onClick={handleSave} disabled={isSaving} className="bg-accent-primary text-black px-8 py-3 rounded-full font-bold hover:scale-105 active:scale-95 transition-all">
                                {isSaving ? 'Saving...' : 'Save Lyrics to Database'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LyricsSyncer;