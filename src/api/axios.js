// src/api/axios.js
import axios from 'axios';

const currentHost = window.location.hostname;
const dynamicApiUrl = `http://${currentHost}:5000/`;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || dynamicApiUrl,
  // 1. CRITICAL: This tells Axios to ALWAYS send your HTTP-Only cookies 
  // (like the refresh token) to the backend.
  withCredentials: true 
});

// REQUEST INTERCEPTOR: Auto-attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});



// RESPONSE INTERCEPTOR: The Silent Retry Magic
api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    // If the backend says "Dead Token" (401) AND we haven't tried refreshing yet...
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Lock the door so we don't infinitely loop!

      try {
        // 2. THE SENIOR TRICK: We use the raw 'axios' instance here, NOT 'api'.
        // If we used 'api.get', and the refresh failed, it would trigger this 
        // interceptor again and crash your browser with an infinite loop.
        const { data } = await axios.get(`${api.defaults.baseURL}refresh`, {
            withCredentials: true 
        });
        
        const newAccessToken = data.token;
        
        // Save the shiny new VIP pass
        localStorage.setItem('token', newAccessToken);

        // Update the failed original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Replay the paused request! The user never notices a thing.
        return api(originalRequest);
        
      } catch (refreshError) {
        // 3. THE HARD KILL: The Refresh Token is ALSO dead. 
        // Now it is finally time to kick them out.
        console.warn("Refresh token expired. Hard logout required.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Dispatch an event so React/AuthContext knows to update its state
        window.dispatchEvent(new Event('auth-logout')); 
        
        window.location.href = '/'; 
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;