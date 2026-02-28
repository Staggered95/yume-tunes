import { useState, useLayoutEffect } from 'react';

export const useSmartPosition = (isOpen, anchorRef, popoverRef) => {
    const [positionStyle, setPositionStyle] = useState({});

    useLayoutEffect(() => {
        // If it's closed, or our refs haven't attached to the DOM yet, do nothing.
        if (!isOpen || !anchorRef.current || !popoverRef.current) return;

        const anchorRect = anchorRef.current.getBoundingClientRect();
        const popoverRect = popoverRef.current.getBoundingClientRect();
        
        const spaceBelow = window.innerHeight - anchorRect.bottom;
        const spaceAbove = anchorRect.top;
        const spaceRight = window.innerWidth - anchorRect.right;
        
        let newStyles = {};

        // Vertical Collision
        if (spaceBelow < popoverRect.height && spaceAbove > spaceBelow) {
            newStyles.bottom = '100%';
            newStyles.marginBottom = '8px';
        } else {
            newStyles.top = '100%';
            newStyles.marginTop = '8px';
        }

        // Horizontal Collision
        if (spaceRight < popoverRect.width) {
            newStyles.right = '0';
        } else {
            newStyles.left = '0';
        }

        setPositionStyle(newStyles);
        
    // We re-run this math whenever it opens, or if the refs somehow change
    }, [isOpen, anchorRef, popoverRef]);

    return positionStyle;
};