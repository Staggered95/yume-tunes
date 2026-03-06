import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // Native Axios instance
import { useSongs } from '../context/SongContext';
import { getMediaUrl } from '../utils/media';

export default function SearchAutocomplete() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const navigate = useNavigate();
    
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const itemRefs = useRef([]);

    const { selectSong } = useSongs();

    // Reset focus when query changes
    useEffect(() => {
        setFocusedIndex(-1);
    }, [query]);

    // Keep item refs in sync with results
    useEffect(() => {
        itemRefs.current = [];
    }, [results]);

    // Auto-scroll to focused item for keyboard navigation
    useEffect(() => {
        if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
            itemRefs.current[focusedIndex].scrollIntoView({
                block: "nearest",
                behavior: "smooth"
            });
        }
    }, [focusedIndex]);

    // Debounce Logic: Prevents unnecessary API calls
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim().length > 1) {
                fetchResults(query);
            } else {
                setResults([]);
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchResults = async (searchTerm) => {
        try {
            // Using the 'api' instance which already knows the baseURL
            const { data } = await api.get(`/songs/search?q=${searchTerm}`);
            setResults(data.data);
            setShowDropdown(true);
        } catch (err) {
            console.error("Search error:", err);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
        }
        else if (e.key === 'Enter') {
            if (focusedIndex >= 0 && results[focusedIndex]) {
                selectSong(results[focusedIndex]);
                setShowDropdown(false);
                setQuery(''); // Clear search on selection
            } else if (query.trim()) {
                setShowDropdown(false);
                navigate(`/search?q=${encodeURIComponent(query)}`);
            }
        }
        else if (e.key === 'Escape') {
            setShowDropdown(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div className="relative w-full max-w-md group" ref={dropdownRef}>
            {/* Search Icon */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors duration-300 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </div>

            {/* The Input Field */}
            <input 
                ref={inputRef}
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length > 1 && setShowDropdown(true)}
                onKeyDown={handleKeyDown}
                className="w-full bg-background-secondary border border-border focus:bg-background-active focus:border-accent-primary/50 text-text-primary placeholder:text-text-muted pl-10 pr-4 py-2 rounded-full outline-none transition-all duration-300 ease-in-out shadow-sm"
                placeholder="Search for songs, artists, or anime..."
            />
            
            {/* The Results Dropdown */}
            {showDropdown && results.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full max-h-[70vh] bg-background-secondary border border-border rounded-2xl shadow-2xl z-50 overflow-y-auto scrollbar-none animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2">
                        {results.map((song, index) => (
                            <div 
                                key={song.id} 
                                ref={el => itemRefs.current[index] = el}
                                onClick={() => { 
                                    selectSong(song); 
                                    setShowDropdown(false); 
                                    setQuery('');
                                }}
                                className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 group
                                    ${focusedIndex === index 
                                        ? 'bg-background-active border-l-4 border-accent-primary shadow-inner' 
                                        : 'hover:bg-background-hover border-l-4 border-transparent'}
                                `}
                            >
                                <img 
                                    src={getMediaUrl(song.cover_path)} 
                                    className="w-10 h-10 rounded-md object-cover shadow-sm shrink-0" 
                                    alt=""
                                />
                                <div className="overflow-hidden flex-1">
                                    <p className={`text-sm font-bold truncate transition-colors ${focusedIndex === index ? 'text-accent-primary' : 'text-text-primary'}`}>
                                        {song.title}
                                    </p>
                                    <p className="text-text-secondary text-xs truncate font-medium">
                                        {song.artist} • <span className="text-text-muted">{song.anime || 'Single'}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}