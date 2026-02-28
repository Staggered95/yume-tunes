import React, { useEffect } from 'react';
import { createPortal } from 'react-dom'; // 1. Import this!

const BaseModal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
    
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // 2. Wrap the return in createPortal and send it to document.body
    return createPortal(
        // Bumped z-index to 9999 just to be absolutely certain it clears everything
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose} 
            ></div>

            <div className={`relative w-full ${maxWidth} bg-background-secondary border border-border rounded-2xl shadow-2xl animate-modal-pop overflow-hidden`}>
                
                {title && (
                    <div className="flex items-center justify-between p-5 border-b border-white/5">
                        <h2 className="text-xl font-bold text-text-primary">{title}</h2>
                        <button 
                            onClick={onClose}
                            className="p-2 text-text-secondary hover:text-white transition-colors rounded-full hover:bg-white/5"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="p-5">
                    {children}
                </div>
            </div>
        </div>,
        document.body // 3. The escape hatch!
    );
};

export default BaseModal;