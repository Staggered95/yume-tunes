import React, { useState, useRef, useEffect } from 'react';
import { useSongs } from '../context/SongContext';
import { useSmartPosition } from '../hooks/useSmartPosition'; // Import your new superpower

const OptionsMenu = ({ song, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const menuRef = useRef(null);
    const dropdownRef = useRef(null); 
    const { addToQueue } = useSongs();

    // MAGIC: We hand the hook our state and refs, and it hands us the perfect inline styles
    const positionStyle = useSmartPosition(isOpen, menuRef, dropdownRef);

    // Close on outside click
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

    const handleAddToQueue = (e) => {
        e.stopPropagation();
        addToQueue(song);
        setIsOpen(false);
    };

    return (
        <div className={`relative inline-block ${className}`} ref={menuRef}>
            {/* The 3-Dot Button */}
            <button 
                onClick={handleToggle}
                className="p-2 text-text-secondary hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                </svg>
            </button>

            {/* The Smart Dropdown Menu */}
            {isOpen && (
                <div 
                    ref={dropdownRef}
                    className="absolute w-48 bg-zinc-900 border border-white/10 rounded-md shadow-2xl py-1 z-[100] overflow-hidden"
                    style={positionStyle} // Applied here!
                >
                    <button 
                        onClick={handleAddToQueue}
                        className="w-full text-left px-4 py-3 text-sm text-text-primary hover:bg-white/10 transition-colors"
                    >
                        Add to queue
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm text-text-primary hover:bg-white/10 transition-colors"
                    >
                        Add to playlist
                    </button>
                </div>
            )}
        </div>
    );
};

export default OptionsMenu;