import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000);
    }, []);

    // Theme-based style mapping
    const getTypeStyles = (type) => {
        switch (type) {
            case 'error':
                return 'bg-error/90 border-error/20 text-background-primary shadow-error/20';
            case 'warning':
                return 'bg-warning/90 border-warning/20 text-background-primary shadow-warning/20';
            case 'info':
                return 'bg-accent-tertiary/90 border-accent-tertiary/20 text-background-primary shadow-accent-tertiary/20';
            default: // success
                return 'bg-background-secondary/90 border-border text-text-primary shadow-accent-primary/10';
        }
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            
            {/* GLOBAL TOAST CONTAINER */}
            <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col items-center gap-3 pointer-events-none px-4 w-full max-w-md">
                {toasts.map((toast) => (
                    <div 
                        key={toast.id}
                        className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border animate-in fade-in slide-in-from-top-4 duration-300 transition-all ${getTypeStyles(toast.type)}`}
                    >
                        {/* Dynamic Icon Logic */}
                        <div className="shrink-0">
                            {toast.type === 'error' && (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                            {toast.type === 'warning' && (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            )}
                            {(toast.type === 'success' || !toast.type) && (
                                <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            {toast.type === 'info' && (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </div>

                        <span className="text-sm font-bold tracking-tight leading-tight">
                            {toast.message}
                        </span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);