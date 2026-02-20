import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const ArtistListPage = () => {
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/artists')
      .then(res => setArtists(res.data.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-black mb-10 text-white/10 uppercase italic">Artists</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {artists.map(artist => (
          <div 
            key={artist.id}
            onClick={() => navigate(`/artist/${encodeURIComponent(artist.name)}`)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-accent-primary transition-all duration-300 shadow-2xl">
              <img 
                src={`http://localhost:5000${artist.profile_pic || '/default-artist.png'}`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                alt={artist.name}
              />
            </div>
            <h3 className="font-bold text-center group-hover:text-accent-primary transition-colors">{artist.name}</h3>
            <p className="text-xs text-white/30 uppercase tracking-widest mt-1">{artist.track_count} Songs</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistListPage;