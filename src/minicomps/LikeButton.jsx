import React, { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext'; 
import { useToast } from '../context/ToastContext';
import Spinner from './Spinner';

const LikeButton = ({ songId, className = "", variant = "default" }) => {
    const { token, likedSongIds, updateLikedSongsState } = useAuth(); 
    const { addToast } = useToast();
    
    const [isLiking, setIsLiking] = useState(false);
    const isLiked = likedSongIds?.has(songId);

    const toggleLike = async (e) => {
        e.stopPropagation(); 
        
        if (!token) {
            addToast("Please log in to save songs", "info");
            return;
        }

        if (isLiking) return;
        setIsLiking(true);

        try {
            await api.post(`/user/likedsongs/${songId}`);
            const newLikeState = !isLiked;
            updateLikedSongsState(songId, newLikeState);
        } catch (error) {
            console.error(error);
            addToast("Couldn't sync with server", "error");
        } finally {
            setIsLiking(false);
        }
    };

    // ✨ UPGRADED RESPONSIVE STYLES ✨
    let iconStyles = "";
    
    if (variant === 'massive') {
        iconStyles = `w-1/2 h-1/2 sm:w-3/5 sm:h-3/5 md:w-3/4 md:h-3/4 max-w-[200px] max-h-[200px] md:max-w-[280px] md:max-h-[280px] lg:max-w-[320px] lg:max-h-[320px] drop-shadow-[0_0_40px_rgba(157,92,250,0.5)] ${
            isLiked ? 'text-accent-primary fill-accent-primary' : 'text-text-primary/30 fill-transparent hover:text-text-primary/50'
        }`;
    } else if (variant === 'fullscreen') {
        // LARGER SIZES FOR MOBILE PLAYER
        iconStyles = `w-6 h-6 sm:w-8 sm:h-8 md:w-8 md:h-8 ${
            isLiked ? 'text-accent-primary fill-accent-primary drop-shadow-[0_0_8px_rgba(157,92,250,0.5)]' : 'text-text-secondary hover:text-text-primary fill-transparent'
        }`;
    } else {
        // STANDARD SIZES
        iconStyles = `w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${
            isLiked ? 'text-accent-primary fill-accent-primary' : 'text-text-secondary hover:text-text-primary fill-transparent'
        }`;
    }

    return (
        <button 
            type="button"
            onClick={toggleLike}
            disabled={isLiking}
            className={`relative flex items-center justify-center transition-transform duration-300 ${
                !isLiking && 'active:scale-90 hover:scale-110'
            } ${className}`}
            title={isLiked ? "Remove from Liked Songs" : "Save to Liked Songs"}
        >
            {isLiking ? (
                <Spinner size={variant === 'massive' ? "xl" : "md"} />
            ) : (
                <>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        className={`${iconStyles} transition-all duration-300 ease-out`}
                        stroke="currentColor" 
                        strokeWidth={variant === 'massive' ? "1" : "2"} 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>

                    {isLiked && variant !== 'massive' && (
                        <div className="absolute inset-0 bg-accent-primary/20 blur-lg rounded-full -z-10 animate-pulse" />
                    )}
                </>
            )}
        </button>
    );
};

export default LikeButton;