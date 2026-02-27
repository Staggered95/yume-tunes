import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AddToPlaylistButton from '../minicomps/AddToPlaylistButton';
import Collage from '../minicomps/Collage';

const PlaylistPage = () => {
    const { id } = useParams(); // Grabs the ID from the URL!
    const { authFetch } = useAuth();
    
    const [playlistMeta, setPlaylistMeta] = useState(null);
    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            try {
                // IMPORTANT: You need to make sure your backend has a GET /playlists/:id route
                // that returns BOTH the playlist details and the array of songs inside it!
                const response = await authFetch(`/playlists/${id}`);
                const json = await response.json();
                
                if (json.success) {
                    setPlaylistMeta(json.data.playlist);
                    setSongs(json.data.songs || []);
                }
            } catch (error) {
                console.error("Failed to fetch playlist:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaylistDetails();
    }, [id, authFetch]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading) return <div className="min-h-screen bg-zinc-950 p-8 pt-24 text-white">Loading playlist...</div>;
    if (!playlistMeta) return <div className="min-h-screen bg-zinc-950 p-8 pt-24 text-white">Playlist not found.</div>;

    return (
        <div className="min-h-screen bg-zinc-950 text-white relative">
            {/* The Hero Header */}
            <div className="h-80 bg-gradient-to-b from-zinc-800 to-zinc-950 flex items-end p-8 pb-10">
                <div className="flex gap-6 items-end w-full max-w-7xl mx-auto">
                    {/* The Collage Cover */}
                    <div className="w-52 h-52 shadow-2xl rounded-md shrink-0">
                        <Collage covers={playlistMeta.custom_cover_path ? [playlistMeta.custom_cover_path] : playlistMeta.auto_covers} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold tracking-widest uppercase">Playlist</span>
                        <h1 className="text-5xl md:text-7xl font-black mb-2 truncate">{playlistMeta.name}</h1>
                        <p className="text-zinc-300 text-sm max-w-2xl">{playlistMeta.description}</p>
                        <div className="flex items-center gap-2 text-sm font-semibold mt-1">
                            <span className="text-zinc-400">{songs.length} songs</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Row */}
            <div className="max-w-7xl mx-auto px-8 py-4 flex items-center gap-6">
                <button className="w-14 h-14 bg-accent-primary rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white ml-1" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </button>
            </div>

            {/* The Track List (Identical UI to Liked Songs) */}
            <div className="max-w-7xl mx-auto px-8 pb-24">
                <div className="grid grid-cols-[32px_1fr_auto_60px] gap-4 px-4 py-2 text-zinc-400 text-sm border-b border-zinc-800 mb-4">
                    <div className="text-center">#</div>
                    <div>Title</div>
                    <div></div>
                    <div className="text-right flex justify-end">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                </div>

                <div className="flex flex-col">
                    {songs.length === 0 ? (
                        <div className="text-zinc-500 py-8 px-4">No songs in this playlist yet.</div>
                    ) : (
                        songs.map((song, index) => (
                            <div key={song.id} className="group grid grid-cols-[32px_1fr_auto_60px] gap-4 px-4 py-3 items-center rounded-md hover:bg-white/5 transition-colors cursor-pointer">
                                <div className="text-zinc-400 text-center relative flex items-center justify-center">
                                    <span className="group-hover:opacity-0">{index + 1}</span>
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-white absolute opacity-0 group-hover:opacity-100" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <img src={song.cover_path} alt={song.title} className="w-10 h-10 rounded shadow object-cover" />
                                    <div className="flex flex-col truncate">
                                        <span className="text-white font-medium truncate">{song.title}</span>
                                        <span className="text-zinc-400 text-sm truncate">{song.artist}</span>
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <AddToPlaylistButton songId={song.id} variant="bottom" />
                                </div>
                                <div className="text-zinc-400 text-sm text-right">
                                    {formatTime(song.duration_seconds)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlaylistPage;