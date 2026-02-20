import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useSongs } from '../context/SongContext';

const ArtistPage = () => {
  const { artistName } = useParams();
  const {  selectSong } = useSongs();
  
  const [data, setData] = useState({ songs: [], animes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistData = async () => {
      setLoading(true);
      try {
        // encodeURIComponent handles spaces and special characters like LiSA or Aimer
        const encodedName = encodeURIComponent(artistName);
        
        // Parallel fetching: hitting both your song and artist endpoints at once
        const [songsRes, detailsRes] = await Promise.all([
          axios.get(`http://localhost:5000/songs/artist/${encodedName}`),
          axios.get(`http://localhost:5000/artists/${encodedName}`)
        ]);

        setData({
          songs: songsRes.data.data || [],
          // Adjusting to your backend structure: mapping to the correct key
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
      <div className="flex items-center justify-center min-h-screen text-white/20 animate-pulse font-black text-4xl">
        LOADING ARTIST...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {/* 1. HERO HEADER */}
      <div className="relative p-12 pt-24 bg-gradient-to-b from-zinc-800 to-[#0a0a0a] border-b border-white/5">
        <div className="relative z-10">
          <p className="text-accent-primary font-bold tracking-[0.5em] text-xs uppercase mb-3 italic">
            Verified Artist
          </p>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter drop-shadow-2xl">
            {artistName}
          </h1>
          <div className="mt-6 flex items-center gap-6 text-white/40 text-sm font-medium">
            <span>{data.songs.length} Tracks</span>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <span>{data.animes.length} Appearances</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-16 max-w-[1600px] mx-auto">
        
        {/* LEFT COLUMN: Popular Tracks */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black mb-8 tracking-tight text-white/10 uppercase italic">
            Popular Tracks
          </h2>
          
          <div className="space-y-1">
            {data.songs.map((song, index) => (
              <div 
                key={song.id}
                onClick={() => selectSong(song)}
                className="flex items-center gap-5 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group"
              >
                {/* Track Number */}
                <span className="w-8 text-center text-white/20 font-mono text-sm group-hover:text-accent-primary">
                  {(index + 1).toString().padStart(2, '0')}
                </span>

                {/* Cover Art */}
                <img 
                  src={`http://localhost:5000${song.cover_path}`} 
                  className="w-14 h-14 rounded-xl object-cover shadow-2xl border border-white/5"
                  alt="" 
                />

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-base truncate group-hover:text-white">
                    {song.title}
                  </h4>
                  <p className="text-xs text-white/40 truncate mt-0.5">
                    {/* Shows the Anime name if your join is working, else falls back */}
                    {song.anime_title || "Single"}
                  </p>
                </div>

                {/* Duration / Meta */}
                <span className="text-xs font-mono text-white/10 pr-4">
                  04:20
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Featured In (Anime Collection) */}
        <div className="space-y-8">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/30 mb-6">
              Featured In
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {data.animes.map(anime => (
                <Link 
                  to={`/anime/${encodeURIComponent(anime.title)}`} 
                  key={anime.id}
                  className="flex items-center gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/10 transition-all group"
                >
                  <img 
                    src={`http://localhost:5000${anime.anime_cover}`} 
                    className="w-16 h-16 rounded-xl object-cover group-hover:scale-105 transition-transform"
                    alt={anime.title}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm leading-tight truncate group-hover:text-accent-primary">
                      {anime.title}
                    </span>
                    <span className="text-[10px] text-white/30 uppercase tracking-widest mt-1">
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
            <p className="text-sm text-white/50 leading-relaxed italic">
              "This artist has contributed several iconic themes to your library. Explore their discography through the series links above."
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ArtistPage;