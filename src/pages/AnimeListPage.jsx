import React, { useEffect, useState } from 'react';
import AnimeCollage from '../minicomps/AnimeCollage';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AnimeListPage = () => {
  const [animes, setAnimes] = useState([]);

  useEffect(() => {
  const fetchAnimes = async () => {
    try {
      // 1. Await the axios call
      const res = await axios.get('http://localhost:5000/animes');
      
      // 2. Axios already parsed the JSON into res.data
      // No need for res.json()
      setAnimes(res.data.data); // Use .data.data if your backend sends { success: true, data: [...] }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  fetchAnimes();
}, []);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-black mb-10 tracking-tighter uppercase italic text-white/20">
        Browse by Series
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {animes.map((anime) => (
          <Link 
            to={`/anime/${encodeURIComponent(anime.title)}`} 
            key={anime.title}
            className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-accent-primary/50 transition-all duration-300"
          >
            <AnimeCollage covers={anime.collage_covers}/>
            <div className="p-4 bg-gradient-to-t from-black to-transparent">
              <h3 className="font-bold text-sm truncate">{anime.title}</h3>
              <p className="text-[10px] text-white/80 uppercase tracking-widest mt-1">
                {anime.track_count} Tracks
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AnimeListPage;