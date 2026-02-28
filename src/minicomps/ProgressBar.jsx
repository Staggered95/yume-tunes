import React, { useState, useEffect } from 'react';
import { usePlayback } from '../context/PlaybackContext';

const ProgressBar = ({ variant = 'bottom' }) => {
    // 1. It grabs the audio engine itself
    const { audioRef } = usePlayback();
    
    // 2. It manages its own rapid state
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // 3. The universal time tracker
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Force initial read in case the song is already playing
        setTime(audio.currentTime || 0);
        setDuration(audio.duration || 0);

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

    // --- VARIANT A: The Bottom Player UI (Your exact code!) ---
    if (variant === 'bottom') {
        return (
            <div className="w-full group">
                <div className="relative flex items-center h-1 bg-background-secondary mx-3 rounded-full">
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={time}
                        onChange={(e) => handleSeek(Number(e.target.value))}
                        className='absolute h-full w-full inset-0 z-20 opacity-0 cursor-pointer'
                    />
                    <div 
                        className='h-1 bg-accent-secondary group-hover:bg-accent-hover transition-colors duration-200 ease-in-out rounded-full' 
                        style={{ width: `${progressPercent}%` }}
                    />
                    <div 
                        className='absolute w-3 h-3 bg-text-secondary group-hover:bg-text-primary opacity-0 group-hover:opacity-100 rounded-full shadow transform -translate-x-1/2 pointer-events-none' 
                        style={{ left: `${progressPercent}%` }}
                    />
                </div>
                <div className='flex justify-between mx-3 pt-1 text-sm text-text-secondary'>
                    <div>{formatTime(time)}</div>
                    <div className='opacity-0 group-hover:opacity-80 text-text-muted transition-opacity cursor-pointer'>▽</div>
                    <div>{formatTime(duration)}</div>
                </div>
            </div>
        );
    }

    // --- VARIANT B: The Fullscreen Minimal UI ---
    if (variant === 'fullscreen') {
        return (
            <div className="w-full space-y-2">
                <div className="relative flex items-center h-1 w-full bg-white/10 rounded-full group">
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={time}
                        onChange={(e) => handleSeek(Number(e.target.value))}
                        className='absolute h-full w-full inset-0 z-20 opacity-0 cursor-pointer'
                    />
                    <div 
                        className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-75 pointer-events-none" 
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-white/20">
                    <span>{formatTime(time)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>
        );
    }

    return null;
};

export default ProgressBar;