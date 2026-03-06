import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/UnifiedAuthContext';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requiredPermission = null,
  requireAuth = true 
}) => {
  const { user, loading, hasPermission, isAuthenticated } = useAuth();
  const location = useLocation();
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const checkLocalAuth = () => {
      const authData = localStorage.getItem('auth');
      const token = localStorage.getItem('user_token');
      
      console.log('ProtectedRoute checking:', {
        contextUser: user,
        contextAuth: isAuthenticated(),
        localAuth: !!authData,
        localToken: !!token
      });
      
      setLocalLoading(false);
    };

    checkLocalAuth();
  }, [user, isAuthenticated]);

  if (loading || localLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!requireAuth) {
    return children;
  }

  const authData = localStorage.getItem('auth');
  const token = localStorage.getItem('user_token');
  const isAuthenticatedLocal = !!(authData || token);
  const isAuthenticatedContext = isAuthenticated();

  console.log('Auth Check:', {
    contextAuth: isAuthenticatedContext,
    localAuth: isAuthenticatedLocal,
    finalAuth: isAuthenticatedContext || isAuthenticatedLocal
  });

  if (!isAuthenticatedContext && !isAuthenticatedLocal) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/user/login" state={{ from: location }} replace />;
  }

  let currentUser = user;
  if (!user && authData) {
    try {
      currentUser = JSON.parse(authData);
      console.log('Using localStorage user data:', currentUser);
    } catch (e) {
      console.error('Failed to parse auth data:', e);
    }
  }

  if (requiredRole && currentUser?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Required role: {requiredRole}</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (requiredPermission && hasPermission) {
    const [resource, action] = requiredPermission.split('.');
    if (!hasPermission(resource, action)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
            <p className="text-sm text-gray-500 mt-2">Required permission: {requiredPermission}</p>
            <button 
              onClick={() => window.history.back()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  console.log('Access granted, rendering protected content');
  return children;
};

export default ProtectedRoute;