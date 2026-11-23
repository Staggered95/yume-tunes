import React from 'react';
import { useLoading } from '../../context/LoadingContext';

const GlobalProgressBar = () => {
    const { isLoading, progress } = useLoading();

    if (!isLoading && progress === 0) return null;

    const widthTransition =
        progress <= 15
            ? 'transition-none'
            : progress === 100
              ? 'transition-[width] duration-400 ease-out'
              : 'transition-[width] duration-200 ease-out';

    return (
        <div
            className={`fixed top-0 left-0 w-full h-[2px] z-[9999] pointer-events-none transition-opacity duration-300 ${
                isLoading ? 'opacity-100' : 'opacity-0'
            }`}
        >
            <div
                className={`relative h-full bg-accent-primary ${widthTransition}`}
                style={{ width: `${progress}%` }}
            >
                <div className="absolute right-0 top-0 h-full w-6 bg-white/40" />
            </div>
        </div>
    );
};

export default GlobalProgressBar;