import React from 'react';
import { useSongs } from '../context/SongContext';

const ShuffleButton = ({ className = '' }) => {
    const { isShuffle, toggleShuffle } = useSongs();

    return (
        <button 
            onClick={toggleShuffle}
            title="Shuffle"
            className={`group flex items-center justify-center transition-colors ${
                isShuffle ? 'text-accent-primary' : 'text-text-secondary hover:text-white'
            } ${className}`}
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="transition-transform group-hover:scale-110"
            >
                {/* A sleek intertwined arrows SVG for shuffle */}
                <polyline points="16 3 21 3 21 8"></polyline>
                <line x1="4" y1="20" x2="21" y2="3"></line>
                <polyline points="21 16 21 21 16 21"></polyline>
                <line x1="15" y1="15" x2="21" y2="21"></line>
                <line x1="4" y1="4" x2="9" y2="9"></line>
            </svg>
            
            {/* Optional: A tiny dot underneath to indicate it's active (Spotify style) */}
            {isShuffle && (
                <div className="absolute -bottom-2 w-1 h-1 bg-accent-primary rounded-full"></div>
            )}
        </button>
    );
};

export default ShuffleButton;