import React from 'react';
import SongCard from './components/SongCard';
import Navbar from './components/Navbar'
import FeaturedCard from './components/FeaturedCard'

function App() {
  return (
    <div>
      <Navbar />
      <FeaturedCard
      imageUrl=""
      title="Test"
      tagline="This is a test"
      ></FeaturedCard>
    </div>
  );
}

export default App;