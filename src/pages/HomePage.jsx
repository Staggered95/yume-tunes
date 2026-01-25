import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import BottomPlayer from '../components/BottomPlayer'
import InfoBox from '../components/InfoBox'
import FeaturedCard from '../components/FeaturedCard';


function HomePage() {
  // This is the single source of truth for the sidebar's state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // This function will be passed to any button that needs to toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className=''>
      <Sidebar isExpanded={isSidebarOpen} />
      <Navbar toggleSidebar={toggleSidebar} />
      <FeaturedCard />
      <BottomPlayer/>
      
    </div>
  );
}

export default HomePage;