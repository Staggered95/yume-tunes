import React from 'react';
import { useNavigate } from "react-router-dom";
import { GENRES } from "../utils/constants";

export default function TagChips({ currentGenre = null }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-3 px-6 snap-x snap-proximity">
      {GENRES.map((genre) => {
        const isActive = currentGenre === genre;
        
        return (
          <button 
            key={genre}
            onClick={() => navigate(`/genre/${encodeURIComponent(genre)}`)}
            className={`px-5 py-2 rounded-full border text-sm font-bold tracking-tight whitespace-nowrap transition-all duration-300 snap-start
              ${isActive 
                ? "bg-accent-primary border-accent-primary text-background-primary shadow-lg shadow-accent-primary/20" 
                : "bg-background-secondary border-border text-text-secondary hover:text-text-primary hover:bg-background-hover hover:border-border-hover active:scale-95"
              }`}
          >
            {genre}
          </button>
        );
      })}
      
      <button 
        onClick={() => navigate('/genres')}
        className="px-6 py-2 text-sm font-black text-accent-primary hover:text-accent-hover hover:underline transition-colors whitespace-nowrap shrink-0"
      >
        Show all
      </button>
    </div>
  );
}