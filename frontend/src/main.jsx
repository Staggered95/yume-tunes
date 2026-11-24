import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' 
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'
// Contexts
import { SongProvider } from './context/SongContext.jsx'
import { PlaylistProvider } from './context/PlaylistContext.jsx'
import { PlaybackProvider } from './context/PlaybackContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { LoadingProvider } from './context/LoadingContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
// Helpers
import AxiosInterceptorSetup from './helpers/AxiosInterceptorSetup.jsx'

const updateSW = registerSW({
  onNeedRefresh() {
    console.log("New content available, please refresh.");
  },
  onOfflineReady() {
    console.log("YumeTunes is ready to work offline.");
  },
})

const id = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LoadingProvider>
          <PlaybackProvider>
            <AuthProvider>
              <AxiosInterceptorSetup>
                <ToastProvider>
                  <SongProvider>
                    <UserProvider>
                      <PlaylistProvider>
                        <ThemeProvider>
                          <GoogleOAuthProvider clientId={id}>
                            <App />
                          </GoogleOAuthProvider>
                        </ThemeProvider>
                      </PlaylistProvider>
                    </UserProvider>
                  </SongProvider>
                </ToastProvider>
              </AxiosInterceptorSetup>
            </AuthProvider>
          </PlaybackProvider>
      </LoadingProvider>
    </BrowserRouter>
  </StrictMode>,
)