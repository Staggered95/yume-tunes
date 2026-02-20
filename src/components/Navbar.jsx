import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HamburgerButton from "../minicomps/HamburgerButton";
import Logo from '../minicomps/Logo';
import SearchAutocomplete from './SearchAutoComplete';
import { useAuth } from '../context/AuthContext'; // Import your hook

export default function Navbar({ isSidebarOpen, toggleSidebar }) {
    const navigate = useNavigate();
    
    // Extract token and auth controls from Context
    const { token, logout, openAuthModal } = useAuth();
    
    return (
        <nav className="flex items-center justify-between gap-4 p-6 ml-10">
            <div onClick={() => navigate('/')} className='flex items-center gap-2 cursor-pointer'>
                <Logo />       
                <div className="text-2xl lg:text-3xl font-extrabold text-text-primary">YumeTunes</div>
            </div>

            <SearchAutocomplete />

            <div className="flex items-center gap-4">
                {/* CONDITIONAL RENDERING BASED ON AUTH STATE */}
                {!token ? (
                    // --- GUEST VIEW ---
                    <>
                        <div 
                            onClick={() => openAuthModal('login')} 
                            className="text-text-secondary h-6 lg:h-8 p-2 lg:p-3 text-sm lg:text-md flex justify-center items-center cursor-pointer hover:text-accent-primary transition-colors duration-300 ease-in-out"
                        >
                            Log In
                        </div>
                        <div 
                            onClick={() => openAuthModal('register')} 
                            className="bg-accent-primary hover:bg-accent-hover cursor-pointer rounded-sm h-6 lg:h-7 lg:p-3 p-2 text-sm lg:text-md flex justify-center items-center transition-colors duration-300 ease-in-out"
                        >
                            Sign Up
                        </div>
                    </>
                ) : (
                    // --- LOGGED IN VIEW ---
                    <>
                        <div 
                            onClick={logout} 
                            className="text-text-secondary hover:text-rose-500 h-6 lg:h-8 p-2 lg:p-3 text-sm lg:text-md flex justify-center items-center cursor-pointer transition-colors duration-300 ease-in-out"
                        >
                            Log Out
                        </div>
                        <div className="cursor-pointer" title="Your Profile">
                            <svg 
                                className="w-10 md:w-11 lg:w-12 h-10 md:h-11 lg:h-12 text-accent-primary hover:text-accent-hover transition-colors duration-300 ease-in-out"
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="currentColor" 
                                aria-hidden="true"
                            >
                                <path 
                                    fillRule="evenodd" 
                                    d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" 
                                    clipRule="evenodd" 
                                />
                            </svg>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}