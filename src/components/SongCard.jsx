import React, { useState } from 'react';
import { useSongs } from '../context/SongContext';
import OptionsMenu from '../minicomps/OptionsMenu';
import { getMediaUrl } from '../utils/media';

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
  trending: {
    container: "w-[300px] md:w-[350px] h-20 flex items-center gap-4 p-3 rounded-2xl bg-gradient-to-r from-background-secondary/50 to-background-primary border border-border/50 hover:border-accent-primary/50 shrink-0",
    image: "w-14 h-14 rounded-lg object-cover shadow-lg",
    text: "flex-1 min-w-0"
  }
};

// Skeleton shimmer that mirrors the exact shape of each card
const SongCardSkeleton = ({ shape }) => {
  const skeletonShimmer = "animate-pulse bg-background-hover";
  const isHorizontal = ['wide', 'list', 'trending'].includes(shape);

  const imageClass = {
    square:           "w-32 h-32 md:w-48 md:h-48 rounded-xl",
    small_square:     "w-28 h-28 md:w-36 md:h-36 rounded-lg",
    responsive_square:"w-28 h-28 md:w-48 md:h-48 rounded-lg md:rounded-xl",
    circle:           "w-24 h-24 md:w-32 md:h-32 rounded-full",
    wide:             "w-12 h-12 rounded-md shrink-0",
    list:             "w-12 h-12 md:w-14 md:h-14 rounded-md shrink-0",
    trending:         "w-14 h-14 rounded-lg shrink-0",
  }[shape] || "w-32 h-32 rounded-xl";

  const containerClass = {
    square:           "w-32 md:w-48 flex flex-col gap-2",
    small_square:     "w-28 md:w-36 flex flex-col gap-2",
    responsive_square:"w-28 md:w-48 flex flex-col gap-2 md:gap-3",
    circle:           "w-24 md:w-32 flex flex-col items-center gap-2",
    wide:             "w-[280px] h-16 flex items-center gap-3 p-2 rounded-xl",
    list:             "w-full flex items-center gap-3 p-2 md:p-3 rounded-xl",
    trending:         "w-[300px] md:w-[350px] h-20 flex items-center gap-4 p-3 rounded-2xl",
  }[shape] || "w-32 md:w-48 flex flex-col gap-2";

  return (
    <div className={containerClass}>
      <div className={`${imageClass} ${skeletonShimmer}`} />
      {isHorizontal ? (
        <div className="flex-1 flex flex-col gap-1.5 justify-center min-w-0">
          <div className={`h-3 rounded-full w-3/4 ${skeletonShimmer}`} />
          <div className={`h-2.5 rounded-full w-1/2 ${skeletonShimmer}`} />
        </div>
      ) : (
        <div className="flex flex-col gap-1.5 px-1">
          <div className={`h-3 rounded-full w-3/4 ${skeletonShimmer}`} />
          <div className={`h-2.5 rounded-full w-1/2 ${skeletonShimmer}`} />
        </div>
      )}
    </div>
  );
};

const SongCard = ({ song, queue, index = 0, shape = 'square' }) => {
  const { playQueue, currentSong, isPlaying } = useSongs();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!song) return null;

  const currentStyle = styles[shape] || styles.square;
  const isCurrentTrack = currentSong?.id === song.id;
  const isHorizontal = ['wide', 'list', 'trending'].includes(shape);

  const handlePlay = () => playQueue(queue || [song], index);

  return (
    <div
      onClick={handlePlay}
      className={`${currentStyle.container} relative group cursor-pointer transition-all duration-300 active:scale-95 md:hover:scale-[1.02]`}
    >
      {/* Show skeleton until image is ready */}
      {!imgLoaded && !imgError && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <SongCardSkeleton shape={shape} />
        </div>
      )}

      {!isHorizontal && (
        <div onClick={(e) => e.stopPropagation()} className="absolute top-2 right-2 opacity-100 md:opacity-0 group-hover:opacity-100 z-20 transition-opacity">
          <OptionsMenu song={song} className="bg-background-active/80 backdrop-blur-md rounded-full sm:p-1" />
        </div>
      )}

      <div className="relative shrink-0 shadow-lg shadow-black/20">
        <img
          src={getMediaUrl(song.cover_path)}
          alt={song.title}
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgError(true); setImgLoaded(true); }}
          className={`${currentStyle.image} group-hover:brightness-110 transition-all duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {isCurrentTrack && imgLoaded && (
          <div className={`absolute inset-0 bg-background-primary/60 flex items-center justify-center pointer-events-none ${shape === 'circle' ? 'rounded-full' : 'rounded-inherit'}`}>
            
            {/* Clean, static SVG with a subtle drop shadow instead of a pulse animation */}
            <svg className="w-16 h-16 text-accent-primary drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
              {isPlaying ? (
                /* Beautifully Rounded Pause Icon */
                <path fillRule="evenodd" clipRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" />
              ) : (
                /* Beautifully Rounded Play Triangle */
                <path fillRule="evenodd" clipRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" />
              )}
            </svg>
            
          </div>
        )}
      </div>

      <div className={`${currentStyle.text} overflow-hidden flex flex-col justify-center`}>
        <h3 className={`text-sm md:text-base font-bold truncate transition-colors ${isCurrentTrack ? 'text-accent-primary' : 'text-text-primary group-hover:text-accent-hover'}`}>
          {song.title}
        </h3>
        <p className="text-text-secondary text-xs truncate mt-0.5">
          {song.artist}
        </p>
      </div>

      {isHorizontal && (
        <div onClick={(e) => e.stopPropagation()} className="opacity-100 md:opacity-0 group-hover:opacity-100 z-10 ml-auto transition-opacity">
          <OptionsMenu song={song} className="hover:bg-background-active rounded-full p-2" />
        </div>
      )}
    </div>
  );
};

export default React.memo(SongCard, (prevProps, nextProps) => {
  return prevProps.song.id === nextProps.song.id && prevProps.index === nextProps.index;
});