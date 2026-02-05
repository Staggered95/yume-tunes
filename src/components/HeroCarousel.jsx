import { useState, useEffect } from 'react';
// Import each banner image so the bundler processes the URL correctly
import banner1 from '../assets/one.png'; 
import banner2 from '../assets/two.png'; // Replace with actual paths later
import banner3 from '../assets/three.jpg'; 

const banners = [
  { id: 1, title: "Anime of the Day", subtitle: "Kamisato Ayaka: The Frostflake Heron", image: banner1, color: "from-blue-900/80" },
  { id: 2, title: "Featured Artist", subtitle: "LiSA - Crossing Field (2026 Remaster)", image: banner2, color: "from-red-900/80" },
  { id: 3, title: "New Season", subtitle: "Winter 2026: Top Openings", image: banner3, color: "from-purple-900/80" },
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-64 md:h-90 w-full rounded-2xl overflow-hidden shadow-2xl bg-zinc-900">
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-1000 flex items-end p-8 bg-cover bg-center ${i === active ? 'opacity-100' : 'opacity-0'}`}
          // FIX: Use the url() template literal and pull the image from the map item
          style={{ backgroundImage: `url(${b.image})` }}
        >
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t ${b.color} to-transparent opacity-60`} />
          
          <div className="relative z-10 space-y-2">
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] uppercase px-2 py-1 rounded-sm font-bold tracking-widest border border-white/10">
              {b.title}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-md">
              {b.subtitle}
            </h2>
          </div>
        </div>
      ))}

      {/* Pagination Dots */}
      <div className="absolute bottom-4 right-8 flex gap-2 z-20">
        {banners.map((_, i) => (
          <div 
            key={i} 
            className={`1.5 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-white' : 'w-2 bg-white/30'}`} 
          />
        ))}
      </div>
    </section>
  );
}