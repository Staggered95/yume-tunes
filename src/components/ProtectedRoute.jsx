import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext'; // Make sure this path is correct!

// 1. FOR NORMAL LOGGED-IN USERS (Library, Liked Songs, etc.)
export const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, isCheckingAuth } = useAuth();
    const { addToast } = useToast();

    // Fire the toast safely outside the render cycle
    useEffect(() => {
        if (!isCheckingAuth && !isLoggedIn) {
            addToast("You need to log in to access this page.", "warning");
        }
    }, [isCheckingAuth, isLoggedIn, addToast]);

    // Wait for the Axios interceptor/backend to verify the session
    if (isCheckingAuth) {
        return <div className="min-h-screen flex items-center justify-center text-text-muted italic">Verifying session...</div>;
    }

    // If they aren't logged in, kick them to the home page
    if (!isLoggedIn) {
        return <Navigate to="/home" replace />;
    }

    // If they are allowed, render the component!
    return children ? children : <Outlet />;
};

// 2. FOR ADMINS & MODERATORS ONLY (The Admin Dashboard)
export const AdminRoute = ({ children }) => {
    const { isLoggedIn, user, isCheckingAuth } = useAuth();
    const { addToast } = useToast();

    // Granular toast messages based on WHY they are being kicked out
    useEffect(() => {
        if (!isCheckingAuth) {
            if (!isLoggedIn) {
                addToast("Please log in to access the dashboard.", "warning");
            } else if (!['admin', 'moderator'].includes(user?.role)) {
                addToast("Access denied. Authorized personnel only.", "error");
            }
        }
    }, [isCheckingAuth, isLoggedIn, user, addToast]);

    if (isCheckingAuth) {
        return <div className="min-h-screen flex items-center justify-center text-text-muted italic">Verifying credentials...</div>;
    }

    // If they aren't logged in OR they have the wrong role, kick them out
    if (!isLoggedIn || !['admin', 'moderator'].includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return children ? children : <Outlet />;
};