import React from 'react';
import { useLoading } from '../../context/LoadingContext';

const GlobalProgressBar = () => {
    const { isLoading, progress } = useLoading();

    if (!isLoading && progress === 0) return null;

    return (
        // Wrapper controls the Opacity fade in/out
        <div 
            className={`fixed top-0 left-0 w-full h-[3px] z-[9999] pointer-events-none transition-opacity duration-300 ${
                isLoading ? 'opacity-100' : 'opacity-0'
            }`}
        >
            {/* The Actual Bar controls the Width slide */}
            <div 
                className={`relative h-full bg-accent-primary transition-all ease-out ${
                    progress === 100 ? 'duration-400' : 'duration-200'
                }`}
                style={{ width: `${progress}%` }}
            >
                {/* THE MAGIC: The Glowing Tip
                    This creates a bright white trailing gradient at the very front of the bar 
                    that makes it look like a laser beam shooting across the screen.
                */}
                <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-r from-transparent to-white/50 blur-[1px]" />
                
                {/* Core of the laser */}
                <div className="absolute right-0 top-0 h-full w-2 bg-white/80 shadow-[0_0_10px_#fff,0_0_20px_var(--accent-primary)] rounded-full" />
            </div>
        </div>
    );
};

export default GlobalProgressBar;