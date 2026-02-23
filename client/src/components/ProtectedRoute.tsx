import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { token, role } = useAuth();

    // 1. Check if user is logged in
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // 2. Check if user has the required role (if roles are specified)
    if (allowedRoles && role && !allowedRoles.includes(role)) {
        // Redirect to their appropriate dashboard if they try to access a wrong page
        if (role === 'PATIENT') return <Navigate to="/patient-dashboard" replace />;
        if (role === 'DOCTOR') return <Navigate to="/doctor-dashboard" replace />;
        if (role === 'ADMIN') return <Navigate to="/admin-dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;