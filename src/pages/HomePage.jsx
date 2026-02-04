import React, { useState, useEffect } from 'react';
import HeroCarousel from '../components/HeroCarousel';
import TagChips from '../components/TagChips';
import GreetingHeader from '../components/GreetingHeader';
import SectionRow from '../components/SectionRow';

function HomePage() {
  // Dummy State for now
  const [isLoggedIn, setIsLoggedIn] = useState(true); 

  return (
    <div className="flex flex-col gap-8 pb-32 animate-fade-in ml-16">
      {/* 1. Hero Section */}
      <HeroCarousel />

      {/* 2. Chip Tags */}
      <TagChips />

      {/* 3. Greeting & Quotes */}
      <GreetingHeader isLoggedIn={isLoggedIn} />

      {/* 4. Launchpad Sections */}
      <div className="space-y-12">
        {isLoggedIn ? (
          <>
            <SectionRow title="Continue Listening" type="wide" />
            <SectionRow title="Jump Back In" type="circle" />
            <SectionRow title="Made for Shubham" type="grid" />
          </>
        ) : (
          <SectionRow title="Latest Releases" type="grid" />
        )}
        
        <SectionRow title="Trending Now" type="grid" />
        <SectionRow title="Songs This Season" type="grid" />
      </div>
    </div>
  );
}

export default HomePage;