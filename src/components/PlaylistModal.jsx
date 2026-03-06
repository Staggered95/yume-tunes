import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // Native Axios import
import { useToast } from '../context/ToastContext';
import BaseModal from '../minicomps/BaseModal';

const PlaylistModal = ({ isOpen, onClose, songId }) => {
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
                // Axios handles token and JSON automatically
                const { data } = await api.get('/playlists');
                if (data.success) {
                    setPlaylists(data.data);
                }
            } catch (error) {
                addToast("Failed to fetch playlists", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaylists();
    }, [isOpen, addToast]);

    const handleAddToPlaylist = async (playlistId) => {
        try {
            const { data } = await api.post(`/playlists/${playlistId}/songs`, { 
                songID: songId, 
                positionOrder: 1 
            });
            
            if (data.success) {
                addToast('Added to playlist! 🎵', "success"); 
                onClose(); 
            } else {
                addToast(data.message || 'Song already in playlist', "warning");
                onClose();
            }
        } catch (error) {
            addToast('Failed to add song.', "error");
        }
    };

    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/playlists', { 
                name: newPlaylistName, 
                description: newPlaylistDesc 
            });
            
            if (data.success) {
                const newPlaylist = data.data;
                setPlaylists([newPlaylist, ...playlists]);
                setNewPlaylistName('');
                setNewPlaylistDesc('');
                setView('list');
                addToast(`Created ${newPlaylist.name}!`, "success");
            }
        } catch (error) {
            addToast('Failed to create playlist.', "error");
        }
    };

    return (
        <BaseModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={view === 'list' ? "Add to Playlist" : "New Playlist"}
        >
            {/* --- VIEW 1: THE LIST --- */}
            {view === 'list' && (
                <div className="animate-fade-in flex flex-col">
                    <div className="max-h-72 overflow-y-auto space-y-1 mb-6 pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                        {isLoading ? (
                            <div className="flex flex-col gap-3 py-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-12 w-full bg-background-active/50 animate-pulse rounded-lg" />
                                ))}
                            </div>
                        ) : playlists.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-text-secondary text-sm">You don't have any playlists yet.</p>
                            </div>
                        ) : (
                            playlists.map(playlist => (
                                <button 
                                    key={playlist.id}
                                    onClick={() => handleAddToPlaylist(playlist.id)}
                                    className="w-full text-left p-4 bg-background-primary/40 hover:bg-background-hover border border-transparent hover:border-border rounded-xl transition-all duration-300 flex justify-between items-center group"
                                >
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-text-primary font-bold truncate">{playlist.name}</span>
                                        <span className="text-text-muted text-xs truncate">
                                            {playlist.song_count || 0} tracks
                                        </span>
                                    </div>
                                    <span className="text-accent-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        + Add
                                    </span>
                                </button>
                            ))
                        )}
                    </div>

                    <button 
                        onClick={() => setView('create')}
                        className="w-full bg-background-secondary hover:bg-background-hover text-text-primary py-4 rounded-xl font-black text-sm uppercase tracking-widest border border-border hover:border-border-hover transition-all duration-300"
                    >
                        Create New Playlist
                    </button>
                </div>
            )}

            {/* --- VIEW 2: CREATE NEW --- */}
            {view === 'create' && (
                <form onSubmit={handleCreatePlaylist} className="animate-fade-in flex flex-col gap-5">
                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-text-secondary text-xs font-black uppercase tracking-widest mb-2 group-focus-within:text-accent-primary transition-colors">
                                Playlist Name
                            </label>
                            <input 
                                type="text" 
                                required
                                value={newPlaylistName}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                className="w-full bg-background-primary text-text-primary border border-border rounded-xl p-4 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 transition-all duration-300"
                                placeholder="e.g., Late Night Anime Vibes"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-text-secondary text-xs font-black uppercase tracking-widest mb-2 group-focus-within:text-accent-primary transition-colors">
                                Description
                            </label>
                            <textarea 
                                value={newPlaylistDesc}
                                onChange={(e) => setNewPlaylistDesc(e.target.value)}
                                className="w-full bg-background-primary text-text-primary border border-border rounded-xl p-4 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 transition-all duration-300 resize-none h-28"
                                placeholder="Tell us about the mood..."
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button 
                            type="button"
                            onClick={() => setView('list')}
                            className="flex-1 py-4 rounded-xl font-bold text-text-secondary hover:text-text-primary hover:bg-background-hover transition-all duration-300"
                        >
                            Back
                        </button>
                        <button 
                            type="submit"
                            disabled={!newPlaylistName.trim()}
                            className="flex-1 bg-accent-primary text-background-primary py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-accent-primary/20 hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
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