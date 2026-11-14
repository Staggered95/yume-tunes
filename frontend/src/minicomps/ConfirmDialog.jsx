import React from 'react';
import BaseModal from './BaseModal';

const ConfirmDialog = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = "Confirm", 
    cancelText = "Cancel",
    isDestructive = false 
}) => {
    
    return (
        <BaseModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={title} 
            maxWidth="max-w-sm"
        >
            <div className="flex flex-col gap-6">
                
                <div className="flex gap-4">
                    {/* Visual Indicator for Destructive Actions */}
                    {isDestructive && (
                        <div className="shrink-0 w-12 h-12 rounded-2xl bg-error/10 flex items-center justify-center text-error border border-error/20">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    )}
                    
                    <p className="text-text-secondary text-sm md:text-base leading-relaxed font-medium">
                        {message}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                    {/* Secondary/Cancel Button */}
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-bold text-sm uppercase tracking-widest text-text-secondary hover:text-text-primary hover:bg-background-hover border border-transparent hover:border-border transition-all duration-300 active:scale-95"
                    >
                        {cancelText}
                    </button>
                    
                    {/* Primary Action Button */}
                    <button 
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95 ${
                            isDestructive 
                                ? "bg-error text-background-primary hover:bg-red-500 shadow-error/20" 
                                : "bg-accent-primary text-background-primary hover:bg-accent-hover shadow-accent-primary/20"
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default ConfirmDialog;