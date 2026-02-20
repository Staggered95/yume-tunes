const AnimeCollage = ({ covers }) => {
  const count = covers?.length || 0;

  // If we have 4 or more, show the grid. Otherwise, just show the first one.
  const showGrid = count >= 4;

  return (
    <div className="aspect-square bg-white/5 overflow-hidden relative group">
      {showGrid ? (
        // 4-GRID LAYOUT
        <div className="grid grid-cols-2 grid-rows-2 h-full w-full gap-[1px]">
          {covers.slice(0, 4).map((path, idx) => (
            <img
              key={idx}
              src={`http://localhost:5000${path}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt=""
            />
          ))}
        </div>
      ) : (
        // SINGLE IMAGE LAYOUT (for 1, 2, or 3 songs)
        <img
          src={count > 0 ? `http://localhost:5000${covers[0]}` : '/placeholder-anime.png'}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt=""
        />
      )}

      {/* Subtle Overlay to make text readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
    </div>
  );
};

export default AnimeCollage;