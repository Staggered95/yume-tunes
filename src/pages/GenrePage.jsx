import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SongCard from '../components/SongCard';

const GenrePage = () => {
    const { genreName } = useParams(); // Grabs 'Rock' from /genre/Rock
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGenreSongs = async () => {
            setLoading(true);
            try {
                // Using your existing search endpoint with the genre filter
                const res = await axios.get(`http://localhost:5000/songs/search`, {
                    params: { genre: genreName }
                });
                setSongs(res.data.data);
            } catch (err) {
                console.error("Failed to fetch genre songs:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGenreSongs();
    }, [genreName]);

    if (loading) return <div className="p-10 text-text-secondary">Loading {genreName} hits...</div>;

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-5xl font-black text-text-primary mb-2 uppercase tracking-tighter">
                    {genreName}
                </h1>
                <p className="text-text-secondary italic">
                    {songs.length} tracks found in this category
                </p>
            </header>

            <div className="grid gap-3 lg:grid-cols-5 md:grid-cols-3">
                {songs.map(song => (
                    <SongCard key={song.id} song={song} shape="square" />
                ))}
            </div>
        </div>
    );
};

export default GenrePage;