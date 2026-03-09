import React, { useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import SongCard from '../components/SongCard';
import SkeletonCard from '../components/loading/SkeletonCard'; // Our master skeleton!
import { usePagination } from '../hooks/usePagination';

const GenrePage = () => {
    const { genreName } = useParams(); 
    
    // 1. Use our incredibly clean new hook!
    const { 
        data: songs, 
        loading, 
        hasMore, 
        loadNextPage 
    } = usePagination('/songs/search', { genre: genreName }, genreName);

    // 2. The Intersection Observer (The Infinite Scroll Trigger)
    const observer = useRef();
    const lastSongElementRef = useCallback(node => {
        if (loading) return; // Don't trigger if we are already fetching
        
        // Disconnect the old observer so we don't have multiples running
        if (observer.current) observer.current.disconnect();
        
        // Create a new observer pointing at the newly rendered last element
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadNextPage(); // Trigger Page 2!
            }
        });
        
        if (node) observer.current.observe(node);
    }, [loading, hasMore, loadNextPage]);

    // Initial Full-Page Loading State (Only for Page 1)
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
            <header className="mb-6 md:mb-8">
                <h1 className="text-3xl md:text-5xl font-black text-text-primary mb-1 md:mb-2 uppercase tracking-tighter">
                    {genreName}
                </h1>
                <p className="text-text-secondary italic text-sm md:text-base font-medium">
                    Showing {songs.length} tracks
                </p>
            </header>

            <div className="flex flex-wrap gap-4 md:gap-6 justify-center sm:justify-start">
                {songs.map((song, index) => {
                    // 3. Attach the observer ONLY to the very last song in the array
                    //const isLastElement = songs.length === index + 1;
                    const isTriggerElement = index === songs.length - 9;
                    
                    return (
                        <div key={song.id} ref={isTriggerElement ? lastSongElementRef : null} className="animate-fade-in">
                            <SongCard 
                                song={song} 
                                queue={songs} // The queue dynamically grows as you scroll!
                                index={index} 
                                shape="responsive_square" 
                            />
                        </div>
                    );
                })}
                
                {/* 4. The "Appending" Loading State (Shows at the bottom while Page 2 loads) */}
                {loading && songs.length > 0 && (
                    <div className="flex gap-4 md:gap-6">
                        {[...Array(5)].map((_, i) => <SkeletonCard key={`append-${i}`} shape="responsive_square" />)}
                    </div>
                )}
            </div>
            
            {/* 5. End of list indicator */}
            {!hasMore && songs.length > 0 && (
                <div className="text-center text-text-muted mt-12 mb-8 italic text-sm">
                    You've reached the end of the {genreName} collection.
                </div>
            )}
        </div>
    );
};

export default GenrePage;