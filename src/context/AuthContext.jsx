import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => { 
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState('login');

    
    const login = (newToken) => {
        if (!newToken) {
            console.error("Failed to log in: No token provided");
            return;
        }
        localStorage.setItem('token', newToken);
        setToken(newToken);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    }

    const authFetch = (url, options = {}) => {
        return fetch(url, {
            ...options, // Spread the incoming options (like method: 'POST', body: {...})
            headers: {
                ...options.headers, // Keep any custom headers (like Content-Type)
                'Authorization': `Bearer ${token}` // Attach the VIP pass
            }
        });
    }

    const isLoggedIn = !!token;

    const openAuthModal = (view = 'login') => {
        setAuthModalView(view);
        setIsAuthModalOpen(true);
    }
    
    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    }

    // FIX 2: Added 'token' to the exported values
    const values = { isLoggedIn, token, isAuthModalOpen, authModalView, login, logout, authFetch, openAuthModal, closeAuthModal }; 

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