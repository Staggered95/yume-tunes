import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';

const PlaylistModal = ({ isOpen, onClose, songId }) => {
    const { authFetch } = useAuth();
    
    const [view, setView] = useState('list'); 
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState(''); 
    
    const [playlists, setPlaylists] = useState([]);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setView('list');
            setStatusMessage('');
            return;
        }

        const fetchPlaylists = async () => {
            setIsLoading(true);
            try {
                const response = await authFetch('/playlists');
                const json = await response.json();
                if (json.success) {
                    setPlaylists(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch playlists", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaylists();
    }, [isOpen, authFetch]);

    const handleAddToPlaylist = async (playlistId) => {
        try {
            const response = await authFetch(`/playlists/${playlistId}/songs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ songID: songId, positionOrder: 1 }) 
            });
            const json = await response.json();
            
            if (json.success) {
                setStatusMessage('Added to playlist! 🎵');
                setTimeout(() => onClose(), 1500); 
            } else {
                setStatusMessage(json.error || 'Song already in playlist');
            }
        } catch (error) {
            setStatusMessage('Failed to add song.');
        }
    };

    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        try {
            const response = await authFetch('/playlists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newPlaylistName, description: newPlaylistDesc })
            });
            const json = await response.json();
            
            if (json.success) {
                const newPlaylist = json.data;
                setPlaylists([newPlaylist, ...playlists]);
                setNewPlaylistName('');
                setNewPlaylistDesc('');
                setView('list');
                setStatusMessage(`Created ${newPlaylist.name}! Click it to add the song.`);
            }
        } catch (error) {
            setStatusMessage('Failed to create playlist.');
        }
    };

    if (!isOpen) return null;

    return createPortal(
        /* Dark, blurred overlay with a smooth fade */
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            
            {/* The Modal Box with custom YumeTunes colors and the pop animation */}
            <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl w-full max-w-md p-6 relative shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-modal-pop">
                
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-secondary hover:text-accent-primary text-2xl font-bold transition-colors"
                >
                    &times;
                </button>

                {statusMessage && (
                    <div className="bg-accent-primary text-text-primary text-center p-2 rounded mb-4 text-sm font-bold animate-fade-in">
                        {statusMessage}
                    </div>
                )}

                {/* --- VIEW 1: THE LIST --- */}
                {view === 'list' && (
                    <>
                        <h2 className="text-2xl font-bold text-text-primary mb-6">Add to Playlist</h2>
                        
                        <div className="max-h-64 overflow-y-auto space-y-2 mb-6 custom-scrollbar pr-2">
                            {isLoading ? (
                                <p className="text-text-secondary text-center py-4">Loading your playlists...</p>
                            ) : playlists.length === 0 ? (
                                <p className="text-text-secondary text-center py-4">You don't have any playlists yet.</p>
                            ) : (
                                playlists.map(playlist => (
                                    <button 
                                        key={playlist.id}
                                        onClick={() => handleAddToPlaylist(playlist.id)}
                                        className="w-full text-left p-3 hover:bg-zinc-800 rounded-lg text-text-primary font-semibold transition-colors flex justify-between items-center group"
                                    >
                                        <span className="truncate">{playlist.name}</span>
                                        <span className="text-text-secondary group-hover:text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                            + Add
                                        </span>
                                    </button>
                                ))
                            )}
                        </div>

                        <button 
                            onClick={() => setView('create')}
                            className="w-full bg-zinc-900 hover:bg-zinc-800 text-text-primary py-3 rounded-lg font-bold border border-zinc-800 transition-colors"
                        >
                            + Create New Playlist
                        </button>
                    </>
                )}

                {/* --- VIEW 2: CREATE NEW --- */}
                {view === 'create' && (
                    <form onSubmit={handleCreatePlaylist} className="animate-fade-in">
                        <h2 className="text-2xl font-bold text-text-primary mb-6">New Playlist</h2>
                        
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-text-secondary text-sm font-bold mb-2">Playlist Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newPlaylistName}
                                    onChange={(e) => setNewPlaylistName(e.target.value)}
                                    className="w-full bg-zinc-900 text-text-primary border border-zinc-800 rounded-lg p-3 focus:outline-none focus:border-accent-primary transition-colors"
                                    placeholder="e.g., Late Night Anime Vibes"
                                />
                            </div>
                            <div>
                                <label className="block text-text-secondary text-sm font-bold mb-2">Description (Optional)</label>
                                <textarea 
                                    value={newPlaylistDesc}
                                    onChange={(e) => setNewPlaylistDesc(e.target.value)}
                                    className="w-full bg-zinc-900 text-text-primary border border-zinc-800 rounded-lg p-3 focus:outline-none focus:border-accent-primary transition-colors resize-none h-24"
                                    placeholder="Songs that make me cry..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                type="button"
                                onClick={() => setView('list')}
                                className="flex-1 bg-transparent hover:bg-zinc-800 text-text-primary py-3 rounded-lg font-bold transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={!newPlaylistName.trim()}
                                className="flex-1 bg-accent-primary hover:bg-accent-hover text-white py-3 rounded-lg font-bold transition-transform transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                )}

            </div>
        </div>,
        document.body
    );
};

export default PlaylistModal;