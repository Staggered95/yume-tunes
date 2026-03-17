import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../minicomps/Logo';
import { useTheme } from '../context/ThemeContext'; 
import { useAuth } from '../context/AuthContext'; 

export default function Footer() {
    const { themeFamily, setThemeFamily, themeMode, themeFamilies } = useTheme();
    const { token, openAuthModal } = useAuth(); 
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    
    const activeFamily = themeFamilies.find(f => f.id === themeFamily) || themeFamilies[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleThemeSelect = (theme) => {
        if (!theme.isFree && !token) {
            setIsMenuOpen(false);
            openAuthModal('register');
            return;
        }
        setThemeFamily(theme.id);
        setIsMenuOpen(false);
    };

    return (
        <div className="bg-background-secondary border-t border-border rounded-t-3xl mt-auto w-full relative z-10">
            
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent overflow-hidden"></div>

            <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
                    
                    {/* 1. BRANDING & MASCOT */}
                    <div className="md:col-span-5 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="relative shrink-0 flex items-end justify-center w-24 sm:w-28 group">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-accent-primary/20 rounded-full blur-2xl transition-all duration-500 group-hover:bg-accent-primary/40 group-hover:scale-110"></div>
                            <img 
                                src="https://res.cloudinary.com/ddc6silap/image/upload/mascot_ipgjzj"
                                alt="YumeTunes Mascot" 
                                className="relative z-10 w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(157,92,250,0.3)] transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2"
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <Logo />
                                <h2 className="text-2xl font-black text-text-primary tracking-tighter">YumeTunes</h2>
                            </div>
                            <p className="text-sm font-medium text-text-secondary leading-relaxed max-w-xs">
                                Your personal anime music sanctuary. Listen to iconic OSTs, sync lyrics, and vibe with the community.
                            </p>
                        </div>
                    </div>

                    {/* 2. NAVIGATION LINKS */}
                    <div className="md:col-span-4 grid grid-cols-2 gap-8 pt-2 sm:pt-0">
                        <div>
                            <h3 className="text-xs font-black text-text-primary uppercase tracking-widest mb-5">Explore</h3>
                            <ul className="space-y-3 text-sm font-semibold text-text-secondary">
                                <li><Link to="/home" className="hover:text-accent-primary transition-colors">Home</Link></li>
                                <li><Link to="/library" className="hover:text-accent-primary transition-colors">Library</Link></li>
                                <li><Link to="/animes" className="hover:text-accent-primary transition-colors">Anime OSTs</Link></li>
                                <li><Link to="/artists" className="hover:text-accent-primary transition-colors">Artists</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-text-primary uppercase tracking-widest mb-5">Support & Legal</h3>
                            <ul className="space-y-3 text-sm font-semibold text-text-secondary">
                                <li><Link to="/contact" className="hover:text-accent-primary transition-colors flex items-center gap-2">Contact Us <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse"></span></Link></li>
                                <li><Link to="/terms" className="hover:text-accent-primary transition-colors">Terms of Service</Link></li>
                                <li><Link to="/privacy" className="hover:text-accent-primary transition-colors">Privacy Policy</Link></li>
                                <li><Link to="/dmca" className="hover:text-accent-primary transition-colors">DMCA</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* 3. DYNAMIC THEME SELECTOR & SOCIALS */}
                    <div className="md:col-span-3 flex flex-col md:items-end gap-8 pt-2 sm:pt-0" ref={menuRef}>
                        
                        <div className="flex flex-col md:items-end w-full relative">
                            <h3 className="text-xs font-black text-text-primary uppercase tracking-widest mb-4">Appearance</h3>
                            
                            {/* THEME MENU DROPDOWN */}
                            <div className={`absolute bottom-full mb-2 right-0 md:right-auto w-56 bg-background-secondary/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-2 transition-all duration-300 origin-bottom flex flex-col gap-1 z-50 ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                <div className="px-3 py-2 text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
                                    Select Theme
                                </div>
                                {themeFamilies.map((theme) => {
                                    const isLocked = !theme.isFree && !token;
                                    const isSelected = theme.id === themeFamily;
                                    return (
                                        <button 
                                            key={theme.id}
                                            onClick={() => handleThemeSelect(theme)}
                                            className={`flex items-center w-full p-2 rounded-xl transition-colors ${isSelected ? 'bg-background-active' : 'hover:bg-background-hover'}`}
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="w-4 h-4 rounded-full shadow-inner shrink-0" style={{ backgroundColor: theme.color }}></div>
                                                <span className={`text-sm font-bold truncate text-left ${isSelected ? 'text-accent-primary' : 'text-text-primary'}`}>{theme.label}</span>
                                            </div>
                                            {isLocked && (
                                                <svg className="w-4 h-4 text-text-muted shrink-0 ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-10-4c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-8v-4zm6 11.236v2.764h-4v-2.764c-.596-.341-1-.983-1-1.736 0-1.104.896-2 2-2s2 .896 2 2c0 .753-.404 1.395-1 1.736z"/></svg>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* THEME SELECTOR BUTTON */}
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                                className="group flex items-center justify-between md:justify-start gap-4 p-2 pr-5 rounded-full border border-border bg-background-primary/50 hover:bg-background-hover hover:border-accent-primary/50 transition-all duration-300 w-full md:w-auto"
                            >
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="w-8 h-8 rounded-full shadow-inner flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                        style={{ backgroundColor: activeFamily.color, boxShadow: `0 0 12px ${activeFamily.color}60` }}
                                    >
                                        {themeMode === 'dark' ? (
                                            <svg className="w-4 h-4 text-white/90" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                                        ) : (
                                            <svg className="w-4 h-4 text-white/90" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted group-hover:text-text-secondary transition-colors leading-none mb-1">Current Theme</span>
                                        <span className="text-sm font-black text-text-primary leading-none">{activeFamily.label}</span>
                                    </div>
                                </div>
                                <svg className={`w-4 h-4 text-text-muted group-hover:text-accent-primary transition-transform duration-300 ${isMenuOpen ? '-rotate-90' : 'translate-x-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-5 mt-2 md:mt-auto">
                            <a href="#" aria-label="Follow us on Twitter/X" className="text-text-muted hover:text-accent-primary transition-colors hover:-translate-y-1 transform duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                            </a>
                            <a href="https://github.com/Staggered95/yume-tunes" aria-label="View source on GitHub" className="text-text-muted hover:text-accent-primary transition-colors hover:-translate-y-1 transform duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* BOTTOM BORDER & COPYRIGHT */}
                <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <p className="text-xs font-semibold text-text-muted">&copy; {new Date().getFullYear()} YumeTunes. All rights reserved.</p>
                        <span className="text-text-muted/30">·</span>
                        <span className="text-xs font-semibold text-text-muted/50">v1.0</span>
                    </div>
                    <p className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
                        Built with <span className="text-error animate-pulse">♥</span> for Anime Fans
                    </p>
                </div>

            </div>
        </div>
    );
}