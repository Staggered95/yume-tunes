import './App.css'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import SearchResultPage from './pages/SearchResultPage';
import ArtistPage from './pages/ArtistPage';
import BottomPlayer from './components/BottomPlayer'


const App = () => {


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
            {/* Add a 404 Page if you want */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </main>
        <Sidebar/>
        <BottomPlayer/>
        </div>
      </div>
    </>
  );
}

export default App;