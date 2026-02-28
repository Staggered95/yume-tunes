import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SongCard from '../components/SongCard'; 
import axios from 'axios';

const SearchResultPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [results, setResults] = useState({ songs: [], artists: [], animes: [] });
    const [isLoading, setIsLoading] = useState(false);
    
    const query = searchParams.get('q') || '';
    const activeGenre = searchParams.get('genre') || '';
    const activeType = searchParams.get('type') || '';

    useEffect(() => {
        const fetchFilteredResults = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`http://localhost:5000/search`, {
                    params: { q: query, genre: activeGenre, type: activeType }
                });
                
                if (res.data.success) {
                    setResults({
                        songs: res.data.data.songs || [],
                        artists: res.data.data.artists || [],
                        animes: res.data.data.animes || []
                    });
                }
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setIsLoading(false);
            }
        };
        
        if (query) fetchFilteredResults();
    }, [query, activeGenre, activeType]);

    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) newParams.set(key, value);
        else newParams.delete(key);
        setSearchParams(newParams);
    };

    const hasNoResults = results.songs.length === 0 && results.artists.length === 0 && results.animes.length === 0;

    return (
        <div className="flex flex-col md:flex-row gap-8 p-6 text-text-primary max-w-7xl mx-auto">
            
            {/* 1. FILTER SIDEBAR */}
            <aside className="w-full md:w-64 space-y-8 sticky top-0 h-fit shrink-0">
                <div>
                    <h3 className="text-xl font-bold mb-4">Filters</h3>
                    <button 
                        onClick={() => setSearchParams({ q: query })}
                        className="text-xs text-text-secondary hover:text-accent-primary transition-colors"
                    >
                        Clear All
                    </button>
                </div>

                {/* Genre Filter */}
                <div>
                    <h4 className="text-sm font-semibold text-text-secondary uppercase mb-3">Genres</h4>
                    <div className="flex flex-col gap-3">
                        {['Soft', 'Rock', 'Vibe', 'Masterclass'].map(g => (
                            <label key={g} className="flex items-center gap-3 cursor-pointer group">
                                {/* FIX: Re-added the hidden input to capture clicks! */}
                                <input 
                                    type="radio" 
                                    name="genre"
                                    checked={activeGenre === g}
                                    onChange={() => updateFilter('genre', g)}
                                    className="hidden"
                                />
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                    activeGenre === g ? 'bg-accent-primary border-accent-primary' : 'border-border group-hover:border-accent-primary'
                                }`}>
                                    {activeGenre === g && <div className="w-2 h-2 bg-white rounded-sm" />}
                                </div>
                                <span className={activeGenre === g ? 'text-accent-primary font-medium' : 'text-text-secondary group-hover:text-white transition-colors'}>
                                    {g}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Type Filter */}
                <div>
                    <h4 className="text-sm font-semibold text-text-secondary uppercase mb-3">Song Type</h4>
                    <div className="flex flex-col gap-3">
                        {['OP', 'ED', 'OST'].map(t => (
                            <label key={t} className="flex items-center gap-3 cursor-pointer group">
                                {/* FIX: Re-added the hidden input */}
                                <input 
                                    type="radio" 
                                    name="type"
                                    checked={activeType === t}
                                    onChange={() => updateFilter('type', t)}
                                    className="hidden"
                                />
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                    activeType === t ? 'bg-accent-primary border-accent-primary' : 'border-border group-hover:border-accent-primary'
                                }`}>
                                    {activeType === t && <div className="w-2 h-2 bg-white rounded-sm" />}
                                </div>
                                <span className={activeType === t ? 'text-accent-primary font-medium' : 'text-text-secondary group-hover:text-white transition-colors'}>
                                    {t}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </aside>

            {/* 2. RESULTS MAIN AREA */}
            <main className="flex-1 overflow-hidden">
                <h2 className="text-2xl lg:text-3xl font-bold mb-8">Top results for "{query}"</h2>
                
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="w-8 h-8 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : hasNoResults && query ? (
                    <div className="text-center py-20 bg-background-secondary rounded-2xl border border-white/5">
                        <svg className="w-16 h-16 mx-auto text-text-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="text-xl font-bold text-text-primary mb-2">No results found</h3>
                        <p className="text-text-secondary">Try adjusting your filters or searching for a different keyword.</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        
                        {/* CATEGORY: ARTISTS (Shrunk to w-24 h-24) */}
                        {results.artists.length > 0 && (
                            <section>
                                <h3 className="text-lg font-bold mb-4 text-text-secondary uppercase tracking-wider">Artists</h3>
                                <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-none mask-fade-edges-right">
                                    {results.artists.map((artist, idx) => (
                                        <div key={idx} className="flex flex-col items-center gap-2 w-24 shrink-0 cursor-pointer group">
                                            {/* Reduced translation to -translate-y-1 */}
                                            <div className="w-24 h-24 rounded-full overflow-hidden shadow-md group-hover:shadow-accent-primary/20 transition-all duration-300 group-hover:-translate-y-1">
                                                <img 
                                                    src={`http://localhost:5000${artist.image}`} 
                                                    alt={artist.name}
                                                    // Reduced zoom to scale-105
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => { e.target.src = '/fallback-avatar.png' }}
                                                />
                                            </div>
                                            <span className="font-medium text-sm text-center truncate w-full group-hover:text-accent-primary transition-colors">{artist.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* CATEGORY: ANIME (Shrunk to w-36 h-20) */}
                        {results.animes.length > 0 && (
                            <section>
                                <h3 className="text-lg font-bold mb-4 text-text-secondary uppercase tracking-wider">Anime</h3>
                                <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-none mask-fade-edges-right">
                                    {results.animes.map((anime, idx) => (
                                        <div key={idx} className="flex flex-col gap-2 w-36 shrink-0 cursor-pointer group">
                                            {/* Reduced translation to -translate-y-1 */}
                                            <div className="w-36 h-20 rounded-lg overflow-hidden shadow-md group-hover:shadow-accent-primary/20 transition-all duration-300 group-hover:-translate-y-1 relative">
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <img 
                                                    src={`http://localhost:5000${anime.image}`} 
                                                    alt={anime.name}
                                                    // Reduced zoom to scale-105
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <span className="font-medium text-sm truncate w-full group-hover:text-accent-primary transition-colors">{anime.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* CATEGORY: SONGS */}
                        {results.songs.length > 0 && (
                            <section>
                                <h3 className="text-xl font-bold mb-4">Songs</h3>
                                <div className="flex flex-col gap-2">
                                    {results.songs.map(song => (
                                        <SongCard key={song.id} song={song} shape="list"/>
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>
                )}
            </main>
        </div>
    );
};

export default SearchResultPage;