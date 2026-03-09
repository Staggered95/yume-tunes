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
import UserPage from './pages/UserPage';
import LibraryPage from './pages/LibraryPage';
import PlaylistPage from './pages/PlaylistPage';
import LikedSongsPage from './pages/LikedSongsPage';
import AdminPage from './pages/AdminPage';
import BottomPlayer from './components/BottomPlayer'
import FullscreenPlayer from './components/FullscreenPlayer';
import { useSongs } from './context/SongContext';
import AuthModal from './components/AuthModal';
import MobileNav from './components/MobileNav';

const App = () => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const {currentSong} = useSongs();

  return (
    <>
      <div className='relative min-h-screen pt-16 bg-background-primary text-text-primary'>
        <Navbar/>
        
        {/* Sidebar sits outside the main content container */}
        <Sidebar/>
        
        {/* Main Content Area */}
        {/* md:ml-20 prevents content from hiding behind the collapsed desktop sidebar */}
        {/* pb-32 ensures content doesn't get hidden behind the BottomPlayer/MobileNav */}
        <main className=' md:px-8 md:ml-20  transition-all duration-300'>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/search" element={<SearchResultPage />} />
            <Route path="/artists" element={<ArtistListPage />} />
            <Route path="/genres" element={<GenreListPage />} />
            <Route path="/artist/:artistName" element={<ArtistPage />} />
            <Route path="/genre/:genreName" element={<GenrePage />} />
            <Route path="/animes" element={<AnimeListPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/library" element={<LibraryPage/>} />
            <Route path="/likedsongs" element={<LikedSongsPage/>} />
            <Route path="/admin" element={<AdminPage/>} />
            <Route path="/playlists/:id" element={<PlaylistPage/>} />
            <Route path="/anime/:title" element={<AnimePage />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </main>
        
        <BottomPlayer onExpand={() => setIsPlayerOpen(true)}/>
        <FullscreenPlayer 
          isOpen={isPlayerOpen} 
          onClose={() => setIsPlayerOpen(false)} 
          song={currentSong} 
        />
      </div>
      
      <MobileNav />
      <AuthModal/>
    </>
  );
}

export default App;