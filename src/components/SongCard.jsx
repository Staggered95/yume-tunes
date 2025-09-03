// src/components/SongCard.jsx

import React from 'react';

// The component takes 'props' (properties) like title and artist
const SongCard = ({ title, artist, imageUrl }) => {
  return (
    <div className="bg-background-secondary p-4 rounded-lg flex items-center gap-4">
      <img src={imageUrl} alt={title} className="w-16 h-16 rounded-md" />
      <div>
        <h3 className="font-bold text-text">{title}</h3>
        <p className="text-text-secondary">{artist}</p>
      </div>
    </div>
  );
};

export default SongCard;