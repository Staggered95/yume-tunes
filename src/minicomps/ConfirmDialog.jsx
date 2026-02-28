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
    isDestructive = false // If true, we make the confirm button RED
}) => {
    
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        // We set maxWidth to max-w-sm to make dialogs appropriately small
        <BaseModal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
            
            <p className="text-text-secondary mb-6 text-sm md:text-base">
                {message}
            </p>

            <div className="flex justify-end gap-3">
                <button 
                    onClick={onClose}
                    className="px-4 py-2 rounded-full font-medium text-text-primary hover:bg-white/5 transition-colors"
                >
                    {cancelText}
                </button>
                <button 
                    onClick={handleConfirm}
                    className={`px-4 py-2 rounded-full font-medium transition-colors ${
                        isDestructive 
                            ? "bg-error hover:bg-red-500 text-white" // Using your CSS variable!
                            : "bg-accent-primary hover:bg-accent-hover text-white"
                    }`}
                >
                    {confirmText}
                </button>
            </div>
            
        </BaseModal>
    );
};

export default ConfirmDialog;