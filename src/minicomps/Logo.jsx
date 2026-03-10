import React from 'react';

const Logo = ({ className = "w-12 h-12" }) => {
    return (
        <svg
            className={`${className} transition-transform duration-500 hover:rotate-[10deg]`}
            viewBox="0 0 128 128"
            role="img"
            aria-label="YumeTunes logo"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                {/* Dynamically reads from your active theme's CSS variables */}
                <linearGradient id="yt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop 
                        offset="0%" 
                        stopColor="var(--acc-secondary, #E056FD)" 
                    />
                    <stop 
                        offset="100%" 
                        stopColor="var(--acc-primary, #8258FA)" 
                    />
                </linearGradient>

                <mask id="yt-cut">
                    <rect width="128" height="128" fill="#fff" />
                    <circle cx="86" cy="58" r="40" fill="#000" />
                </mask>
            </defs>

            {/* Background Eclipse Shape */}
            <circle 
                cx="64" 
                cy="64" 
                r="52" 
                mask="url(#yt-cut)" 
                fill="url(#yt-grad)" 
                className="opacity-90 transition-opacity duration-300 hover:opacity-100" 
            />

            {/* Musical Note Path */}
            <path
                d="M78 36 v29 c-2.4-1.5-5.6-2.4-9.1-2.4 c-7.6 0-13.9 4.1-13.9 9.2 s6.3 9.2 13.9 9.2 s13.9-4.1 13.9-9.2 V51.5 l18 5.8 v11.7 c-2.4-1.5-5.6-2.4-9.1-2.4 c-7.6 0-13.9 4.1-13.9 9.2 s6.3 9.2 13.9 9.2 s13.9-4.1 13.9-9.2 V41 L78 36 z"
                fill="var(--txt-primary, #F2F2F5)"
                className="opacity-95 transition-colors duration-300"
            />
        </svg>
    );
};

export default Logo;