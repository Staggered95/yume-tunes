import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GenreListPage = () => {
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/genres')
      .then(res => setGenres(res.data.data))
      .catch(err => console.error(err));
  }, []);

  // Simple hash function to generate consistent colors for genres
  const getGenreColor = (str) => {
    const colors = [
      'bg-rose-500', 'bg-purple-600', 'bg-amber-500', 'bg-emerald-600', 
      'bg-blue-600', 'bg-pink-500', 'bg-indigo-600', 'bg-cyan-600'
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="p-8 md:p-12">
      <header className="mb-12">
        <h1 className="text-5xl font-black tracking-tighter italic text-white/10 uppercase">Browse Genres</h1>
        <p className="text-white/40 mt-2 font-medium">Explore your {genres.length} unique music tags</p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {genres.map((g) => (
          <div
            key={g.genre}
            onClick={() => navigate(`/genre/${encodeURIComponent(g.genre)}`)}
            className={`${getGenreColor(g.genre)} aspect-[16/10] p-5 rounded-2xl cursor-pointer 
                        relative overflow-hidden group hover:scale-[1.02] active:scale-95 transition-all shadow-xl`}
          >
            {/* Visual Flair: Giant background text */}
            <span className="absolute -bottom-4 -right-4 text-white/10 text-6xl font-black uppercase rotate-[-15deg] group-hover:rotate-0 transition-transform duration-500">
              {g.genre}
            </span>

            <h3 className="text-2xl font-black text-white drop-shadow-md z-10 relative capitalize">
              {g.genre}
            </h3>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest z-10 relative mt-1">
              {g.track_count} Tracks
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenreListPage;