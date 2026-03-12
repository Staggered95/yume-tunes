import React from 'react';
import MorphingPlayPauseButton from './MorphingPlayPauseButton';
import { useSongs } from '../context/SongContext';
import { usePlayback } from '../context/PlaybackContext';

const MediaControllers = ({ variant = 'bottomplayer', className = '' }) => {
    const { nextSong, prevSong } = useSongs(); 
    // 1. Pull isBuffering into the component
    const { isPlaying, isBuffering, togglePlay } = usePlayback();

    // ==========================================
    // VARIANT 1: FULLSCREEN (Minimal View)
    // ==========================================
    if (variant === 'fullscreen') {
        return (
            <div className={`flex items-center gap-8 md:gap-12 ${className}`}>
                <button 
                    onClick={(e) => { e.stopPropagation(); prevSong(); }}
                    className="p-2 text-text-secondary hover:text-text-primary transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="Previous Song"
                >
                  <svg viewBox="0 0 24 24" className="w-10 h-10 md:w-14 md:h-14 fill-current">
                    <rect x="5" y="5" width="2" height="14" rx="1" />
                    <path d="M19 7 Q19 6 18 6 L10 11 Q9 12 10 13 L18 18 Q19 18 19 17 Z" />
                  </svg>           
                </button>

                <button 
                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                    className="p-5 md:p-6 bg-text-primary text-background-primary rounded-full hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl shadow-text-primary/20 hover:shadow-text-primary/40 flex items-center justify-center shrink-0"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {/* 2. Conditionally render the Spinner vs Play/Pause */}
                    {isBuffering ? (
                        <svg className="animate-spin w-8 h-8 md:w-10 md:h-10 text-background-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : isPlaying ? (
                        <svg className="w-8 h-8 md:w-10 md:h-10 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                        <svg className="w-8 h-8 md:w-10 md:h-10 ml-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                </button>

                <button 
                    onClick={(e) => { e.stopPropagation(); nextSong(); }}
                    className="p-2 text-text-secondary hover:text-text-primary transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="Next Song"
                >
                  <svg viewBox="0 0 24 24" className="w-10 h-10 md:w-14 md:h-14 fill-current">
                    <rect x="17" y="5" width="2" height="14" rx="1" />
                    <path d="M5 7 Q5 6 6 6 L14 11 Q15 12 14 13 L6 18 Q5 18 5 17Z" />
                  </svg>            
                </button>
            </div>
        );
    }

    // ==========================================
    // VARIANT 2: UTILITY (Split-Pane View)
    // ==========================================
    if (variant === 'utility') {
        return (
            <div className={`flex items-center gap-4 md:gap-6 lg:gap-8 ${className}`}>
                <button 
                    onClick={(e) => { e.stopPropagation(); prevSong(); }}
                    className="p-2 text-text-secondary hover:text-text-primary transition-all hover:scale-110 active:scale-95 shrink-0"
                    aria-label="Previous Song"
                >
                    <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 fill-current"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                </button>
                
                <button 
                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                    className="p-3 md:p-4 lg:p-5 bg-text-primary text-background-primary rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-text-primary/10 shrink-0"
                >
                    {isBuffering ? (
                        <svg className="animate-spin w-7 h-7 md:w-8 md:h-8 text-background-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : isPlaying ? (
                        <svg className="w-7 h-7 md:w-8 md:h-8 ml-0.5" fill="current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                        <svg className="w-7 h-7 md:w-8 md:h-8 ml-1" fill="current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                </button>
                
                <button 
                    onClick={(e) => { e.stopPropagation(); nextSong(); }}
                    className="p-2 text-text-secondary hover:text-text-primary transition-all hover:scale-110 active:scale-95 shrink-0"
                    aria-label="Next Song"
                >
                    <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 fill-current"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                </button>
            </div>
        );
    }

    // ==========================================
    // VARIANT 3: BOTTOM PLAYER (Default)
    // ==========================================
    return (
        <div className={`flex gap-3 md:gap-8 items-center justify-center text-text-primary ${className}`}>
            
            <button 
                onClick={(e) => { e.stopPropagation(); prevSong(); }}
                className="hidden sm:block group p-2 text-text-secondary hover:text-text-primary transition-all duration-300 active:scale-90"
                aria-label="Previous Song"
            >
                <svg className="w-7 h-7 md:w-8 md:h-8 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 6l-8.5 6 8.5 6V6zM6 6v12h2V6H6z" />
                </svg>
            </button>

            <div className="relative group/play">
                <div className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-700 ${
                    isPlaying ? 'bg-accent-primary/30 opacity-100' : 'opacity-0'
                }`} />
                
                <div className="relative border-2 md:border-[3px] border-accent-primary group-hover/play:border-accent-hover group-hover/play:scale-105 rounded-full transition-all duration-300 shadow-lg shadow-accent-primary/10 flex items-center justify-center">
                    {/* 3. Swap the morphing button with a spinner to keep the glowing border intact! */}
                    {isBuffering ? (
                        <div className="p-[10px] md:p-[12px]">
                            <svg className="animate-spin w-6 h-6 md:w-8 md:h-8 text-accent-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : (
                        <MorphingPlayPauseButton
                          isPlaying={isPlaying}
                          onToggle={(e) => { 
                              if(e) e.stopPropagation(); 
                              togglePlay(); 
                          }}
                        />
                    )}
                </div>
            </div>

            <button 
                onClick={(e) => { e.stopPropagation(); nextSong(); }}
                className="group p-2 text-text-secondary hover:text-text-primary transition-all duration-300 active:scale-90"
                aria-label="Next Song"
            >
                <svg 
                  className="w-7 h-7 md:w-8 md:h-8 transition-transform group-hover:translate-x-1" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                >
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
            </button>
            
        </div>
    );
};

export default MediaControllers;