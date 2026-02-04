export default function SectionRow({ title, type }) {
  // Dummy items for UI placeholder
  const items = [1, 2, 3, 4, 5, 6];

  return (
    <section>
      <div className="flex justify-between items-end mb-4 px-2">
        <h3 className="text-xl font-bold text-text-primary">{title}</h3>
        <button className="text-xs uppercase font-bold tracking-widest text-text-muted hover:text-white">See More</button>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
        {items.map((i) => (
          <div key={i} className="flex-shrink-0 group cursor-pointer">
            {type === 'circle' ? (
              <div className="w-32 h-32 rounded-full bg-zinc-800 border border-white/5 group-hover:border-accent-active transition-all" />
            ) : type === 'wide' ? (
              <div className="w-64 h-32 rounded-xl bg-zinc-800 border border-white/5 group-hover:scale-[1.02] transition-all" />
            ) : (
              <div className="w-40 h-40 rounded-lg bg-zinc-800 border border-white/5 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all" />
            )}
            <div className="mt-2 text-sm font-semibold truncate w-32">Example Item {i}</div>
            <div className="text-[10px] text-text-secondary uppercase">Description</div>
          </div>
        ))}
      </div>
    </section>
  );
}