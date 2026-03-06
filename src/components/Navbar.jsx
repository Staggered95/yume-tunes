import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../minicomps/Logo';
import SearchAutocomplete from './SearchAutoComplete';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import ConfirmDialog from '../minicomps/ConfirmDialog'; 
import UserMenu from './UserMenu';

export default function Navbar({ isSidebarOpen }) {
    const navigate = useNavigate();
    const { token, logout, openAuthModal } = useAuth();
    const { userProfile } = useUser();
    
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    
    return (
        <>
            {/* FIXED NAVBAR: 
               - Using bg-background-primary/80 with backdrop-blur for a premium glass feel.
               - z-40 to stay above content but below modals (z-50+).
               - border-b for structural definition.
            */}
            <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-4 px-6 py-4 bg-background-primary/80 backdrop-blur-md border-b border-border transition-all duration-300 ease-in-out">
                
                {/* Logo Section */}
                <div 
                    onClick={() => navigate('/')} 
                    className='flex items-center gap-3 cursor-pointer group shrink-0'
                >
                    <div className="transition-transform duration-300 group-hover:scale-110">
                        <Logo />       
                    </div>
                    <div className="text-xl lg:text-2xl font-black text-text-primary tracking-tighter">
                        YumeTunes
                    </div>
                </div>

                {/* Center Search - Taking up flexible space */}
                <div className="flex-1 max-w-2xl mx-auto px-4">
                    <SearchAutocomplete />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 lg:gap-6 shrink-0">
                    {!token ? (
                        <div className="flex items-center gap-2 lg:gap-4 font-bold">
                            <button 
                                onClick={() => openAuthModal('login')} 
                                className="text-text-secondary text-sm lg:text-base hover:text-text-primary transition-all duration-300 px-3 py-2"
                            >
                                Log In
                            </button>
                            <button 
                                onClick={() => openAuthModal('register')} 
                                className="bg-accent-primary hover:bg-accent-hover text-background-primary text-xs lg:text-sm px-4 lg:px-6 py-2 lg:py-2.5 rounded-full transition-all duration-300 shadow-lg shadow-accent-primary/20 active:scale-95"
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
            </nav>

            {/* Modal for Logout */}
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
            
            {/* IMPORTANT: Spacer div. 
               Since the nav is fixed, this prevents the top of your page 
               content from being hidden behind the navbar.
            */}
            <div className="h-20 w-full" />
        </>
    );
}