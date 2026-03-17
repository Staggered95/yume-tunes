import { useState, useEffect, createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import api from "../api/axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [likedSongIds, setLikedSongIds] = useState(new Set());
    const [isLoading, setIsLoading] = useState(false);

    const { isLoggedIn } = useAuth();

    const fetchLikedSongIds = async () => {
        try {
            const { data } = await api.get('/user/likedsongs/minimal');
            
            if (data.success) {
                setLikedSongIds(new Set(data.data));
            }
        } catch (err) {
            console.error("Error fetching the liked song ids", err);
        }
    }

    const fetchUserData = async () => {
        try {
            const { data } = await api.get('/user');
            
            if (data.success) {
                setUserProfile(data.data[0]);
            }
        } catch (err) {
            console.error("Error fetching the user details", err);
        }
    }

    const toggleLike = async (songId) => {
        setLikedSongIds(prevSet => {
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
        } catch (err) {
            console.error("Error changing like status", err);
            
            setLikedSongIds(prevSet => {
                const newSet = new Set(prevSet);
                if (newSet.has(songId)) {
                    newSet.delete(songId);
                } else {
                    newSet.add(songId);
                }
                return newSet;
            });
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            setIsLoading(true);
            Promise.all([fetchUserData(), fetchLikedSongIds()]).finally(() => {
                setIsLoading(false);
            });
        } else {
            setLikedSongIds(new Set());
            setUserProfile(null);
        }
    }, [isLoggedIn]);
    const values = { userProfile, likedSongIds, isLoading, toggleLike, setUserProfile };

    return (
        <UserContext.Provider value={values}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be within a UserProvider");
    }
    return context;
}