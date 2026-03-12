import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../minicomps/Logo';

export default function Footer() {

    return (
        <footer className="bg-background-secondary border-t border-border rounded-t-2xl mt-auto w-full relative z-10">
            <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-8">
                    
                    {/* 1. BRANDING & MASCOT */}
                    <div className="md:col-span-5 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        
                        {/* Mascot Image (Transparent Full Body) */}
                        <div className="relative shrink-0 flex items-end justify-center w-24 sm:w-28">
                            {/* Ambient background glow specifically for the mascot */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-accent-primary/20 rounded-full blur-2xl pointer-events-none"></div>
                            
                            <img 
                                src="https://res.cloudinary.com/ddc6silap/image/upload/mascot_ipgjzj" // Assuming this is your transparent PNG file
                                alt="YumeTunes Mascot" 
                                className="relative z-10 w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(157,92,250,0.3)] transition-transform duration-500 hover:scale-105"
                            />
                        </div>
                        
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <Logo />
                                <h2 className="text-2xl font-black text-text-primary tracking-tighter">YumeTunes</h2>
                            </div>
                            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                                Your personal anime music sanctuary. Listen to iconic OSTs, sync lyrics, and vibe with the community.
                            </p>
                        </div>
                    </div>

                    {/* 2. NAVIGATION LINKS */}
                    <div className="md:col-span-4 grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xs font-black text-text-primary uppercase tracking-widest mb-4">Explore</h3>
                            <ul className="space-y-3 text-sm font-medium text-text-secondary">
                                <li><Link to="/" className="hover:text-accent-primary transition-colors">Home</Link></li>
                                <li><Link to="/library" className="hover:text-accent-primary transition-colors">Library</Link></li>
                                <li><Link to="/animes" className="hover:text-accent-primary transition-colors">Anime OSTs</Link></li>
                                <li><Link to="/artists" className="hover:text-accent-primary transition-colors">Artists</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-text-primary uppercase tracking-widest mb-4">Legal</h3>
                            <ul className="space-y-3 text-sm font-medium text-text-secondary">
                                <li><Link to="/terms" className="hover:text-accent-primary transition-colors">Terms of Service</Link></li>
                                <li><Link to="/privacy" className="hover:text-accent-primary transition-colors">Privacy Policy</Link></li>
                                <li><Link to="/dmca" className="hover:text-accent-primary transition-colors">DMCA</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* 3. THEME SELECTOR & SOCIALS */}
                    <div className="md:col-span-3 flex flex-col md:items-end gap-6">
                        
                        <div className="flex flex-col md:items-end gap-3">
                            <h3 className="text-xs font-black text-text-primary uppercase tracking-widest">Theme</h3>
                            <p className="text-xs font-medium text-text-muted mt-4">
                                Multiple themes available in your{' '}
                                <Link to="/user" state={{ activeTab: 'settings' }} 
                                    className="text-accent-primary hover:text-accent-hover underline underline-offset-2 transition-colors"
                                >
                                    settings
                                </Link>
                                .
                            </p>
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-4 mt-2">
                            <a href="#" className="text-text-muted hover:text-accent-primary transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                            </a>
                            <a href="https://github.com/Staggered95/yume-tunes" className="text-text-muted hover:text-accent-primary transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* BOTTOM BORDER & COPYRIGHT */}
                <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-medium text-text-muted">
                        &copy; {new Date().getFullYear()} YumeTunes. All rights reserved.
                    </p>
                    <p className="text-xs font-medium text-text-muted flex items-center gap-1">
                        Built with <span className="text-error">♥</span> for Anime Fans
                    </p>
                </div>

            </div>
        </footer>
    );
}