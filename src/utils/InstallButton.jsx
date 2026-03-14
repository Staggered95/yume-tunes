import React, { useState, useEffect } from 'react';

const InstallButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        // Catch the event when the browser says the PWA is ready
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault(); // Stop the default browser prompt
            setDeferredPrompt(e); // Save the event to trigger it later
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Cleanup
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the browser's native installation prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted the YumeTunes install prompt');
        } else {
            console.log('User dismissed the YumeTunes install prompt');
        }

        // We've used the prompt, and can't use it again, discard it
        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    // If the app is already installed or not ready, hide the button
    if (!isInstallable) return null;

    return (
        <button 
            onClick={handleInstallClick}
            className="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-opacity-80 transition-all shadow-[0_0_10px_var(--accent-primary)]"
        >
            Install YumeTunes
        </button>
    );
};

export default InstallButton;