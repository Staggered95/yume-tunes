import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useParams, Link } from 'react-router-dom';
import { useSongs } from '../context/SongContext';
import { getMediaUrl } from '../utils/media';

const ArtistPage = () => {
  const { artistName } = useParams();
  const {  playQueue } = useSongs();
  
  const [data, setData] = useState({ songs: [], animes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistData = async () => {
      setLoading(true);
      try {
        const encodedName = encodeURIComponent(artistName);
        
        const [songsRes, detailsRes] = await Promise.all([
          api.get(`/songs/artist/${encodedName}`),
          api.get(`/artists/${encodedName}`)
        ]);

        setData({
          songs: songsRes.data.data || [],
          animes: detailsRes.data.data.featuredAnimes || []
        });
      } catch (err) {
        console.error("❌ Error loading artist page:", err);
      } finally {
        setLoading(false);
      }
    };

    if (artistName) fetchArtistData();
  }, [artistName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-text-muted animate-pulse font-black text-4xl">
        LOADING ARTIST...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary text-text-primary pb-24 transition-colors duration-300">
      {/* 1. HERO HEADER */}
      <div className="relative p-12 pt-24 bg-gradient-to-b from-background-secondary to-background-primary border-b border-border">
        <div className="relative z-10">
          <p className="text-accent-primary font-bold tracking-[0.5em] text-xs uppercase mb-3 italic">
            Verified Artist
          </p>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter drop-shadow-2xl">
            {artistName}
          </h1>
          <div className="mt-6 flex items-center gap-6 text-text-secondary text-sm font-medium">
            <span>{data.songs.length} Tracks</span>
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <span>{data.animes.length} Appearances</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-16 max-w-[1600px] mx-auto">
        
        {/* LEFT COLUMN: Popular Tracks */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black mb-8 tracking-tight text-text-muted uppercase italic">
            Popular Tracks
          </h2>
          
          <div className="space-y-1">
            {data.songs.map((song, index) => (
              <div 
                key={song.id}
                onClick={() => playQueue(data.songs, index)}
                className="flex items-center gap-5 p-3 rounded-2xl hover:bg-background-hover transition-all cursor-pointer group"
              >
                {/* Track Number */}
                <span className="w-8 text-center text-text-muted font-mono text-sm group-hover:text-accent-primary transition-colors">
                  {(index + 1).toString().padStart(2, '0')}
                </span>

                {/* Cover Art */}
                <img 
                  src={getMediaUrl(song.cover_path)} 
                  className="w-14 h-14 rounded-xl object-cover shadow-2xl border border-border"
                  alt="" 
                />

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-base truncate group-hover:text-accent-primary transition-colors">
                    {song.title}
                  </h4>
                  <p className="text-xs text-text-secondary truncate mt-0.5">
                    {song.anime_title || "Single"}
                  </p>
                </div>

                {/* Duration / Meta */}
                <span className="text-xs font-mono text-text-muted pr-4">
                  04:20
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Featured In (Anime Collection) */}
        <div className="space-y-8">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-text-muted mb-6">
              Featured In
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {data.animes.map(anime => (
                <Link 
                  to={`/anime/${encodeURIComponent(anime.title)}`} 
                  key={anime.id}
                  className="flex items-center gap-4 p-3 bg-background-secondary/50 border border-border rounded-2xl hover:bg-background-hover transition-all group"
                >
                  <img 
                    src={getMediaUrl(anime.anime_cover)} 
                    className="w-16 h-16 rounded-xl object-cover group-hover:scale-105 transition-transform"
                    alt={anime.title}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm leading-tight truncate group-hover:text-accent-primary transition-colors">
                      {anime.title}
                    </span>
                    <span className="text-[10px] text-text-secondary uppercase tracking-widest mt-1">
                      Series Collection
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Subtle Artist Bio / Fact Card */}
          <div className="p-6 rounded-3xl bg-accent-primary/5 border border-accent-primary/10">
            <h3 className="text-accent-primary text-xs font-bold uppercase tracking-widest mb-2">Artist Note</h3>
            <p className="text-sm text-text-secondary leading-relaxed italic">
              "This artist has contributed several iconic themes to your library. Explore their discography through the series links above."
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ArtistPage;