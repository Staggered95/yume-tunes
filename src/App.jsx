import './App.css';
import { Route, Routes, Outlet } from 'react-router-dom';
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
import Landing from './pages/Landing';
import BottomPlayer from './components/BottomPlayer';
import FullscreenPlayer from './components/FullscreenPlayer';
import { useSongs } from './context/SongContext';
import AuthModal from './components/AuthModal';
import MobileNav from './components/MobileNav';
import GlobalProgressBar from './minicomps/loading/GlobalProgressBar';
import Footer from './components/Footer';
import ScrollToTop from './helpers/ScrollToTop';
import ResetPassword from './pages/ResetPassword';
import ContactPage from './pages/ContactPage';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';


const MainLayout = () => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const { currentSong } = useSongs();

  return (
    <div className='relative min-h-screen pt-16 bg-background-primary text-text-primary'>
      <Navbar />
      <Sidebar />
      
      <main className='md:px-8 md:ml-20 transition-all duration-300 flex flex-col min-h-screen'>
        <ScrollToTop />
        <div className="flex-grow">
          <Outlet /> {/*  This is where HomePage, AnimePage, etc., get rendered! */}
        </div>
        <Footer />
      </main>
      
      <BottomPlayer onExpand={() => setIsPlayerOpen(true)} />
      <FullscreenPlayer 
        isOpen={isPlayerOpen} 
        onClose={() => setIsPlayerOpen(false)} 
        song={currentSong} 
      />
      <MobileNav />
      <AuthModal />
    </div>
  );
};

//  THE MAIN APP ROUTER
const App = () => {
  return (
    <>
      <GlobalProgressBar />
      
      <Routes>
        {/*  ISOLATED ROUTE: No Sidebars, No Players */}
        <Route path="/" element={<Landing />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
        

        {/*  MAIN APP ROUTES: Wrapped inside the MainLayout */}
        <Route element={<MainLayout />}>
        <Route path="/contact" element={<ContactPage />} />
          
          <Route path="/home" element={<HomePage />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/artists" element={<ArtistListPage />} />
          <Route path="/genres" element={<GenreListPage />} />
          <Route path="/artist/:artistName" element={<ArtistPage />} />
          <Route path="/genre/:genreName" element={<GenrePage />} />
          <Route path="/animes" element={<AnimeListPage />} />
          <Route path="/anime/:title" element={<AnimePage />} />

          {/* PROTECTED ROUTES */}
          <Route element={<ProtectedRoute />}>
              <Route path="/user" element={<UserPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/likedsongs" element={<LikedSongsPage />} />
              <Route path="/playlists/:id" element={<PlaylistPage />} />
          </Route>

          {/* ADMIN ROUTES */}
          <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
          </Route>

          {/* 404 CATCH-ALL */}
          <Route path="*" element={<div className="p-8 text-center mt-20 text-2xl font-black italic text-text-muted">404 - Page Not Found</div>} />
        </Route>
      </Routes>
    </>
  );
};

export default App;