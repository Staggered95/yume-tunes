import React from 'react';
import { useSongs } from '../context/SongContext';
import { useToast } from '../context/ToastContext';
import OptionsMenu from '../minicomps/OptionsMenu';

// Define shape-specific styles
const styles = {
  square: {
    container: "w-54 flex flex-col items-start gap-2",
    image: "h-54 w-54 rounded-lg",
    text: "w-full overflow-hidden" 
  },
  small_square: {
    container: "w-40 flex flex-col items-start gap-2",
    image: "h-40 w-40 rounded-lg",
    text: "w-full overflow-hidden" 
  },
  circle: {
    container: "w-36 flex flex-col items-center gap-2",
    image: "h-36 w-36 rounded-full border-2 border-white/5",
    text: "w-full text-center overflow-hidden"
  },
  wide: {
    container: "w-72 flex flex-row items-center gap-4 bg-white/5 p-2 rounded-xl",
    image: "h-16 w-16 rounded-md shrink-0", 
    text: "flex-1 min-w-0" 
  },
  list: {
    container: "w-full flex flex-row items-center gap-4 bg-background-secondary/40 hover:bg-background-active p-3 rounded-xl border border-white/5",
    image: "h-14 w-14 rounded-md shrink-0 shadow-md",
    text: "flex-1 min-w-0 flex flex-col justify-center",
    meta: "hidden md:flex flex-col items-end gap-1 text-right shrink-0 px-4" 
  }
};

const SongCard = ({ song, index = 0, shape = 'square' }) => {
  const { playQueue, currentSong, isPlaying } = useSongs();
  
  if (!song) return null;
  const songArray = Array.isArray(song) ? song : [song];
  const track = songArray[index];
  if (!track) return null;

  const currentStyle = styles[shape] || styles.square;
  const isCurrentTrack = currentSong && track && String(currentSong.id) === String(track.id);

  const isHorizontal = shape === 'wide' || shape === 'list';

  const getOverlayRadius = () => {
    if (shape === 'circle') return 'rounded-full';
    if (shape === 'wide' || shape === 'list') return 'rounded-md';
    return 'rounded-lg';
  };

  return (
    <div 
      onClick={() => playQueue(songArray, index)} 
      // FIX 1: Added hover:z-[100] and focus-within:z-[100] to pull the active card above its neighbors!
      className={`${currentStyle.container} relative group cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95 hover:z-[100] focus-within:z-[100]`}
    >
      
      {/* SQUARE / CIRCLE LAYOUT */}
      {!isHorizontal && (
        <div 
            // FIX 2: The Click Dead Zone. Stops the card from playing when interacting with the menu area.
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 z-50"
        >
            <OptionsMenu 
                song={track} 
                className="bg-black/40 hover:bg-black/80 backdrop-blur-md rounded-full text-white" 
            />
        </div>
      )}

      {/* Image Container */}
      <div className="relative shrink-0">
        <img 
          src={track.cover_path.startsWith('http') ? track.cover_path : `http://localhost:5000${track.cover_path}`} 
          alt={track.title} 
          className={`${currentStyle.image} object-cover shadow-lg group-hover:shadow-accent-active/20 transition-all`} 
        />
        
        {/* The Current Playing Transparent Overlay */}
        {isCurrentTrack && (
          <div className={`absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center transition-all duration-300 pointer-events-none ${getOverlayRadius()}`}>
            <svg className="w-10 h-10 text-accent-primary drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
              {isPlaying ? <path d="M6 4h4v16H6zm8 0h4v16h-4z" /> : <path d="M8 5v14l11-7z" />}
            </svg>
          </div>
        )}
      </div>
      
      {/* Text Container */}
      <div className={`${currentStyle.text} overflow-hidden`}>
        <h3 className={`font-bold truncate w-full transition-colors ${
          isCurrentTrack ? 'text-accent-primary' : 'text-text-primary group-hover:text-accent-active'
        }`}>
          {track.title}
        </h3>
        <p className="text-text-secondary text-xs truncate">
          {track.artist}
        </p>
      </div>

      {/* WIDE / LIST LAYOUT */}
      {isHorizontal && (
        <div 
            // FIX 2 (Continued): Dead zone applied to the list layout as well
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
            className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 ml-auto shrink-0 z-50 pl-2"
        >
            <OptionsMenu 
                song={track} 
                className="hover:bg-white/10 rounded-full text-text-secondary hover:text-white" 
            />
        </div>
      )}
      
    </div>
  );
};

export default SongCard;