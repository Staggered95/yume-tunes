import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// THE SINGLE SOURCE OF TRUTH: Define Theme Families here
export const THEME_FAMILIES = [
    { id: 'default', label: 'Default (Purple)', color: '#9D5CFA' },
    { id: 'gruvbox', label: 'Gruvbox', color: '#fe8019' },
    // Add 'dracula', 'cyberpunk', etc. here later!
];

export const ThemeProvider = ({ children }) => {
    // 1. Track the Family (e.g., 'default', 'gruvbox')
    const [themeFamily, setThemeFamily] = useState(() => {
        return localStorage.getItem('yumetunes-theme-family') || 'default';
    });

    // 2. Track the Mode (e.g., 'dark', 'light')
    const [themeMode, setThemeMode] = useState(() => {
        return localStorage.getItem('yumetunes-theme-mode') || 'dark';
    });

    // 3. The universal toggle function for your Navbar switch
    const toggleThemeMode = () => {
        setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    useEffect(() => {
        const root = document.documentElement;
        
        // Combine them! Examples: "default-light", "gruvbox-dark"
        const activeTheme = `${themeFamily}-${themeMode}`;
        
        // Keep standard 'dark' as the bare :root fallback so we don't break your existing CSS
        if (activeTheme === 'default-dark') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', activeTheme);
        }

        // Save both preferences
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

export const useTheme = () => useContext(ThemeContext);