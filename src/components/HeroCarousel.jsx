import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import your fallbacks
import fallbackBanner1 from '../assets/one.png'; 
import fallbackBanner2 from '../assets/two.png'; 
import fallbackBanner3 from '../assets/three.jpg'; 

const fallbackBanners = [
  { id: 'f1', title: "Anime of the Day", subtitle: "Kamisato Ayaka: The Frostflake Heron", image_path: fallbackBanner1 },
  { id: 'f2', title: "Featured Artist", subtitle: "LiSA - Crossing Field (2026 Remaster)", image_path: fallbackBanner2 },
  { id: 'f3', title: "New Season", subtitle: "Winter 2026: Top Openings", image_path: fallbackBanner3 },
];

// Fallback gradients since we didn't add a color column to the DB
const overlayGradients = ["from-blue-900/80", "from-red-900/80", "from-purple-900/80", "from-emerald-900/80"];

export default function HeroCarousel({ dbBanners }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  // If the DB has banners, use them. Otherwise, use your local fallbacks.
  const displayBanners = dbBanners?.length > 0 ? dbBanners : fallbackBanners;

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % displayBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displayBanners.length]);

  return (
    <section className="relative h-64 md:h-90 w-full rounded-2xl overflow-hidden shadow-2xl bg-zinc-900 group">
      {displayBanners.map((b, i) => {
        // Safely determine if the image is a local import or a database path
        const isLocalFallback = b.image_path.includes('static/media') || b.image_path.startsWith('data:');
        const imageUrl = isLocalFallback 
            ? b.image_path 
            : (b.image_path.startsWith('http') ? b.image_path : `http://localhost:5000${b.image_path}`);

        // Assign a gradient based on the index
        const gradientColor = overlayGradients[i % overlayGradients.length];

        return (
          <div
            key={b.id}
            onClick={() => b.target_url && navigate(b.target_url)}
            className={`absolute inset-0 transition-opacity duration-1000 flex items-end p-8 bg-cover bg-center ${i === active ? 'opacity-100' : 'opacity-0'} ${b.target_url ? 'cursor-pointer' : ''}`}
            style={{ backgroundImage: `url(${imageUrl})` }}
          >
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${gradientColor} to-transparent opacity-60`} />
            
            <div className="relative z-10 space-y-2">
              {b.title && (
                <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-md">
                  {b.title}
                </h2>
              )}
              {b.subtitle && (
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] uppercase px-2 py-1 rounded-sm font-bold tracking-widest border border-white/10">
                  {b.subtitle}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Pagination Dots */}
      <div className="absolute bottom-4 right-8 flex gap-2 z-20">
        {displayBanners.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`} 
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}