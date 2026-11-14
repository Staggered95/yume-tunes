import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import { getMediaUrl } from '../../utils/media';

const formatLrcTime = (timeInSeconds) => {
    const min = Math.floor(timeInSeconds / 60);
    const sec = (timeInSeconds % 60).toFixed(2);
    return `[${min.toString().padStart(2, '0')}:${sec.padStart(5, '0')}]`;
};

const parseLrcText = (rawText) => {
    const lines = rawText.split('\n');
    const parsed = [];
    const lrcRegex = /^\[(\d{2}):(\d{2}\.\d{2,3})\](.*)/;

    lines.forEach(line => {
        const match = line.match(lrcRegex);
        if (match) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseFloat(match[2]);
            parsed.push({ 
                time: (minutes * 60) + seconds, 
                text: match[3].trim() 
            });
        } else if (line.trim().length > 0) {
            parsed.push({ time: null, text: line.trim() });
        }
    });

    return parsed;
};

const LyricsSyncer = ({ songId, songTitle, songArtist, audioUrl, initialLyrics, onCancel, onSaveSuccess }) => {
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

    const handleStartSync = () => {
        if (!rawText.trim()) return addToast("Please paste some lyrics first", "error");

        const parsedLines = parseLrcText(rawText);
        setSyncLines(parsedLines);

        const firstUnsynced = parsedLines.findIndex(l => l.time === null);
        setActiveIndex(firstUnsynced !== -1 ? firstUnsynced : parsedLines.length);
        
        setPhase(2);
    };

    useEffect(() => {
        if (activeLineRef.current) {
            activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [activeIndex]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (phase !== 2) return;
            
            if (e.code === 'ArrowLeft') {
                e.preventDefault();
                scrubAudio(-5);
            }
            if (e.code === 'ArrowRight') {
                e.preventDefault();
                scrubAudio(5);
            }

            if (e.code === 'ArrowUp') {
                e.preventDefault();
                moveIndex(-1);
            }
            if (e.code === 'ArrowDown') {
                e.preventDefault();
                moveIndex(1);
            }

            if (e.code === 'Space') {
                e.preventDefault(); 
                if (!isPlaying) {
                    togglePlay();
                } else if (activeIndex < syncLines.length) {
                    stampTime();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [phase, activeIndex, isPlaying, syncLines]);

    // Helper functions for both Keyboard and Mobile Buttons
    const scrubAudio = (amount) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration, audioRef.current.currentTime + amount));
        }
    };

    const moveIndex = (direction) => {
        setActiveIndex(prev => Math.max(0, Math.min(syncLines.length - 1, prev + direction)));
    };

    const stampTime = () => {
        if (!audioRef.current) return;
        
        // Stop if we are already past the last line!
        if (activeIndex >= syncLines.length) {
            addToast("All lines are already synced!", "info");
            return; 
        }

        const currentTime = audioRef.current.currentTime;
        
        setSyncLines(prev => {
            const newLines = [...prev];
            if (newLines[activeIndex]) {
                newLines[activeIndex].time = currentTime;
            }
            return newLines;
        });
        
        setActiveIndex(prev => prev + 1); 
    };

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
        setIsPlaying(!isPlaying);
    };

    const handleAutoGenerate = async () => {
        setIsGenerating(true);
        addToast("Summoning lyrics...", "info");
        
        try {
            const queryParams = new URLSearchParams({ title: songTitle, artist: songArtist }).toString();
            const { data } = await api.get(`/admin/songs/auto-lyrics?${queryParams}`);
            
            if (data.success && data.lyrics) {
                setRawText(data.lyrics); 
                addToast("Lyrics successfully generated!", "success");
            } else {
                addToast(data.message || "Could not find/generate lyrics", "error");
            }
        } catch (err) {
            addToast("Network error during generation", "error");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        
        const finalLrc = syncLines
            .map(line => `${formatLrcTime(line.time || 0)} ${line.text}`)
            .join('\n');

        try {
            const { data } = await api.put(`/admin/songs/${songId}/lyrics`, { lyrics: finalLrc });
            if (data.success) {
                addToast("Lyrics synced successfully!", "success");
                onSaveSuccess();
            } else {
                addToast(data.message || "Failed to save lyrics", "error");
            }
        } catch (err) {
            addToast("Network error saving lyrics", "error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-background-secondary border border-border rounded-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl">
                
                {/* Header */}
                <div className="p-4 border-b border-border flex justify-between items-center bg-background-primary shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-text-primary tracking-tight">Lyrics Studio</h2>
                        <p className="text-xs text-text-secondary mt-1 truncate max-w-[200px] sm:max-w-none">
                            Syncing: <span className="text-accent-primary font-bold">{songTitle}</span>
                        </p>
                    </div>
                    <button onClick={onCancel} className="text-text-muted hover:text-error transition-colors p-2 font-bold text-xl">✕</button>
                </div>

                {/* PHASE 1 VIEW */}
                {phase === 1 && (
                    <div className="p-4 flex flex-col h-full overflow-hidden">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <p className="text-sm text-text-secondary">Paste raw text OR existing .lrc data here.</p>
                            <button 
                                onClick={handleAutoGenerate} 
                                disabled={isGenerating}
                                className="w-full sm:w-auto text-xs bg-accent-primary/10 border border-accent-primary/20 text-accent-primary px-4 py-2 rounded-lg hover:bg-accent-primary hover:text-white transition-all font-bold"
                            >
                                {isGenerating ? '⏳ Processing...' : '✨ Auto-Generate'}
                            </button>
                        </div>
                        
                        <textarea 
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                            placeholder="Paste Japanese, Romaji, or English lyrics here..."
                            className="flex-1 w-full bg-background-primary border border-border rounded-xl p-4 text-sm text-text-primary focus:border-accent-primary focus:outline-none resize-none mb-4"
                        />

                        <div className="flex gap-4 shrink-0">
                            <button onClick={onCancel} className="flex-1 px-4 py-3 rounded-xl font-bold text-text-secondary bg-background-hover">Cancel</button>
                            <button onClick={handleStartSync} className="flex-[2] bg-accent-primary text-background-primary px-4 py-3 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-accent-primary/20">
                                Proceed to Sync ➔
                            </button>
                        </div>
                    </div>
                )}

                {/* PHASE 2 VIEW */}
                {phase === 2 && (
                    <div className="flex flex-col h-full overflow-hidden">
                        
                        {/* Audio Controller */}
                        <div className="bg-background-primary p-3 sm:p-4 border-b border-border flex items-center gap-3 shrink-0">
                            <button 
                                onClick={togglePlay}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent-primary text-background-primary flex items-center justify-center font-black hover:scale-105 shrink-0 transition-transform shadow-md shadow-accent-primary/20"
                            >
                                {isPlaying ? '❚❚' : '▶'}
                            </button>
                            <audio 
                                ref={audioRef} 
                                src={getMediaUrl(audioUrl)} 
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                className="w-full h-10 accent-accent-primary"
                                controls 
                            />
                        </div>

                        {/* Lyrics List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-background-primary/50 relative">
                            {syncLines.map((line, index) => {
                                const isActive = index === activeIndex;
                                const isStamped = line.time !== null;

                                return (
                                    <div 
                                        key={index}
                                        ref={isActive ? activeLineRef : null}
                                        onClick={() => setActiveIndex(index)}
                                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                                            isActive 
                                                ? 'bg-background-active border-l-4 border-accent-primary shadow-md' 
                                                : 'hover:bg-background-hover border-l-4 border-transparent'
                                        }`}
                                    >
                                        <div className={`font-mono text-[10px] sm:text-xs w-16 sm:w-20 shrink-0 ${isStamped ? 'text-success font-bold' : 'text-text-muted'}`}>
                                            {isStamped ? formatLrcTime(line.time) : '[--:--.--]'}
                                        </div>
                                        <div className={`text-xs sm:text-sm font-medium ${isActive ? 'text-text-primary text-sm sm:text-base font-bold' : 'text-text-secondary'}`}>
                                            {line.text}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* --- MOBILE CONTROL DECK (Visible only on small screens) --- */}
                        <div className="md:hidden bg-background-primary border-t border-border p-3 flex flex-col gap-3 shrink-0">
                            
                            {/* Navigation Row */}
                            <div className="flex justify-between items-center gap-2">
                                <button onClick={() => scrubAudio(-5)} className="flex-1 bg-background-secondary p-2 rounded-lg text-text-secondary font-bold text-xs border border-border">⏪ -5s</button>
                                <button onClick={() => moveIndex(-1)} className="flex-1 bg-background-secondary p-2 rounded-lg text-text-secondary font-bold text-xs border border-border">⬆ Prev</button>
                                <button onClick={() => moveIndex(1)} className="flex-1 bg-background-secondary p-2 rounded-lg text-text-secondary font-bold text-xs border border-border">⬇ Next</button>
                                <button onClick={() => scrubAudio(5)} className="flex-1 bg-background-secondary p-2 rounded-lg text-text-secondary font-bold text-xs border border-border">+5s ⏩</button>
                            </div>

                            {/* Action Row */}
                            <div className="flex gap-2">
                                <button 
                                    onClick={stampTime} 
                                    disabled={activeIndex >= syncLines.length}
                                    className={`flex-[2] py-3 rounded-xl font-black uppercase tracking-wider shadow-lg transition-colors ${
                                            activeIndex >= syncLines.length 
                                            ? 'bg-background-active text-text-muted border border-border shadow-none' 
                                            : 'bg-accent-primary text-background-primary shadow-accent-primary/20'
                                        }`}
                                    >
                                    {activeIndex >= syncLines.length ? 'SYNC COMPLETE' : 'STAMP TIME'}
                                </button>
                                <button onClick={handleSave} disabled={isSaving} className="flex-1 bg-success text-background-primary py-3 rounded-xl font-bold">
                                    {isSaving ? '...' : 'Save'}
                                </button>
                            </div>
                        </div>

                        {/* --- DESKTOP FOOTER (Visible only on md+) --- */}
                        <div className="hidden md:flex p-4 border-t border-border bg-background-secondary shrink-0 justify-between items-center">
                            <div className="text-xs text-text-muted flex gap-4">
                                <span className="flex items-center gap-1"><kbd className="bg-background-primary px-2 py-0.5 rounded border border-border font-mono text-text-primary font-bold shadow-sm">Space</kbd> Stamp</span>
                                <span className="flex items-center gap-1"><kbd className="bg-background-primary px-2 py-0.5 rounded border border-border font-mono text-text-primary font-bold shadow-sm">↑↓</kbd> Move</span>
                                <span className="flex items-center gap-1"><kbd className="bg-background-primary px-2 py-0.5 rounded border border-border font-mono text-text-primary font-bold shadow-sm">←→</kbd> Scrub 5s</span>
                            </div>
                            
                            <div className="flex gap-4">
                                <button onClick={() => setPhase(1)} className="px-6 py-2 rounded-xl font-bold text-text-secondary hover:bg-background-hover">Back</button>
                                <button 
                                    onClick={handleSave} 
                                    disabled={isSaving}
                                    className="bg-success text-background-primary px-8 py-2 rounded-xl font-bold hover:bg-[#3bca6b] shadow-lg shadow-success/20 disabled:opacity-50 transition-colors"
                                >
                                    {isSaving ? 'Saving...' : 'Save Lyrics'}
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default LyricsSyncer;