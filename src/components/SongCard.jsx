import React from 'react';
import { useSongs } from '../context/SongContext';

const SongCard = ({ song, shape = 'square' }) => {
  const { selectSong } = useSongs();

  if (!song) return null;

  // Define shape-specific styles
  const styles = {
  square: {
    container: "w-54 flex flex-col items-start gap-2",
    image: "h-54 w-54 rounded-lg",
    text: "w-full overflow-hidden" // Ensure container doesn't grow
  },
  small_square: {
    container: "w-40 flex flex-col items-start gap-2",
    image: "h-40 w-40 rounded-lg",
    text: "w-full overflow-hidden" // Ensure container doesn't grow
  },
  circle: {
    container: "w-36 flex flex-col items-center gap-2",
    image: "h-36 w-36 rounded-full border-2 border-white/5",
    text: "w-full text-center overflow-hidden"
  },
  wide: {
    container: "w-72 flex flex-row items-center gap-4 bg-white/5 p-2 rounded-xl",
    image: "h-16 w-16 rounded-md shrink-0", // Prevent image from squishing
    text: "flex-1 min-w-0" // The MAGIC: min-w-0 allows the title to truncate
  }
};

  const currentStyle = styles[shape] || styles.square;

  return (
    <div 
      onClick={() => selectSong(song)} 
      className={`${currentStyle.container} group cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95`}
    >
      <img 
        src={song.cover_path} 
        alt={song.title} 
        className={`${currentStyle.image} object-cover shadow-lg group-hover:shadow-accent-active/20`} 
      />
      
      <div className={`${currentStyle.text} overflow-hidden`}>
        <h3 className="font-bold text-text-primary truncate w-full group-hover:text-accent-active transition-colors">
          {song.title}
        </h3>
        <p className="text-text-secondary text-xs truncate">
          {song.artist}
        </p>
      </div>
    </div>
  );
};

export default SongCard;