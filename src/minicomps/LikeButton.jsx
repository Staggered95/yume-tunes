import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { useToast } from '../context/ToastContext';

const LikeButton = ({ songId, className = "" }) => {
    // Grab the global array and the updater function
    const { authFetch, token, likedSongIds, updateLikedSongsState } = useAuth(); 
    const { addToast } = useToast();
    
    const [isAnimating, setIsAnimating] = useState(false);

    // MAGIC: We calculate the state dynamically.
    // If songId 4 is in [2, 4, 6], this instantly evaluates to true!
    const isLiked = likedSongIds.has(songId);

    const toggleLike = async (e) => {
        if (!token) {
            addToast("Please log in to like songs", "error");
            return;
        }
        e.stopPropagation(); 
        
        const newLikeState = !isLiked;
        
        // Optimistic UI Update globally!
        updateLikedSongsState(songId, newLikeState);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);

        if (newLikeState) {
            addToast("Added to Liked Songs", "success");
        } else {
            addToast("Removed from Liked Songs", "error"); 
        }

        try {
            await authFetch(`/user/likedsongs/${songId}`, { method: 'POST' });
        } catch (error) {
            // Revert global state if the database failed
            updateLikedSongsState(songId, !newLikeState); 
            addToast("Failed to update server", "error");
        }
    };

    return (
        <button 
            onClick={toggleLike}
            className={`transition-all duration-300 hover:scale-110 flex items-center justify-center ${
                isAnimating ? 'scale-125' : 'scale-100'
            } ${className}`}
            title={isLiked ? "Remove from Liked Songs" : "Save to Liked Songs"}
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                // Color updates instantly based on the global array!
                className={`w-5 h-5 transition-colors duration-300 ${isLiked ? 'text-accent-primary' : 'text-text-secondary'}`}
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
        </button>
    );
};

export default LikeButton;