import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => { 
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState('login');
    

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
                const response = await fetch('http://localhost:5000/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData); // Token is valid! Set the user.
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

    
    const login = (newToken) => {
        if (!newToken) {
            console.error("Failed to log in: No token provided");
            return;
        }
        localStorage.setItem('token', newToken);
        setToken(newToken);
        //if (userData) setUser(userData);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
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
    const values = { isLoggedIn, user, token, isCheckingAuth, isAuthModalOpen, authModalView, login, logout, authFetch, openAuthModal, closeAuthModal }; 

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