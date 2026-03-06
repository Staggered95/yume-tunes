import React from 'react';
import SongCard from './SongCard';

export default function SectionRow({ title, type = 'square', items = [] }) {
  
  // Both 'wide' and 'list' shapes look best stacked in a 3-row grid. 
  // Everything else (square, circle, trending) looks best in a single infinite row.
  const isStackedLayout = type === 'wide' || type === 'list';

  return (
    <section className="mb-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-end px-4 mb-4 group">
        <h2 className="text-xl md:text-2xl font-black text-text-primary tracking-tight group-hover:text-accent-primary transition-colors">
          {title}
        </h2>
        
        {/* Only show 'See All' if there are actually items */}
        {items.length > 0 && (
          <button className="text-[10px] md:text-xs uppercase font-black tracking-widest text-text-muted hover:text-text-primary transition-colors">
            See All
          </button>
        )}
      </div>

      {/* Scrollable Container */}
      <div 
        className={`
          ${isStackedLayout 
            // STACKED GRID: 3 rows high. 
            // We use auto-cols-[280px] because our 'wide' card in SongCard is exactly 280px!
            ? "grid grid-rows-3 grid-flow-col auto-cols-[280px] gap-x-4 gap-y-2" 
            
            // SINGLE ROW: Standard flexbox.
            : "flex flex-row gap-4 md:gap-6"
          }
          overflow-x-auto scrollbar-none pb-4 px-4 scroll-smooth snap-x snap-mandatory
        `}      
      >
        {/* The Cards */}
        {items.map((song, index) => (
          <div key={song.id || index} className="snap-start h-full">
            <SongCard 
              song={song}       // Just pass the individual song
              queue={items}     // Pass the whole row as the queue
              index={index} 
              shape={type}      // 'type' maps perfectly to the SongCard shapes!
            />
          </div>
        ))}

        {/* Loading Skeletons */}
        {items.length === 0 && (
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="w-32 h-32 md:w-48 md:h-48 bg-background-secondary/40 animate-pulse rounded-xl border border-border" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}