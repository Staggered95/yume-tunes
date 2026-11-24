import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import api from '../api/axios';
import { useSongs } from '../context/SongContext';
import { useToast } from '../context/ToastContext';
import { usePlaylists } from '../context/PlaylistContext';
import { useSmartPositionTwo } from '../hooks/useSmartPositionTwo';
import PlaylistModal from '../components/PlaylistModal';

const OptionsMenu = ({
    song = null,
    playlist = null,
    playlistId = null,
    variant = 'song', // 'song' | 'playlistSong' | 'playlist'
    hide = [],        // e.g. ['addToPlaylist', 'playNext']
    extraOptions = [], // [{ id, label, icon, onClick, danger, dividerBefore }]
    onRemove = null,
    onPlaylistSuccess = null,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalMode, setModalMode] = useState(null); // null | 'list' | 'edit' | 'delete'

    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);

    const { addToQueue, playNextInQueue } = useSongs();
    const { addToast } = useToast();
    const { refreshPlaylists } = usePlaylists();

    const portalStyle = useSmartPositionTwo(isOpen, buttonRef);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        const handleScroll = () => setIsOpen(false);

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('scroll', handleScroll, true);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    // Safe early return AFTER all hooks
    if (variant === 'playlist' ? !playlist : !song) return null;

    const handleToggle = (e) => {
        e.stopPropagation();
        setIsOpen(prev => !prev);
    };

    const handleSongAction = (callback, message) => {
        callback(song);
        if (message) addToast(message, 'success');
        setIsOpen(false);
    };

    const handleRemoveFromPlaylist = async () => {
        setIsOpen(false);
        if (!playlistId) {
            onRemove?.(song.id);
            return;
        }

        try {
            const { data } = await api.delete(`/playlists/${playlistId}/songs/${song.id}`);
            if (data.success) {
                addToast('Removed from playlist', 'success');
                refreshPlaylists();
                onRemove?.(song.id);
            }
        } catch (error) {
            addToast('Failed to remove song.', 'error');
        }
    };

    // Catalog of reusable built-in actions
    const actionRegistry = {
        playNext: {
            id: 'playNext',
            label: 'Play Next',
            hoverColor: 'group-hover:text-accent-primary',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
            ),
            onClick: () => handleSongAction(playNextInQueue, 'Will play next ⏭️')
        },
        addToQueue: {
            id: 'addToQueue',
            label: 'Add to Queue',
            hoverColor: 'group-hover:text-accent-secondary',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10m4-4v8m-4-4h8" />
                </svg>
            ),
            onClick: () => handleSongAction(addToQueue, 'Added to your queue 🎧')
        },
        addToPlaylist: {
            id: 'addToPlaylist',
            label: 'Add to Playlist',
            dividerBefore: true,
            hoverColor: 'group-hover:text-accent-tertiary',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            onClick: () => {
                setIsOpen(false);
                setModalMode('list');
            }
        },
        removeFromPlaylist: {
            id: 'removeFromPlaylist',
            label: 'Remove from Playlist',
            dividerBefore: true,
            danger: true,
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
            onClick: handleRemoveFromPlaylist
        },
        editPlaylist: {
            id: 'editPlaylist',
            label: 'Edit Playlist',
            hoverColor: 'group-hover:text-accent-primary',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
            onClick: () => {
                setIsOpen(false);
                setModalMode('edit');
            }
        },
        deletePlaylist: {
            id: 'deletePlaylist',
            label: 'Delete Playlist',
            dividerBefore: true,
            danger: true,
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
            onClick: () => {
                setIsOpen(false);
                setModalMode('delete');
            }
        }
    };

    const variantPresets = {
        song: ['playNext', 'addToQueue', 'addToPlaylist'],
        playlistSong: ['playNext', 'addToQueue', 'removeFromPlaylist'],
        playlist: ['editPlaylist', 'deletePlaylist']
    };

    const presetKeys = variantPresets[variant] || variantPresets.song;
    const menuItems = [
        ...presetKeys
            .filter(key => !hide.includes(key))
            .map(key => actionRegistry[key])
            .filter(Boolean),
        ...extraOptions
    ];

    if (menuItems.length === 0) return null;

    return (
        <div className={`relative inline-block ${className}`}>
            <button
                ref={buttonRef}
                onClick={handleToggle}
                className="p-2 text-text-secondary hover:text-text-primary transition-all duration-300 rounded-full hover:bg-background-hover active:scale-90"
                aria-label="More options"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                </svg>
            </button>

            {isOpen && createPortal(
                <div
                    ref={dropdownRef}
                    style={portalStyle}
                    className="w-56 bg-background-secondary/95 border border-border rounded-xl shadow-2xl py-2 z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {menuItems.map((item, index) => (
                        <React.Fragment key={item.id}>
                            {item.dividerBefore && index > 0 && (
                                <div className="h-px bg-border my-1.5 mx-3" />
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    item.onClick(e);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors group ${
                                    item.danger
                                        ? 'text-red-400 hover:bg-red-500/10'
                                        : 'text-text-primary hover:bg-background-active'
                                }`}
                            >
                                <span
                                    className={`transition-colors ${
                                        item.danger
                                            ? 'text-red-400'
                                            : `text-text-muted ${item.hoverColor || 'group-hover:text-accent-primary'}`
                                    }`}
                                >
                                    {item.icon}
                                </span>
                                {item.label}
                            </button>
                        </React.Fragment>
                    ))}
                </div>,
                document.body
            )}

            {modalMode && (
                <PlaylistModal
                    isOpen={Boolean(modalMode)}
                    onClose={() => setModalMode(null)}
                    initialView={modalMode}
                    songId={song?.id}
                    playlist={playlist}
                    onSuccess={onPlaylistSuccess}
                />
            )}
        </div>
    );
};

export default OptionsMenu;