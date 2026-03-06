import React from 'react';
import { useSongs } from '../context/SongContext';

const ShuffleButton = ({ className = '', size = "w-5 h-5" }) => {
    const { isShuffle, toggleShuffle } = useSongs();

    return (
        <button 
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                toggleShuffle();
            }}
            title={isShuffle ? "Order: Shuffled" : "Order: Sequential"}
            className={`relative group flex items-center justify-center transition-all duration-300 active:scale-90 ${
                isShuffle 
                    ? 'text-accent-primary drop-shadow-[0_0_8px_rgba(157,92,250,0.5)]' 
                    : 'text-text-secondary hover:text-text-primary'
            } ${className}`}
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={`${size} transition-transform duration-300 group-hover:scale-110`}
            >
                {/* Clean, symmetrical shuffle arrows */}
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
            
            {/* The Active Indicator (Dot) */}
            <div className={`absolute -bottom-1.5 w-1 h-1 bg-accent-primary rounded-full transition-all duration-500 shadow-[0_0_10px_var(--accent-primary)] ${
                isShuffle ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`} />
        </button>
    );
};

export default ShuffleButton;