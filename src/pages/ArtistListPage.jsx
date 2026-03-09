import React, { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMediaUrl } from '../utils/media';
import { usePagination } from '../hooks/usePagination'; // <-- 1. Import the hook

const ArtistListPage = () => {
  const navigate = useNavigate();

  // 2. One-liner state management
  const { 
    data: artists, 
    loading, 
    hasMore, 
    loadNextPage 
  } = usePagination('/artists', {});

  // 3. The Intersection Observer (Trigger 9 items early!)
  const observer = useRef();
  const lastArtistElementRef = useCallback(node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting && hasMore) {
              loadNextPage();
          }
      });
      
      if (node) observer.current.observe(node);
  }, [loading, hasMore, loadNextPage]);

  // 4. Initial Full-Page Loading State
  if (loading && artists.length === 0) return (
    <div className="p-3 md:p-8 pt-24 min-h-screen">
      <h1 className="text-4xl font-black mb-10 text-white/10 uppercase italic">Artists</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {[...Array(12)].map((_, i) => (
          <div key={`ghost-${i}`} className="flex flex-col items-center animate-pulse">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-border/40 mb-4" />
            <div className="h-4 w-24 bg-border/40 rounded-full mb-2" />
            <div className="h-3 w-16 bg-border/20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-3 md:p-8 pt-24 min-h-screen pb-32">
      <h1 className="text-4xl font-black mb-10 text-white/10 uppercase italic">Artists</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {artists.map((artist, index) => {
          // Trigger fetch when user is 9 items away from the bottom
          const isTriggerElement = index === artists.length - 9;

          return (
            <div 
              key={`artist-${artist.id}-${index}`}
              ref={isTriggerElement ? lastArtistElementRef : null}
              onClick={() => navigate(`/artist/${encodeURIComponent(artist.name)}`)}
              className="flex flex-col items-center group cursor-pointer animate-fade-in will-change-transform"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-accent-primary transition-all duration-300 shadow-2xl shrink-0">
                <img 
                  src={getMediaUrl(artist.profile_pic)} 
                  alt={artist.name}
                  loading="lazy"
                  decoding="async" /* Prevents scroll freeze when loading new profile pics! */
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 bg-border/20"
                />
              </div>
              <h3 className="font-bold text-center group-hover:text-accent-primary transition-colors">
                {artist.name}
              </h3>
              <p className="text-xs text-white/30 uppercase tracking-widest mt-1">
                {artist.track_count} Songs
              </p>
            </div>
          );
        })}

        {/* 5. Appending Skeletons (Shows at the bottom while next page loads) */}
        {loading && artists.length > 0 && (
           [...Array(6)].map((_, i) => (
            <div key={`append-ghost-${i}`} className="flex flex-col items-center animate-pulse">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-border/20 mb-4" />
              <div className="h-4 w-24 bg-border/30 rounded-full mb-2" />
            </div>
          ))
        )}
      </div>

      {/* 6. End of list indicator */}
      {!hasMore && artists.length > 0 && (
        <div className="text-center text-text-muted mt-16 italic text-sm w-full col-span-full">
            You've reached the end of the artist directory.
        </div>
      )}
    </div>
  );
};

export default ArtistListPage;