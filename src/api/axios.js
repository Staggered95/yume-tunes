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



export default api;