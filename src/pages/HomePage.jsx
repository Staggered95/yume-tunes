import React, { useState, useEffect } from 'react';
import HeroCarousel from '../components/HeroCarousel';
import TagChips from '../components/TagChips';
import GreetingHeader from '../components/GreetingHeader';
import SectionRow from '../components/SectionRow';
import { useSongs } from '../context/SongContext';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';

function HomePage() {
  // 1. Split our state to match the new endpoints
  const [trending, setTrending] = useState([]);
  const [thisSeason, setThisSeason] = useState([]);
  const [continueListening, setContinueListening] = useState([]);

  // Extract authFetch and token to make secure calls
  const { isLoggedIn, authFetch, token } = useAuth(); 
  const { userProfile } = useUser();

  // 2. PUBLIC DATA FETCH (Runs once on mount)
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const res = await fetch('http://localhost:5000/home/data');
        const json = await res.json();
        
        if (json.success) {
          setTrending(json.data.trending || []);
          setThisSeason(json.data.thisSeason || []);
        }
      } catch (err) {
        console.error("Failed to fetch public home data:", err);
      }
    };

    fetchPublicData();
  }, []);

  // 3. PRIVATE DATA FETCH (Runs only when auth state changes)
  useEffect(() => {
    const fetchPrivateData = async () => {
      if (!isLoggedIn || !token) {
        setContinueListening([]); // Clear it out if they log out
        return;
      }

      try {
        // Using standard fetch with token, or you can use authFetch if it wraps this!
        const res = await fetch('http://localhost:5000/user/continue-listening', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        
        if (json.success) {
          setContinueListening(json.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch continue listening:", err);
      }
    };

    fetchPrivateData();
  }, [isLoggedIn, token]);

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
              {/* Only render Continue Listening if they actually have history! */}
              {continueListening.length > 0 && (
                <SectionRow 
                  title="Continue Listening" 
                  properties="grid md:grid-cols-3 lg:grid-cols-6" 
                  type="square" 
                  items={continueListening} 
                />
              )}
              
              {/* Dynamic Name Injection! */}
              <SectionRow 
                title={`Made for ${userProfile?.[0]?.first_name || 'You'}`} 
                properties="grid md:grid-cols-4 lg:grid-cols-8" 
                type="small_square" 
                items={thisSeason.slice(0, 8)} // Temporary fallback until you build the Made For You logic
              />
            </>
          ) : (
            <SectionRow 
              title="Latest Releases" 
              properties="grid md:grid-cols-4 lg:grid-cols-8" 
              type="small_square" 
              items={thisSeason.slice(0, 8)} // Temporary fallback
            />
          )}
          
          <SectionRow 
            title="Trending Now" 
            properties="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5" 
            type="wide" 
            items={trending}
          />
          
          <SectionRow 
            title="Songs This Season" 
            properties="flex scrollbar-none" 
            type="small_square" 
            items={thisSeason}
          />
          
        </div>
      </div>
    </div>
  );
}

export default HomePage;