import React from 'react';

const Collage = ({ covers }) => {
  // Ensure we safely handle null/undefined arrays
  const validCovers = covers || [];
  const count = validCovers.length;

  // --- STATE 1: THE EMPTY STATE (Brand New Playlist) ---
  if (count === 0) {
    return (
      <div className="w-full aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center relative group overflow-hidden border border-white/5">
        {/* Sleek Music Note SVG */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-1/3 h-1/3 text-zinc-700 transition-transform duration-500 group-hover:scale-110 group-hover:text-zinc-500" 
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
      </div>
    );
  }

  // --- STATE 2: THE GRID STATE (4 or more songs) ---
  if (count >= 4) {
    return (
      <div className="aspect-square bg-zinc-900 overflow-hidden relative group">
        <div className="grid grid-cols-2 grid-rows-2 h-full w-full gap-[1px]">
          {validCovers.slice(0, 4).map((path, idx) => (
            <img
              key={idx}
              src={`http://localhost:5000${path}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt={`Playlist cover ${idx + 1}`}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
      </div>
    );
  }

  // --- STATE 3: THE SINGLE IMAGE STATE (1 to 3 songs) ---
  return (
    <div className="aspect-square bg-zinc-900 overflow-hidden relative group">
      <img
        src={`http://localhost:5000${validCovers[0]}`}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        alt="Playlist cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
    </div>
  );
};

export default Collage;