import './App.css'
import { Route, Routes } from 'react-router-dom'
import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import SearchResultPage from './pages/SearchResultPage';
import GenreListPage from './pages/GenreListPage';
import GenrePage from './pages/GenrePage';
import AnimeListPage from './pages/AnimeListPage';
import AnimePage from './pages/AnimePage';
import ArtistListPage from './pages/ArtistListPage';
import ArtistPage from './pages/ArtistPage';
import BottomPlayer from './components/BottomPlayer'
import FullscreenPlayer from './components/FullscreenPlayer';
import { useSongs } from './context/SongContext';
import AuthModal from './components/AuthModal';


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
            <Route path="/artists" element={<ArtistListPage />} />
            <Route path="/genres" element={<GenreListPage />} />
            <Route path="/artist/:artistName" element={<ArtistPage />} />
            <Route path="/genre/:genreName" element={<GenrePage />} />
            <Route path="/animes" element={<AnimeListPage />} />
            
            {/* 2. The Dynamic Detail Page */}
            {/* The :title acts as a placeholder for whatever anime name you click */}
            <Route path="/anime/:title" element={<AnimePage />} />
            {/* Add a 404 Page if you want */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </main>
        <Sidebar/>
        
        </div>
          <BottomPlayer onExpand={() => setIsPlayerOpen(true)}/>
          <FullscreenPlayer 
            isOpen={isPlayerOpen} 
            onClose={() => setIsPlayerOpen(false)} 
            song={currentSong} 
          />
      </div>
      <AuthModal/>
    </>
  );
}

export default App;