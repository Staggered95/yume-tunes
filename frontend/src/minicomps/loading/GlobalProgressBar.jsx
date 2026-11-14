import React from 'react';
import { useLoading } from '../../context/LoadingContext';

const GlobalProgressBar = () => {
    const { isLoading, progress } = useLoading();

    if (!isLoading && progress === 0) return null;

    return (
        <div 
            className={`fixed top-0 left-0 w-full h-[2px] z-[9999] pointer-events-none transition-opacity duration-300 ${
                isLoading ? 'opacity-100' : 'opacity-0'
            }`}
        >
            <div 
                className={`relative h-full bg-accent-primary transition-all ease-out ${
                    progress === 100 ? 'duration-400' : 'duration-200'
                }`}
                style={{ width: `${progress}%` }}
            >
                {/* No blur, no shadow, just a slightly brighter/lighter tip for a crisp edge */}
                <div className="absolute right-0 top-0 h-full w-6 bg-white/40" />
            </div>
        </div>
    );
};

export default GlobalProgressBar;