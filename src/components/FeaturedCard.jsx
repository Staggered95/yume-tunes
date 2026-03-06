import React from 'react';
import { useColor } from 'color-thief-react';
import girl from '../assets/anime-girl.png';

// Added default fallbacks so it doesn't break if props are missing
const FeaturedCard = ({ imageUrl, title = "Trending", tagline = "Explore richness" }) => {
  // This hook gets the dominant color from the imageUrl
  const { data: dominantColor, loading } = useColor(imageUrl, 'hex', { crossOrigin: 'anonymous' });

  // Create a dynamic style for the background gradient overlay
  // Using an opacity hex (e.g., '40' for 25% opacity) to blend it beautifully with your dark theme
  const cardStyle = {
    backgroundImage: loading || !dominantColor
      ? 'none' 
      : `linear-gradient(110deg, ${dominantColor}40 0%, transparent 60%)`
  };

  return (
    <div 
        style={cardStyle} 
        className="group relative flex items-center p-6 sm:p-8 rounded-2xl overflow-hidden h-48 sm:h-60 mx-4 sm:mx-8 lg:mx-16 bg-background-secondary border border-border hover:border-border-hover transition-all duration-300 shadow-xl"
    >
      {/* Text Content */}
      <div className="relative z-10 max-w-[60%] sm:max-w-none">
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight drop-shadow-md">
            {title}
        </h2>
        <p className="text-sm sm:text-lg text-text-secondary mt-1 font-medium">
            {tagline}
        </p>
      </div>
      
      {/* Mascot Image - Made responsive and added a hover pop effect! */}
      <img 
        src={girl} 
        alt="Featured Mascot" 
        className="absolute -right-4 sm:right-0 -bottom-2 sm:bottom-0 w-48 sm:w-64 md:w-72 object-contain z-0 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-translate-x-2" 
      />
    </div>
  );
};

export default FeaturedCard;