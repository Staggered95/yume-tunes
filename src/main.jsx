import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 1. Import the Router
import './index.css'
import App from './App.jsx'
import { SongProvider } from './context/SongContext.jsx'
import { PlaybackProvider } from './context/PlaybackContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* 2. Wrap the app */}
      <PlaybackProvider>
        <AuthProvider>
          <ToastProvider>
            <SongProvider>
              <UserProvider>
                <App />
              </UserProvider>
            </SongProvider>
          </ToastProvider>
        </AuthProvider>
      </PlaybackProvider>
    </BrowserRouter>
  </StrictMode>,
)