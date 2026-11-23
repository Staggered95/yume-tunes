import React, { createContext, useState, useContext, useCallback, useRef, useEffect } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const activeRequests = useRef(0);
    const progressInterval = useRef(null);
    const hideTimeout = useRef(null);
    const resetTimeout = useRef(null);

    const clearTimers = useCallback(() => {
        if (progressInterval.current) clearInterval(progressInterval.current);
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        if (resetTimeout.current) clearTimeout(resetTimeout.current);
    }, []);

    const startLoading = useCallback(() => {
        activeRequests.current += 1;

        // Let an already-running load bar continue smoothly
        if (activeRequests.current > 1) return;

        clearTimers();
        setIsLoading(true);
        setProgress(15);

        progressInterval.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev;
                const step = (100 - prev) * 0.1;
                return prev + step;
            });
        }, 300);
    }, [clearTimers]);

    const stopLoading = useCallback(() => {
        activeRequests.current = Math.max(0, activeRequests.current - 1);

        // Wait until all in-flight requests finish
        if (activeRequests.current > 0) return;

        clearTimers();
        setProgress(100);

        hideTimeout.current = setTimeout(() => {
            setIsLoading(false);

            resetTimeout.current = setTimeout(() => {
                setProgress(0);
            }, 300);
        }, 400);
    }, [clearTimers]);

    useEffect(() => clearTimers, [clearTimers]);

    return (
        <LoadingContext.Provider value={{ isLoading, progress, startLoading, stopLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);