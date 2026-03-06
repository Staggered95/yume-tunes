import React from 'react';
import { useSongs } from '../context/SongContext';
import OptionsMenu from '../minicomps/OptionsMenu';
import { getMediaUrl } from '../utils/media';

// 1. SIMPLIFIED STYLES: Mobile first, md for desktop. No more messy sm/lg middle-steps.
const styles = {
  square: {
    container: "w-32 md:w-48 flex flex-col gap-2 shrink-0",
    image: "w-32 h-32 md:w-48 md:h-48 rounded-xl object-cover",
    text: "px-1" 
  },
  small_square: {
    container: "w-28 md:w-36 flex flex-col gap-2 shrink-0",
    image: "w-28 h-28 md:w-36 md:h-36 rounded-lg object-cover",
    text: "px-1" 
  },
  responsive_square: {
    container: "w-28 md:w-48 flex flex-col gap-2 md:gap-3 shrink-0",
    // Notice the height/width and border radius expanding on md:
    image: "w-28 h-28 md:w-48 md:h-48 rounded-lg md:rounded-xl object-cover", 
    text: "px-1" 
  },
  circle: {
    container: "w-24 md:w-32 flex flex-col items-center text-center gap-2 shrink-0",
    image: "w-24 h-24 md:w-32 md:h-32 rounded-full border border-border object-cover",
    text: "px-1"
  },
  wide: {
    container: "w-[280px] h-16 flex items-center gap-3 p-2 rounded-xl bg-background-secondary/40 hover:bg-background-hover shrink-0",
    image: "w-12 h-12 rounded-md object-cover", 
    text: "flex-1 min-w-0" 
  },
  list: {
    container: "w-full flex items-center gap-3 p-2 md:p-3 rounded-xl hover:bg-background-active border border-transparent hover:border-border",
    image: "w-12 h-12 md:w-14 md:h-14 rounded-md object-cover",
    text: "flex-1 min-w-0",
  },
  // NEW: The Trending Card!
  trending: {
    container: "w-[300px] md:w-[350px] h-20 flex items-center gap-4 p-3 rounded-2xl bg-gradient-to-r from-background-secondary/50 to-background-primary border border-border/50 hover:border-accent-primary/50 shrink-0",
    image: "w-14 h-14 rounded-lg object-cover shadow-lg",
    text: "flex-1 min-w-0"
  }
};

// 2. CLEANER PROPS: `song` is the single object. `queue` is the array of songs.
const SongCard = ({ song, queue, index = 0, shape = 'square' }) => {
  const { playQueue, currentSong, isPlaying } = useSongs();
  
  if (!song) return null;

  const currentStyle = styles[shape] || styles.square;
  const isCurrentTrack = currentSong?.id === song.id;
  const isHorizontal = ['wide', 'list', 'trending'].includes(shape);

  // Use the queue if provided, otherwise just play this single song
  const handlePlay = () => playQueue(queue || [song], index);

  return (
    <div 
      onClick={handlePlay} 
      className={`${currentStyle.container} relative group cursor-pointer transition-all duration-300 active:scale-95 md:hover:scale-[1.02]`}
    >
      
      {/* VERTICAL OPTIONS MENU (Top Right) */}
      {!isHorizontal && (
        <div onClick={(e) => { e.stopPropagation(); }} className="absolute top-2 right-2 opacity-100 md:opacity-0 group-hover:opacity-100 z-10 transition-opacity">
            <OptionsMenu song={song} className="bg-background-active/80 backdrop-blur-md rounded-full sm:p-1" />
        </div>
      )}

      {/* IMAGE & PLAY OVERLAY */}
      <div className="relative shrink-0 shadow-lg shadow-black/20">
        <img 
          src={getMediaUrl(song.cover_path)} 
          alt={song.title} 
          loading="lazy"
          className={`${currentStyle.image} group-hover:brightness-110 transition-all`} 
        />
        
        {isCurrentTrack && (
          <div className={`absolute inset-0 bg-background-primary/60 flex items-center justify-center pointer-events-none ${shape === 'circle' ? 'rounded-full' : 'rounded-inherit'}`}>
            <svg className={`w-16 h-16 text-accent-primary ${isPlaying ? 'animate-pulse' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                {isPlaying ? <path d="M6 4h4v16H6zm8 0h4v16h-4z" /> : <path d="M8 5v14l11-7z" />}
            </svg>
          </div>
        )}
      </div>
      
      {/* TEXT DATA */}
      <div className={`${currentStyle.text} overflow-hidden flex flex-col justify-center`}>
        <h3 className={`text-sm md:text-base font-bold truncate transition-colors ${isCurrentTrack ? 'text-accent-primary' : 'text-text-primary group-hover:text-accent-hover'}`}>
          {song.title}
        </h3>
        <p className="text-text-secondary text-xs truncate mt-0.5">
          {song.artist}
        </p>
      </div>

      {/* HORIZONTAL OPTIONS MENU (Far Right) */}
      {isHorizontal && (
        <div onClick={(e) => { e.stopPropagation(); }} className="opacity-100 md:opacity-0 group-hover:opacity-100 z-10 ml-auto transition-opacity">
            <OptionsMenu song={song} className="hover:bg-background-active rounded-full p-2" />
        </div>
      )}
      
    </div>
  );
};

export default SongCard;