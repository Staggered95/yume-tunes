import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMediaUrl } from '../utils/media';

const overlayGradients = [
    "from-accent-primary/80", 
    "from-accent-secondary/80", 
    "from-background-active/90", 
    "from-accent-tertiary/80"
];

export default function HeroCarousel({ dbBanners }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  // --- SWIPE STATE ---
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const minSwipeDistance = 50; 
  
  const displayBanners = dbBanners || [];

  // --- NAVIGATION HELPERS ---
  const nextSlide = () => setActive((prev) => (prev + 1) % displayBanners.length);
  const prevSlide = () => setActive((prev) => (prev === 0 ? displayBanners.length - 1 : prev - 1));

  // --- TOUCH HANDLERS ---
  const handleTouchStart = (e) => {
    setTouchEndX(null); 
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    if (distance > minSwipeDistance) nextSlide();
    if (distance < -minSwipeDistance) prevSlide();
  };

  // --- AUTOPLAY ---
  useEffect(() => {
    if (displayBanners.length === 0) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [displayBanners.length, active]);

  // --- LOADING / SKELETON STATE ---
  if (displayBanners.length === 0) {
      return (
          <section className="relative h-64 md:h-96 lg:h-120 w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-background-secondary to-background-active animate-pulse" />
      );
  }

  return (
    <section 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative h-64 md:h-96 lg:h-120 w-full rounded-2xl overflow-hidden shadow-2xl bg-background-primary group animate-fade-in touch-pan-y"
    >
      {displayBanners.map((b, i) => {
        const imageUrl = getMediaUrl(b.image_path);
        const gradientColor = overlayGradients[i % overlayGradients.length];

        return (
          <div
            key={b.id}
            onClick={() => b.target_url && navigate(b.target_url)}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-end p-6 sm:p-8 bg-cover bg-center ${i === active ? 'opacity-100 z-10' : 'opacity-0 z-0'} ${b.target_url ? 'cursor-pointer' : ''}`}
            style={{ backgroundImage: `url(${imageUrl})` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-t ${gradientColor} to-transparent opacity-70`} />
            
            <div className="relative z-20 flex flex-col items-start gap-3 w-full max-w-4xl">
              {b.title && (
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary drop-shadow-lg leading-tight transition-transform duration-500 hover:scale-[1.01]">
                  {b.title}
                </h2>
              )}
              {b.subtitle && (
                <span className="inline-block bg-background-secondary/50 backdrop-blur-md text-text-primary text-[10px] sm:text-xs uppercase px-3 py-1.5 rounded-md font-bold tracking-widest border border-border shadow-lg">
                  {b.subtitle}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Pagination Dots */}
      <div className="absolute bottom-4 right-6 sm:right-8 flex gap-2 z-30">
        {displayBanners.map((_, i) => (
          <button 
            key={i} 
            onClick={(e) => { e.stopPropagation(); setActive(i); }}
            className={`h-1.5 rounded-full transition-all duration-300 ease-in-out ${
                i === active 
                    ? 'w-6 sm:w-8 bg-accent-primary shadow-[0_0_10px_rgba(157,92,250,0.5)]' 
                    : 'w-2 bg-text-muted hover:bg-text-secondary'
            }`} 
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}