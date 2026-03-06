import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../lib/api';

const UnifiedAuthContext = createContext();

export const useAuth = () => {
  const context = useContext(UnifiedAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      // FIXED: Check multiple localStorage keys
      const authData = localStorage.getItem('auth');
      const userData = localStorage.getItem('user');
      
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed;
      }
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    // FIXED: Check multiple token keys
    return localStorage.getItem('user_token') || localStorage.getItem('token') || null;
  });

  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState(null);

  // FIXED: Save to multiple localStorage keys for compatibility
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('user_token', token);
      localStorage.setItem('auth', JSON.stringify({
        token: token,
        ...user
      }));
      console.log('Auth context updated:', { user, token });
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('user_token');
      localStorage.removeItem('auth');
    }
  }, [user, token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token && !user) {
        setLoading(true);
        try {
          const response = await authAPI.verifyToken();
          setUser(response.data.user);
          setPermissions(response.data.user.permissions);
        } catch (error) {
          console.error('Auth check failed:', error);
          if (error.response?.status === 401) {
            setToken(null);
            setUser(null);
            setPermissions(null);
          }
        } finally {
          setLoading(false);
        }
      } else if (user && user.permissions) {
        setPermissions(user.permissions);
      }
    };

    checkAuth();
  }, [token, user]);

  // FIXED: Listen for storage changes and custom authChange event
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Handle storage event
      if (e.key === 'token' || e.key === 'user_token') {
        const newToken = e.newValue;
        if (newToken && newToken !== token) {
          setToken(newToken);
          console.log('Token updated from storage');
        }
      }
      if (e.key === 'auth' || e.key === 'user') {
        try {
          const newUser = JSON.parse(e.newValue);
          if (newUser) {
            setUser(newUser);
            console.log('User updated from storage');
          }
        } catch (err) {
          console.error('Failed to parse user data:', err);
        }
      }
    };

    const handleAuthChange = () => {
      console.log('Auth change event triggered');
      // Reload user and token from localStorage
      const authData = localStorage.getItem('auth');
      const newToken = localStorage.getItem('user_token') || localStorage.getItem('token');
      
      if (authData && newToken) {
        try {
          const parsed = JSON.parse(authData);
          setUser(parsed);
          setToken(newToken);
          console.log('Auth reloaded from localStorage:', { user: parsed, token: newToken });
        } catch (err) {
          console.error('Failed to reload auth:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [token]);

  const login = async (email, password, role = null) => {
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password, role });
      setUser(response.data.user);
      setToken(response.data.token);
      setPermissions(response.data.user.permissions);
      
      // Dispatch auth change event
      window.dispatchEvent(new Event('authChange'));
      
      setLoading(false);
      return { success: true, user: response.data.user };
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.message };
    }
  };

  const sendOTP = async (emailOrPhone, role = 'user') => {
    setLoading(true);
    try {
      const response = await authAPI.sendOTP({ emailOrPhone, role });
      setLoading(false);
      return { success: true, data: response.data };
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.message };
    }
  };

  const verifyOTP = async (emailOrPhone, otp, role = 'user') => {
    setLoading(true);
    try {
      const response = await authAPI.verifyOTP({ emailOrPhone, otp, role });
      setUser(response.data.user);
      setToken(response.data.token);
      setPermissions(response.data.user.permissions);
      
      // Dispatch auth change event
      window.dispatchEvent(new Event('authChange'));
      
      setLoading(false);
      return { success: true, user: response.data.user };
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.message };
    }
  };

  const resendOTP = async (emailOrPhone, role = 'user') => {
    setLoading(true);
    try {
      const response = await authAPI.resendOTP({ emailOrPhone, role });
      setLoading(false);
      return { success: true, data: response.data };
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authAPI.register(userData);
      setUser(response.data.user);
      setToken(response.data.token);
      
      // Dispatch auth change event
      window.dispatchEvent(new Event('authChange'));
      
      setLoading(false);
      return { success: true, user: response.data.user };
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      setPermissions(null);
      
      // Dispatch auth change event
      window.dispatchEvent(new Event('authChange'));
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      setUser(response.data.user);
      
      // Dispatch auth change event
      window.dispatchEvent(new Event('authChange'));
      
      return { success: true, user: response.data.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await authAPI.changePassword(passwordData);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Permission checking functions
  const hasPermission = (resource, action) => {
    if (!permissions) return false;
    if (user?.role === 'superadmin') return true;
    return permissions[resource] && permissions[resource][action];
  };

  const isAdmin = () => {
    return user && ['admin', 'superadmin'].includes(user.role);
  };

  const isSuperAdmin = () => {
    return user && user.role === 'superadmin';
  };

  const isSeller = () => {
    return user && user.role === 'seller';
  };

  const isUser = () => {
    return user && user.role === 'user';
  };

  const isAuthenticated = () => {
    // FIXED: Check both memory and localStorage
    const hasMemoryAuth = !!user && !!token;
    const hasLocalAuth = !!(localStorage.getItem('auth') || localStorage.getItem('user_token'));
    return hasMemoryAuth || hasLocalAuth;
  };

  const getRole = () => {
    return user?.role || null;
  };

  const getUserId = () => {
    return user?.id || user?._id || null;
  };

  const getUserName = () => {
    return user?.name || null;
  };

  const getUserEmail = () => {
    return user?.email || null;
  };

  const checkAuthStatus = async () => {
    const storedToken = localStorage.getItem('token') || localStorage.getItem('user_token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        const response = await authAPI.verifyToken();
        setUser(response.data.user);
        setToken(storedToken);
        setPermissions(response.data.user.permissions);
        return { success: true, user: response.data.user };
      } catch (error) {
        // Token is invalid, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user_token');
        localStorage.removeItem('user');
        localStorage.removeItem('auth');
        setUser(null);
        setToken(null);
        setPermissions(null);
        return { success: false, message: 'Session expired' };
      }
    }
    return { success: false, message: 'No stored session' };
  };

  const value = {
    user,
    token,
    loading,
    permissions,
    login,
    sendOTP,
    verifyOTP,
    resendOTP,
    register,
    logout,
    updateProfile,
    changePassword,
    checkAuthStatus,
    hasPermission,
    isAdmin,
    isSuperAdmin,
    isSeller,
    isUser,
    isAuthenticated,
    getRole,
    getUserId,
    getUserName,
    getUserEmail
  };

  return (
    <UnifiedAuthContext.Provider value={value}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};