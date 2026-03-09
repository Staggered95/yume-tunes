import React, { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext'; 
import { useToast } from '../context/ToastContext';
import Spinner from './Spinner'; // <-- 1. Import your new micro-spinner!

const LikeButton = ({ songId, className = "", variant = "default" }) => {
    const { token, likedSongIds, updateLikedSongsState } = useAuth(); 
    const { addToast } = useToast();
    
    // 2. The Network State
    const [isLiking, setIsLiking] = useState(false);

    const isLiked = likedSongIds?.has(songId);

    const toggleLike = async (e) => {
        e.stopPropagation(); 
        
        if (!token) {
            addToast("Please log in to save songs", "info");
            return;
        }

        // Prevent spam-clicking the API
        if (isLiking) return;

        // 3. Start the spinner!
        setIsLiking(true);

        try {
            // Wait for the server to successfully process the request
            await api.post(`/user/likedsongs/${songId}`);
            
            // Only update the global UI AFTER the server confirms it
            const newLikeState = !isLiked;
            updateLikedSongsState(songId, newLikeState);
            
            // You can keep the toasts, or remove them entirely since the spinner gives feedback!
        } catch (error) {
            console.error(error);
            addToast("Couldn't sync with server", "error");
        } finally {
            // 4. Stop the spinner!
            setIsLiking(false);
        }
    };

    const isMassive = variant === 'massive';
    
    const iconStyles = isMassive 
        ? `w-4/5 h-4/5 max-w-[180px] max-h-[180px] drop-shadow-[0_0_30px_rgba(157,92,250,0.4)] ${
            isLiked ? 'text-accent-primary fill-accent-primary' : 'text-text-primary/20 fill-transparent'
          }`
        : `w-5 h-5 md:w-6 md:h-6 ${
            isLiked ? 'text-accent-primary fill-accent-primary' : 'text-text-secondary hover:text-text-primary fill-transparent'
          }`;

    return (
        <button 
            type="button"
            onClick={toggleLike}
            disabled={isLiking} // Visually disable the button while loading
            className={`relative flex items-center justify-center transition-transform duration-300 ${
                !isLiking && 'active:scale-90 hover:scale-110'
            } ${className}`}
            title={isLiked ? "Remove from Liked Songs" : "Save to Liked Songs"}
        >
            {/* 5. The Magic Swap: Show Spinner OR the SVG Heart */}
            {isLiking ? (
                <Spinner size={isMassive ? "xl" : "md"} />
            ) : (
                <>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        className={`${iconStyles} transition-all duration-300 ease-out`}
                        stroke="currentColor" 
                        strokeWidth={isMassive ? "1" : "2"} 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>

                    {isLiked && !isMassive && (
                        <div className="absolute inset-0 bg-accent-primary/20 blur-lg rounded-full -z-10 animate-pulse" />
                    )}
                </>
            )}
        </button>
    );
};

export default LikeButton;