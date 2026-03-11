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
  const [trending, setTrending] = useState([]);
  const [thisSeason, setThisSeason] = useState([]);
  const [latestRelease, setLatestRelease] = useState([]);
  const [continueListening, setContinueListening] = useState([]);
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [banners, setBanners] = useState([]);

  // NEW: Dedicated Loading States
  const [isPublicLoading, setIsPublicLoading] = useState(true);
  const [isPrivateLoading, setIsPrivateLoading] = useState(true);

  const { isLoggedIn, token } = useAuth(); 
  const { userProfile } = useUser();

  // PUBLIC DATA FETCH
  useEffect(() => {
    const fetchPublicData = async () => {
      setIsPublicLoading(true);
      try {
        const { data } = await api.get('/home/data');
        if (data.success) {
          setTrending(data.data.trending || []);
          setThisSeason(data.data.thisSeason || []);
          setLatestRelease(data.data.latest || []);
          setQuotes(data.data.quotes || []);
          setBanners(data.data.banners || []);
        }
      } catch (err) {
        console.error("Failed to fetch public home data:", err);
      } finally {
        setIsPublicLoading(false); // Stop skeletons
      }
    };
    fetchPublicData();
  }, []);

  // PRIVATE DATA FETCH 
  useEffect(() => {
    const fetchPrivateData = async () => {
      if (!isLoggedIn || !token) {
        setContinueListening([]); 
        setRecommendedSongs([]);
        setIsPrivateLoading(false);
        return;
      }

      setIsPrivateLoading(true);
      try {
        const { data } = await api.get('/user/home-data');
        if (data.success) {
          setContinueListening(data.data.continueListening || []);
          setRecommendedSongs(data.data.recommended || []);
        }
      } catch (err) {
        console.error("Failed to fetch private home data:", err);
      } finally {
        setIsPrivateLoading(false); // Stop skeletons
      }
    };
    fetchPrivateData();
  }, [isLoggedIn, token]);

  return (
    <div className="flex flex-col gap-8 pb-32 animate-fade-in">
      <HeroCarousel dbBanners={banners} />
      
      <div className='flex flex-col mx-8 gap-12'>
        <TagChips />
        <GreetingHeader isLoggedIn={isLoggedIn} dbQuotes={quotes} />

        <div className="space-y-12">
          
          {isLoggedIn ? (
            <>
              {/* No need to check continueListening.length > 0 anymore, 
                  because SectionRow hides itself if items are empty! */}
              <SectionRow 
                title="Continue Listening" 
                type="square" 
                items={continueListening} 
                isLoading={isPrivateLoading}
              />
              
              <SectionRow 
                title={`Made for ${userProfile?.[0]?.first_name || 'You'}`} 
                type="small_square" 
                items={recommendedSongs} 
                isLoading={isPrivateLoading}
              />
            </>
          ) : (
            <SectionRow 
              title="Recently Added" 
              type="small_square" 
              items={latestRelease} 
              isLoading={isPublicLoading}
            />
          )}
          
          <SectionRow 
            title="Trending Now" 
            type="wide" 
            items={trending}
            isLoading={isPublicLoading}
          />
          
          <SectionRow 
            title="Discover Random" 
            type="small_square" 
            items={thisSeason}
            isLoading={isPublicLoading}
          />
          
        </div>
      </div>
    </div>
  );
}

export default HomePage;