import React, { useState } from 'react';
import PlaylistModal from '../components/PlaylistModal';

const AddToPlaylistButton = ({ songId, variant = 'bottom', className = '', children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const BottomPlayerIcon = () => (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-5 h-5 md:w-6 md:h-6 transition-all duration-300 group-hover:scale-110 group-hover:text-accent-primary"
        >
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <path d="M4 17v4m-2-2h4" strokeWidth="2.5" className="text-accent-primary group-hover:text-accent-hover transition-colors"></path>
        </svg>
    );

    const FullScreenIcon = () => (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-7 h-7 md:w-8 md:h-8 transition-all duration-300 group-hover:scale-110 group-hover:text-accent-tertiary drop-shadow-xl"
        >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            <line x1="12" y1="11" x2="12" y2="17" strokeWidth="2.5" className="text-accent-primary" />
            <line x1="9" y1="14" x2="15" y2="14" strokeWidth="2.5" className="text-accent-primary" />
        </svg>
    );

    return (
        <>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation(); 
                    e.preventDefault(); 
                    setIsModalOpen(true);
                }}
                aria-label="Add to Playlist"
                title="Add to Playlist"
                className={`group flex items-center justify-center text-text-secondary hover:text-text-primary transition-all duration-300 active:scale-90 ${className}`} 
            >
                
                {children ? children : (
                    variant === 'full' ? <FullScreenIcon /> : <BottomPlayerIcon />
                )}
            </button>

            {/* Modal Logic */}
            <PlaylistModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                songId={songId} 
            />
        </>
    );
};

export default AddToPlaylistButton;