import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import { getMediaUrl } from '../../utils/media';

// --- UTILITIES ---
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

    // --- PHASE 1: PARSE AND START ---
    const handleStartSync = () => {
        if (!rawText.trim()) return addToast("Please paste some lyrics first", "error");

        const parsedLines = parseLrcText(rawText);
        setSyncLines(parsedLines);

        const firstUnsynced = parsedLines.findIndex(l => l.time === null);
        setActiveIndex(firstUnsynced !== -1 ? firstUnsynced : parsedLines.length);
        
        setPhase(2);
    };

    // --- PHASE 2: THE STUDIO KEYBINDS ---
    useEffect(() => {
        if (activeLineRef.current) {
            activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [activeIndex]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (phase !== 2) return;
            
            if (e.code === 'ArrowLeft') {
                e.preventDefault();
                if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
            }
            if (e.code === 'ArrowRight') {
                e.preventDefault();
                if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 5);
            }

            if (e.code === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex(prev => Math.max(0, prev - 1));
            }
            if (e.code === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex(prev => Math.min(syncLines.length - 1, prev + 1));
            }

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

    // --- PHASE 3: SAVE TO DB (Completed from your cutoff) ---
    const handleSave = async () => {
        setIsSaving(true);
        
        const finalLrc = syncLines
            .map(line => `${formatLrcTime(line.time || 0)} ${line.text}`)
            .join('\n');

        try {
            // Axios automatically converts the object to JSON and sets headers!
            const { data } = await api.put(`/admin/songs/${songId}/lyrics`, { lyrics: finalLrc });
            
            if (data.success) {
                addToast("Lyrics synced successfully!", "success");
                onSaveSuccess(); // Close the modal
            } else {
                addToast(data.message || "Failed to save lyrics", "error");
            }
        } catch (err) {
            addToast("Network error saving lyrics", "error");
        } finally {
            setIsSaving(false);
        }
    };

    // --- RENDER ---
    return (
        <div className="fixed inset-0 z-50 flex  justify-center bg-black/10 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-background-secondary border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl transition-all duration-300">
                
                {/* Header */}
                <div className="p-4 md:p-6 border-b border-border flex justify-between items-center bg-background-primary shrink-0">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">Lyrics Studio</h2>
                        <p className="text-xs md:text-sm text-text-secondary mt-1">
                            Syncing: <span className="text-accent-tertiary font-bold">{songTitle}</span> by {songArtist}
                        </p>
                    </div>
                    <button onClick={onCancel} className="text-text-muted hover:text-error transition-colors p-2 font-bold text-xl">
                        ✕
                    </button>
                </div>

                {/* PHASE 1 VIEW */}
                {phase === 1 && (
                    <div className="p-4 md:p-6 flex flex-col h-full overflow-hidden">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <p className="text-sm text-text-secondary">Paste raw text OR existing .lrc data here.</p>
                            <button 
                                onClick={handleAutoGenerate} 
                                disabled={isGenerating}
                                className="text-xs bg-background-hover border border-border text-accent-primary px-4 py-2 rounded-lg hover:border-accent-primary hover:bg-background-active transition-all duration-300 flex items-center gap-2 font-bold whitespace-nowrap"
                            >
                                {isGenerating ? '⏳ Processing...' : '✨ Auto-Generate'}
                            </button>
                        </div>
                        
                        <textarea 
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                            placeholder="Paste Japanese, Romaji, or English lyrics here..."
                            className="flex-1 w-full bg-background-primary border border-border rounded-xl p-4 text-sm text-text-primary focus:border-accent-primary focus:outline-none transition-colors resize-none mb-6"
                        />

                        <div className="flex justify-end gap-4 shrink-0">
                            <button onClick={onCancel} className="px-6 py-3 rounded-xl font-bold text-text-secondary hover:text-text-primary hover:bg-background-hover transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleStartSync} className="bg-accent-primary text-background-primary px-8 py-3 rounded-xl font-bold hover:bg-accent-hover transition-colors shadow-lg shadow-accent-primary/20">
                                Proceed to Sync ➔
                            </button>
                        </div>
                    </div>
                )}

                {/* PHASE 2 VIEW */}
                {phase === 2 && (
                    <div className="flex flex-col h-full overflow-hidden">
                        
                        {/* Audio Controller Bar */}
                        <div className="bg-background-primary p-4 border-b border-border flex flex-col md:flex-row items-center gap-4 shrink-0">
                            <button 
                                onClick={togglePlay}
                                className="w-12 h-12 rounded-full bg-accent-primary text-background-primary flex items-center justify-center font-black hover:bg-accent-hover transition-transform hover:scale-105 shrink-0"
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
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 bg-background-primary/50">
                            {syncLines.map((line, index) => {
                                const isActive = index === activeIndex;
                                const isStamped = line.time !== null;

                                return (
                                    <div 
                                        key={index}
                                        ref={isActive ? activeLineRef : null}
                                        onClick={() => setActiveIndex(index)}
                                        className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                                            isActive 
                                                ? 'bg-background-active border-l-4 border-accent-primary scale-[1.02]' 
                                                : 'hover:bg-background-hover border-l-4 border-transparent'
                                        }`}
                                    >
                                        <div className={`font-mono text-xs w-20 shrink-0 ${isStamped ? 'text-success' : 'text-text-muted'}`}>
                                            {isStamped ? formatLrcTime(line.time) : '[--:--.--]'}
                                        </div>
                                        <div className={`text-sm md:text-base font-medium ${isActive ? 'text-text-primary text-lg' : 'text-text-secondary'}`}>
                                            {line.text}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer Controls */}
                        <div className="p-4 border-t border-border bg-background-secondary shrink-0">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="text-xs text-text-muted hidden md:flex gap-4">
                                    <span><kbd className="bg-background-primary px-2 py-1 rounded border border-border text-text-primary">Space</kbd> Stamp Time</span>
                                    <span><kbd className="bg-background-primary px-2 py-1 rounded border border-border text-text-primary">↑↓</kbd> Move Line</span>
                                    <span><kbd className="bg-background-primary px-2 py-1 rounded border border-border text-text-primary">←→</kbd> Scrub Audio</span>
                                </div>
                                
                                <div className="flex gap-4 w-full md:w-auto">
                                    <button onClick={() => setPhase(1)} className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-text-secondary hover:text-text-primary hover:bg-background-hover transition-colors">
                                        Back
                                    </button>
                                    <button 
                                        onClick={handleSave} 
                                        disabled={isSaving}
                                        className="flex-1 md:flex-none bg-success text-background-primary px-8 py-3 rounded-xl font-bold hover:bg-[#3bca6b] transition-colors shadow-lg shadow-success/20 disabled:opacity-50"
                                    >
                                        {isSaving ? 'Saving...' : 'Save Lyrics'}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default LyricsSyncer;