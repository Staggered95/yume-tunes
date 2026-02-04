import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';

const App = () => {


  return (
    <>
      <div className='relative'>
        <Navbar/>
        <HomePage/>
        
        <Sidebar/>
      </div>
    </>
  );
}

export default App;