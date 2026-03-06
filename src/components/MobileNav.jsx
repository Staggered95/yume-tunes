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
            path: '/', 
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            )
        },
        { 
            label: 'Search', 
            path: '/search', 
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
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
            // NEW: Added translate-y-full when scrolling down to hide it, and translate-y-0 to show it
            className={`fixed bottom-0 left-0 right-0 bg-background-primary/90 backdrop-blur-md border-t border-border z-[100] md:hidden pb-safe transition-transform duration-300 ease-in-out ${
                scrollDirection === 'down' ? 'translate-y-full' : 'translate-y-0'
            }`}
        >
            {/* NEW: Changed h-16 to h-14 to make it slimmer! */}
            <div className="flex justify-around items-center h-14 px-2">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.path || (tab.path !== '/' && pathname.startsWith(tab.path));
                    
                    return (
                        <button
                            key={tab.label}
                            onClick={() => navigate(tab.path)}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 ${
                                isActive ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'
                            }`}
                        >
                            <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
                                {React.cloneElement(tab.icon, { className: "w-5 h-5" })} {/* Shrunk icon slightly from w-6 to w-5 to fit slimmer nav */}
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