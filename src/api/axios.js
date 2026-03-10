// src/api/axios.js
import axios from 'axios';

const currentHost = window.location.hostname;
const dynamicApiUrl = `http://${currentHost}:5000/`;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || dynamicApiUrl,
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

    // If we get a 401 (Expired Token) and we haven't retried yet...
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 

      try {
        // Attempt the silent refresh
        const { data } = await axios.get(`${api.defaults.baseURL}auth/refresh`, {
            withCredentials: true 
        });
        
        const newAccessToken = data.token;
        
        // Save the new token
        localStorage.setItem('token', newAccessToken);
        
        // Update the failed request and try again
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // The Refresh Token is dead. Hard Kill.
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-logout')); 
        window.location.href = '/'; 
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;