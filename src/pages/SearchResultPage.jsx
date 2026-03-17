import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios'; 
import SongCard from '../components/SongCard'; 
import { getMediaUrl } from '../utils/media';

const FilterPill = ({ active, label, onClick }) => (
    <button
        onClick={onClick}
        className={`shrink-0 px-4 py-1.5 md:py-2 md:w-full md:text-left rounded-full md:rounded-xl text-xs md:text-sm font-bold transition-all border ${
            active
                ? 'bg-accent-primary border-accent-primary text-white shadow-md shadow-accent-primary/20'
                : 'bg-background-secondary md:bg-transparent border-border md:border-transparent text-text-secondary hover:text-text-primary hover:bg-background-hover'
        }`}
    >
        {label}
    </button>
);

const SearchResultPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [results, setResults] = useState({ songs: [], artists: [], animes: [] });
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const query = searchParams.get('q') || '';
    const activeGenre = searchParams.get('genre') || '';
    const activeType = searchParams.get('type') || '';

    useEffect(() => {
        const fetchFilteredResults = async () => {
            setIsLoading(true);
            try {
                const { data } = await api.get(`/search`, {
                    params: { q: query, genre: activeGenre, type: activeType }
                });
                
                if (data.success) {
                    setResults({
                        songs: data.data.songs || [],
                        artists: data.data.artists || [],
                        animes: data.data.animes || []
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
        if (searchParams.get(key) === value) newParams.delete(key);
        else if (value) newParams.set(key, value);
        else newParams.delete(key);
        setSearchParams(newParams);
    };

    const hasNoResults = !results.songs.length && !results.artists.length && !results.animes.length;

    return (
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 px-4 md:px-10 pt-20 md:pt-24 pb-32 text-text-primary max-w-7xl mx-auto min-h-screen bg-background-primary">
            
            {/* 1. FILTER SIDEBAR (Responsive) */}
            <aside className="w-full md:w-56 lg:w-64 md:space-y-8 md:sticky top-24 h-fit shrink-0 z-10 bg-background-primary md:bg-transparent pt-2 md:pt-0">
                <div className="hidden md:flex items-center justify-between border-b border-border pb-4">
                    <h3 className="text-xl font-black uppercase tracking-tighter italic">Filters</h3>
                    <button 
                        onClick={() => setSearchParams({ q: query })}
                        className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent-primary transition-colors"
                    >
                        Reset
                    </button>
                </div>

                {/* Mobile Filter Wrapper: Horizontal Scroll */}
                <div className="flex flex-row md:flex-col gap-4 overflow-x-auto scrollbar-none pb-2 md:pb-0">
                    
                    {/* Genre Filters */}
                    <div className="flex md:flex-col gap-2 shrink-0">
                        <h4 className="hidden md:block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 px-2">Genres</h4>
                        {['Soft', 'Rock', 'Vibe', 'Masterclass'].map(g => (
                            <FilterPill 
                                key={g} 
                                label={g} 
                                active={activeGenre === g} 
                                onClick={() => updateFilter('genre', g)} 
                            />
                        ))}
                    </div>

                    {/* Divider for Mobile */}
                    <div className="w-px h-8 bg-border md:hidden shrink-0 self-center" />

                    {/* Type Filters */}
                    <div className="flex md:flex-col gap-2 shrink-0">
                        <h4 className="hidden md:block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 px-2 mt-4">Song Type</h4>
                        {['OP', 'ED', 'OST'].map(t => (
                            <FilterPill 
                                key={t} 
                                label={t} 
                                active={activeType === t} 
                                onClick={() => updateFilter('type', t)} 
                            />
                        ))}
                    </div>

                </div>
            </aside>

            {/* 2. RESULTS MAIN AREA */}
            <main className="flex-1 min-w-0">
                <div className="mb-6 md:mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <h2 className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase">
                        Search Results
                    </h2>
                    <p className="text-text-muted text-xs md:text-sm font-bold mt-1">Found results for <span className="text-accent-primary">"{query}"</span></p>
                </div>
                
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-square rounded-2xl bg-background-secondary/50 animate-pulse border border-border" />
                        ))}
                    </div>
                ) : hasNoResults && query ? (
                    <div className="flex flex-col items-center justify-center py-20 md:py-32 bg-background-secondary/30 rounded-3xl border border-border mx-2 md:mx-0">
                        <svg className="w-16 h-16 md:w-20 md:h-20 text-text-muted/30 mb-4 md:mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="text-xl md:text-2xl font-black tracking-tighter uppercase text-text-primary mb-2">Ghost Town</h3>
                        <p className="text-text-secondary text-xs md:text-sm font-medium text-center px-4">No results found with those specific filters.</p>
                    </div>
                ) : (
                    <div className="space-y-10 md:space-y-12">

                        {/* CATEGORY: ARTISTS */}
                        {results.artists.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-left-4 duration-500">
                                <h3 className="text-[10px] md:text-xs font-black mb-4 md:mb-6 text-text-muted uppercase tracking-[0.3em]">Top Artists</h3>
                                <div className="flex overflow-x-auto pb-4 gap-4 md:gap-6 scrollbar-none snap-x">
                                    {results.artists.map((artist, idx) => (
                                        <div key={idx} onClick={() => navigate(`/artist/${encodeURIComponent(artist.name)}`)} className="flex flex-col items-center gap-2 md:gap-3 w-20 md:w-28 shrink-0 cursor-pointer group snap-start">
                                            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden shadow-lg border-2 border-transparent group-hover:border-accent-primary transition-all duration-300 md:duration-500 md:group-hover:-translate-y-2 bg-background-secondary">
                                                <img 
                                                    src={getMediaUrl(artist.image)} 
                                                    alt={artist.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    onError={(e) => { e.target.src = '/fallback-avatar.png' }}
                                                />
                                            </div>
                                            <span className="font-bold text-[10px] md:text-xs text-center truncate w-full group-hover:text-accent-primary transition-colors tracking-tight">{artist.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* CATEGORY: ANIME */}
                        {results.animes.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-left-4 duration-700">
                                <h3 className="text-[10px] md:text-xs font-black mb-4 md:mb-6 text-text-muted uppercase tracking-[0.3em]">Anime Series</h3>
                                <div className="flex overflow-x-auto pb-4 gap-4 md:gap-6 scrollbar-none snap-x">
                                    {results.animes.map((anime, idx) => (
                                        <div key={idx} onClick={() => navigate(`/anime/${encodeURIComponent(anime.name)}`)} className="flex flex-col gap-2 md:gap-3 w-36 md:w-48 shrink-0 cursor-pointer group snap-start">
                                            <div className="aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-lg border border-border group-hover:border-accent-primary/50 transition-all duration-300 md:duration-500 md:group-hover:-translate-y-2 bg-background-secondary">
                                                <img 
                                                    src={getMediaUrl(anime.image)} 
                                                    alt={anime.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                />
                                            </div>
                                            <span className="font-bold text-[10px] md:text-xs truncate w-full group-hover:text-accent-primary transition-colors tracking-tight">{anime.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* CATEGORY: SONGS */}
                        {results.songs.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <h3 className="text-[10px] md:text-xs font-black mb-4 md:mb-6 text-text-muted uppercase tracking-[0.3em]">Songs Found</h3>
                                <div className="flex flex-col gap-2">
                                    {results.songs.map((song, index) => (
                                        // Passed 'queue' and 'index' so the player actually knows what to play next!
                                        <SongCard key={song.id} song={song} queue={results.songs} index={index} shape="list"/>
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