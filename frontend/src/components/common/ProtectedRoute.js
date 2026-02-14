import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user || { user: null, isAuthenticated: false });
  const token = localStorage.getItem('token');

  // Check if user is authenticated
  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'CLIENT') {
      return <Navigate to="/client" replace />;
    } else if (user.role === 'FREELANCER') {
      return <Navigate to="/freelancer" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;