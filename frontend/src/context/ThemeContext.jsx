import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();


export const THEME_FAMILIES = [
    { id: 'default', label: 'Default (Purple)', color: '#9D5CFA', isFree: true },
    { id: 'gruvbox', label: 'Gruvbox', color: '#d3869b', isFree: true },
    { id: 'nord', label: 'Nord (Icy)', color: '#88C0D0', isFree: true },
    { id: 'dracula', label: 'Dracula', color: '#bd93f9', isFree: false },
    { id: 'everforest', label: 'Everforest', color: '#a7c080', isFree: false },
    { id: 'crimson', label: 'Crimson', color: '#e63946', isFree: false },
    { id: 'solar', label: 'Solar', color: '#e9c46a', isFree: false },
    { id: 'ocean', label: 'Ocean', color: '#0ea5e9', isFree: false }
];

export const ThemeProvider = ({ children }) => {
    const [themeFamily, setThemeFamily] = useState(() => {
        return localStorage.getItem('yumetunes-theme-family') || 'default';
    });

    const [themeMode, setThemeMode] = useState(() => {
        return localStorage.getItem('yumetunes-theme-mode') || 'dark';
    });

    const toggleThemeMode = () => {
        setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    useEffect(() => {
        const root = document.documentElement;
        
        const activeTheme = `${themeFamily}-${themeMode}`;
        
        if (activeTheme === 'default-dark') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', activeTheme);
        }

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