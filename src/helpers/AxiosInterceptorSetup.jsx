import { useEffect } from 'react';
import api from '../api/axios';
import { useLoading } from '../context/LoadingContext';

const AxiosInterceptorSetup = ({ children }) => {
    const { startLoading, stopLoading } = useLoading();

    useEffect(() => {
        // We use a counter in case multiple API requests fire at the exact same time
        let activeRequests = 0;

        const requestInterceptor = api.interceptors.request.use((config) => {
            activeRequests++;
            if (activeRequests === 1) startLoading();
            return config;
        }, (error) => {
            activeRequests--;
            if (activeRequests === 0) stopLoading();
            return Promise.reject(error);
        });

        const responseInterceptor = api.interceptors.response.use((response) => {
            activeRequests--;
            if (activeRequests === 0) stopLoading();
            return response;
        }, (error) => {
            activeRequests--;
            if (activeRequests === 0) stopLoading();
            return Promise.reject(error);
        });

        // Cleanup interceptors if the component unmounts
        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [startLoading, stopLoading]);

    // This component renders nothing visually, just passes the children through
    return children;
};

export default AxiosInterceptorSetup;