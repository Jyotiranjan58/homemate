import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, loading } = useAuth();

    // 1. Wait for the authentication check to finish before making a decision
    if (loading) {
        return <div style={{ padding: '4rem', textAlign: 'center' }}>Authenticating...</div>;
    }

    // 2. If not logged in at all, bounce them to the homepage
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // 3. If logged in, but their role isn't in the allowed list, bounce them
    if (allowedRoles && !allowedRoles.includes(user?.role?.toLowerCase())) {
        return <Navigate to="/" replace />;
    }

    // 4. If they pass all checks, render the page!
    return children;
};

export default ProtectedRoute;