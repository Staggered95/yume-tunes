import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Collage from '../minicomps/Collage';
import PlaylistModal from '../components/PlaylistModal';

const LibraryPage = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    
    const [playlists, setPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchLibrary = async () => {
            setIsLoading(true);
            try {
                const { data } = await api.get('/playlists');
                if (data.success) {
                    setPlaylists(data.data);
                }
            } catch (error) {
                console.error("Error fetching library:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLibrary();
    }, [isLoggedIn]);

    if (!isLoggedIn) return (
        <div className="min-h-screen flex items-center justify-center bg-background-primary text-text-secondary">
            Please log in to view your library.
        </div>
    );

    return (
        <div className="min-h-screen bg-background-primary text-text-primary p-6 md:p-10 pt-24">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div className="space-y-1">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
                        Your Library
                    </h1>
                    <p className="text-text-muted text-sm font-bold tracking-widest uppercase">
                        {playlists.length + 1} Collections
                    </p>
                </div>
                
                <button onClick={() => setIsModalOpen(true)}
                    className="w-fit px-6 py-3 bg-background-secondary hover:bg-background-hover text-accent-primary border border-border hover:border-accent-primary/30 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 active:scale-95 shadow-lg shadow-black/20"
                >
                    + Create New Playlist
                </button>
            </div>

            {isLoading ? (
                /* Skeleton Loader Grid */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="animate-pulse space-y-4">
                            <div className="aspect-square bg-background-secondary rounded-2xl border border-border" />
                            <div className="h-4 w-3/4 bg-background-secondary rounded" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
                    
                    {/* 1. THE LIKED SONGS HERO CARD */}
                    <div 
                        onClick={() => navigate('/likedsongs')}
                        className="group cursor-pointer bg-background-secondary/20 p-4 rounded-3xl hover:bg-background-hover border border-transparent hover:border-border transition-all duration-500 shadow-xl hover:shadow-accent-primary/5"
                    >
                        <div className="w-full aspect-square mb-4 shadow-2xl rounded-2xl overflow-hidden bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center transition-all duration-700 group-hover:scale-[1.03] group-hover:rotate-1">
                            <svg className="w-16 h-16 md:w-32 md:h-32 lg:w-40 lg:h-40 text-background-primary drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </div>
                        <h3 className="font-black text-sm tracking-tight truncate group-hover:text-accent-primary transition-colors">Liked Songs</h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Special Collection</p>
                    </div>

                    {/* 2. USER PLAYLISTS GRID */}
                    {playlists.map((playlist) => (
                        <div 
                            key={playlist.id}
                            onClick={() => navigate(`/playlists/${playlist.id}`)}
                            className="group cursor-pointer bg-background-secondary/20 p-4 rounded-3xl hover:bg-background-hover border border-transparent hover:border-border transition-all duration-500 shadow-xl hover:shadow-accent-primary/5"
                        >
                            <div className="w-full aspect-square mb-4 shadow-2xl rounded-2xl overflow-hidden bg-background-primary">
                                <Collage 
                                    covers={playlist.custom_cover_path ? [playlist.custom_cover_path] : playlist.auto_covers} 
                                />
                            </div>
                            <h3 className="font-black text-sm tracking-tight truncate group-hover:text-accent-primary transition-colors">
                                {playlist.name}
                            </h3>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">{playlist.song_count} tracks</p>
                            
                        </div>
                    ))}
                    
                </div>
            )}
            <PlaylistModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                initialView='create' 
            />
        </div>
    );
};

export default LibraryPage;