import React, { useRef, useEffect, useState } from 'react';

const ScrollingText = ({ text, className = "" }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const checkOverflow = () => {
            if (containerRef.current && textRef.current) {
                // If the text's scroll width is larger than the container's physical width
                setIsOverflowing(textRef.current.scrollWidth > containerRef.current.clientWidth);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [text]);

    return (
        <div ref={containerRef} className="w-full overflow-hidden whitespace-nowrap relative">
            <div 
                ref={textRef} 
                // If overflowing, apply our CSS class. w-max prevents it from wrapping.
                className={`inline-block w-max ${className} ${isOverflowing ? 'animate-marquee' : ''}`}
            >
                {text}
                
                {/* The Duplicate Node: This creates the "circular linked list" illusion */}
                {isOverflowing && (
                    <span className="ml-12">{text}</span>
                )}
            </div>
            
            {/* Optional: Tiny gradient fades on the edges to make the scroll look polished */}
            {isOverflowing && (
                <>
                    <div className="absolute top-0 left-0 w-4 h-full bg-gradient-to-r from-background-secondary/80 to-transparent pointer-events-none" />
                    <div className="absolute top-0 right-0 w-4 h-full bg-gradient-to-l from-background-secondary/80 to-transparent pointer-events-none" />
                </>
            )}
        </div>
    );
};

export default ScrollingText;