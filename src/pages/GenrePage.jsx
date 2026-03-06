import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import SongCard from '../components/SongCard';

const GenrePage = () => {
    const { genreName } = useParams(); 
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGenreSongs = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/songs/search`, {
                    params: { genre: genreName }
                });
                setSongs(data.data);
            } catch (err) {
                console.error("Failed to fetch genre songs:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGenreSongs();
    }, [genreName]);

    if (loading) return (
        <div className="p-4 md:p-8 text-text-secondary animate-pulse">
            Loading {genreName} hits...
        </div>
    );

    return (
        <div className="p-4 md:p-8 animate-fade-in pb-24"> {/* Added pb-24 so bottom player doesn't cover last row */}
            <header className="mb-6 md:mb-8">
                <h1 className="text-3xl md:text-5xl font-black text-text-primary mb-1 md:mb-2 uppercase tracking-tighter">
                    {genreName}
                </h1>
                <p className="text-text-secondary italic text-sm md:text-base font-medium">
                    {songs.length} tracks found in this category
                </p>
            </header>

            {/* Fluid Flexbox Grid */}
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center sm:justify-start">
                {songs.map((song, index) => (
                    <SongCard 
                        key={song.id} 
                        song={song} 
                        queue={songs} 
                        index={index} 
                        shape="responsive_square" // <-- Boom. Magic happens here.
                    />
                ))}
            </div>
        </div>
    );
};

export default GenrePage;