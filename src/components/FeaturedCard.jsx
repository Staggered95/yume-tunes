// src/components/FeaturedCard.jsx
import React from 'react';
import { useColor } from 'color-thief-react';

const FeaturedCard = ({ imageUrl, title, tagline }) => {
  // This hook gets the dominant color from the imageUrl
  const { data: dominantColor, loading, error } = useColor(imageUrl, 'hex', { crossOrigin: 'anonymous' });

  // Create a dynamic style for the background gradient
  const cardStyle = {
    background: loading 
      ? '#1a1a2e' // A default background while the color is loading
      : `linear-gradient(110deg, ${dominantColor} 0%, rgba(18, 18, 28, 0.5) 60%)`
  };

  return (
    <div style={cardStyle} className="relative flex items-center p-8 rounded-lg overflow-hidden h-48">
      <div className="z-10">
        <h2 className="text-4xl font-bold text-text-primary">{title}</h2>
        <p className="text-lg text-text-secondary mt-1">{tagline}</p>
      </div>
      <img 
        src={imageUrl} 
        alt={title} 
        className="absolute right-0 bottom-0 w-48 h-48 object-cover z-0" 
      />
    </div>
  );
};

export default FeaturedCard;
