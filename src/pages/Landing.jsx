import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();
    
    // 1. Check if the screen is mobile-sized
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // 2. Listen for screen resizing
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
    const desktopVideo = "https://res.cloudinary.com/ddc6silap/video/upload/ac_none,f_auto,q_auto,w_1920,c_limit/v1773392627/one_hr2kqf.mp4";
    const mobileVideo = "https://res.cloudinary.com/ddc6silap/video/upload/ac_none,f_auto,q_auto,w_720,c_limit/v1773393443/grok-video-7fb3a9fa-5355-4d58-8358-8cebd2d5fcd4_jalu6m.mp4";

    return (
        <div className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-background-primary">
            
            {/* THE BACKGROUND VIDEO */}
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

            {/* THE OVERLAY: A gradient to darken the video so the text pops */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 via-black/60 to-background-primary z-10"></div>

            {/* THE CONTENT */}
            <div className="relative z-20 flex flex-col items-center text-center px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full max-w-5xl">
                
                <h1 className="text-5xl md:text-8xl font-black text-text-primary tracking-tighter drop-shadow-2xl mb-4">
                    Yume<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-tertiary">Tunes</span>
                </h1>
                
                <p className="text-lg md:text-2xl text-text-secondary max-w-2xl drop-shadow-lg mb-8 font-medium">
                    Your Personal Anime Music Sanctuary. Listen to iconic OSTs, sync lyrics, and vibe with the community.
                </p>

                {/* ✨ THE NEW DATA: Glassmorphism Feature Pills ✨ */}
                <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-12">
                    <div className="px-4 py-2 rounded-full bg-background-secondary/30 backdrop-blur-md border border-border/50 text-text-primary text-sm font-semibold tracking-wide shadow-lg">
                        🎧 Clean UI
                    </div>
                    <div className="px-4 py-2 rounded-full bg-background-secondary/30 backdrop-blur-md border border-border/50 text-text-primary text-sm font-semibold tracking-wide shadow-lg">
                        📜 Precision Timed Lyrics
                    </div>
                    <div className="px-4 py-2 rounded-full bg-background-secondary/30 backdrop-blur-md border border-border/50 text-text-primary text-sm font-semibold tracking-wide shadow-lg">
                        🤖 Recommendation engine
                    </div>
                </div>

                {/* THE BIG CTA BUTTON */}
                <button 
                    onClick={handleEnter}
                    className="group relative px-10 py-5 bg-gradient-to-r from-accent-secondary to-accent-primary text-white font-black text-xl md:text-2xl rounded-full uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(157,92,250,0.4)] hover:shadow-[0_0_60px_rgba(157,92,250,0.7)] hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                    <span className="relative z-10">Enter Sanctuary</span>
                    <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0"></div>
                </button>
            </div>

            {/* ✨ SUBTLE FOOTER ✨ */}
            <div className="absolute bottom-6 left-0 w-full flex justify-center z-20 pointer-events-none">
                <p className="text-text-muted/60 text-xs font-semibold tracking-widest uppercase">
                    v1.0 Production Build • PERN Stack Architecture
                </p>
            </div>

        </div>
    );
};

export default Landing;