import { useState, useRef, useEffect } from "react";
import { usePlayback } from "../context/PlaybackContext";

const LiveLyrics = ({ lyrics, language }) => {
    const [time, setTime] = useState(0);
    const lyricRefs = useRef([]);
    const rAFRef = useRef(null); // Ref to hold our animation frame
    const { audioRef } = usePlayback();

    // === 1. THE 60FPS TIME TRACKER ===
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // This loop runs 60 times a second for buttery smooth liquid fills!
        const updateLoop = () => {
            setTime(audio.currentTime);
            rAFRef.current = requestAnimationFrame(updateLoop);
        };

        const handlePlay = () => {
            rAFRef.current = requestAnimationFrame(updateLoop);
        };

        const handlePause = () => {
            cancelAnimationFrame(rAFRef.current);
        };

        // If it's already playing when we mount, start the loop
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
            // Added block: 'center' to keep it perfectly in the middle of the screen
            lyricRefs.current[activeIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [activeIndex]);

    const handleSeek = (targetTime) => {
        if (audioRef.current) audioRef.current.currentTime = targetTime;
        setTime(targetTime); // Instant visual feedback
    };

    return (
        // Added a CSS mask to create a beautiful fade-out effect at the top and bottom edges!
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
                    fillPercent = 100; // Fully colored if it's already sung
                } else if (isActive) {
                    const startTime = line.time;
                    // Find the duration of this line. 
                    // (If it's the last line, we default to 5 seconds so it still fills)
                    const nextTime = lyrics[i + 1]?.time || startTime + 5;
                    
                    // Cap the fill duration at 4 seconds so it doesn't fill too slowly during long instrumental breaks
                    const duration = Math.min(nextTime - startTime, 4); 
                    
                    const progress = (time - startTime) / duration;
                    // Clamp between 0 and 100
                    fillPercent = Math.min(Math.max(progress * 100, 0), 100); 
                }

                return (
                    <p 
                        key={i}
                        ref={el => lyricRefs.current[i] = el}
                        onClick={() => handleSeek(line.time)}
                        className={`text-2xl md:text-5xl font-black py-4 transition-all duration-500 cursor-pointer origin-left ${
                            isActive 
                                ? 'scale-105 blur-0' 
                                : isPast
                                    ? 'opacity-50 blur-[0.5px] hover:opacity-100 hover:blur-none'
                                    : 'opacity-20 blur-[1.5px] hover:opacity-50 hover:blur-none'
                        }`}
                    >
                        {/* THE MAGIC GRADIENT SPAN */}
                        <span 
                            className="inline-block bg-clip-text text-transparent"
                            style={{
                                backgroundImage: `linear-gradient(to right, #ffffff ${fillPercent}%, rgba(255, 255, 255, 0.2) ${fillPercent}%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                // Fallback base color just in case
                                backgroundColor: 'rgba(255, 255, 255, 0.2)' 
                            }}
                        >
                            {line.text}
                        </span>
                    </p>
                );
            })}
        </div>
    );
};

export default LiveLyrics;