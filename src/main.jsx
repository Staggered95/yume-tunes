import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' 
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
import AxiosInterceptorSetup from './helpers/AxiosInterceptorSetup.jsx' // <-- Adjust this path to your helper directory!

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LoadingProvider>
        {/* The Interceptor Bridge wraps everything else so it can access the LoadingContext */}
        <AxiosInterceptorSetup>
          <PlaybackProvider>
            <AuthProvider>
              <ToastProvider>
                <SongProvider>
                  <UserProvider>
                    <ThemeProvider>
                        <App />
                    </ThemeProvider>
                  </UserProvider>
                </SongProvider>
              </ToastProvider>
            </AuthProvider>
          </PlaybackProvider>
        </AxiosInterceptorSetup>
      </LoadingProvider>
    </BrowserRouter>
  </StrictMode>,
)