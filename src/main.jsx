import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' 
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'
// Contexts
import { SongProvider } from './context/SongContext.jsx'
import { PlaybackProvider } from './context/PlaybackContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { LoadingProvider } from './context/LoadingContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
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
                      <ThemeProvider>
                        <App />
                      </ThemeProvider>
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