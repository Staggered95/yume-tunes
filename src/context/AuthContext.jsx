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
                // We ping the backend to validate the token. 
                // (Adjust this URL to match your actual backend route!)
                const { data } = await api.get('/auth/me')

                if (data.success) {
                    setUser(data.data); // Token is valid! Set the user.
                } else {
                    // Backend said the token is expired or fake (401/403 status)
                    console.warn("Session expired. Logging out.");
                    logout(); 
                }
            } catch (error) {
                console.error("Failed to verify session:", error);
                logout(); // If the server crashes, fail securely
            } finally {
                setIsCheckingAuth(false); // We are done checking, safe to render the app!
            }
        };

        verifySession();
    }, [token]);

    useEffect(() => {
        if (!token) {
            setLikedSongIds(new Set()); // Clear if logged out
            return;
        }

        const fetchLikedIds = async () => {
            try {
                // Point this to your getLikedSongsMinimalData route
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
            // Create a copy of the Set (React requires new references for state updates)
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
        //if (userData) setUser(userData);
    }

    const logout = async () => {
        try {
            // 1. Tell the backend to destroy the 7-day Refresh Cookie
            await api.post('/auth/logout'); 
        } catch (err) {
            console.error("Server logout failed, but we will still clear local data.");
        }
        
        // 2. Destroy the 15-minute Access Token from the frontend
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        //setLikedSongIds(new Set());
    }

    const authFetch = async (url, options = {}) => {
        const response = await fetch(`http://localhost:5000${url}`, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`
            }
        });

        // THE INTERCEPTOR: If the backend says the token is expired/invalid...
        if (response.status === 401 || response.status === 403) {
            console.warn("Token expired or invalid. Auto-logging out.");
            logout(); // Shred the token!
        }

        return response; // Pass the response back to whoever called it (like UserContext)
    }

    const isLoggedIn = !!user;

    const openAuthModal = (view = 'login') => {
        setAuthModalView(view);
        setIsAuthModalOpen(true);
    }
    
    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    }

    // FIX 2: Added 'token' to the exported values
    const values = { isLoggedIn, user, token, likedSongIds, isCheckingAuth, isAuthModalOpen, authModalView, login, logout, authFetch, updateLikedSongsState, openAuthModal, closeAuthModal }; 

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