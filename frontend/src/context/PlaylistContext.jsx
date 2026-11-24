import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
    const { isLoggedIn } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshPlaylists = useCallback(async () => {
        if (!isLoggedIn) {
            setPlaylists([]);
            return;
        }
        setIsLoading(true);
        try {
            const { data } = await api.get('/playlists');
            if (data.success) {
                setPlaylists(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch playlists:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        refreshPlaylists();
    }, [refreshPlaylists]);

    return (
        <PlaylistContext.Provider value={{ playlists, setPlaylists, isLoading, refreshPlaylists }}>
            {children}
        </PlaylistContext.Provider>
    );
};

export const usePlaylists = () => useContext(PlaylistContext);