import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const BaseModal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
    
    // 1. Logic: Body Scroll Lock & Escape Key
    useEffect(() => {
        if (isOpen) {
            // Prevent background scrolling
            document.body.style.overflow = 'hidden';
            
            const handleEsc = (e) => {
                if (e.key === 'Escape') onClose();
            };
            window.addEventListener('keydown', handleEsc);
            
            return () => {
                document.body.style.overflow = 'auto';
                window.removeEventListener('keydown', handleEsc);
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            
            {/* Backdrop: Standardized blur and theme-compliant dark overlay */}
            <div 
                className="absolute inset-0 bg-background-primary/80 backdrop-blur-md cursor-pointer"
                onClick={onClose} 
                aria-hidden="true"
            ></div>

            {/* Modal Container: Utilizing your border and background variables */}
            <div 
                className={`relative w-full ${maxWidth} bg-background-secondary border border-border rounded-[2rem] shadow-2xl shadow-black/50 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out`}
                role="dialog"
                aria-modal="true"
            >
                
                {/* Header Section */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-background-active/10">
                    {title ? (
                        <h2 className="text-xl md:text-2xl font-black text-text-primary tracking-tighter uppercase">
                            {title}
                        </h2>
                    ) : (
                        <div /> // Spacer if no title
                    )}
                    
                    <button 
                        onClick={onClose}
                        className="group p-2 text-text-secondary hover:text-error transition-all duration-300 rounded-xl bg-background-primary/40 border border-transparent hover:border-error/20"
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content Section */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default BaseModal;