import { useState, useEffect } from 'react';

export const useSmartPositionTwo = (isOpen, buttonRef) => {
    const [style, setStyle] = useState({});

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const menuWidth = 224; // Tailwind's w-56 is 224px

            // Start with the vertical position (just below the button)
            let newStyle = {
                position: 'absolute',
                top: `${rect.bottom + window.scrollY + 8}px`,
            };

            // THE EDGE DETECTION
            // If the button is too close to the left edge, anchor the menu to the left.
            // Otherwise, anchor it safely to the right.
            if (rect.right < menuWidth) {
                newStyle.left = `${rect.left}px`;
                newStyle.right = 'auto'; // Clear right
            } else {
                newStyle.right = `${window.innerWidth - rect.right}px`;
                newStyle.left = 'auto'; // Clear left
            }

            setStyle(newStyle);
        }
    }, [isOpen, buttonRef]);

    return style;
};