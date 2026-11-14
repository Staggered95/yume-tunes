import React, { createContext, useState, useContext, useCallback, useRef } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const progressInterval = useRef(null);

    const startLoading = useCallback(() => {
        setIsLoading(true);
        setProgress(15); 
        
        if (progressInterval.current) clearInterval(progressInterval.current);
        
        progressInterval.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev;
                const step = (100 - prev) * 0.1; 
                return prev + step;
            });
        }, 300);
    }, []);

    const stopLoading = useCallback(() => {
        if (progressInterval.current) clearInterval(progressInterval.current);
        
        setProgress(100); 
        
        setTimeout(() => {
            setIsLoading(false); 
            
            setTimeout(() => {
                setProgress(0);
            }, 300); 

        }, 400); 
    }, []);

    return (
        <LoadingContext.Provider value={{ isLoading, progress, startLoading, stopLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);