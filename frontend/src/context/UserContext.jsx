import { useState, useEffect, createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import api from "../api/axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [likedSongIds, setLikedSongIds] = useState(new Set());
    const [isLoading, setIsLoading] = useState(false);

    const { isLoggedIn } = useAuth();

    const toggleLike = async (songId) => {
        if (!isLoggedIn) return false;

        setLikedSongIds((prevSet) => {
            const newSet = new Set(prevSet);
            if (newSet.has(songId)) {
                newSet.delete(songId);
            } else {
                newSet.add(songId);
            }
            return newSet;
        });

        try {
            const { data } = await api.post(`/user/likedsongs/${songId}`);
            if (!data.success) {
                throw new Error("Server failed to update");
            }
            return true;
        } catch (err) {
            console.error("Error changing like status", err);

            // Rollback optimistic update
            setLikedSongIds((prevSet) => {
                const newSet = new Set(prevSet);
                if (newSet.has(songId)) {
                    newSet.delete(songId);
                } else {
                    newSet.add(songId);
                }
                return newSet;
            });
            return false;
        }
    };

    useEffect(() => {
        if (!isLoggedIn) {
            setLikedSongIds(new Set());
            setUserProfile(null);
            setIsLoading(false);
            return;
        }

        let isCancelled = false;

        const loadUserData = async () => {
            setIsLoading(true);
            try {
                const [userRes, likedRes] = await Promise.all([
                    api.get('/user').catch((err) => {
                        console.error("Error fetching user details", err);
                        return null;
                    }),
                    api.get('/user/likedsongs/minimal').catch((err) => {
                        console.error("Error fetching liked song ids", err);
                        return null;
                    }),
                ]);

                if (isCancelled) return;

                if (userRes?.data?.success) {
                    const payload = userRes.data.data;
                    const normalizedProfile = Array.isArray(payload)
                        ? (payload[0] ?? null)
                        : (payload ?? null);
                    setUserProfile(normalizedProfile);
                }

                if (likedRes?.data?.success) {
                    setLikedSongIds(new Set(likedRes.data.data));
                }
            } finally {
                if (!isCancelled) setIsLoading(false);
            }
        };

        loadUserData();

        return () => {
            isCancelled = true;
        };
    }, [isLoggedIn]);

    const values = { userProfile, likedSongIds, isLoading, toggleLike, setUserProfile };

    return (
        <UserContext.Provider value={values}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be within a UserProvider");
    }
    return context;
};