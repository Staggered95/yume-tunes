import React, { useState, useEffect } from 'react';
import HeroCarousel from '../components/HeroCarousel';
import TagChips from '../components/TagChips';
import GreetingHeader from '../components/GreetingHeader';
import SectionRow from '../components/SectionRow';
import { useSongs } from '../context/SongContext';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  // Dummy State for now
  const { isLoggedIn } = useAuth(); 
  const {songs} = useSongs();

  return (
    <div className="flex flex-col gap-8 pb-32 animate-fade-in">
      {/* 1. Hero Section */}
      <HeroCarousel />
      <div className='flex flex-col mx-8 gap-20'>
      {/* 2. Chip Tags */}
      <TagChips />

      {/* 3. Greeting & Quotes */}
      <GreetingHeader isLoggedIn={isLoggedIn} />

      {/* 4. Launchpad Sections */}
      <div className="space-y-12">
        {isLoggedIn ? (
          <>
            <SectionRow title="Continue Listening" properties="grid md:grid-cols-3 lg:grid-cols-6" type="square" items={songs.slice(1, 6)} />
            {/*<SectionRow title="Jump Back In" type="circle" items={songs.slice(1, 12)}/>*/}
            <SectionRow title="Made for Shubham" properties="grid md:grid-cols-4 lg:grid-cols-8" type="small_square" items={songs.slice(1, 12)}/>
          </>
        ) : (
          <SectionRow title="Latest Releases" properties="grid md:grid-cols-4 lg:grid-cols-8" type="small_square" items={songs.slice(1, 12)}/>
        )}
        
        <SectionRow title="Trending Now" properties="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5" type="wide" items={songs.slice(1, 12)}/>
        <SectionRow title="Songs This Season" properties="flex scrollbar-none" type="small_square" items={songs.slice(1, 12)}/>
      </div>
    </div>
    </div>
  );
}

export default HomePage;