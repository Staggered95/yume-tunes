import React, { useState, useEffect } from 'react';
import { usePlayback } from '../context/PlaybackContext';

const ProgressBar = ({ variant = 'bottom' }) => {
    const { audioRef } = usePlayback();
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Sync state with the global audio engine
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Force immediate sync on mount
        if (audio.currentTime) setTime(audio.currentTime);
        if (audio.duration) setDuration(audio.duration);

        const updateTime = () => setTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
        };
    }, [audioRef]);

    const handleSeek = (newTime) => {
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setTime(newTime);
        }
    };

    const formatTime = (s) => {
        if (!s || isNaN(s)) return "0:00";
        const min = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const progressPercent = duration > 0 ? (time / duration) * 100 : 0;

    // --- SHARED LOGIC: The Hidden Range Input ---
    const RangeInput = () => (
        <input
            type="range"
            min="0"
            max={duration || 100}
            value={time}
            step="0.1" // Added step for smoother scrubbing
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="absolute h-full w-full inset-0 z-20 opacity-0 cursor-pointer"
        />
    );

    // --- VARIANT A: Bottom Player (Standard Theme) ---
    if (variant === 'bottom') {
        return (
            <div className="w-full group px-3">
                <div className="relative flex items-center h-1 bg-background-active rounded-full overflow-visible">
                    <RangeInput />
                    
                    {/* The Visual Fill */}
                    <div 
                        className="h-1 bg-accent-secondary group-hover:bg-accent-primary transition-colors duration-300 rounded-full shadow-[0_0_10px_rgba(224,86,253,0.2)]" 
                        style={{ width: `${progressPercent}%` }}
                    />
                    
                    {/* The Draggable Knob (Thumb) */}
                    <div 
                        className="absolute w-3 h-3 bg-text-primary border-2 border-accent-primary opacity-0 group-hover:opacity-100 rounded-full shadow-lg transform -translate-x-1/2 pointer-events-none transition-opacity duration-300" 
                        style={{ left: `${progressPercent}%` }}
                    />
                </div>
                
                <div className="flex justify-between pt-1.5 text-[10px] md:text-xs font-bold tracking-tighter text-text-muted">
                    <span>{formatTime(time)}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Placeholder for future features like 'remaining time' toggle */}
                        <svg className="w-3 h-3 rotate-180" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
                    </span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>
        );
    }

    // --- VARIANT B: Fullscreen / Minimal (Zen Theme) ---
    if (variant === 'fullscreen') {
        return (
            <div className="w-full space-y-3 group/full px-4">
                <div className="relative flex items-center h-1.5 w-full bg-text-primary/10 rounded-full">
                    <RangeInput />
                    
                    {/* Glowing Fill */}
                    <div 
                        className="absolute top-0 left-0 h-full bg-text-primary rounded-full transition-all duration-75 pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                
                <div className="flex justify-between text-xs font-black tracking-widest text-text-secondary/40 font-mono">
                    <span className="group-hover/full:text-text-primary transition-colors">{formatTime(time)}</span>
                    <span className="group-hover/full:text-text-primary transition-colors">{formatTime(duration)}</span>
                </div>
            </div>
        );
    }

    return null;
};

export default ProgressBar;