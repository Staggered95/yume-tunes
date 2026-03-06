import React from 'react';
import f2 from '../assets/f2.png';

const InfoBox = () => {
    return (
        // Hides on mobile/tablet, appears on desktop, fluid width, slide-in animation
        <div className="hidden lg:flex flex-col gap-5 fixed right-4 top-24 w-72 xl:w-[340px] bg-background-secondary border border-border hover:border-border-hover p-5 rounded-2xl transition-all duration-500 shadow-2xl z-10 animate-in slide-in-from-right-8 fade-in group">
            
            {/* Image Container - Added a subtle hover scale effect */}
            <div className="w-full aspect-square rounded-xl overflow-hidden shadow-lg bg-background-primary relative">
                <img 
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                    src={f2} 
                    alt="current song"
                />
                {/* Subtle gradient overlay to make it look premium */}
                <div className="absolute inset-0 bg-gradient-to-t from-background-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Track Info */}
            <div className="flex flex-col gap-0.5">
                <div className="flex flex-col">
                    <span className="text-text-primary text-xl xl:text-2xl font-black truncate tracking-tight drop-shadow-sm">
                        Title content
                    </span>
                </div>
                <div className="text-accent-primary font-bold text-sm xl:text-base transition-colors hover:text-accent-hover cursor-pointer w-fit">
                    Artist Name
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 mt-1">
                <button className="flex-1 bg-text-primary text-background-primary py-2.5 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-text-primary/10 hover:shadow-text-primary/30">
                    Play
                </button>
                <button className="flex-1 border-2 border-border text-text-primary py-2.5 rounded-full font-bold text-sm uppercase tracking-widest hover:border-text-secondary hover:bg-background-hover active:scale-95 transition-all duration-300">
                    Shuffle
                </button>
            </div>

            {/* Suggested Tracks Placeholder */}
            <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-text-secondary text-xs uppercase tracking-widest font-black">Up Next</h3>
                </div>
                
                <div className="space-y-3">
                    {/* Skeleton Loaders using your theme variables */}
                    <div className="flex items-center gap-3 w-full opacity-70">
                        <div className="h-10 w-10 shrink-0 bg-background-active rounded-md animate-pulse"></div>
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="h-3 w-3/4 bg-background-active rounded-full animate-pulse"></div>
                            <div className="h-2 w-1/2 bg-background-active/50 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full opacity-50">
                        <div className="h-10 w-10 shrink-0 bg-background-active rounded-md animate-pulse"></div>
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="h-3 w-2/3 bg-background-active rounded-full animate-pulse"></div>
                            <div className="h-2 w-1/3 bg-background-active/50 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default InfoBox;