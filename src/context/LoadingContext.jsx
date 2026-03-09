import React, { createContext, useState, useContext, useCallback, useRef } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const progressInterval = useRef(null);

    const startLoading = useCallback(() => {
        setIsLoading(true);
        setProgress(15); // Start at 15% so it's instantly visible
        
        // Clear any old intervals just in case
        if (progressInterval.current) clearInterval(progressInterval.current);
        
        // The Trickle Effect: slowly inch forward to 90% while waiting
        progressInterval.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev;
                // Move slower as it gets closer to 90%
                const step = (100 - prev) * 0.1; 
                return prev + step;
            });
        }, 300);
    }, []);

    const stopLoading = useCallback(() => {
        if (progressInterval.current) clearInterval(progressInterval.current);
        
        // 1. Instantly shoot to 100%
        setProgress(100); 
        
        // 2. Wait for the 100% CSS width transition to physically finish
        setTimeout(() => {
            setIsLoading(false); // This triggers the opacity fade-out
            
            // 3. Wait for the fade-out to finish, THEN secretly reset width to 0
            setTimeout(() => {
                setProgress(0);
            }, 300); // 300ms matches the duration of our opacity transition

        }, 400); // Give the bar 400ms to visually slide to the end of the screen
    }, []);

    return (
        <LoadingContext.Provider value={{ isLoading, progress, startLoading, stopLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);