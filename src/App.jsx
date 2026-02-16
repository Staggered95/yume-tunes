import './App.css'
import { Route, Routes } from 'react-router-dom'
import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import SearchResultPage from './pages/SearchResultPage';
import GenrePage from './pages/GenrePage';
import ArtistPage from './pages/ArtistPage';
import BottomPlayer from './components/BottomPlayer'
import FullscreenPlayer from './components/FullscreenPlayer';
import { useSongs } from './context/SongContext';


const App = () => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const {currentSong} = useSongs();

  return (
    <>
      <div className='relative'>
        <Navbar/>
        <div className='pl-16 pr-2'>
        <main>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/search" element={<SearchResultPage />} />
            <Route path="/artist/:id" element={<ArtistPage />} />
            <Route path="/genre/:genreName" element={<GenrePage />} />
            {/* Add a 404 Page if you want */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </main>
        <Sidebar/>
        <FullscreenPlayer />
        <BottomPlayer onExpand={() => setIsPlayerOpen(true)}/>
        
        </div>
        <FullscreenPlayer 
        isOpen={isPlayerOpen} 
        onClose={() => setIsPlayerOpen(false)} 
        song={currentSong} 
      />
      </div>
    </>
  );
}

export default App;