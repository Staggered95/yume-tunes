import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSongs } from '../context/SongContext';
import axios from 'axios';

const AnimePage = () => {
  // 1. Ensure this matches the ":title" in your App.jsx Route
  const { title } = useParams(); 
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectSong } = useSongs();

  useEffect(() => {
  const fetchSongs = async () => {
    console.log("🚀 Fetching started for:", title); // DEBUG 1
    setLoading(true);
    try {
      // Ensure the URL is EXACTLY what works in Postman
      const url = `http://localhost:5000/songs/anime/${encodeURIComponent(title)}`;
      console.log("🔗 Requesting URL:", url); // DEBUG 2

      const res = await axios.get(url);
      console.log("📦 Raw Response:", res.data); // DEBUG 3

      // Defensive check: handle both {data: [...]} and just [...] structures
      const songData = res.data.data || res.data; 
      setSongs(Array.isArray(songData) ? songData : []);
      
    } catch (err) {
      console.error("❌ API Error:", err.response || err.message);
    } finally {
      setLoading(false);
      console.log("🏁 Fetching finished."); // DEBUG 4
    }
  };

  if (title) {
    fetchSongs();
  } else {
    console.warn("⚠️ No title found in URL params!");
  }
}, [title]);

  // 3. Early return or loading UI
  if (loading) return <div className="p-20 text-white/20 animate-pulse text-4xl font-black">LOADING...</div>;

  return (
    <div className="min-h-screen">
      {/* HERO HEADER */}
      <div className="relative h-[45vh] flex items-end p-8 md:p-12 overflow-hidden bg-[#0a0a0a]">
        {/* Dynamic Background Blur */}
        {songs[0]?.cover_path && (
          <img 
            src={`http://localhost:5000${songs[0].cover_path}`} 
            className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-20 scale-125 pointer-events-none"
            alt=""
          />
        )}
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8 w-full">
          <img 
            src={songs[0]?.cover_path ? `http://localhost:5000${songs[0].cover_path}` : '/placeholder.png'} 
            className="w-56 h-56 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] object-cover border border-white/10"
            alt={title}
          />
          <div className="text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-accent-primary mb-3">Anime Series</p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-4">{title}</h1>
            <div className="flex items-center gap-4 justify-center md:justify-start text-white/40 font-medium">
              <span>{songs.length} Tracks</span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span>Verified Collection</span>
            </div>
          </div>
        </div>
      </div>

      {/* SONG LIST */}
      <div className="p-4 md:p-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-1">
          {songs.length > 0 ? songs.map((song, index) => (
            <div 
              key={song.id}
              onClick={() => selectSong(song)}
              className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/[0.03] active:bg-white/[0.05] transition-all cursor-pointer group"
            >
              <span className="w-6 text-sm font-mono text-white/10 group-hover:text-accent-primary transition-colors">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-lg truncate group-hover:text-white transition-colors">{song.title}</h4>
                <p className="text-sm text-white/30 truncate">{song.artist}</p>
              </div>
              <div className="text-xs font-mono text-white/10 group-hover:text-white/40">04:20</div>
            </div>
          )) : (
            <div className="py-20 text-center text-white/10 italic">No songs found for this series.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimePage;