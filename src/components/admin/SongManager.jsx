import React, { useState, useEffect } from 'react';
import api from '../../api/axios'; 
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext'; 
import ConfirmDialog from '../../minicomps/ConfirmDialog';
import { getMediaUrl } from '../../utils/media';

const SongManager = ({ onAddNew, onEditSong, onSyncLyrics }) => {
    const { addToast } = useToast();
    const { user } = useAuth(); 

    const isAdmin = user?.role === 'admin';

    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [songToDelete, setSongToDelete] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/admin/songs'); 
            if (data.success) {
                setSongs(data.data);
            } else {
                addToast("Failed to fetch songs", "error");
            }
        } catch (err) {
            console.error("Error fetching songs:", err);
            addToast("Network error while fetching songs", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!songToDelete) return;
        
        try {
            const { data } = await api.delete(`/admin/songs/${songToDelete.id}`);

            if (data.success) {
                setSongs(prev => prev.filter(s => s.id !== songToDelete.id));
                addToast("Song deleted successfully", "success");
            } else {
                addToast(data.message || "Failed to delete song", "error");
            }
        } catch (err) {
            console.error("Delete error:", err);
            addToast("Network error during deletion", "error");
        } finally {
            setIsConfirmOpen(false);
            setSongToDelete(null);
        }
    };

    const filteredSongs = songs.filter(song => {
        const query = searchQuery.toLowerCase();
        return (
            song.title?.toLowerCase().includes(query) || 
            song.artist?.toLowerCase().includes(query) ||
            song.anime?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="animate-fade-in">
            
            {/* 1. HEADER & CONTROLS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary tracking-tight">Song Library</h2>
                    <p className="text-sm text-text-muted mt-1">Manage and organize your catalog ({songs.length} total)</p>
                </div>

                <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch sm:items-center gap-4">
                    <div className="relative flex-1 md:w-64">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Search songs..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-background-secondary border border-border rounded-full py-2 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-all duration-300 ease-in-out shadow-sm focus:shadow-accent-primary/20"
                        />
                    </div>
                    
                    <button 
                        onClick={onAddNew}
                        className="bg-accent-primary text-background-primary px-5 py-2 rounded-full font-bold text-sm hover:bg-accent-hover transition-all duration-300 hover:scale-105 active:scale-95 shrink-0 shadow-lg shadow-accent-primary/20"
                    >
                        + Add Song
                    </button>
                </div>
            </div>

            {/* 2. THE DATA TABLE */}
            <div className="bg-background-secondary border border-border rounded-2xl overflow-hidden shadow-xl transition-all duration-300">
                {isLoading ? (
                    <div className="p-12 text-center text-text-muted animate-pulse">Loading library...</div>
                ) : filteredSongs.length === 0 ? (
                    <div className="p-12 text-center text-text-muted">No songs found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-border bg-background-primary/50 text-xs uppercase tracking-widest text-text-muted">
                                    <th className="p-4 font-bold">Song</th>
                                    <th className="p-4 font-bold">Artist</th>
                                    <th className="p-4 font-bold">Anime</th>
                                    <th className="p-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredSongs.slice(0, 8).map(song => (
                                    <tr key={song.id} className="hover:bg-background-hover transition-colors duration-300 ease-in-out group">
                                        
                                        <td className="p-4 flex items-center gap-4 min-w-[200px]">
                                            <div className="w-10 h-10 rounded-md overflow-hidden bg-background-primary border border-border shrink-0">
                                                {song.cover_path ? (
                                                    <img src={getMediaUrl(song.cover_path)} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <svg className="w-5 h-5 text-text-muted m-auto mt-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                                                )}
                                            </div>
                                            <span className="font-bold text-text-primary truncate">{song.title}</span>
                                        </td>
                                        
                                        <td className="p-4 text-sm text-text-secondary truncate max-w-[150px]">
                                            {song.artist}
                                        </td>
                                        
                                        <td className="p-4 text-sm text-text-secondary truncate max-w-[150px]">
                                            {song.anime || '-'}
                                        </td>
                                        
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                                
                                                <button 
                                                    onClick={() => onSyncLyrics(song)}
                                                    className="p-2 text-text-muted hover:text-accent-secondary hover:bg-accent-secondary/10 rounded-md transition-colors duration-300"
                                                    title="Sync Lyrics"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm12-3c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zM9 10l12-3" /></svg>
                                                </button>

                                                <button 
                                                    onClick={() => onEditSong(song)}
                                                    className="p-2 text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 rounded-md transition-colors duration-300"
                                                    title="Edit Song"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>

                                                {/* 4. THE CONDITIONAL RENDER: Only Admins see the trash can */}
                                                {isAdmin && (
                                                    <button 
                                                        onClick={() => {
                                                            setSongToDelete(song);
                                                            setIsConfirmOpen(true);
                                                        }}
                                                        className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-md transition-colors duration-300"
                                                        title="Delete Song"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* 3. CONFIRMATION MODAL */}
            <ConfirmDialog 
                isOpen={isConfirmOpen}
                onClose={() => {
                    setIsConfirmOpen(false);
                    setSongToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Song"
                message={`Are you sure you want to permanently delete "${songToDelete?.title}"? This action cannot be undone and will remove the file and all associated listening history.`}
                confirmText="Delete Permanently"
                cancelText="Keep Song"
                isDestructive={true}
            />

        </div>
    );
};

export default SongManager;