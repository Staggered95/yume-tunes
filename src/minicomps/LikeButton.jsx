import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming you have authFetch here

const LikeButton = ({ songId, initialIsLiked = false, className = "" }) => {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isAnimating, setIsAnimating] = useState(false);
    const { authFetch, isLoggedIn } = useAuth(); // Or however you make API calls

    const toggleLike = async (e) => {
        if (!isLoggedIn) return;
        e.stopPropagation(); // Prevents clicking the heart from accidentally playing the song!
        
        // Optimistic UI Update: Flip it instantly for the user
        setIsLiked(!isLiked);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300); // Reset animation state

        try {
            // Background API Call (Update this route to match your backend)
            await authFetch(`/user/likedsongs/${songId}`, {
                method: 'POST'
            });
        } catch (error) {
            console.error("Failed to toggle like status", error);
            // Revert UI if the database failed
            setIsLiked(isLiked); 
        }
    };

    console.log(isLoggedIn);

    

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
                className="w-5 h-5 transition-colors duration-300"
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