const tags = ["Slow", "Naruto", "Soft", "Banger", "Instrumental", "Lofi", "Vocals", "J-Pop", "Sad"];

export default function TagChips() {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
      {tags.map((tag) => (
        <button 
          key={tag}
          className="px-5 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all whitespace-nowrap"
        >
          {tag}
        </button>
      ))}
      <button className="px-5 py-1.5 text-sm font-bold text-accent-active hover:underline whitespace-nowrap">
        Show all
      </button>
    </div>
  );
}