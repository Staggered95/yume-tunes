import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios'; 
import { useSongs } from '../context/SongContext';
import Collage from '../minicomps/Collage';
import { getMediaUrl } from '../utils/media';
import ShuffleButton from '../minicomps/ShuffleButton';

const PlaylistPage = () => {
    const { id } = useParams(); 
    const { playQueue, playShuffledQueue } = useSongs();
    
    const [playlistMeta, setPlaylistMeta] = useState(null);
    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            setIsLoading(true);
            try {
                const { data } = await api.get(`/playlists/${id}`);
                
                if (data.success) {
                    setPlaylistMeta(data.data.playlist);
                    setSongs(data.data.songs || []);
                }
            } catch (error) {
                console.error("Failed to fetch playlist:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchPlaylistDetails();
    }, [id]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background-primary flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }
    
    if (!playlistMeta) return <div className="min-h-screen bg-background-primary p-8 pt-32 text-text-secondary text-center">Playlist not found.</div>;

    return (
        <div className="min-h-screen bg-background-primary text-text-primary">
            {/* 1. HERO HEADER */}
            <div className="relative min-h-[45vh] md:h-[55vh] flex items-end overflow-hidden">
                {/* Background Tint Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-background-secondary/60 to-background-primary z-0" />
                
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-10 flex flex-col md:flex-row gap-8 items-center md:items-end">
                    {/* The Collage Cover */}
                    <div className="w-52 h-52 md:w-64 md:h-64 shadow-2xl rounded-3xl overflow-hidden shrink-0 animate-in zoom-in duration-500">
                        <Collage covers={playlistMeta.custom_cover_path ? [playlistMeta.custom_cover_path] : playlistMeta.auto_covers} />
                    </div>

                    <div className="flex flex-col gap-2 text-center md:text-left animate-in slide-in-from-bottom-8 duration-700">
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-accent-primary">Playlist</span>
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter italic uppercase leading-tight truncate max-w-2xl">
                            {playlistMeta.name}
                        </h1>
                        <p className="text-text-secondary text-sm md:text-base font-medium max-w-xl line-clamp-2">
                            {playlistMeta.description || "A custom YumeTunes collection."}
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-3 mt-2 text-xs font-bold text-text-muted">
                            <span className="text-text-primary">You</span>
                            <span className="w-1.5 h-1.5 bg-border rounded-full" />
                            <span>{songs.length} Tracks</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. ACTION ROW */}
            <div className="sticky top-16 z-30 bg-background-primary/80 backdrop-blur-md border-b border-border/50">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center gap-4">
        
                    {/* The Big Play Button */}
                    <button 
                        onClick={() => playQueue(songs, 0)} 
                        disabled={songs.length === 0}
                        className="w-14 h-14 md:w-16 md:h-16 shrink-0 bg-accent-primary text-background-primary rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-primary/20 disabled:opacity-50 group"
                        title="Play All"
                    >
                        <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 ml-1 transition-transform group-hover:scale-110" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </button>

                    <ShuffleButton 
                        variant="action" 
                        onClick={() => { if (songs.length > 0) playShuffledQueue(songs);}}
                    />

                </div>
            </div>

            {/* 3. TRACK LIST */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 pb-32 pt-8">
                {/* Table Header */}
                <div className="grid grid-cols-[40px_1fr_auto_80px] gap-4 px-4 py-3 text-text-muted text-[10px] font-black uppercase tracking-widest border-b border-border mb-4">
                    <div className="text-center">#</div>
                    <div>Title</div>
                    <div className="hidden md:block">Action</div>
                    <div className="text-right flex justify-end">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    {songs.length === 0 ? (
                        <div className="flex flex-col items-center gap-4 py-20 text-text-muted">
                            <svg className="w-16 h-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                <path d="M9 19V6l12-3v13M9 19c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM21 16c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
                            </svg>
                            <p className="font-bold text-sm tracking-widest uppercase">This playlist is empty</p>
                        </div>
                    ) : (
                        songs.map((song, index) => (
                            <div 
                                key={song.id} 
                                onClick={() => playQueue(songs, index)} 
                                className="group grid grid-cols-[40px_1fr_auto_80px] gap-4 px-4 py-3 items-center rounded-2xl hover:bg-background-secondary transition-all duration-300 cursor-pointer border border-transparent hover:border-border"
                            >
                                <div className="text-text-muted text-xs font-bold text-center relative flex items-center justify-center">
                                    <span className="group-hover:opacity-0 transition-opacity">{index + 1}</span>
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-accent-primary absolute opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100" fill="currentColor">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                </div>
                                
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <img 
                                        src={getMediaUrl(song.cover_path)} 
                                        alt="" 
                                        className="w-12 h-12 rounded-lg shadow-lg object-cover" 
                                    />
                                    <div className="flex flex-col truncate">
                                        <span className="text-text-primary font-bold text-base truncate group-hover:text-accent-primary transition-colors">
                                            {song.title}
                                        </span>
                                        <span className="text-text-secondary text-xs truncate">
                                            {song.artist}
                                        </span>
                                    </div>
                                </div>

                                

                                <div className="text-text-muted text-xs font-mono text-right">
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