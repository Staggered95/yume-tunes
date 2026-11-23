import { useEffect } from 'react';
import api from '../api/axios';
import { useLoading } from '../context/LoadingContext';
import { useAuth } from '../context/AuthContext';

const AUTH_SKIP_URLS = ['/auth/refresh', '/auth/logout', '/auth/login', '/auth/google'];

const AxiosInterceptorSetup = ({ children }) => {
    const { startLoading, stopLoading } = useLoading();
    const { login, logout } = useAuth();

    useEffect(() => {
        let refreshPromise = null;

        const requestInterceptor = api.interceptors.request.use(
            (config) => {
                startLoading();
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = api.interceptors.response.use(
            (response) => {
                stopLoading();
                return response;
            },
            async (error) => {
                stopLoading();

                const originalRequest = error.config;
                const requestUrl = originalRequest?.url || '';
                const isAuthEndpoint = AUTH_SKIP_URLS.some((url) => requestUrl.includes(url));

                if (
                    error.response?.status === 401 &&
                    originalRequest &&
                    !originalRequest._retry &&
                    !isAuthEndpoint
                ) {
                    originalRequest._retry = true;

                    // If a refresh is already running, reuse it instead of calling /auth/refresh twice
                    if (!refreshPromise) {
                        refreshPromise = api
                            .get('/auth/refresh', { withCredentials: true })
                            .then(({ data }) => {
                                login(data.token);
                                return data.token;
                            })
                            .catch((refreshError) => {
                                logout();
                                return Promise.reject(refreshError);
                            })
                            .finally(() => {
                                refreshPromise = null;
                            });
                    }

                    const newAccessToken = await refreshPromise;
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }

                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [startLoading, stopLoading, login, logout]);

    return children;
};

export default AxiosInterceptorSetup;