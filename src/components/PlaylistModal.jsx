import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext'; // 1. Bring in the Toast!
import BaseModal from '../minicomps/BaseModal'; // 2. Bring in the wrapper!

const PlaylistModal = ({ isOpen, onClose, songId }) => {
    const { authFetch } = useAuth();
    const { addToast } = useToast(); 
    
    const [view, setView] = useState('list'); 
    const [isLoading, setIsLoading] = useState(true);
    
    const [playlists, setPlaylists] = useState([]);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setView('list');
            return;
        }

        const fetchPlaylists = async () => {
            setIsLoading(true);
            try {
                const response = await authFetch('/playlists');
                const json = await response.json();
                if (json.success) setPlaylists(json.data);
            } catch (error) {
                addToast("Failed to fetch playlists", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaylists();
    }, [isOpen, authFetch, addToast]);

    const handleAddToPlaylist = async (playlistId) => {
        try {
            const response = await authFetch(`/playlists/${playlistId}/songs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ songID: songId, positionOrder: 1 }) 
            });
            const json = await response.json();
            
            if (json.success) {
                // Replace inline status with our sleek global toast
                addToast('Added to playlist! 🎵'); 
                onClose(); // Close instantly, let the toast linger
            } else {
                addToast(json.error || 'Song already in playlist', "error");
                onClose();
            }
        } catch (error) {
            addToast('Failed to add song.', "error");
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
                addToast(`Created ${newPlaylist.name}!`, "success"); // Toast!
            }
        } catch (error) {
            addToast('Failed to create playlist.', "error");
        }
    };

    // 3. MAGIC: We wrap EVERYTHING in the BaseModal. 
    // It dynamically changes its title based on the state!
    return (
        <BaseModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={view === 'list' ? "Add to Playlist" : "New Playlist"}
        >
            {/* --- VIEW 1: THE LIST --- */}
            {view === 'list' && (
                <div className="animate-fade-in">
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
                                    className="w-full text-left p-3 hover:bg-white/5 rounded-lg text-text-primary font-semibold transition-colors flex justify-between items-center group"
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
                        className="w-full bg-background-secondary hover:bg-white/5 text-text-primary py-3 rounded-lg font-bold border border-border transition-colors"
                    >
                        + Create New Playlist
                    </button>
                </div>
            )}

            {/* --- VIEW 2: CREATE NEW --- */}
            {view === 'create' && (
                <form onSubmit={handleCreatePlaylist} className="animate-fade-in">
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-text-secondary text-sm font-bold mb-2">Playlist Name</label>
                            <input 
                                type="text" 
                                required
                                value={newPlaylistName}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                className="w-full bg-background-primary text-text-primary border border-border rounded-lg p-3 focus:outline-none focus:border-accent-primary transition-colors"
                                placeholder="e.g., Late Night Anime Vibes"
                            />
                        </div>
                        <div>
                            <label className="block text-text-secondary text-sm font-bold mb-2">Description (Optional)</label>
                            <textarea 
                                value={newPlaylistDesc}
                                onChange={(e) => setNewPlaylistDesc(e.target.value)}
                                className="w-full bg-background-primary text-text-primary border border-border rounded-lg p-3 focus:outline-none focus:border-accent-primary transition-colors resize-none h-24"
                                placeholder="Songs that make me cry..."
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            type="button"
                            onClick={() => setView('list')}
                            className="flex-1 bg-transparent hover:bg-white/5 text-text-primary py-3 rounded-lg font-bold transition-colors"
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
        </BaseModal>
    );
};

export default PlaylistModal;