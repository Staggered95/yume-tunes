import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext'; 

export const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, isCheckingAuth } = useAuth();
    const { addToast } = useToast();

    useEffect(() => {
        if (!isCheckingAuth && !isLoggedIn) {
            addToast("You need to log in to access this page.", "warning");
        }
    }, [isCheckingAuth, isLoggedIn, addToast]);

    if (isCheckingAuth) {
        return <div className="min-h-screen flex items-center justify-center text-text-muted italic">Verifying session...</div>;
    }

    // kick-out if not logged in
    if (!isLoggedIn) {
        return <Navigate to="/home" replace />;
    }

    return children ? children : <Outlet />;
};

export const AdminRoute = ({ children }) => {
    const { isLoggedIn, user, isCheckingAuth } = useAuth();
    const { addToast } = useToast();

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

    if (!isLoggedIn || !['admin', 'moderator'].includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return children ? children : <Outlet />;
};