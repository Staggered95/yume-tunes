import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../minicomps/ConfirmDialog';

const SongManager = ({ onAddNew, onEditSong }) => {
    const { authFetch } = useAuth();
    const { addToast } = useToast();

    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Deletion States
    const [songToDelete, setSongToDelete] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    // Fetch all songs on mount
    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        setIsLoading(true);
        try {
            // Assuming you have a general or admin-specific route to get all songs
            const res = await authFetch('/admin/songs'); 
            const json = await res.json();
            if (json.success) {
                setSongs(json.data);
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

    // Safe Deletion Handler
    const confirmDelete = async () => {
        if (!songToDelete) return;
        
        try {
            // Your backend should ideally have a protected /admin/songs/:id DELETE route
            const res = await authFetch(`/admin/songs/${songToDelete.id}`, {
                method: 'DELETE'
            });
            const json = await res.json();

            if (json.success) {
                setSongs(prev => prev.filter(s => s.id !== songToDelete.id));
                addToast("Song deleted successfully", "success");
            } else {
                addToast(json.message || "Failed to delete song", "error");
            }
        } catch (err) {
            console.error("Delete error:", err);
            addToast("Network error during deletion", "error");
        } finally {
            setIsConfirmOpen(false);
            setSongToDelete(null);
        }
    };

    // Instant Local Search Filter
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
                    <h2 className="text-2xl font-bold text-white tracking-tight">Song Library</h2>
                    <p className="text-sm text-white/40 mt-1">Manage and organize your catalog ({songs.length} total)</p>
                </div>

                <div className="flex w-full md:w-auto items-center gap-4">
                    {/* Search Bar */}
                    <div className="relative flex-1 md:w-64">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Search songs..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent-primary focus:bg-white/10 transition-colors"
                        />
                    </div>
                    
                    <button 
                        onClick={onAddNew}
                        className="bg-accent-primary text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-accent-hover transition-all hover:scale-105 active:scale-95 shrink-0"
                    >
                        + Add Song
                    </button>
                </div>
            </div>

            {/* 2. THE DATA TABLE */}
            <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-white/40 animate-pulse">Loading library...</div>
                ) : filteredSongs.length === 0 ? (
                    <div className="p-12 text-center text-white/40">No songs found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-widest text-white/40">
                                    <th className="p-4 font-bold">Song</th>
                                    <th className="p-4 font-bold">Artist</th>
                                    <th className="p-4 font-bold">Anime</th>
                                    <th className="p-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredSongs.map(song => (
                                    <tr key={song.id} className="hover:bg-white/5 transition-colors group">
                                        
                                        <td className="p-4 flex items-center gap-4 min-w-[200px]">
                                            <div className="w-10 h-10 rounded-md overflow-hidden bg-white/10 shrink-0">
                                                {song.cover_path ? (
                                                    <img src={song.cover_path.startsWith('http') ? song.cover_path : `http://localhost:5000${song.cover_path}`} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <svg className="w-5 h-5 text-white/30 m-auto mt-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                                                )}
                                            </div>
                                            <span className="font-bold text-white/90 truncate">{song.title}</span>
                                        </td>
                                        
                                        <td className="p-4 text-sm text-white/60 truncate max-w-[150px]">
                                            {song.artist}
                                        </td>
                                        
                                        <td className="p-4 text-sm text-white/60 truncate max-w-[150px]">
                                            {song.anime || '-'}
                                        </td>
                                        
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => onEditSong(song)}
                                                    className="p-2 text-white/40 hover:text-accent-primary hover:bg-accent-primary/10 rounded-md transition-colors"
                                                    title="Edit Song"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setSongToDelete(song);
                                                        setIsConfirmOpen(true);
                                                    }}
                                                    className="p-2 text-white/40 hover:text-rose-400 hover:bg-rose-400/10 rounded-md transition-colors"
                                                    title="Delete Song"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
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