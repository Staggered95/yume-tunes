import { useEffect } from 'react';
import api from '../api/axios';
import { useLoading } from '../context/LoadingContext';
import { useAuth } from '../context/AuthContext'; // 

const AxiosInterceptorSetup = ({ children }) => {
    const { startLoading, stopLoading } = useLoading();
    const { login, logout } = useAuth(); 

    useEffect(() => {
        let activeRequests = 0;

        // --- REQUEST INTERCEPTOR (Handles Loading State) ---
        const requestInterceptor = api.interceptors.request.use((config) => {
            activeRequests++;
            if (activeRequests === 1) startLoading();
            return config;
        }, (error) => {
            activeRequests--;
            if (activeRequests === 0) stopLoading();
            return Promise.reject(error);
        });

        // --- RESPONSE INTERCEPTOR (Handles Loading & 401 Silent Refresh) ---
        const responseInterceptor = api.interceptors.response.use((response) => {
            activeRequests--;
            if (activeRequests === 0) stopLoading();
            return response;
        }, async (error) => {
            activeRequests--;
            if (activeRequests === 0) stopLoading();

            const originalRequest = error.config;

            // The Retry Logic
            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true; 

                try {
                    const { data } = await api.get('/auth/refresh', {
                        withCredentials: true 
                    });
                    
                    const newAccessToken = data.token;
                    
                    login(newAccessToken);
                    
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                    
                } catch (refreshError) {
                    logout(); 
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        });

        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [startLoading, stopLoading, login, logout]); 

    return children;
};

export default AxiosInterceptorSetup;