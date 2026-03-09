import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSongs } from '../context/SongContext';
import api from '../api/axios';
import { getMediaUrl } from '../utils/media';

const AnimePage = () => {
  const { title } = useParams(); 
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playQueue } = useSongs();

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        const url = `/songs/anime/${encodeURIComponent(title)}`;
        const { data } = await api.get(url);
        const songData = data.data || data; 
        setSongs(Array.isArray(songData) ? songData : []);
      } catch (err) {
        console.error("❌ API Error:", err.response || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (title) fetchSongs();
  }, [title]);

  if (loading) return (
      <div className="flex items-center justify-center min-h-screen">
          <div className="text-text-muted animate-pulse text-2xl md:text-4xl font-black tracking-widest uppercase">
              Loading...
          </div>
      </div>
  );

  return (
    // Added pb-32 to the wrapper so the Bottom Player doesn't hide the last song!
    <div className="min-h-screen pb-32 bg-background-primary">
        
      {/* HERO HEADER */}
      <div className="relative min-h-[45vh] md:h-[45vh] flex items-end p-6 pt-24 md:p-12 overflow-hidden bg-background-secondary shadow-lg">
        
        {/* Dynamic Background Blur */}
        {songs[0]?.cover_path && (
          <img 
            src={getMediaUrl(songs[0].cover_path)} 
            className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-20 scale-125 pointer-events-none"
            alt=""
          />
        )}
        
        {/* Added mt-auto to naturally push content down without forcing overflow */}
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 w-full mt-auto">
          
          <img 
            src={getMediaUrl(songs[0]?.cover_path)} 
            // Scaled down to w-40 for mobile, back to w-56 for desktop. Added shrink-0.
            className="w-50 h-50 md:w-56 md:h-56 rounded-xl md:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-cover border border-border shrink-0"
            alt={title}
          />
          
          <div className="text-center md:text-left flex-1 min-w-0">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-accent-primary mb-2 md:mb-3">
                Anime Series
            </p>
            {/* Scaled text to 4xl on mobile so long anime titles don't break layout */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight md:leading-none mb-3 md:mb-4 text-text-primary">
                {title}
            </h1>
            <div className="flex items-center gap-3 justify-center md:justify-start text-text-muted text-xs md:text-sm font-medium">
              <span>{songs.length} Tracks</span>
              <span className="w-1 h-1 bg-border rounded-full" />
              <span>Verified Collection</span>
            </div>
          </div>

        </div>
      </div>

      {/* SONG LIST */}
      <div className="p-4 md:p-12 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          {songs.length > 0 ? songs.map((song, index) => (
            <div 
              key={song.id}
              onClick={() => playQueue(songs, index)}
              className="flex items-center gap-4 md:gap-6 p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-background-hover active:bg-background-active transition-all cursor-pointer group"
            >
              <span className="w-6 text-xs md:text-sm font-bold text-text-muted group-hover:text-accent-primary transition-colors text-center shrink-0">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="font-bold text-sm md:text-lg truncate group-hover:text-accent-primary transition-colors text-text-primary">
                    {song.title}
                </h4>
                <p className="text-xs md:text-sm text-text-secondary truncate mt-0.5">
                    {song.artist}
                </p>
              </div>
              
              {/* Added a subtle play icon that appears on hover instead of a fake timestamp */}
              <div className="hidden sm:flex text-text-muted group-hover:text-accent-primary transition-colors shrink-0">
                <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center text-text-muted italic text-sm md:text-base">
                No songs found for this series.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimePage;