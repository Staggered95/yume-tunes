import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 1. Import the Router
import './index.css'
import App from './App.jsx'
import { SongProvider } from './context/SongContext.jsx'
import { PlaybackProvider } from './context/PlaybackContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* 2. Wrap the app */}
      <PlaybackProvider>
        <SongProvider>
          <App />
        </SongProvider>
      </PlaybackProvider>
    </BrowserRouter>
  </StrictMode>,
)