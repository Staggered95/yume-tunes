import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../minicomps/Logo';
import SearchAutocomplete from './SearchAutoComplete';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import ConfirmDialog from '../minicomps/ConfirmDialog'; 
import UserMenu from './UserMenu';

export default function Navbar() {
    const navigate = useNavigate();
    const { token, logout, openAuthModal } = useAuth();
    const { userProfile } = useUser();
    
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    
    // NEW: State to track if the mobile search overlay is active
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    
    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-4 px-4 md:px-6 py-4 bg-background-primary/80 backdrop-blur-md border-b border-border transition-all duration-300 ease-in-out h-20">
                
                {/* MOBILE SEARCH OVERLAY 
                    If active, this takes over the entire navbar space.
                */}
                {isMobileSearchOpen ? (
    <div className="flex items-center justify-between w-full gap-2 animate-in fade-in duration-300">
        
        {/* 1. Left Action: Back Button (Locked to w-10) */}
        <div className="w-6 flex justify-start shrink-0">
            <button 
                onClick={() => setIsMobileSearchOpen(false)}
                // -ml-2 pulls the icon slightly left so the touch target is big, but it visually aligns with the edge
                className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
        </div>

        {/* 2. Center: The Search Bar (Flex-1 fills the remaining space) */}
        <div className="flex-1 w-full max-w-2xl">
            <SearchAutocomplete autoFocus={true} />
        </div>

        {/* 3. Right Action: The Dummy Div (Locked to exactly w-10 to balance the back button) */}
        <div className="w-2 shrink-0" />
        
    </div>
) : (
                    /* STANDARD NAVBAR (Desktop & Mobile Default) 
                    */
                    <>
                        {/* Logo Section */}
                        <div 
                            onClick={() => navigate('/')} 
                            className='flex items-center gap-3 cursor-pointer group shrink-0'
                        >
                            <div className="transition-transform duration-300 group-hover:scale-110">
                                <Logo />       
                            </div>
                            {/* Hide text on very small screens to save space */}
                            <div className="hidden sm:block text-xl lg:text-2xl font-black text-text-primary tracking-tighter">
                                YumeTunes
                            </div>
                        </div>

                        {/* Center Search - Hidden on mobile, visible on md+ */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-auto px-4">
                            <SearchAutocomplete />
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2 lg:gap-6 shrink-0">
                            
                            {/* Mobile Search Icon Trigger - Visible ONLY on mobile */}
                            <button 
                                onClick={() => setIsMobileSearchOpen(true)}
                                className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                            </button>

                            {/* Auth Logic */}
                            {!token ? (
                                <div className="flex items-center gap-2 lg:gap-4 font-bold">
                                    <button 
                                        onClick={() => openAuthModal('login')} 
                                        className="text-text-secondary text-sm lg:text-base hover:text-text-primary transition-all duration-300 px-2 md:px-3 py-2"
                                    >
                                        Log In
                                    </button>
                                    <button 
                                        onClick={() => openAuthModal('register')} 
                                        className="bg-accent-primary hover:bg-accent-hover text-background-primary text-xs lg:text-sm px-4 lg:px-6 py-2 rounded-full transition-all duration-300 shadow-lg shadow-accent-primary/20 active:scale-95"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            ) : (
                                <UserMenu 
                                    user={userProfile} 
                                    onLogoutClick={() => setIsLogoutModalOpen(true)} 
                                />
                            )}
                        </div>
                    </>
                )}
            </nav>

            <ConfirmDialog 
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={() => {
                    logout();
                    setIsLogoutModalOpen(false);
                    navigate('/'); 
                }}
                title="Log Out"
                message="Are you sure you want to log out of YumeTunes?"
                confirmText="Log Out"
                cancelText="Cancel"
                isDestructive={true} 
            />
            
            <div className="h-20 w-full" />
        </>
    );
}