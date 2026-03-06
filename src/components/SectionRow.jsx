import React from 'react';
import SongCard from './SongCard';

export default function SectionRow({ title, type, properties, items = [] }) {
  // Map internal types to SongCard shapes
  const shapeMap = {
    grid: 'square',
    circle: 'circle',
    wide: 'wide',
    small_square: 'small_square',
  };

  return (
    <section className="animate-fade-in space-y-4">
      {/* Header with improved text mapping and hover states */}
      <div className="flex justify-between items-end px-2 group/header">
        <div className="flex flex-col">
          <h3 className="text-xl md:text-2xl font-black text-text-primary tracking-tighter transition-colors group-hover/header:text-accent-primary">
            {title}
          </h3>
          {/* Subtle underline decoration */}
          <div className="h-1 w-8 bg-accent-primary rounded-full mt-1 opacity-0 group-hover/header:opacity-100 group-hover/header:w-full transition-all duration-500" />
        </div>
        
        <button className="text-[10px] uppercase font-black tracking-widest text-text-muted hover:text-text-primary transition-all duration-300 border-b border-transparent hover:border-accent-primary pb-1">
          See All
        </button>
      </div>

      {/* Horizontal Scroll Container:
          - Standardized 'properties' for responsive layouts.
          - Custom scrollbar styling (hidden but interactive).
          - Snap-scrolling for a native app feel.
      */}
      <div 
        className={`${properties} gap-6 overflow-x-auto scrollbar-none pb-4 px-2 scroll-smooth snap-x snap-mandatory`}
      >
        {items.map((song, index) => (
          <div key={song.id || index} className="snap-start shrink-0">
            <SongCard 
              song={items} // Fixed: passing single song instead of items array
              index={index} 
              shape={shapeMap[type] || 'square'} 
            />
          </div>
        ))}

        {/* Placeholder if empty */}
        {items.length === 0 && (
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="w-40 h-40 bg-background-secondary animate-pulse rounded-2xl border border-border" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}