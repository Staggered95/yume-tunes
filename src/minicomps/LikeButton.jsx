import React, { useState } from 'react';
import api from '../api/axios'; // Native Axios instance
import { useAuth } from '../context/AuthContext'; 
import { useToast } from '../context/ToastContext';

const LikeButton = ({ songId, className = "", variant = "default" }) => {
    // Standardizing on the Axios-based API and global state
    const { token, likedSongIds, updateLikedSongsState } = useAuth(); 
    const { addToast } = useToast();
    const [isAnimating, setIsAnimating] = useState(false);

    const isLiked = likedSongIds?.has(songId);

    const toggleLike = async (e) => {
        // Prevent clicking the song card underneath
        e.stopPropagation(); 
        
        if (!token) {
            addToast("Please log in to save songs", "info");
            return;
        }

        const newLikeState = !isLiked;
        
        // 1. Optimistic UI Update (Change local state immediately)
        updateLikedSongsState(songId, newLikeState);
        
        // 2. Trigger "Heartbeat" Animation
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 450);

        // 3. Feedback Toasts
        if (newLikeState) {
            addToast("Added to Liked Songs 💖", "success");
        } else {
            addToast("Removed from Liked Songs", "info"); 
        }

        try {
            // Axios handles the JWT and base URL automatically
            await api.post(`/user/likedsongs/${songId}`);
        } catch (error) {
            // 4. Rollback on Failure
            updateLikedSongsState(songId, !newLikeState); 
            addToast("Couldn't sync with server", "error");
        }
    };

    // Style logic based on variant and state
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
            className={`relative flex items-center justify-center transition-transform duration-300 active:scale-90 ${
                isAnimating ? 'animate-heartbeat' : 'hover:scale-110'
            } ${className}`}
            title={isLiked ? "Remove from Liked Songs" : "Save to Liked Songs"}
        >
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

            {/* Subtle glow effect behind the heart when liked */}
            {isLiked && !isMassive && (
                <div className="absolute inset-0 bg-accent-primary/20 blur-lg rounded-full -z-10 animate-pulse" />
            )}
        </button>
    );
};

export default LikeButton;