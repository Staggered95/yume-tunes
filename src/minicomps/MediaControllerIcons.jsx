import React from 'react';
import MorphingPlayPauseButton from './MorphingPlayPauseButton';
import { useSongs } from '../context/SongContext';
import { usePlayback } from '../context/PlaybackContext';

const MediaControllers = () => {
    const { nextSong, prevSong } = useSongs(); 
    const { isPlaying, togglePlay } = usePlayback();

    return (
        <div className="flex gap-6 md:gap-8 items-center justify-center text-text-primary">
            
            {/* Previous Track Button */}
            <button 
                onClick={(e) => { e.stopPropagation(); prevSong(); }}
                className="group p-2 text-text-secondary hover:text-text-primary transition-all duration-300 active:scale-90"
                aria-label="Previous Song"
            >
                <svg 
                  className="w-7 h-7 md:w-8 md:h-8 transition-transform group-hover:-translate-x-1" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                >
                  <path d="M18 6l-8.5 6 8.5 6V6zM6 6v12h2V6H6z" />
                </svg>
            </button>

            {/* Play/Pause Toggle with Glowing Border */}
            <div className="relative group/play">
                {/* Subtle outer glow that only appears when playing */}
                <div className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-700 ${
                    isPlaying ? 'bg-accent-primary/30 opacity-100' : 'opacity-0'
                }`} />
                
                <div className="relative border-2 md:border-[3px] border-accent-primary group-hover/play:border-accent-hover group-hover/play:scale-105 rounded-full transition-all duration-300 shadow-lg shadow-accent-primary/10">
                    <MorphingPlayPauseButton
                      isPlaying={isPlaying}
                      onToggle={togglePlay}
                    />
                </div>
            </div>

            {/* Next Track Button */}
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