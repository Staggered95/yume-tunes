import React from 'react';
import { useSongs } from '../context/SongContext';
import OptionsMenu from '../minicomps/OptionsMenu';
import { getMediaUrl } from '../utils/media';

// Standardized Theme-Aware Styles
const styles = {
  square: {
    container: "w-48 sm:w-54 flex flex-col items-start gap-3",
    image: "h-48 w-48 sm:h-54 sm:w-54 rounded-2xl",
    text: "w-full px-1" 
  },
  small_square: {
    container: "w-36 sm:w-40 flex flex-col items-start gap-2",
    image: "h-36 min-w-36 sm:h-40 sm:min-w-40 rounded-xl",
    text: "w-full px-1" 
  },
  circle: {
    container: "w-32 sm:w-36 flex flex-col items-center gap-3 text-center",
    image: "h-32 w-32 sm:h-36 sm:w-36 rounded-full border-2 border-border hover:border-accent-primary",
    text: "w-full"
  },
  wide: {
    container: "w-full sm:w-64 lg:w-76 flex flex-row items-center gap-4 bg-background-secondary/40 hover:bg-background-hover p-2 rounded-2xl border border-transparent hover:border-border",
    image: "h-14 w-14 sm:h-16 sm:w-16 rounded-lg shrink-0", 
    text: "flex-1 min-w-0" 
  },
  list: {
    container: "w-full flex flex-row items-center gap-4 bg-background-secondary/20 hover:bg-background-active p-3 rounded-2xl border border-border hover:border-border-hover",
    image: "h-12 w-12 sm:h-14 sm:w-14 rounded-lg shrink-0 shadow-md",
    text: "flex-1 min-w-0 flex flex-col justify-center",
  }
};

const SongCard = ({ song, index = 0, shape = 'square' }) => {
  const { playQueue, currentSong, isPlaying } = useSongs();
  
  if (!song) return null;
  
  // Safe extraction of the track object
  const track = Array.isArray(song) ? song[index] : song;
  if (!track) return null;

  const currentStyle = styles[shape] || styles.square;
  const isCurrentTrack = currentSong && String(currentSong.id) === String(track.id);
  const isHorizontal = shape === 'wide' || shape === 'list';

  return (
    <div 
      onClick={() => playQueue(Array.isArray(song) ? song : [song], index)} 
      className={`${currentStyle.container} relative group cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95 hover:z-[10] focus-within:z-[10] animate-fade-in`}
    >
      
      {/* 1. OVERLAY OPTIONS (Vertical Layouts Only) */}
      {!isHorizontal && (
        <div 
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all duration-300 z-30"
        >
            <OptionsMenu 
                song={track} 
                className="bg-background-active/80 hover:bg-background-active backdrop-blur-md border border-border rounded-full text-text-primary p-1.5 shadow-xl" 
            />
        </div>
      )}

      {/* 2. IMAGE SECTION */}
      <div className="relative shrink-0 shadow-2xl shadow-black/40">
        <img 
          src={getMediaUrl(track.cover_path)} 
          alt={track.title} 
          loading="lazy"
          className={`${currentStyle.image} object-cover transition-all duration-500 group-hover:brightness-110`} 
        />
        
        {/* Play State Overlay */}
        {isCurrentTrack && (
          <div className={`absolute inset-0 bg-background-primary/60 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300 pointer-events-none ${shape === 'circle' ? 'rounded-full' : 'rounded-inherit'}`}>
            <div className={`${isPlaying ? 'animate-pulse' : ''}`}>
                <svg className="w-10 h-10 text-accent-primary drop-shadow-[0_0_10px_rgba(157,92,250,0.5)]" fill="currentColor" viewBox="0 0 24 24">
                {isPlaying ? <path d="M6 4h4v16H6zm8 0h4v16h-4z" /> : <path d="M8 5v14l11-7z" />}
                </svg>
            </div>
          </div>
        )}
      </div>
      
      {/* 3. TEXT METADATA */}
      <div className={`${currentStyle.text} overflow-hidden flex flex-col gap-0.5`}>
        <h3 className={`text-sm sm:text-base font-bold truncate w-full transition-colors duration-300 ${
          isCurrentTrack ? 'text-accent-primary' : 'text-text-primary group-hover:text-accent-hover'
        }`}>
          {track.title}
        </h3>
        <p className="text-text-secondary text-[10px] sm:text-xs truncate font-medium">
          {track.artist}
        </p>
      </div>

      {/* 4. TRAILING OPTIONS (Horizontal Layouts Only) */}
      {isHorizontal && (
        <div 
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
            className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all duration-300 ml-auto shrink-0 z-30"
        >
            <OptionsMenu 
                song={track} 
                className="hover:bg-background-active rounded-full text-text-secondary hover:text-text-primary p-2 transition-colors" 
            />
        </div>
      )}
      
    </div>
  );
};

export default SongCard;