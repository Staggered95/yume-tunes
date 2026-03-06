import { useState, useEffect } from 'react';

export const useScrollDirection = () => {
    const [scrollDirection, setScrollDirection] = useState("up");
    const [prevOffset, setPrevOffset] = useState(0);

    useEffect(() => {
        const toggleScrollDirection = () => {
            let scrollY = window.scrollY;
            
            // If we are at the very top, always show the nav
            if (scrollY === 0) {
                setScrollDirection("up");
            } 
            // Scrolling down
            else if (scrollY > prevOffset && scrollY > 50) { // 50px buffer so it doesn't trigger on tiny accidental scrolls
                setScrollDirection("down");
            } 
            // Scrolling up
            else if (scrollY < prevOffset) {
                setScrollDirection("up");
            }
            
            setPrevOffset(scrollY);
        };

        window.addEventListener("scroll", toggleScrollDirection);
        return () => window.removeEventListener("scroll", toggleScrollDirection);
    }, [prevOffset]);

    return scrollDirection;
};