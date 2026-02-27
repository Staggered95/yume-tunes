import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import AddToPlaylistButton from '../minicomps/AddToPlaylistButton';

const LikedSongsPage = () => {
    const { authFetch } = useAuth();
    const { userProfile } = useUser();
    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHeavyLikedSongs = async () => {
            try {
                // This is your original heavy endpoint!
                const response = await authFetch('/user/likedsongs');
                const json = await response.json();
                if (json.success) {
                    setSongs(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch liked songs details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHeavyLikedSongs();
    }, [authFetch]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading) return <div className="min-h-screen bg-zinc-950 p-8 pt-24 text-white">Loading your favorites...</div>;

    return (
        <div className="min-h-screen bg-zinc-950 text-white relative">
            {/* The Hero Header */}
            <div className="h-80 bg-gradient-to-b from-indigo-900 to-zinc-950 flex items-end p-8 pb-10">
                <div className="flex gap-6 items-end w-full max-w-7xl mx-auto">
                    {/* The Big Heart Cover */}
                    <div className="w-52 h-52 shadow-2xl rounded-md bg-gradient-to-br from-indigo-500 to-purple-800 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold tracking-widest uppercase">Playlist</span>
                        <h1 className="text-5xl md:text-7xl font-black mb-2">Liked Songs</h1>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <span>{userProfile?.first_name || 'You'}</span>
                            <span className="text-zinc-400">•</span>
                            <span className="text-zinc-400">{songs.length} songs</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Row */}
            <div className="max-w-7xl mx-auto px-8 py-4 flex items-center gap-6">
                <button className="w-14 h-14 bg-accent-primary rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                    {/* A bold play icon */}
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white ml-1" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </button>
            </div>

            {/* The Track List */}
            <div className="max-w-7xl mx-auto px-8 pb-24">
                {/* Header Row */}
                <div className="grid grid-cols-[32px_1fr_auto_60px] gap-4 px-4 py-2 text-zinc-400 text-sm border-b border-zinc-800 mb-4">
                    <div className="text-center">#</div>
                    <div>Title</div>
                    <div></div> {/* Empty space for Add button */}
                    <div className="text-right flex justify-end">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                </div>

                {/* Song Rows */}
                <div className="flex flex-col">
                    {songs.map((song, index) => (
                        <div key={song.id} className="group grid grid-cols-[32px_1fr_auto_60px] gap-4 px-4 py-3 items-center rounded-md hover:bg-white/5 transition-colors cursor-pointer">
                            {/* Number changes to Play icon on hover */}
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

                            {/* Using your new Minicomp! */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <AddToPlaylistButton songId={song.id} variant="bottom" />
                            </div>

                            <div className="text-zinc-400 text-sm text-right">
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