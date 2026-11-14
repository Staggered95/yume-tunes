import React, { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Collage from '../minicomps/Collage';
import { usePagination } from '../hooks/usePagination';

const AnimeListPage = () => {
  const { 
    data: animes, 
    loading, 
    hasMore, 
    loadNextPage 
  } = usePagination('/animes', {}); 

  const observer = useRef();
  const lastAnimeElementRef = useCallback(node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting && hasMore) {
              loadNextPage();
          }
      });
      
      if (node) observer.current.observe(node);
  }, [loading, hasMore, loadNextPage]);

  if (loading && animes.length === 0) return (
    <div className="p-3 md:p-8 pt-24 min-h-screen bg-background-primary">
      <div className="h-10 w-64 bg-border/60 rounded-lg animate-pulse mb-10" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {[...Array(12)].map((_, i) => (
          <div 
            key={`grid-skeleton-${i}`} 
            className="aspect-square rounded-2xl bg-border/60 animate-pulse border border-border/20" 
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-3 md:p-8 pt-24 min-h-screen bg-background-primary pb-32">
      <h1 className="text-4xl font-black mb-10 tracking-tighter uppercase italic text-text-primary/20">
        Browse by Series
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {animes.map((anime, index) => {
          const isTriggerElement = index === animes.length - 9;
          
          return (
            <Link 
              to={`/anime/${encodeURIComponent(anime.title)}`} 
              key={`anime-${anime.id}-${index}`} // Bulletproof key
              ref={isTriggerElement ? lastAnimeElementRef : null}
              className="group relative bg-background-secondary rounded-2xl overflow-hidden border border-border hover:border-accent-primary/50 transition-all duration-300 animate-fade-in will-change-transform"
            >
              <Collage covers={anime.collage_covers}/>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent z-10">
                <h3 className="font-bold text-sm truncate text-white">{anime.title}</h3>
                <p className="text-[10px] text-white/80 uppercase tracking-widest mt-1">
                  {anime.track_count} Tracks
                </p>
              </div>
            </Link>
          );
        })}

        {loading && animes.length > 0 && (
          [...Array(6)].map((_, i) => (
            <div 
              key={`append-skeleton-${i}`} 
              className="aspect-square rounded-2xl bg-border/40 animate-pulse border border-border/10" 
            />
          ))
        )}
      </div>

      {!hasMore && animes.length > 0 && (
          <div className="text-center text-text-muted mt-16 italic text-sm w-full col-span-full">
              You've reached the end of the catalog.
          </div>
      )}
    </div>
  );
};

export default AnimeListPage;