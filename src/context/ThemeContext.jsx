import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // 1. Check local storage on initial load. Default to 'dark'.
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('yumetunes-theme') || 'dark';
    });

    // 2. Whenever the theme state changes, update the DOM and save it
    useEffect(() => {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.removeAttribute('data-theme'); // Dark is our default :root
        } else {
            root.setAttribute('data-theme', theme);
        }

        // Save preference so it survives page reloads
        localStorage.setItem('yumetunes-theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook for easy access
export const useTheme = () => useContext(ThemeContext);