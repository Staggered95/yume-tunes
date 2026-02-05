const tags = [{ tag: "Slow", 
                className: "px-5 py-1.5 rounded-full border border-white/10 bg-accent-active/10 text-sm font-medium hover:bg-accent-hover hover:border-white/20 transition-all whitespace-nowrap",
                },
              {  tag: "Soft", 
                className: "px-5 py-1.5 rounded-full border border-white/10 bg-accent-active/14 text-sm font-medium hover:bg-accent-hover hover:border-white/20 transition-all whitespace-nowrap",
                },
              {  tag: "Instrumental", 
                className: "px-5 py-1.5 rounded-full border border-white/10 bg-accent-active/18 text-sm font-medium hover:bg-accent-hover hover:border-white/20 transition-all whitespace-nowrap",
                },
              {  tag: "Lofi", 
                className: "px-5 py-1.5 rounded-full border border-white/10 bg-accent-active/22 text-sm font-medium hover:bg-accent-hover hover:border-white/20 transition-all whitespace-nowrap",
                },
              {  tag: "Vocals", 
                className: "px-5 py-1.5 rounded-full border border-white/10 bg-accent-active/26 text-sm font-medium hover:bg-accent-hover hover:border-white/20 transition-all whitespace-nowrap",
                },
              {  tag: "J-Pop", 
                className: "px-5 py-1.5 rounded-full border border-white/10 bg-accent-active/30 text-sm font-medium hover:bg-accent-hover hover:border-white/20 transition-all whitespace-nowrap",
                },
              {  tag: "Sad", 
                className: "px-5 py-1.5 rounded-full border border-white/10 bg-accent-active/34 text-sm font-medium hover:bg-accent-hover hover:border-white/20 transition-all whitespace-nowrap",
                },
              {  tag: "Banger", 
                className: "px-5 py-1.5 rounded-full border border-white/10 bg-accent-active/40 text-sm font-medium hover:bg-accent-hover hover:border-white/20 transition-all whitespace-nowrap",
                },
              {  tag: "Naruto", 
                className: "px-5 py-1.5 rounded-full border border-white/10 bg-accent-active/44 text-sm font-medium hover:bg-accent-hover hover:border-white/20 transition-all whitespace-nowrap",
                }];



export default function TagChips() {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-none py-2">
      {tags.map((t) => (
        <button 
          key={t.id}
          className={t.className}
        >
          {t.tag}
        </button>
      ))}
      <button className="px-5 py-1.5 text-sm font-bold text-accent-active hover:underline whitespace-nowrap">
        Show all
      </button>
    </div>
  );
}