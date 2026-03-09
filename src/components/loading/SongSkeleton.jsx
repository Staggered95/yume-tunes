import React from 'react';

const SongSkeleton = () => {
    return (
        // The animate-pulse class makes the whole row gently fade in and out!
        <div className="flex items-center gap-4 md:gap-6 p-3 md:p-4 rounded-xl md:rounded-2xl animate-pulse">
            
            {/* 1. Ghost Index Number */}
            <div className="w-6 shrink-0 flex justify-center">
                <div className="w-4 h-4 bg-border/50 rounded-sm" />
            </div>
            
            {/* 2. Ghost Text Column */}
            <div className="flex-1 min-w-0 pr-4 space-y-2">
                {/* Title Line (Longer) */}
                <div className="h-4 bg-border/50 rounded-full w-3/4 sm:w-1/2" />
                {/* Artist Line (Shorter & slightly dimmer) */}
                <div className="h-3 bg-border/30 rounded-full w-1/2 sm:w-1/3 mt-2" />
            </div>
            
            {/* 3. Ghost Trailing Icon (Like the play button) */}
            <div className="hidden sm:block shrink-0">
                <div className="w-5 h-5 bg-border/40 rounded-full" />
            </div>
            
        </div>
    );
};

export default SongSkeleton;