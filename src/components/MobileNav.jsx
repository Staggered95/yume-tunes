import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useScrollDirection } from '../hooks/useScrollDirection';

const MobileNav = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const scrollDirection = useScrollDirection();

    const tabs = [
        { 
            label: 'Home', 
            path: '/home', 
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            )
        },
        { 
            label: 'Artists', 
            path: '/artists', 
            icon: (
                // Microphone icon for Artists
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
            )
        },
        { 
            label: 'Animes', 
            path: '/animes', 
            icon: (
                // TV icon for Animes
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                    <polyline points="17 2 12 7 7 2" />
                </svg>
            )
        },
        { 
            label: 'Library', 
            path: '/library', 
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15" />
                    <path d="M10 10h6M10 14h6M10 6h6" />
                </svg>
            )
        },
    ];

    return (
        <div 
            className={`fixed bottom-0 left-0 right-0 bg-background-primary backdrop-blur-md border-t border-border z-50 md:hidden pb-safe transition-transform duration-300 ease-in-out ${
                scrollDirection === 'down' ? 'translate-y-full' : 'translate-y-0'
            }`}
        >
            <div className="flex justify-around items-center h-14 px-2">
                {tabs.map((tab) => {
                    // Logic to ensure exact match for home, but partial match for other routes (e.g. /artists/123)
                    const isActive = tab.path === '/' 
                        ? pathname === '/' 
                        : pathname.startsWith(tab.path);
                    
                    return (
                        <button
                            key={tab.label}
                            onClick={() => navigate(tab.path)}
                            className={`flex flex-col items-center justify-center w-full h-12 gap-1 transition-all duration-300 ${
                                isActive ? 'text-accent-primary bg-background-active rounded-full ' : 'text-text-secondary hover:text-text-primary'
                            }`}
                        >
                            <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
                                {React.cloneElement(tab.icon, { className: "w-5 h-5" })} 
                            </div>
                            <span className="text-[9px] font-bold tracking-wide uppercase">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileNav;