import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState('login');

    const login = useCallback((newToken) => {
        if (!newToken) {
            console.error("Failed to log in: No token provided");
            return;
        }
        localStorage.setItem('token', newToken);
        setToken(newToken);
    }, []);

    const logout = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        const verifySession = async () => {
            if (!token) {
                setIsCheckingAuth(false);
                setUser(null);
                return;
            }

            try {
                const { data } = await api.get('/auth/me');

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
    }, [token, logout]);



    const isLoggedIn = !!user;

    const openAuthModal = (view = 'login') => {
        setAuthModalView(view);
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    const values = {
        isLoggedIn,
        user,
        token,
        isCheckingAuth,
        isAuthModalOpen,
        authModalView,
        login,
        logout,
        openAuthModal,
        closeAuthModal,
    };

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};