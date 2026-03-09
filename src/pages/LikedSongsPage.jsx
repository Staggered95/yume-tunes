import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // Native Axios instance
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { useSongs } from '../context/SongContext';
import AddToPlaylistButton from '../minicomps/AddToPlaylistButton';
import { getMediaUrl } from '../utils/media';

const LikedSongsPage = () => {
    const { isLoggedIn } = useAuth();
    const { userProfile } = useUser();
    const { playQueue } = useSongs();
    
    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLikedSongs = async () => {
            try {
                // Axios handles the JWT and base URL automatically
                const { data } = await api.get('/user/likedsongs');
                if (data.success) {
                    setSongs(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch favorites:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoggedIn) fetchLikedSongs();
    }, [isLoggedIn]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background-primary flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-text-secondary font-black text-xs uppercase tracking-widest">Waking up your favorites...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-primary text-text-primary">
            {/* 1. THE HERO HEADER */}
            <div className="relative min-h-[40vh] md:h-[50vh] flex items-end overflow-hidden">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/30 to-background-primary z-0" />
                
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-10 flex flex-col md:flex-row gap-8 items-center md:items-end">
                    {/* The Big Heart Cover */}
                    <div className="w-48 h-48 md:w-64 md:h-64 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shrink-0 animate-in zoom-in duration-700">
                        <svg className="w-24 h-24 md:w-32 md:h-32 text-background-primary drop-shadow-2xl" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </div>

                    <div className="flex flex-col gap-2 text-center md:text-left animate-in slide-in-from-left-8 duration-700">
                        <span className="text-[10px] md:text-xs font-black tracking-[0.3em] uppercase text-accent-primary">Personal Collection</span>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic uppercase leading-none">
                            Liked <br className="hidden md:block" /> Songs
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-3 mt-4 text-sm font-bold">
                            <span className="text-text-primary">{userProfile?.username || 'You'}</span>
                            <span className="w-1 h-1 bg-text-muted rounded-full" />
                            <span className="text-text-secondary">{songs.length} Tracks</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. ACTION BAR */}
            <div className="sticky top-16 z-30 bg-background-primary/80 backdrop-blur-md border-b border-border/50">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center gap-6">
                    <button 
                        onClick={() => playQueue(songs, 0)}
                        className="w-14 h-14 bg-accent-primary text-background-primary rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-accent-primary/20 group"
                    >
                        <svg viewBox="0 0 24 24" className="w-8 h-8 ml-1 transition-transform group-hover:scale-110" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                </div>
            </div>

            {/* 3. THE TRACK LIST */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 pb-32 pt-8">
                {/* Table Header */}
                <div className="grid grid-cols-[40px_1fr_auto_80px] gap-4 px-4 py-3 text-text-muted text-[10px] font-black uppercase tracking-widest border-b border-border mb-4">
                    <div className="text-center">#</div>
                    <div>Title</div>
                    <div className="hidden md:block">Action</div>
                    <div className="text-right">Time</div>
                </div>

                {/* Song Rows */}
                <div className="flex flex-col gap-1">
                    {songs.map((song, index) => (
                        <div 
                            key={song.id} 
                            onClick={() => playQueue(songs, index)}
                            className="group grid grid-cols-[40px_1fr_auto_80px] gap-4 px-4 py-3 items-center rounded-2xl hover:bg-background-secondary transition-all duration-300 cursor-pointer border border-transparent hover:border-border"
                        >
                            {/* Play Indicator */}
                            <div className="text-text-muted text-xs font-bold text-center relative flex items-center justify-center">
                                <span className="group-hover:opacity-0 transition-opacity">{index + 1}</span>
                                <svg viewBox="0 0 24 24" className="w-4 h-4 text-accent-primary absolute opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                            
                            {/* Metadata */}
                            <div className="flex items-center gap-4 overflow-hidden">
                                <img 
                                    src={getMediaUrl(song.cover_path)} 
                                    alt="" 
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg shadow-lg object-cover" 
                                />
                                <div className="flex flex-col truncate">
                                    <span className="text-text-primary font-bold text-sm md:text-base truncate group-hover:text-accent-primary transition-colors">
                                        {song.title}
                                    </span>
                                    <span className="text-text-secondary text-xs md:text-sm truncate">
                                        {song.artist}
                                    </span>
                                </div>
                            </div>

                            {/* Interactions */}
                            <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                <AddToPlaylistButton songId={song.id} variant="bottom" className="p-2 hover:bg-background-active rounded-lg" />
                            </div>

                            {/* Duration */}
                            <div className="text-text-muted text-xs md:text-sm font-mono text-right">
                                {formatTime(song.duration_seconds)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LikedSongsPage;