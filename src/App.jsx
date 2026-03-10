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
import GlobalProgressBar from './minicomps/loading/GlobalProgressBar';
import Footer from './components/Footer';

// IMPORT THE GUARDS
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

const App = () => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const {currentSong} = useSongs();

  return (
    <>
      <div className='relative min-h-screen pt-16 bg-background-primary text-text-primary'>
        <GlobalProgressBar />
        <Navbar/>
        <Sidebar/>
        
        <main className='md:px-8 md:ml-20 transition-all duration-300'>
          <Routes>
            {/* PUBLIC ROUTES (Anyone can see these) */}
            <Route path="/" element={<HomePage/>} />
            <Route path="/search" element={<SearchResultPage />} />
            <Route path="/artists" element={<ArtistListPage />} />
            <Route path="/genres" element={<GenreListPage />} />
            <Route path="/artist/:artistName" element={<ArtistPage />} />
            <Route path="/genre/:genreName" element={<GenrePage />} />
            <Route path="/animes" element={<AnimeListPage />} />
            <Route path="/anime/:title" element={<AnimePage />} />

            {/* PROTECTED ROUTES (Must be logged in) */}
            <Route element={<ProtectedRoute />}>
                <Route path="/user" element={<UserPage />} />
                <Route path="/library" element={<LibraryPage/>} />
                <Route path="/likedsongs" element={<LikedSongsPage/>} />
                <Route path="/playlists/:id" element={<PlaylistPage/>} />
            </Route>

            {/* ADMIN ROUTES (Must be an admin) */}
            <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPage/>} />
            </Route>

            {/* 404 CATCH-ALL */}
            <Route path="*" element={<div className="p-8 text-center mt-20 text-2xl font-black italic text-text-muted">404 - Page Not Found</div>} />
          </Routes>
          <Footer/>
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