import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HamburgerButton from "../minicomps/HamburgerButton";
import Logo from '../minicomps/Logo';
import SearchAutocomplete from './SearchAutoComplete';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import ConfirmDialog from '../minicomps/ConfirmDialog'; 
import UserMenu from './UserMenu'; // <-- Import the new menu

export default function Navbar({ isSidebarOpen, toggleSidebar }) {
    const navigate = useNavigate();
    
    // Grab 'user' from your AuthContext!
    const { token, logout, openAuthModal } = useAuth();
    const { userProfile } = useUser();
    console.log("userprofile consoole.logged from navbar: ",userProfile);
    
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    
    return (
        <>
            <nav className="flex items-center justify-between gap-4 p-6 ml-10">
                <div onClick={() => navigate('/')} className='flex items-center gap-2 cursor-pointer'>
                    <Logo />       
                    <div className="text-2xl lg:text-3xl font-extrabold text-text-primary">YumeTunes</div>
                </div>

                <SearchAutocomplete />

                <div className="flex items-center gap-4">
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
                        <UserMenu 
                            user={userProfile} 
                            onLogoutClick={() => setIsLogoutModalOpen(true)} 
                        />
                    )}
                </div>
            </nav>

            <ConfirmDialog 
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={() => {
                    logout();
                    setIsLogoutModalOpen(false); // Close the modal on confirm
                    navigate('/'); 
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