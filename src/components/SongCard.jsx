// src/components/SongCard.jsx
import React from 'react';
import f2 from '../assets/f2.png';
import { useSongs } from '../context/SongContext';

// The component takes 'props' (properties) like title and artist
const SongCard = ({ song }) => {
  const {selectSong} = useSongs();
  const handleClick = () => {
    selectSong(song);
    //console.log(song.file_path);
  }

  return (
    <div onClick={handleClick} className="w-42 p-1 bg-background-secondary rounded-lg flex flex-col items-center">
      <img src={song.cover_path} alt={song.title} className="h-40 rounded-lg object-cover" />
      <div className='flex flex-col justify-center items-center'>
        <h3 className="font-bold text-text">{song.title}</h3>
        <p className="text-text-secondary text-sm">{song.artist}</p>
      </div>
    </div>
  );
};

export default SongCard;