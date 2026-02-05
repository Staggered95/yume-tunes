import './App.css'
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import BottomPlayer from './components/BottomPlayer'

const App = () => {


  return (
    <>
      <div className='relative'>
        <Navbar/>
        <HomePage/>
        <Sidebar/>
        <BottomPlayer/>
      </div>
    </>
  );
}

export default App;