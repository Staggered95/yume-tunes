import React, { useState, useRef, useEffect } from 'react';
import { useSongs } from '../context/SongContext';
import { useToast } from '../context/ToastContext';
import { useSmartPosition } from '../hooks/useSmartPosition'; 
import PlaylistModal from '../components/PlaylistModal';

const OptionsMenu = ({ song, className = "" }) => {
    if (!song) return null;
    
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    
    const menuRef = useRef(null);
    const dropdownRef = useRef(null); 
    const { addToQueue, playNextInQueue } = useSongs();
    const { addToast } = useToast();

    // Ensures the menu doesn't get cut off at the screen edges
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

    const handleAction = (e, callback, message) => {
        e.stopPropagation();
        callback(song);
        if (message) addToast(message, "success");
        setIsOpen(false);
    };

    return (
        <div className={`relative inline-block ${className}`} ref={menuRef}>
            {/* Trigger Button */}
            <button 
                onClick={handleToggle}
                className="p-2 text-text-secondary hover:text-text-primary transition-all duration-300 rounded-full hover:bg-background-hover active:scale-90"
                aria-label="More options"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div 
                    ref={dropdownRef}
                    className="absolute w-56 bg-background-secondary/95  border border-border rounded-xl shadow-2xl py-2 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                    style={positionStyle} 
                >
                    <button 
                        onClick={(e) => handleAction(e, playNextInQueue, "Will play next ⏭️")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-text-primary hover:bg-background-active transition-colors group"
                    >
                        <svg className="w-4 h-4 text-text-muted group-hover:text-accent-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                        Play Next
                    </button>
                    
                    <button 
                        onClick={(e) => handleAction(e, addToQueue, "Added to your queue 🎧")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-text-primary hover:bg-background-active transition-colors group"
                    >
                        <svg className="w-4 h-4 text-text-muted group-hover:text-accent-secondary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path d="M4 6h16M4 12h16M4 18h10m4-4v8m-4-4h8" />
                        </svg>
                        Add to Queue
                    </button>
                    
                    <div className="h-px bg-border my-1.5 mx-3"></div>
                    
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                            setIsModalOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-text-primary hover:bg-background-active transition-colors group"
                    >
                        <svg className="w-4 h-4 text-text-muted group-hover:text-accent-tertiary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Add to Playlist
                    </button>
                </div>
            )}

            {/* Modal remains mounted but hidden until isModalOpen is true */}
            <PlaylistModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                songId={song.id} 
            />
        </div>
    );
};

export default OptionsMenu;