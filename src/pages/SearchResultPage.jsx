import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SongCard from '../components/SongCard';
import axios from 'axios';

const SearchResultPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [results, setResults] = useState([]);
    const query = searchParams.get('q') || '';
    const activeGenre = searchParams.get('genre') || '';
    const activeType = searchParams.get('type') || '';

    useEffect(() => {
        const fetchFilteredResults = async () => {
            try {
                // Your backend search controller handles these params
                const res = await axios.get(`http://localhost:5000/songs/search`, {
                    params: { q: query, genre: activeGenre, type: activeType }
                });
                setResults(res.data.data);
            } catch (err) {
                console.error("Filtering failed", err);
            }
        };
        if (query) fetchFilteredResults();
    }, [query, activeGenre, activeType]);

    // Helper to update URL params when a filter is clicked
    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) newParams.set(key, value);
        else newParams.delete(key);
        setSearchParams(newParams);
    };

    return (
        <div className="flex gap-8 p-6 text-text-primary">
            {/* 1. FILTER SIDEBAR */}
            <aside className="w-64 space-y-8 sticky top-0 h-fit">
                <div>
                    <h3 className="text-xl font-bold mb-4">Filters</h3>
                    <button 
                        onClick={() => setSearchParams({ q: query })}
                        className="text-xs text-accent-primary hover:underline"
                    >
                        Clear All
                    </button>
                </div>

                {/* Genre Filter */}
                <div>
                    <h4 className="text-sm font-semibold text-text-secondary uppercase mb-3">Genres</h4>
                    <div className="flex flex-col gap-2">
                        {['Soft', 'Rock', 'Vibe', 'Masterclass'].map(g => (
                            <label key={g} className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="radio" 
                                    name="genre"
                                    checked={activeGenre === g}
                                    onChange={() => updateFilter('genre', g)}
                                    className="accent-accent-primary" 
                                />
                                <span className={activeGenre === g ? 'text-accent-primary' : 'group-hover:text-white'}>{g}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Type Filter */}
                <div>
                    <h4 className="text-sm font-semibold text-text-secondary uppercase mb-3">Song Type</h4>
                    <div className="flex flex-col gap-2">
                        {['OP', 'ED', 'OST'].map(t => (
                            <label key={t} className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="radio" 
                                    name="type"
                                    checked={activeType === t}
                                    onChange={() => updateFilter('type', t)}
                                    className="accent-accent-primary" 
                                />
                                <span className={activeType === t ? 'text-accent-primary' : 'group-hover:text-white'}>{t}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </aside>

            {/* 2. RESULTS MAIN AREA */}
            <main className="flex-1">
                <h2 className="text-3xl font-bold mb-6">Results for "{query}"</h2>
                
                <div className="space-y-4">
                    {results.length > 0 ? (
                        results.map(song => (
                            <SongCard key={song.id} song={song} shape="list"/>
                        ))
                    ) : (
                        <p className="text-text-secondary">No songs found matching your filters.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SearchResultPage;