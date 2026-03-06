// src/api/axios.js
import axios from 'axios';

const currentHost = window.location.hostname;
const dynamicApiUrl = `http://${currentHost}:5000/`;

const api = axios.create({
  // Automatically prepends this to all requests (e.g., api.get('/songs'))
  baseURL: import.meta.env.VITE_API_BASE_URL || dynamicApiUrl,
});

// 1. REQUEST INTERCEPTOR: Auto-attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 2. RESPONSE INTERCEPTOR: Global Error Handling
api.interceptors.response.use(
  (response) => response, // If it's a success, just pass it through
  (error) => {
    // If the backend says the token is dead/invalid
    if (error.response && error.response.status === 401) {
      console.warn("Token expired or invalid. Logging out...");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // The "Outside React" fallback to force the user out
      // (Only triggers if they try to make a secure request with a dead token)
      window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

export default api;