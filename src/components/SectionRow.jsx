import SongCard from './SongCard';

export default function SectionRow({ title, type, properties, items = [] }) {
  // Use 'type' as the 'shape' for the SongCard
  const shapeMap = {
    grid: 'square',
    circle: 'circle',
    wide: 'wide',
    small_square: 'small_square',
  };

  return (
    <section className="animate-fade-in-up">
      <div className="flex justify-between items-end mb-4 px-2">
        <h3 className="text-2xl font-bold text-text-primary tracking-tight">{title}</h3>
        <button className="text-[10px] uppercase font-bold tracking-widest text-text-muted hover:text-white transition-colors">
          See All
        </button>
      </div>

      <div className={`${properties} gap-6 overflow-x-auto scrollbar-none pb-4 px-2`}>
        {items.map((song) => (
          <SongCard 
            key={song.id} 
            song={song} 
            shape={shapeMap[type] || 'square'} 
          />
        ))}
      </div>
    </section>
  );
}