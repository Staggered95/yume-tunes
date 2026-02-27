import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';

const UserPage = () => {
    const { userProfile, isLoading } = useUser();
    const { authFetch } = useAuth();
    
    const [playlists, setPlaylists] = useState([]);
    const [isPlaylistsLoading, setIsPlaylistsLoading] = useState(true);

    // Fetch this user's playlists when the page loads
    useEffect(() => {
        const fetchUserPlaylists = async () => {
            try {
                const response = await authFetch('/playlists');
                const json = await response.json();
                if (json.success) {
                    setPlaylists(json.data);
                }
            } catch (error) {
                console.error("Error fetching playlists:", error);
            } finally {
                setIsPlaylistsLoading(false);
            }
        };

        fetchUserPlaylists();
    }, [authFetch]);

    // Show a sleek loading state if Context is still fetching the user
    if (isLoading || !userProfile) {
        return <div className="p-8 text-white text-xl">Loading your library...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            
            {/* 1. THE HEADER */}
            <div className="flex items-center gap-6 mb-12 border-b border-gray-800 pb-8">
                {/* Fallback Avatar using their initial */}
                <div className="w-32 h-32 rounded-full bg-purple-600 flex items-center justify-center text-5xl font-bold shadow-lg">
                    {userProfile.first_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className="text-sm text-gray-400 uppercase tracking-widest">Profile</h2>
                    <h1 className="text-5xl font-black mt-1 mb-2">
                        {userProfile.first_name} {userProfile.last_name}
                    </h1>
                    <p className="text-gray-400">@{userProfile.username}</p>
                </div>
            </div>

            {/* 2. THE HERO CARD (Liked Songs) */}
            <div className="mb-12">
                <Link to="/likedsongs" className="block group">
                    <div className="bg-gradient-to-br from-indigo-700 to-purple-900 rounded-lg p-8 h-48 flex flex-col justify-end transition-transform transform hover:scale-[1.02] shadow-xl">
                        <h2 className="text-3xl font-bold text-white group-hover:underline">Liked Songs</h2>
                        <p className="text-gray-300 mt-2">All your favorite anime tracks in one place.</p>
                    </div>
                </Link>
            </div>

            {/* 3. THE PLAYLISTS GRID */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Your Playlists</h2>
                    <button className="bg-white text-black px-4 py-2 rounded-full font-bold hover:scale-105 transition-transform">
                        + New Playlist
                    </button>
                </div>

                {isPlaylistsLoading ? (
                    <div className="text-gray-400">Loading playlists...</div>
                ) : playlists.length === 0 ? (
                    <div className="text-gray-500 italic bg-gray-800 p-6 rounded-lg text-center">
                        You haven't created any playlists yet. Time to curate some bangers!
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {playlists.map((playlist) => (
                            <Link to={`/playlists/${playlist.id}`} key={playlist.id} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors group">
                                {/* Dummy Playlist Cover */}
                                <div className="w-full aspect-square bg-gray-700 rounded-md mb-4 shadow-md flex items-center justify-center text-gray-500 text-4xl group-hover:shadow-lg">
                                    🎵
                                </div>
                                <h3 className="font-bold text-lg truncate">{playlist.name}</h3>
                                <p className="text-sm text-gray-400 truncate mt-1">
                                    {playlist.description || "Custom Playlist"}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default UserPage;