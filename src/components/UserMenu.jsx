import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSmartPosition } from '../hooks/useSmartPosition';

const UserMenu = ({ user, onLogoutClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const dropdownRef = useRef(null);
    const positionStyle = useSmartPosition(isOpen, menuRef, dropdownRef);
    const navigate = useNavigate();

    // Close menu when clicking outside
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

    // Safely construct the image URL. Assumes your backend serves from port 5000.
    const imageSrc = user?.user_image 
        ? (user.user_image.startsWith('http') ? user.user_image : `http://localhost:5000${user.user_image}`)
        : null;

    return (
        <div className="relative inline-block" ref={menuRef}>
            
            {/* 1. THE TRIGGER (Profile Picture or SVG) */}
            <div 
                onClick={handleToggle} 
                className="cursor-pointer select-none transition-transform hover:scale-105 active:scale-95"
                title="Your Profile"
            >
                {imageSrc ? (
                    <img 
                        src={imageSrc} 
                        alt="Profile" 
                        className="w-10 h-10 lg:w-11 lg:h-11 rounded-full object-cover border-2 border-transparent hover:border-accent-primary transition-colors duration-300"
                    />
                ) : (
                    <svg 
                        className="w-10 h-10 lg:w-11 lg:h-11 text-accent-primary hover:text-accent-hover transition-colors duration-300"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                    >
                        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                    </svg>
                )}
            </div>

            {/* 2. THE DROPDOWN CARD */}
            {isOpen && (
                <div 
                    ref={dropdownRef}
                    className="absolute w-64 bg-background-active border border-white/5 rounded-xl shadow-2xl z-[100] overflow-hidden flex flex-col mt-2"
                    style={positionStyle}
                >
                    {/* Header / Greetings */}
                    <div className="px-5 py-4 flex items-center gap-4 border-b border-white/5 bg-white/5">
                        {imageSrc ? (
                            <img src={imageSrc} className="w-12 h-12 rounded-full object-cover shadow-md" alt="" />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-accent-primary/20 text-accent-primary flex items-center justify-center font-bold text-xl">
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-text-secondary font-medium tracking-wider uppercase">Hello,</p>
                            <p className="text-base font-bold text-white truncate">{user?.username || 'Guest'}</p>
                        </div>
                    </div>

                    <div className="p-2 flex flex-col gap-1">
                        {/* Theme Toggle Placeholder */}
                        <button className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-text-primary hover:bg-white/10 rounded-md transition-colors group">
                            <div className="flex items-center gap-3">
                                <svg className="w-4 h-4 text-text-secondary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                Dark Mode
                            </div>
                            {/* Dummy Switch */}
                            <div className="w-8 h-4 bg-accent-primary rounded-full relative">
                                <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                            </div>
                        </button>

                        <div onClick={() => navigate('/user')}>add user setting svg and all here</div>

                        <div className="h-px bg-white/5 my-1 mx-2"></div>

                        {/* Logout Button */}
                        <button 
                            onClick={() => {
                                setIsOpen(false);
                                onLogoutClick();
                            }} 
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors group"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Log Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;