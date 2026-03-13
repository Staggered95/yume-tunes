import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();
    
    // 1. Check if the screen is mobile-sized (Tailwind's 'md' breakpoint is usually 768px)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // 2. Listen for screen resizing just in case they flip their tablet
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleEnter = () => {
        navigate('/home'); 
    };

    // 3. Your Optimized Cloudinary URLs
    // We add 'w_1920' for desktop and 'w_720' for mobile to save massive bandwidth
    const desktopVideo = "https://res.cloudinary.com/ddc6silap/video/upload/ac_none,f_auto,q_auto,w_1920,c_limit/v1234/yume-desktop.mp4";
    const mobileVideo = "https://res.cloudinary.com/ddc6silap/video/upload/ac_none,f_auto,q_auto,w_720,c_limit/v1234/yume-mobile.mp4";

    return (
        <div className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-background-primary">
            
            {/* THE BACKGROUND VIDEO */}
            {/* The 'key' attribute forces the browser to reload the video if isMobile changes */}
            <video
                key={isMobile ? 'mobile-vid' : 'desktop-vid'}
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-80"
            >
                <source src={isMobile ? mobileVideo : desktopVideo} type="video/mp4" />
            </video>

            {/* THE OVERLAY: A gradient to darken the video so the white text pops */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 via-black/60 to-background-primary z-10"></div>

            {/* THE CONTENT */}
            <div className="relative z-20 flex flex-col items-center text-center px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                
                <h1 className="text-5xl md:text-8xl font-black text-text-primary tracking-tighter drop-shadow-2xl mb-4">
                    Yume<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-tertiary">Tunes</span>
                </h1>
                
                <p className="text-lg md:text-2xl text-text-secondary max-w-2xl drop-shadow-lg mb-12 font-medium">
                    Your Personal Anime Music Sanctuary. Listen to iconic OSTs, sync lyrics, and vibe with the community.
                </p>

                {/* THE BIG CTA BUTTON */}
                <button 
                    onClick={handleEnter}
                    className="group relative px-10 py-5 bg-gradient-to-r from-accent-secondary to-accent-primary text-white font-black text-xl md:text-2xl rounded-full uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(157,92,250,0.4)] hover:shadow-[0_0_60px_rgba(157,92,250,0.7)] hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                    <span className="relative z-10">Enter Sanctuary</span>
                    <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0"></div>
                </button>

            </div>
        </div>
    );
};

export default Landing;