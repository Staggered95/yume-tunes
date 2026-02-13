import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSongs } from '../context/SongContext';

export default function SearchAutocomplete() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    const { selectSong } = useSongs();

    useEffect(() => {
        setFocusedIndex(-1);
    }, [query]);

    // Debounce Logic: Prevents DDOSing your Arch server on every keystroke
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


    // Handle clicking outside to close the dropdown
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
            const response = await axios.get(`http://localhost:5000/songs/search?q=${searchTerm}`);
            setResults(response.data.data);
            setShowDropdown(true);
        } catch (err) {
            console.error("Search error:", err);
        }
    };

    const handleKeyDown = (e) => {
        // 1. Arrow Down
        if (e.key === 'ArrowDown') {
            e.preventDefault(); // Stop page scrolling
            setFocusedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        }
        // 2. Arrow Up
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
        }
        // 3. Enter Key
        else if (e.key === 'Enter') {
            if (focusedIndex >= 0 && results[focusedIndex]) {
                // If an item is highlighted, play it
                selectSong(results[focusedIndex]);
                setShowDropdown(false);
            } else if (query.trim()) {
                // If nothing is highlighted, go to full search page
                setShowDropdown(false);
                navigate(`/search?q=${encodeURIComponent(query)}`);
            }
        }
        // 4. Escape Key
        else if (e.key === 'Escape') {
            setShowDropdown(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div className="relative left-3" ref={dropdownRef}>
            {/* The Input Field */}
            <input 
                ref={inputRef}
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length > 1 && setShowDropdown(true)}
                onKeyDown={handleKeyDown}
                className="bg-background-secondary focus:bg-background-active text-text-primary placeholder:text-text-secondary pl-10 lg:h-9 w-[33.33vw] hidden lg:inline md:inline h-8 rounded-lg outline-none transition-colors duration-300 ease-in-out"
                placeholder="Search"
            />
            
            {/* Search Icon */}
            <svg className="hidden md:inline lg:inline absolute left-1 w-6 h-6 mt-1.5 ml-1 text-text-secondary font-light"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>

            {/* The Results Dropdown */}
            {showDropdown && results.length > 0 && (
    <div className="absolute top-full left-0 mt-2 w-full bg-[#181818] border border-[#333] rounded-lg shadow-2xl z-[100] overflow-hidden">
        {results.map((song, index) => (
            <div 
                key={song.id} 
                onClick={() => { selectSong(song); setShowDropdown(false); }}
                // THE KEY PART: Add conditional background for focus
                className={`flex items-center gap-3 p-3 cursor-pointer transition-colors group
                    ${focusedIndex === index ? 'bg-[#282828] border-l-4 border-accent-primary' : 'hover:bg-[#282828]'}
                `}
            >
                <img src={`http://localhost:5000${song.cover_path}`} className="w-10 h-10 rounded object-cover" />
                <div className="overflow-hidden">
                    <p className={`text-sm font-medium truncate ${focusedIndex === index ? 'text-accent-primary' : 'text-white'}`}>
                        {song.title}
                    </p>
                    <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                </div>
            </div>
        ))}
    </div>
)}
        </div>
    );
}