import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../minicomps/Logo';
import SearchAutocomplete from './SearchAutoComplete';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import ConfirmDialog from '../minicomps/ConfirmDialog'; 
import UserMenu from './UserMenu';
import ThemeToggle from '../minicomps/ThemeToggle';
import InstallButton from '../utils/InstallButton';

export default function Navbar() {
    const navigate = useNavigate();
    const { token, logout, openAuthModal } = useAuth();
    const { userProfile } = useUser();
    
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    
    const hasAdminAccess = ['admin', 'moderator'].includes(userProfile?.role);
    const roleLabel = userProfile?.role === 'moderator' ? 'Moderator' : 'Admin';

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-4 px-4 md:px-6 py-4 bg-background-primary/95  border-b border-border transition-all duration-300 ease-in-out h-16 md:h-20">
                
                {isMobileSearchOpen ? (
                    <div className="flex items-center justify-between w-full gap-2 animate-in fade-in duration-300">
                        <div className="w-6 flex justify-start shrink-0">
                            <button 
                                onClick={() => setIsMobileSearchOpen(false)}
                                className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 w-full max-w-2xl">
                            <SearchAutocomplete autoFocus={true} />
                        </div>

                        <div className="w-2 shrink-0" />
                    </div>
                ) : (
                    <>
                        <div 
                            onClick={() => navigate('/home')} 
                            className='flex items-center gap-3 cursor-pointer group shrink-0'
                        >
                            <div className="transition-transform duration-300 group-hover:scale-110">
                                <Logo />       
                            </div>
                            <div className="hidden sm:block text-xl lg:text-2xl font-black text-text-primary tracking-tighter">
                                YumeTunes
                            </div>
                        </div>

                        <div className="hidden md:flex flex-1 max-w-2xl mx-auto px-4">
                            <SearchAutocomplete />
                        </div>

                        <div className="flex items-center gap-2 lg:gap-6 shrink-0">
                            
                            {/* THE DYNAMIC NAVIGATION BUTTON */}
                            {hasAdminAccess ? (
                                <button 
                                    onClick={() => navigate('/admin')}
                                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-text-secondary hover:text-accent-primary hover:border-accent-primary/50 transition-all duration-300"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {roleLabel} 
                                </button>
                            ) : (
                                <button 
                                    onClick={() => navigate('/contact')}
                                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-transparent text-sm font-bold tracking-widest text-text-muted hover:text-accent-primary transition-all duration-300"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Contact
                                </button>
                            )}

                            <button 
                                onClick={() => setIsMobileSearchOpen(true)}
                                className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                            </button>
                            <div className="hidden md:block">
                                <ThemeToggle/>
                            </div>

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
                    navigate('/home'); 
                }}
                title="Log Out"
                message="Are you sure you want to log out of YumeTunes?"
                confirmText="Log Out"
                cancelText="Cancel"
                isDestructive={true} 
            />
        </>
    );
}