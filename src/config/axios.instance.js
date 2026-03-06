// src/config/axios.instance.js
// Centralized Axios Instance with Interceptors - Frontend

import axios from 'axios';
import { API_CONFIG, ENV_INFO } from './api.config';

/**
 * Create authenticated API instance
 * Automatically handles token, interceptors, and error handling
 */
export const createApiInstance = () => {
  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // ============================================
  // REQUEST INTERCEPTOR - Add auth token
  // ============================================
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token') || localStorage.getItem('user_token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        if (ENV_INFO.isDevelopment) {
          console.log(`[API] Request to: ${config.url}`);
        }
      } else if (ENV_INFO.isDevelopment) {
        console.debug(`[API] No token found for request to: ${config.url}`);
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // ============================================
  // RESPONSE INTERCEPTOR - Handle responses & errors
  // ============================================
  instance.interceptors.response.use(
    (response) => {
      // Handle token refresh if provided in headers
      const newToken = response.headers['x-new-token'];
      if (newToken) {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user_token', newToken);
        if (ENV_INFO.isDevelopment) {
          console.log('[API] Token refreshed');
        }
      }
      return response;
    },
    async (error) => {
      const config = error.config;

      // Check if this is a 401 Unauthorized error
      if (error.response?.status === 401 && !config._retry) {
        config._retry = true;

        // Clear tokens and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user_token');
        localStorage.removeItem('auth');
        localStorage.removeItem('user');

        if (ENV_INFO.isDevelopment) {
          console.error('[API] 401 Unauthorized - Clearing tokens and redirecting to login');
        }

        // Redirect to login page
        const publicRoutes = ['/products', '/categories', '/hero'];
        const isPublicRoute = publicRoutes.some(route => 
          error.config?.url?.includes(route)
        );

        if (!isPublicRoute && 
            window.location.pathname !== '/login' && 
            window.location.pathname !== '/otp-login' &&
            window.location.pathname !== '/user/login') {
          window.location.href = '/user/login';
        }

        return Promise.reject(error);
      }

      // Check if this is a network error and retry is configured
      if (
        error.message === 'Network Error' &&
        config._retryCount !== undefined &&
        config._retryCount < API_CONFIG.RETRY_ATTEMPTS
      ) {
        config._retryCount++;
        
        if (ENV_INFO.isDevelopment) {
          console.warn(`[API] Retrying request (${config._retryCount}/${API_CONFIG.RETRY_ATTEMPTS})`);
        }

        // Wait before retrying
        await new Promise((resolve) => 
          setTimeout(resolve, API_CONFIG.RETRY_DELAY * config._retryCount)
        );

        return instance(config);
      }

      // Log errors in development
      if (ENV_INFO.isDevelopment) {
        console.error('[API] Error Response:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
        });
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Create and export the default API instance
export const apiInstance = createApiInstance();

export default apiInstance;
