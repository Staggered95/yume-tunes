import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now(); // Generate a quick unique ID
        
        // Add the new toast to the array
        setToasts((prev) => [...prev, { id, message, type }]);

        // Automatically remove it after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            
            {/* THE UPGRADED GLOBAL TOAST CONTAINER */}
            <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col items-center gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div 
                        key={toast.id}
                        // Added glassmorphism, subtle borders, and smooth top-down animations
                        className={`flex items-center gap-3 px-5 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.5)] backdrop-blur-md border animate-toast-in ${
                            toast.type === 'error' 
                                ? 'bg-red-500/80 border-red-500/50 text-white' 
                                : 'bg-background-secondary border-white/10 text-white'
                        }`}
                    >
                        {/* Dynamic Icons */}
                        {toast.type === 'error' ? (
                            <svg className="w-5 h-5 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        )}

                        <span className="text-sm font-medium tracking-wide">
                            {toast.message}
                        </span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);