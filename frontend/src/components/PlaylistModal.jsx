import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { usePlaylists } from '../context/PlaylistContext';
import BaseModal from '../minicomps/BaseModal';

const MODAL_TITLES = {
    list: 'Add to Playlist',
    create: 'New Playlist',
    edit: 'Edit Playlist',
    delete: 'Delete Playlist'
};

const PlaylistModal = ({
    isOpen,
    onClose,
    initialView = 'list',
    songId = null,
    playlist = null,
    onSuccess = null
}) => {
    const { addToast } = useToast();
    const { playlists, setPlaylists, isLoading, refreshPlaylists } = usePlaylists();

    const [view, setView] = useState(initialView);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setView('list');
            return;
        }

        setView(initialView);

        if (initialView === 'edit' && playlist) {
            setName(playlist.name || '');
            setDescription(playlist.description || '');
        } else {
            setName('');
            setDescription('');
        }

        if (initialView === 'list') {
            refreshPlaylists();
        }
    }, [isOpen, initialView, playlist, refreshPlaylists]);

    const handleAddToPlaylist = async (playlistId) => {
        try {
            const { data } = await api.post(`/playlists/${playlistId}/songs`, {
                songID: songId,
                positionOrder: 1
            });

            if (data.success) {
                addToast('Added to playlist! 🎵', 'success');
                refreshPlaylists();
                onSuccess?.(playlistId);
                onClose();
            } else {
                addToast(data.message || 'Song already in playlist', 'warning');
                onClose();
            }
        } catch (error) {
            addToast(error.response?.data?.error || 'Failed to add song.', 'error');
        }
    };

    const handleCreateOrEdit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            if (view === 'edit' && playlist) {
                const { data } = await api.put(`/playlists/${playlist.id}`, {
                    name: name.trim(),
                    description: description.trim()
                });

                if (data.success) {
                    const updated = data.data;
                    setPlaylists(prev =>
                        prev.map(p =>
                            String(p.id) === String(playlist.id)
                                ? { ...p, name: updated.name, description: updated.description }
                                : p
                        )
                    );
                    addToast('Playlist updated!', 'success');
                    onSuccess?.(updated);
                    onClose();
                }
            } else {
                const { data } = await api.post('/playlists', {
                    name: name.trim(),
                    description: description.trim()
                });

                if (data.success) {
                    const newPlaylist = {
                        ...data.data,
                        auto_covers: [],
                        song_count: 0
                    };
                    setPlaylists(prev => [newPlaylist, ...prev]);
                    setName('');
                    setDescription('');
                    addToast(`Created ${newPlaylist.name}!`, 'success');
                    onSuccess?.(newPlaylist);

                    if (!songId) {
                        onClose();
                    } else {
                        setView('list');
                    }
                }
            }
        } catch (error) {
            addToast(
                view === 'edit' ? 'Failed to update playlist.' : 'Failed to create playlist.',
                'error'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!playlist) return;

        setIsSubmitting(true);
        try {
            const { data } = await api.delete(`/playlists/${playlist.id}`);

            if (data.success) {
                setPlaylists(prev => prev.filter(p => String(p.id) !== String(playlist.id)));
                addToast(`Deleted "${playlist.name}"`, 'success');
                onSuccess?.(playlist.id);
                onClose();
            }
        } catch (error) {
            addToast('Failed to delete playlist.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={MODAL_TITLES[view] || 'Playlist'}
        >
            {/* --- VIEW 1: ADD SONG TO PLAYLIST --- */}
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
                            playlists.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => handleAddToPlaylist(p.id)}
                                    className="w-full text-left p-4 bg-background-primary/40 hover:bg-background-hover border border-transparent hover:border-border rounded-xl transition-all duration-300 flex justify-between items-center group"
                                >
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-text-primary font-bold truncate">{p.name}</span>
                                        <span className="text-text-muted text-xs truncate">
                                            {p.song_count || 0} tracks
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

            {/* --- VIEW 2 & 3: CREATE OR EDIT PLAYLIST --- */}
            {(view === 'create' || view === 'edit') && (
                <form onSubmit={handleCreateOrEdit} className="animate-fade-in flex flex-col gap-5">
                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-text-secondary text-xs font-black uppercase tracking-widest mb-2 group-focus-within:text-accent-primary transition-colors">
                                Playlist Name
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-background-primary text-text-primary border border-border rounded-xl p-4 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 transition-all duration-300"
                                placeholder="e.g., Late Night Anime Vibes"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-text-secondary text-xs font-black uppercase tracking-widest mb-2 group-focus-within:text-accent-primary transition-colors">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-background-primary text-text-primary border border-border rounded-xl p-4 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 transition-all duration-300 resize-none h-28"
                                placeholder="Tell us about the mood..."
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={() => (view === 'create' && songId ? setView('list') : onClose())}
                            disabled={isSubmitting}
                            className="flex-1 py-4 rounded-xl font-bold text-text-secondary hover:text-text-primary hover:bg-background-hover transition-all duration-300"
                        >
                            {view === 'create' && songId ? 'Back' : 'Cancel'}
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim() || isSubmitting}
                            className="flex-1 bg-accent-primary text-background-primary py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-accent-primary/20 hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
                        >
                            {isSubmitting
                                ? view === 'edit' ? 'Saving...' : 'Creating...'
                                : view === 'edit' ? 'Save' : 'Create'}
                        </button>
                    </div>
                </form>
            )}

            {/* --- VIEW 4: DELETE CONFIRMATION --- */}
            {view === 'delete' && playlist && (
                <div className="animate-fade-in flex flex-col gap-6">
                    <p className="text-text-secondary text-sm leading-relaxed">
                        Are you sure you want to delete{' '}
                        <span className="text-text-primary font-bold">"{playlist.name}"</span>? This action cannot be undone.
                    </p>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 py-3.5 rounded-xl font-bold text-text-secondary hover:text-text-primary hover:bg-background-hover transition-all duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="flex-1 bg-red-500/90 hover:bg-red-500 text-white py-3.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            )}
        </BaseModal>
    );
};

export default PlaylistModal;