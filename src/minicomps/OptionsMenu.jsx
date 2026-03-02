import React, { useState, useRef, useEffect } from 'react';
import { useSongs } from '../context/SongContext';
import { useToast } from '../context/ToastContext';
import { useSmartPosition } from '../hooks/useSmartPosition'; 
import PlaylistModal from '../components/PlaylistModal'; // Import the Modal directly!


const OptionsMenu = ({ song, className = "" }) => {
    if (!song) return null;
    const [isOpen, setIsOpen] = useState(false);
    // 1. Bring back the modal state here so it survives the dropdown closing
    const [isModalOpen, setIsModalOpen] = useState(false); 
    
    const menuRef = useRef(null);
    const dropdownRef = useRef(null); 
    const { addToQueue, playNextInQueue } = useSongs();
    const { addToast } = useToast();

    const positionStyle = useSmartPosition(isOpen, menuRef, dropdownRef);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleToggle = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handlePlayNext = (e) => {
        e.stopPropagation();
        playNextInQueue(song);
        addToast("Playing next", "success");
        setIsOpen(false);
    };

    const handleAddToQueue = (e) => {
        e.stopPropagation();
        addToQueue(song);
        addToast("Added to queue", "success");
        setIsOpen(false);
    };

    const handleAddToPlaylist = (e) => {
        e.stopPropagation();
        setIsOpen(false); // 2. Close the dropdown menu instantly
        setIsModalOpen(true); // 3. Open the modal safely
    };

    return (
        <div className={`relative inline-block ${className}`} ref={menuRef}>
            <button 
                onClick={handleToggle}
                className="p-1.5 text-text-secondary hover:text-white transition-colors rounded-full hover:bg-white/10"
                aria-label="More options"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                </svg>
            </button>

            {/* The Dropdown Block (Unmounts when isOpen is false) */}
            {isOpen && (
                <div 
                    ref={dropdownRef}
                    className="absolute w-56 bg-background-active border border-white/5 rounded-md shadow-2xl py-1.5 z-[100] overflow-hidden "
                    style={positionStyle} 
                >
                    <button 
                        onClick={handlePlayNext}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-white/10 transition-colors group"
                    >
                        <svg className="w-4 h-4 text-text-secondary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                        Play Next
                    </button>
                    
                    <button 
                        onClick={handleAddToQueue}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-white/10 transition-colors group"
                    >
                        <svg className="w-4 h-4 text-text-secondary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h10m4-4v8m-4-4h8" />
                        </svg>
                        Add to queue
                    </button>
                    
                    <div className="h-px bg-white/5 my-1 mx-2"></div>
                    
                    {/* Reverted back to a standard button that triggers our new hoisted state */}
                    <button 
                        onClick={handleAddToPlaylist}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-white/10 transition-colors group"
                    >
                        <svg className="w-4 h-4 text-text-secondary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Add to playlist
                    </button>
                </div>
            )}

            {/* 4. SAFE ZONE: The modal lives OUTSIDE the dropdown block!
                It uses song.id so the database doesn't crash, and stays alive 
                even when the dropdown closes. 
            */}
            <PlaylistModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                songId={song.id} 
            />
        </div>
    );
};

export default OptionsMenu;