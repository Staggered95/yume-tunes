import React from 'react';

const skeletonStyles = {
  square: {
    container: "w-32 md:w-48 flex flex-col gap-2 shrink-0 animate-pulse",
    image: "w-32 h-32 md:w-48 md:h-48 rounded-xl bg-border/30",
    text: "px-1 flex flex-col gap-2 mt-1" 
  },
  small_square: {
    container: "w-28 md:w-36 flex flex-col gap-2 shrink-0 animate-pulse",
    image: "w-28 h-28 md:w-36 md:h-36 rounded-lg bg-border/30",
    text: "px-1 flex flex-col gap-2 mt-1" 
  },
  responsive_square: {
    container: "w-28 md:w-48 flex flex-col gap-2 md:gap-3 shrink-0 animate-pulse",
    image: "w-28 h-28 md:w-48 md:h-48 rounded-lg md:rounded-xl bg-border/30", 
    text: "px-1 flex flex-col gap-2 mt-1" 
  },
  circle: {
    container: "w-24 md:w-32 flex flex-col items-center text-center gap-2 shrink-0 animate-pulse",
    image: "w-24 h-24 md:w-32 md:h-32 rounded-full border border-border/10 bg-border/30",
    text: "px-1 flex flex-col items-center gap-2 mt-1 w-full"
  },
  wide: {
    container: "w-[280px] h-16 flex items-center gap-3 p-2 rounded-xl bg-background-secondary/40 shrink-0 animate-pulse",
    image: "w-12 h-12 rounded-md bg-border/40 shrink-0", 
    text: "flex-1 min-w-0 flex flex-col gap-2" 
  },
  list: {
    container: "w-full flex items-center gap-3 p-2 md:p-3 rounded-xl border border-transparent animate-pulse",
    image: "w-12 h-12 md:w-14 md:h-14 rounded-md bg-border/30 shrink-0",
    text: "flex-1 min-w-0 flex flex-col gap-2",
  },
  trending: {
    container: "w-[300px] md:w-[350px] h-20 flex items-center gap-4 p-3 rounded-2xl bg-background-secondary/30 border border-border/20 shrink-0 animate-pulse",
    image: "w-14 h-14 rounded-lg bg-border/40 shrink-0 shadow-sm",
    text: "flex-1 min-w-0 flex flex-col gap-2"
  }
};

const SkeletonCard = ({ shape = 'square' }) => {
  const currentStyle = skeletonStyles[shape] || skeletonStyles.square;

  return (
    <div className={currentStyle.container}>
      
      {/* GHOST IMAGE */}
      <div className={currentStyle.image} />
      
      {/* GHOST TEXT */}
      <div className={currentStyle.text}>
        {/* Title Line (Thicker, 3/4 width) */}
        <div className="h-3 md:h-4 bg-border/40 rounded-full w-3/4" />
        {/* Artist Line (Thinner, half width) */}
        <div className="h-2 md:h-3 bg-border/20 rounded-full w-1/2" />
      </div>
      
    </div>
  );
};

export default SkeletonCard;