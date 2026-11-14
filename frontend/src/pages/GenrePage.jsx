import React, { useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import SongCard from '../components/SongCard';
import SkeletonCard from '../components/loading/SkeletonCard';
import { usePagination } from '../hooks/usePagination';
import { useSongs } from '../context/SongContext';
import ShuffleButton from '../minicomps/ShuffleButton'; 

const GenrePage = () => {
    const { genreName } = useParams(); 
    
    const { playQueue, playShuffledQueue } = useSongs();
    
    const { 
        data: songs, 
        loading, 
        hasMore, 
        loadNextPage 
    } = usePagination('/songs/search', { genre: genreName }, genreName);

    const observer = useRef();
    const lastSongElementRef = useCallback(node => {
        if (loading) return; 
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadNextPage(); 
            }
        });
        
        if (node) observer.current.observe(node);
    }, [loading, hasMore, loadNextPage]);

    if (loading && songs.length === 0) return (
        <div className="p-4 md:p-8 pt-24 min-h-screen">
            <div className="h-12 w-64 bg-border/40 rounded-lg animate-pulse mb-8" />
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center sm:justify-start">
                {[...Array(15)].map((_, i) => <SkeletonCard key={i} shape="responsive_square" />)}
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 pt-24 animate-fade-in pb-32 min-h-screen"> 
            
            {/* THE HEADER & ACTION BAR */}
            <header className="mb-8 md:mb-12">
                <h1 className="text-4xl md:text-6xl font-black text-text-primary mb-2 uppercase tracking-tighter">
                    {genreName}
                </h1>
                <p className="text-text-secondary italic text-sm md:text-base font-medium mb-6">
                    Showing {songs.length} tracks
                </p>

                {/*  THE ACTION BUTTONS */}
                {songs.length > 0 && (
                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Play All Button */}
                        <button 
                            onClick={() => playQueue(songs, 0)}
                            className="w-12 h-12 md:w-14 md:h-14 bg-accent-primary text-background-primary rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-accent-primary/20 group"
                        >
                            <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-8 md:h-8 ml-1 transition-transform group-hover:scale-110" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </button>

                        {/* Shuffle Play Button */}
                        <ShuffleButton 
                            variant="action" 
                            onClick={() => playShuffledQueue(songs)} 
                        />
                    </div>
                )}
            </header>

            {/* THE TRACK GRID */}
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center sm:justify-start">
                {songs.map((song, index) => {
                    const isTriggerElement = index === songs.length - 9;
                    
                    return (
                        <div key={song.id} ref={isTriggerElement ? lastSongElementRef : null} className="animate-fade-in">
                            <SongCard 
                                song={song} 
                                queue={songs}
                                index={index} 
                                shape="responsive_square" 
                            />
                        </div>
                    );
                })}
                
                {loading && songs.length > 0 && (
                    <div className="flex gap-4 md:gap-6">
                        {[...Array(5)].map((_, i) => <SkeletonCard key={`append-${i}`} shape="responsive_square" />)}
                    </div>
                )}
            </div>
            
            {!hasMore && songs.length > 0 && (
                <div className="text-center text-text-muted mt-12 mb-8 italic text-sm">
                    You've reached the end of the {genreName} collection.
                </div>
            )}
        </div>
    );
};

export default GenrePage;