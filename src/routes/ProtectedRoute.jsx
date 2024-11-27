import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getUserFromStorage } from '../utils'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();

  // Fetch authentication state from Redux
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Get user data from storage
  const user = getUserFromStorage('user');
  const userRole = user?.role || null;

  // Handle unauthenticated access
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle unauthorized role access
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;