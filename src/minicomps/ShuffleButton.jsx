import React from 'react';
import { useSongs } from '../context/SongContext';

const ShuffleIcon = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
        <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
);

const ShuffleButton = ({ variant = 'bottomplayer', className = '', onClick }) => {
    // We only need the context for the player variants
    const { isShuffle, toggleShuffle, playQueue } = useSongs();

    // ==========================================
    // VARIANT 1: PLAYLIST ACTION (Big Hero Button)
    // This is an ACTION, not a state toggle. It should never light up based on global state.
    // ==========================================
    if (variant === 'action') {
        return (
            <button 
                type="button"
                onClick={onClick} // Just fires the action passed from the page
                className={`flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold tracking-widest uppercase transition-all duration-300 active:scale-95 shadow-lg bg-background-secondary text-text-primary border border-border hover:bg-background-hover hover:text-accent-primary hover:border-accent-primary/50 ${className}`}
            >
                <ShuffleIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-[10px] md:text-xs">Shuffle Play</span>
            </button>
        );
    }

    // ==========================================
    // PLAYER TOGGLE LOGIC (For variants 2 & 3)
    // ==========================================
    const handleToggleClick = (e) => {
        e.stopPropagation();
        toggleShuffle();
        if (onClick) onClick(e); 
    };

    // ==========================================
    // VARIANT 2: FULLSCREEN (Minimal / Utility View)
    // ==========================================
    if (variant === 'fullscreen') {
        return (
            <button 
                type="button"
                onClick={handleToggleClick}
                title={isShuffle ? "Order: Shuffled" : "Order: Sequential"}
                className={`p-2 transition-all duration-300 hover:scale-110 active:scale-95 ${
                    isShuffle 
                        ? 'text-accent-primary drop-shadow-[0_0_12px_rgba(157,92,250,0.6)]' 
                        : 'text-text-muted hover:text-text-primary'
                } ${className}`}
            >
                <ShuffleIcon className="w-5 h-5 md:w-6 md:h-6" />
            </button>
        );
    }

    // ==========================================
    // VARIANT 3: BOTTOM PLAYER (Default)
    // ==========================================
    return (
        <button 
            type="button"
            onClick={handleToggleClick}
            title={isShuffle ? "Order: Shuffled" : "Order: Sequential"}
            className={`relative group flex items-center justify-center p-2 transition-all duration-300 active:scale-90 ${
                isShuffle 
                    ? 'text-accent-primary drop-shadow-[0_0_8px_rgba(157,92,250,0.5)]' 
                    : 'text-text-secondary hover:text-text-primary'
            } ${className}`}
        >
            <ShuffleIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            
            <div className={`absolute bottom-0 w-1 h-1 bg-accent-primary rounded-full transition-all duration-500 shadow-[0_0_10px_var(--accent-primary)] ${
                isShuffle ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`} />
        </button>
    );
};

export default ShuffleButton;