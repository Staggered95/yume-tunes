import React from 'react';
import SongCard from './SongCard';
import SkeletonCard from './loading/SkeletonCard'; // <-- Import the Master Skeleton!

export default function SectionRow({ title, type = 'square', items = [], isLoading = false }) {
  
  const isStackedLayout = type === 'wide' || type === 'list';

  // If it's not loading and there are no items, completely hide the row!
  if (!isLoading && items.length === 0) return null;

  return (
    <section className="mb-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-end px-4 mb-4 group">
        <h2 className="text-xl md:text-2xl font-black text-text-primary tracking-tight group-hover:text-accent-primary transition-colors">
          {title}
        </h2>
        
        {items.length > 0 && !isLoading && (
          <button className="text-[10px] md:text-xs uppercase font-black tracking-widest text-text-muted hover:text-text-primary transition-colors">
            See All
          </button>
        )}
      </div>

      {/* Scrollable Container */}
      <div 
        className={`
          ${isStackedLayout 
            ? "grid grid-rows-3 grid-flow-col auto-cols-[280px] gap-x-4 gap-y-2" 
            : "flex flex-row gap-4 md:gap-6"
          }
          overflow-x-auto scrollbar-none pb-4 px-4 scroll-smooth snap-x snap-mandatory
        `}      
      >
        {isLoading ? (
          /* SHOW SKELETONS */
          /* If it's a stacked grid, render 9 ghosts. If single row, render 6 ghosts. */
          [...Array(isStackedLayout ? 9 : 6)].map((_, i) => (
             <div key={`skeleton-${i}`} className="snap-start h-full">
                <SkeletonCard shape={type} />
             </div>
          ))
        ) : (
          /* SHOW REAL CARDS */
          items.map((song, index) => (
            <div key={song.id || index} className="snap-start h-full">
              <SongCard 
                song={song}       
                queue={items}     
                index={index} 
                shape={type}      
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}