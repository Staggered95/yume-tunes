import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({children}) => { 
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState('login');
    const [likedSongIds, setLikedSongIds] = useState(new Set());
    

    useEffect(() => {
        const verifySession = async () => {
            if (!token) {
                setIsCheckingAuth(false);
                setUser(null);
                return;
            }

            try {
                const { data } = await api.get('/auth/me')

                if (data.success) {
                    setUser(data.data);
                } else {
                    console.warn("Session expired. Logging out.");
                    logout(); 
                }
            } catch (error) {
                console.error("Failed to verify session:", error);
                logout(); 
            } finally {
                setIsCheckingAuth(false); 
            }
        };

        verifySession();
    }, [token]);

    useEffect(() => {
        if (!token) {
            setLikedSongIds(new Set()); 
            return;
        }

        const fetchLikedIds = async () => {
            try {
                const { data } = await api.get('/user/likedsongs/minimal');
                if (data.success) {
                    setLikedSongIds(new Set(data.data));
                }
            } catch (err) {
                console.error("Failed to fetch liked IDs", err);
            }
        };

        fetchLikedIds();
    }, [token]);

    const updateLikedSongsState = (songId, isNowLiked) => {
        setLikedSongIds(prev => {
            const newSet = new Set(prev); 
            if (isNowLiked) {
                newSet.add(songId);
            } else {
                newSet.delete(songId);
            }
            return newSet;
        });
    };

    
    const login = (newToken) => {
        if (!newToken) {
            console.error("Failed to log in: No token provided");
            return;
        }
        localStorage.setItem('token', newToken);
        setToken(newToken);
    }

    const logout = async () => {
        try {
            // destroy refresh cookie
            await api.post('/auth/logout'); 
        } catch (err) {
            console.error("Server logout failed, but we will still clear local data.");
        }
        
        // destroy short lived token
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }

    

    const isLoggedIn = !!user;

    const openAuthModal = (view = 'login') => {
        setAuthModalView(view);
        setIsAuthModalOpen(true);
    }
    
    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    }

    const values = { isLoggedIn, user, token, likedSongIds, isCheckingAuth, isAuthModalOpen, authModalView, login, logout, updateLikedSongsState, openAuthModal, closeAuthModal }; 

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}