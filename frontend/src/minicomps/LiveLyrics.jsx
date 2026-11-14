import { useState, useRef, useEffect } from "react";
import { usePlayback } from "../context/PlaybackContext";

const LiveLyrics = ({ lyrics, language }) => {
    const [time, setTime] = useState(0);
    const lyricRefs = useRef([]);
    const rAFRef = useRef(null);
    const { audioRef } = usePlayback();

    // === 1. TIME TRACKER ===
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateLoop = () => {
            setTime(audio.currentTime);
            rAFRef.current = requestAnimationFrame(updateLoop);
        };

        const handlePlay = () => rAFRef.current = requestAnimationFrame(updateLoop);
        const handlePause = () => cancelAnimationFrame(rAFRef.current);

        if (!audio.paused) handlePlay();

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('seeked', () => setTime(audio.currentTime));

        return () => {
            cancelAnimationFrame(rAFRef.current);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('seeked', () => setTime(audio.currentTime));
        };
    }, [audioRef]);

    // === 2. ACTIVE LYRIC & SCROLLING ===
    const activeIndex = lyrics.findLastIndex(line => time >= line.time);

    useEffect(() => {
        if (activeIndex !== -1 && lyricRefs.current[activeIndex]) {
            lyricRefs.current[activeIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [activeIndex]);

    const handleSeek = (targetTime) => {
        if (audioRef.current) audioRef.current.currentTime = targetTime;
        setTime(targetTime); 
    };

    return (
        <div 
            className="relative w-full h-full overflow-y-auto scrollbar-none px-4 md:px-10 py-[40vh]"
            style={{ 
                maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)', 
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' 
            }}
        >
            {lyrics.map((line, i) => {
                const isActive = i === activeIndex;
                const isPast = i < activeIndex;
                
                // === 3. THE LIQUID FILL MATH ===
                let fillPercent = 0;
                
                if (isPast) {
                    fillPercent = 100;
                } else if (isActive) {
                    const startTime = line.time;
                    const nextTime = lyrics[i + 1]?.time || startTime + 5;
                    const duration = Math.min(nextTime - startTime, 4); 
                    const progress = (time - startTime) / duration;
                    fillPercent = Math.min(Math.max(progress * 100, 0), 100); 
                }

                return (
                    <p 
                        key={i}
                        ref={el => lyricRefs.current[i] = el}
                        onClick={() => handleSeek(line.time)}
                        className={`text-2xl md:text-5xl font-black py-4  transition-all duration-500 cursor-pointer origin-left ${
                            isActive 
                                ? 'scale-105 blur-0' 
                                : isPast
                                    ? 'blur-[0.5px] hover:blur-none'
                                    : 'blur-[1.5px] hover:blur-none'
                        }`}
                    >
                        {/* === THE THEME-AWARE LAYERED TEXT === */}
                        <span className="relative inline-block">
                            
                            {/* BOTTOM LAYER (Unfilled Future Text) */}
                            <span className={`transition-colors duration-300 ${
                                isPast ? 'text-text-secondary opacity-60' : 'text-text-muted opacity-30'
                            }`}>
                                {line.text}
                            </span>

                            {/* TOP LAYER (The Liquid Fill) */}
                            <span 
                                className={`absolute left-0 top-0 whitespace-pre-wrap ${
                                    isActive ? 'text-accent-primary drop-shadow-[0_0_8px_rgba(var(--accent-primary-rgb),0.5)]' : 'text-text-primary'
                                }`}
                                style={{ 
                                    // This dynamically clips the top layer from the right side!
                                    clipPath: `inset(0 ${100 - fillPercent}% 0 0)`,
                                    WebkitClipPath: `inset(0 ${100 - fillPercent}% 0 0)`
                                }}
                            >
                                {line.text}
                            </span>
                            
                        </span>
                    </p>
                );
            })}
        </div>
    );
};

export default LiveLyrics;