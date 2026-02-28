import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Collage from '../minicomps/Collage'; // Adjust path if needed

const LibraryPage = () => {
    const navigate = useNavigate();
    const { authFetch, isLoggedIn } = useAuth();
    
    const [playlists, setPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    

    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchLibrary = async () => {
            setIsLoading(true);
            try {
                // This expects your backend to return the playlists with the 'auto_covers' array!
                const response = await authFetch('/playlists');
                const json = await response.json();
                
                if (json.success) {
                    setPlaylists(json.data);
                }
            } catch (error) {
                console.error("Error fetching library:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLibrary();
    }, [isLoggedIn, authFetch]);


    if (!isLoggedIn) return null;

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8 pt-20">
            <div className="flex justify-between items-end mb-8">
                <h1 className="text-3xl md:text-4xl font-black text-text-primary">Your Library</h1>
                <button 
                    // We can wire this to your PlaylistModal later!
                    className="text-sm font-bold bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full transition-colors"
                >
                    + New Playlist
                </button>
            </div>

            {isLoading ? (
                <div className="text-zinc-500 animate-pulse">Loading your collection...</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    
                    {/* 1. THE LIKED SONGS HERO CARD (Always First) */}
                    <div 
                        onClick={() => navigate('/likedsongs')}
                        className="group cursor-pointer bg-zinc-900/40 p-4 rounded-xl hover:bg-zinc-800/60 transition-colors border border-transparent hover:border-white/5"
                    >
                        {/* Custom Gradient Cover for Liked Songs */}
                        <div className="w-full aspect-square mb-4 shadow-lg rounded-md overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-800 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </div>
                        <h3 className="font-bold text-text-primary truncate">Liked Songs</h3>
                        <p className="text-sm text-text-secondary truncate mt-1">Playlist • You</p>
                    </div>

                    {/* 2. THE USER PLAYLISTS GRID */}
                    {playlists.map((playlist) => (
                        <div 
                            key={playlist.id}
                            onClick={() => navigate(`/playlists/${playlist.id}`)}
                            className="group cursor-pointer bg-zinc-900/40 p-4 rounded-xl hover:bg-zinc-800/60 transition-colors border border-transparent hover:border-white/5"
                        >
                            <div className="w-full aspect-square mb-4 shadow-lg rounded-md overflow-hidden">
                                {/* Using your exact Collage component here! */}
                                <Collage 
                                    covers={playlist.custom_cover_path ? [playlist.custom_cover_path] : playlist.auto_covers} 
                                />
                            </div>
                            <h3 className="font-bold text-text-primary truncate">{playlist.name}</h3>
                            <p className="text-sm text-text-secondary truncate mt-1">
                                {playlist.description ? playlist.description : "Playlist • You"}
                            </p>
                        </div>
                    ))}
                    
                </div>
            )}
        </div>
    );
};

export default LibraryPage;