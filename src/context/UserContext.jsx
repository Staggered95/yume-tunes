import { useState, useEffect, createContext, useContext } from "react";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [likedSongIds, setLikedSongIds] = useState(new Set());
    const [isLoading, setIsLoading] = useState(false);

    const { isLoggedIn, authFetch } = useAuth();

    const fetchLikedSongIds = async () => {
        try {
            const result = await authFetch('/user/likedsongs/minimal', { method: 'GET' });
            const json = await result.json();
            
            if (json.success) {
                setLikedSongIds(new Set(json.data));
            }
        } catch (err) {
            console.error("Error fetching the liked song ids", err);
        }
    }

    const fetchUserData = async () => {
        try {
            const result = await authFetch('/user', { method: 'GET' });
            const json = await result.json();
            
            if (json.success) {
                setUserProfile(json.data[0]);
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
            const result = await authFetch(`/user/likedsongs/${songId}`, { method: 'POST' });
            const status = await result.json();
            
            if (!status.success) {
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
            // Promise.all runs both fetches at the exact same time for maximum speed!
            Promise.all([fetchUserData(), fetchLikedSongIds()]).finally(() => {
                setIsLoading(false);
            });
        } else {
            setLikedSongIds(new Set());
            setUserProfile(null);
        }
    }, [isLoggedIn]);
    console.log("userprofile console.logged from usercontext: ",userProfile);
    const values = { userProfile, likedSongIds, isLoading, toggleLike };

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