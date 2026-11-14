import React from 'react';
import { getMediaUrl } from '../utils/media';

const Collage = ({ covers }) => {
  const validCovers = covers || [];
  const count = validCovers.length;

  

  // --- STATE 1: THE EMPTY STATE ---
  if (count === 0) {
    return (
      <div className="w-full aspect-square bg-gradient-to-br from-background-secondary to-background-active flex items-center justify-center relative group overflow-hidden border border-border transition-colors duration-500 hover:border-accent-primary/30">
        {/* Sleek Music Note Icon mapped to theme */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-1/3 h-1/3 text-text-muted transition-all duration-700 group-hover:scale-110 group-hover:text-accent-primary group-hover:drop-shadow-[0_0_15px_rgba(157,92,250,0.4)]" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M9 18V5l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
        
        {/* Subtle decorative glow */}
        <div className="absolute inset-0 bg-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>
    );
  }

  // --- STATE 2: THE GRID STATE (4 or more songs) ---
  if (count >= 4) {
    return (
      <div className="aspect-square bg-background-primary overflow-hidden relative group rounded-inherit shadow-2xl">
        <div className="grid grid-cols-2 grid-rows-2 h-full w-full gap-[1px] bg-border">
          {validCovers.slice(0, 4).map((path, idx) => (
            <div key={idx} className="overflow-hidden bg-background-active">
                <img
                    src={getMediaUrl(path)}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    alt={`Playlist cover ${idx + 1}`}
                    loading="lazy"
                />
            </div>
          ))}
        </div>
        {/* Standardized Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background-primary/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
      </div>
    );
  }

  // --- STATE 3: THE SINGLE IMAGE STATE (1 to 3 songs) ---
  return (
    <div className="aspect-square bg-background-primary overflow-hidden relative group rounded-inherit shadow-2xl">
      <img
        src={getMediaUrl(validCovers[0])}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        alt="Playlist cover"
        loading="lazy"
      />
      {/* Standardized Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background-primary/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
    </div>
  );
};

export default Collage;