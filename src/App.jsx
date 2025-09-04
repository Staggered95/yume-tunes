import React from 'react';
import SongCard from './components/SongCard';
import Navbar from './components/Navbar';
import FeaturedCard from './components/FeaturedCard';
import BottomPlayer from './components/BottomPlayer';


function App() {
  return (
    <div>
      <Navbar />
      <FeaturedCard
      imageUrl=""
      title="Test"
      tagline="This is a test"
      ></FeaturedCard>
      <BottomPlayer/>
    </div>
  );
}

export default App;