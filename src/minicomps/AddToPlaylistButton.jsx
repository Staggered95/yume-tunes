import React, { useState } from 'react';
import PlaylistModal from '../components/PlaylistModal'; // Adjust path if needed

const AddToPlaylistButton = ({ songId, variant = 'bottom', className = '' }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- SVG 1: Bottom Player (Minimal, sleek 'List-Plus') ---
    const BottomPlayerIcon = () => (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="transition-transform group-hover:scale-110"
        >
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            {/* The Plus Badge */}
            <path d="M4 17v4m-2-2h4" strokeWidth="2.5" className="text-accent-primary"></path>
        </svg>
    );

    // --- SVG 2: Full Screen Player (Bolder, 'Music-Folder-Plus') ---
    const FullScreenIcon = () => (
        <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="28" 
    height="28" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="transition-transform group-hover:scale-110 drop-shadow-lg"
>
    {/* Notice the /> at the end of each line now! */}
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    <line x1="12" y1="11" x2="12" y2="17" strokeWidth="2" className="text-accent-primary" />
    <line x1="9" y1="14" x2="15" y2="14" strokeWidth="2" className="text-accent-primary" />
</svg>
    );

    return (
        <>
            {/* The Trigger Button */}
            <button
                onClick={(e) => {
        e.stopPropagation(); // Prevents clicks from leaking to the player
        setIsModalOpen(true);
    }}
                title="Add to Playlist"
                className={`group flex items-center justify-center text-text-secondary hover:text-white transition-colors ${className}`}
            >
                {variant === 'full' ? <FullScreenIcon /> : <BottomPlayerIcon />}
            </button>

            {/* The Hidden Modal (Only mounts when isModalOpen is true) */}
            <PlaylistModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                songId={songId} 
            />
        </>
    );
};

export default AddToPlaylistButton;