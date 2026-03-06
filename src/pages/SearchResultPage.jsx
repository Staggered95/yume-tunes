import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios'; // Native Axios instance
import SongCard from '../components/SongCard'; 
import { getMediaUrl } from '../utils/media';

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
                // Using the 'api' instance handles the baseURL and any auth headers automatically
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
        if (value) newParams.set(key, value);
        else newParams.delete(key);
        setSearchParams(newParams);
    };

    const hasNoResults = !results.songs.length && !results.artists.length && !results.animes.length;

    return (
        <div className="flex flex-col md:flex-row gap-10 p-6 md:p-10 pt-24 text-text-primary max-w-7xl mx-auto min-h-screen bg-background-primary">
            
            {/* 1. FILTER SIDEBAR */}
            <aside className="w-full md:w-64 space-y-10 sticky top-24 h-fit shrink-0">
                <div className="flex items-center justify-between border-b border-border pb-4">
                    <h3 className="text-xl font-black uppercase tracking-tighter italic">Filters</h3>
                    <button 
                        onClick={() => setSearchParams({ q: query })}
                        className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent-primary transition-all active:scale-95"
                    >
                        Reset
                    </button>
                </div>

                {/* Genre Filter */}
                <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em]">Genres</h4>
                    <div className="flex flex-col gap-2">
                        {['Soft', 'Rock', 'Vibe', 'Masterclass'].map(g => (
                            <label key={g} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="radio" 
                                    name="genre"
                                    checked={activeGenre === g}
                                    onChange={() => updateFilter('genre', g)}
                                    className="hidden"
                                />
                                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                                    activeGenre === g 
                                        ? 'bg-accent-primary border-accent-primary shadow-[0_0_10px_rgba(157,92,250,0.3)]' 
                                        : 'border-border group-hover:border-text-muted'
                                }`}>
                                    {activeGenre === g && <div className="w-2 h-2 bg-background-primary rounded-full animate-in zoom-in" />}
                                </div>
                                <span className={`text-sm font-bold transition-colors ${activeGenre === g ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>
                                    {g}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Type Filter */}
                <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em]">Song Type</h4>
                    <div className="flex flex-col gap-2">
                        {['OP', 'ED', 'OST'].map(t => (
                            <label key={t} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="radio" 
                                    name="type"
                                    checked={activeType === t}
                                    onChange={() => updateFilter('type', t)}
                                    className="hidden"
                                />
                                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                                    activeType === t 
                                        ? 'bg-accent-primary border-accent-primary shadow-[0_0_10px_rgba(157,92,250,0.3)]' 
                                        : 'border-border group-hover:border-text-muted'
                                }`}>
                                    {activeType === t && <div className="w-2 h-2 bg-background-primary rounded-full animate-in zoom-in" />}
                                </div>
                                <span className={`text-sm font-bold transition-colors ${activeType === t ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>
                                    {t}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </aside>

            {/* 2. RESULTS MAIN AREA */}
            <main className="flex-1">
                <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter italic uppercase">
                        Search Results
                    </h2>
                    <p className="text-text-muted text-sm font-bold mt-1">Found results for <span className="text-accent-primary">"{query}"</span></p>
                </div>
                
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[1, 2, 4].map(i => (
                            <div key={i} className="aspect-square rounded-2xl bg-background-secondary animate-pulse" />
                        ))}
                    </div>
                ) : hasNoResults && query ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-background-secondary/30 rounded-3xl border border-border animate-in fade-in zoom-in-95">
                        <svg className="w-20 h-20 text-text-muted/20 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="text-2xl font-black tracking-tighter uppercase text-text-primary mb-2">Ghost Town</h3>
                        <p className="text-text-secondary text-sm font-medium">No results found with those specific filters.</p>
                    </div>
                ) : (
                    <div className="space-y-12">

                        {/* CATEGORY: ARTISTS */}
                        {results.artists.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-left-4 duration-500">
                                <h3 className="text-xs font-black mb-6 text-text-muted uppercase tracking-[0.3em]">Top Artists</h3>
                                <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-none">
                                    {results.artists.map((artist, idx) => (
                                        <div key={idx} className="flex flex-col items-center gap-3 w-28 shrink-0 cursor-pointer group">
                                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-2xl border-2 border-transparent group-hover:border-accent-primary transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-accent-primary/20 bg-background-secondary">
                                                <img 
                                                    src={getMediaUrl(artist.image)} 
                                                    alt={artist.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    onError={(e) => { e.target.src = '/fallback-avatar.png' }}
                                                />
                                            </div>
                                            <span className="font-bold text-xs text-center truncate w-full group-hover:text-accent-primary transition-colors tracking-tight">{artist.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* CATEGORY: ANIME */}
                        {results.animes.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-left-4 duration-700">
                                <h3 className="text-xs font-black mb-6 text-text-muted uppercase tracking-[0.3em]">Anime Series</h3>
                                <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-none">
                                    {results.animes.map((anime, idx) => (
                                        <div key={idx} className="flex flex-col gap-3 w-40 md:w-48 shrink-0 cursor-pointer group">
                                            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border group-hover:border-accent-primary/30 transition-all duration-500 group-hover:-translate-y-2 bg-background-secondary">
                                                <img 
                                                    src={getMediaUrl(anime.image)} 
                                                    alt={anime.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                />
                                            </div>
                                            <span className="font-bold text-xs truncate w-full group-hover:text-accent-primary transition-colors tracking-tight">{anime.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* CATEGORY: SONGS */}
                        {results.songs.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <h3 className="text-xs font-black mb-6 text-text-muted uppercase tracking-[0.3em]">Songs Found</h3>
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