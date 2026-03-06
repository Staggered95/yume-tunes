import React, { useState, useEffect } from 'react';
import api from '../api/axios';
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
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [banners, setBanners] = useState([]);

  // Extract authFetch and token to make secure calls
  const { isLoggedIn, authFetch, token } = useAuth(); 
  const { userProfile } = useUser();

  // 2. PUBLIC DATA FETCH (Runs once on mount)
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const { data } = await api.get('/home/data');
        
        if (data.success) {
          setTrending(data.data.trending || []);
          setThisSeason(data.data.thisSeason || []);
          setQuotes(data.data.quotes || []);
          setBanners(data.data.banners || []);
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
      // Clear out private data immediately if they log out
      if (!isLoggedIn || !token) {
        setContinueListening([]); 
        setRecommendedSongs([]);
        return;
      }

      try {
        const { data } = await api.get('/user/home-data');
        
        if (data.success) {
          // Destructure and assign both arrays at the exact same time!
          setContinueListening(data.data.continueListening || []);
          setRecommendedSongs(data.data.recommended || []);
        }
      } catch (err) {
        console.error("Failed to fetch private home data:", err);
      }
    };

    fetchPrivateData();
  }, [isLoggedIn, token]);

  return (
    <div className="flex flex-col gap-8 pb-32 animate-fade-in">
      {/* 1. Hero Section */}
      <HeroCarousel dbBanners={banners} />
      
      <div className='flex flex-col mx-8 gap-20'>
        {/* 2. Chip Tags */}
        <TagChips />

        {/* 3. Greeting & Quotes */}
        <GreetingHeader isLoggedIn={isLoggedIn} dbQuotes={quotes} />

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
                items={recommendedSongs.slice(0, 8)} // Temporary fallback until you build the Made For You logic
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
            title="Discover Random" 
            properties="flex" 
            type="small_square" 
            items={thisSeason}
          />
          
        </div>
      </div>
    </div>
  );
}

export default HomePage;