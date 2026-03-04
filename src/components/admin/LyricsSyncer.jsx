import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

// Helper to format seconds into standard LRC format: [mm:ss.xx]
const formatLrcTime = (timeInSeconds) => {
    const min = Math.floor(timeInSeconds / 60);
    const sec = (timeInSeconds % 60).toFixed(2);
    return `[${min.toString().padStart(2, '0')}:${sec.padStart(5, '0')}]`;
};

const LyricsSyncer = ({ songId, audioUrl, initialLyrics, onCancel, onSaveSuccess }) => {
    const { authFetch } = useAuth();
    const { addToast } = useToast();

    // App Phases: 1 = Paste Text, 2 = Sync Timing
    const [phase, setPhase] = useState(1);
    const [rawText, setRawText] = useState(initialLyrics || '');
    
    // Syncing States
    const [syncLines, setSyncLines] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const audioRef = useRef(null);
    const activeLineRef = useRef(null); // Used to auto-scroll

    // --- PHASE 1: PREPARATION ---
    const handleStartSync = () => {
        if (!rawText.trim()) return addToast("Please paste some lyrics first", "error");

        // Split text by newlines, remove totally empty lines, and format as objects
        const lines = rawText.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => ({ text: line, time: null }));

        setSyncLines(lines);
        setActiveIndex(0);
        setPhase(2);
    };

    // --- PHASE 2: THE SYNC STUDIO ---
    // Auto-scroll to the active line so the admin doesn't have to scroll manually!
    useEffect(() => {
        if (activeLineRef.current) {
            activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [activeIndex]);

    // Listen for the Spacebar to stamp the time
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (phase !== 2 || activeIndex >= syncLines.length) return;
            
            // Prevent spacebar from scrolling the page
            if (e.code === 'Space') {
                e.preventDefault(); 
                
                if (!isPlaying) {
                    audioRef.current.play();
                    setIsPlaying(true);
                    return;
                }

                stampTime();
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
        
        setActiveIndex(prev => prev + 1); // Move to next line
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

    const resetSync = () => {
        setSyncLines(syncLines.map(l => ({ ...l, time: null })));
        setActiveIndex(0);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    // --- PHASE 3: SAVING ---
    const handleSave = async () => {
        setIsSaving(true);
        
        // Generate the final LRC string
        const finalLrc = syncLines
            .map(line => `${formatLrcTime(line.time || 0)} ${line.text}`)
            .join('\n');

        try {
            // Send to a specialized backend endpoint
            const res = await authFetch(`/admin/songs/${songId}/lyrics`, {
                method: 'PUT',
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

            {/* Hidden Audio Element */}
            <audio 
                ref={audioRef} 
                src={`http://localhost:5000${audioUrl}`} 
                onEnded={() => setIsPlaying(false)} 
            />

            {phase === 1 && (
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-white/50">Paste the raw text of the song here. Make sure each phrase is on its own line.</p>
                    <textarea 
                        value={rawText}
                        onChange={(e) => setRawText(e.target.value)}
                        placeholder="Oshiete oshiete yo sono shikumi wo..."
                        className="w-full h-96 bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-accent-primary outline-none resize-none font-mono text-sm leading-relaxed"
                    />
                    <button onClick={handleStartSync} className="bg-accent-primary text-black py-3 rounded-full font-bold hover:bg-accent-hover self-end px-8">
                        Proceed to Sync Studio →
                    </button>
                </div>
            )}

            {phase === 2 && (
                <div className="flex flex-col h-[600px]">
                    
                    {/* Controls Header */}
                    <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl mb-4 border border-white/10 shrink-0">
                        <div className="flex gap-4">
                            <button onClick={togglePlay} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-bold">
                                {isPlaying ? '⏸ Pause' : '▶️ Play'}
                            </button>
                            <button onClick={resetSync} className="px-4 py-2 text-white/50 hover:text-white">
                                ↺ Reset Time
                            </button>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Instructions</p>
                            <p className="text-sm">Press <kbd className="bg-white/10 px-2 py-1 rounded text-accent-primary font-mono">SPACE</kbd> exactly when the highlighted line is sung.</p>
                        </div>
                    </div>

                    {/* Scrolling Lyrics Area */}
                    <div className="flex-1 overflow-y-auto bg-black/20 rounded-xl p-6 space-y-4 border border-white/5 relative">
                        {syncLines.map((line, idx) => {
                            const isActive = idx === activeIndex;
                            const isDone = idx < activeIndex;

                            return (
                                <div 
                                    key={idx} 
                                    ref={isActive ? activeLineRef : null}
                                    className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
                                        isActive ? 'bg-accent-primary/20 border border-accent-primary/50 shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-105 origin-left' : 
                                        isDone ? 'opacity-40' : 'opacity-100'
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
                        
                        {/* Done State */}
                        {activeIndex >= syncLines.length && (
                            <div className="text-center py-12">
                                <h3 className="text-2xl font-bold text-accent-primary mb-2">🎉 Sync Complete!</h3>
                                <p className="text-white/50 mb-6">All lines have been successfully timed.</p>
                                <button onClick={handleSave} disabled={isSaving} className="bg-accent-primary text-black px-8 py-3 rounded-full font-bold">
                                    {isSaving ? 'Saving...' : 'Save Lyrics to Database'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LyricsSyncer;