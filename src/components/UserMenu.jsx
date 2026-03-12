import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSmartPosition } from '../hooks/useSmartPosition';
import { getMediaUrl } from '../utils/media';
import ThemeToggle from '../minicomps/ThemeToggle';

const UserMenu = ({ user, onLogoutClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const dropdownRef = useRef(null);
    const positionStyle = useSmartPosition(isOpen, menuRef, dropdownRef);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleToggle = () => setIsOpen(!isOpen);

    const imageSrc = user?.user_image ? getMediaUrl(user.user_image) : null;
    
    // 1. UPDATED: Check for both roles, just like the Navbar!
    const hasAdminAccess = ['admin', 'moderator'].includes(user?.role);
    // 2. UPDATED: Dynamic label based on the exact role
    const roleLabel = user?.role === 'moderator' ? 'Moderator Dashboard' : 'Admin Dashboard';

    return (
        <div className="relative inline-block" ref={menuRef}>
            <div 
                onClick={handleToggle} 
                className={`cursor-pointer select-none transition-all duration-300 rounded-full p-0.5 border-2 ${
                    isOpen ? 'border-accent-primary scale-105' : 'border-transparent hover:border-border hover:scale-105'
                }`}
            >
                {imageSrc ? (
                    <img src={imageSrc} alt="Profile" className="w-10 h-10 lg:w-11 lg:h-11 rounded-full object-cover shadow-lg" />
                ) : (
                    <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-background-active flex items-center justify-center text-accent-primary border border-border">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                )}
            </div>

            {isOpen && (
                <div 
                    ref={dropdownRef}
                    className="absolute w-64 bg-background-secondary border border-border rounded-2xl shadow-2xl z-[100] overflow-hidden flex flex-col mt-3 animate-in fade-in zoom-in-95 duration-200"
                    style={positionStyle}
                >
                    <div className="px-5 py-5 flex items-center gap-4 border-b border-border bg-background-active/30">
                        {imageSrc ? (
                            <img src={imageSrc} className="w-12 h-12 rounded-full object-cover border-2 border-accent-primary/20" alt="" />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-accent-primary text-background-primary flex items-center justify-center font-black text-xl">
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-text-primary font-bold truncate leading-tight">{user?.username || 'Guest'}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-accent-primary/10 text-accent-primary text-[10px] font-black uppercase tracking-widest rounded-md border border-accent-primary/20">
                                {user?.role || 'User'}
                            </span>
                        </div>
                    </div>

                    <div className="p-2 flex flex-col gap-1">
                        
                        {/* Mobile Only Theme Toggle Row */}
                        <div className="md:hidden flex items-center justify-between px-3 py-2.5 rounded-xl border border-border/50 bg-background-primary/50 mb-1">
                            <span className="text-sm font-medium text-text-primary flex items-center gap-2">
                                <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                Appearance
                            </span>
                            <ThemeToggle />
                        </div>

                        {/* 3. UPDATED: Render if Admin OR Moderator */}
                        {hasAdminAccess && (
                            <button 
                                onClick={() => { navigate('/admin'); setIsOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-accent-primary hover:bg-accent-primary/10 rounded-xl transition-all duration-300 group"
                            >
                                <svg className="w-4 h-4 text-accent-primary group-hover:rotate-45 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {roleLabel}
                            </button>
                        )}

                        <button 
                            onClick={() => { navigate('/user'); setIsOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-background-hover rounded-xl transition-all duration-300 group"
                        >
                            <svg className="w-4 h-4 text-text-secondary group-hover:text-accent-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            View Profile
                        </button>

                        <button 
                            onClick={() => { navigate('/user', { state: { activeTab: "settings" }} ); setIsOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-background-hover rounded-xl transition-all duration-300 group"
                        >
                            <svg className="w-4 h-4 text-text-secondary group-hover:text-accent-tertiary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Account Settings
                        </button>

                        <div className="h-px bg-border my-1 mx-2"></div>

                        <button 
                            onClick={() => { setIsOpen(false); onLogoutClick(); }} 
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-error hover:bg-error/10 rounded-xl transition-all duration-300 group"
                        >
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Log Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;