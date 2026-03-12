import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// THE SINGLE SOURCE OF TRUTH: Define all your premium themes here!
// The 'color' property is the primary accent color of the dark mode, 
// perfect for rendering a little preview circle in a dropdown menu.
export const THEME_FAMILIES = [
    { id: 'default', label: 'Default (Purple)', color: '#9D5CFA' },
    { id: 'gruvbox', label: 'Gruvbox', color: '#d3869b' },
    { id: 'nord', label: 'Nord (Icy)', color: '#88C0D0' },
    { id: 'dracula', label: 'Dracula', color: '#bd93f9' },
    { id: 'everforest', label: 'Everforest', color: '#a7c080' },
    { id: 'crimson', label: 'Crimson', color: '#e63946' },
    { id: 'solar', label: 'Solar', color: '#e9c46a' },
    { id: 'ocean', label: 'Ocean', color: '#0ea5e9' }
];

export const ThemeProvider = ({ children }) => {
    // 1. Track the Family (e.g., 'default', 'gruvbox', 'nord')
    const [themeFamily, setThemeFamily] = useState(() => {
        return localStorage.getItem('yumetunes-theme-family') || 'default';
    });

    // 2. Track the Mode (e.g., 'dark', 'light')
    const [themeMode, setThemeMode] = useState(() => {
        return localStorage.getItem('yumetunes-theme-mode') || 'dark';
    });

    // 3. The universal toggle function for your Navbar sun/moon icon
    const toggleThemeMode = () => {
        setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    useEffect(() => {
        const root = document.documentElement;
        
        // Combine them to match your CSS! Examples: "default-light", "gruvbox-dark", "nord-dark"
        const activeTheme = `${themeFamily}-${themeMode}`;
        
        // Keep standard 'dark' as the bare :root fallback so we don't break your base CSS
        if (activeTheme === 'default-dark') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', activeTheme);
        }

        // Save preferences instantly so they persist on page refresh
        localStorage.setItem('yumetunes-theme-family', themeFamily);
        localStorage.setItem('yumetunes-theme-mode', themeMode);
    }, [themeFamily, themeMode]);

    return (
        <ThemeContext.Provider value={{ 
            themeFamily, 
            setThemeFamily, 
            themeMode, 
            toggleThemeMode, 
            themeFamilies: THEME_FAMILIES 
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};