import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { realTimeAPI, productsAPI, categoriesAPI } from '../lib/api';

const RealTimeContext = createContext();

export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
};

export const RealTimeProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Cache for API responses
  const [cache, setCache] = useState({});
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Check if cache is valid
  const isCacheValid = (key) => {
    const cached = cache[key];
    if (!cached) return false;
    return Date.now() - cached.timestamp < CACHE_DURATION;
  };

  // Get data from cache or API
  const getCachedData = async (key, fetchFunction) => {
    if (isCacheValid(key)) {
      return cache[key].data;
    }

    try {
      const data = await fetchFunction();
      setCache(prev => ({
        ...prev,
        [key]: {
          data,
          timestamp: Date.now()
        }
      }));
      return data;
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      throw error;
    }
  };

  // Fetch products
  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCachedData('products', () => productsAPI.getProducts(params));
      setProducts(data.data || data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [cache]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCachedData('categories', () => categoriesAPI.getCategories());
      setCategories(data.data || data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [cache]);

  // Fetch featured products
  const fetchFeaturedProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCachedData('featuredProducts', () => productsAPI.getFeaturedProducts());
      setFeaturedProducts(data.data || data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [cache]);

  // Fetch dashboard stats
  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCachedData('dashboardStats', () => realTimeAPI.getDashboardStats());
      setDashboardStats(data.data || data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [cache]);

  // Search products
  const searchProducts = useCallback(async (query, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsAPI.searchProducts(query, filters);
      setProducts(data.data || data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get products by category
  const getProductsByCategory = useCallback(async (categoryId, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsAPI.getProductsByCategory(categoryId, params);
      setProducts(data.data || data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchFeaturedProducts(),
        fetchDashboardStats()
      ]);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, fetchCategories, fetchFeaturedProducts, fetchDashboardStats]);

  // Clear cache
  const clearCache = useCallback(() => {
    setCache({});
  }, []);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAll();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [refreshAll]);

  // Initial data fetch
  useEffect(() => {
    refreshAll();
  }, []);

  const value = {
    // Data
    products,
    categories,
    featuredProducts,
    dashboardStats,
    loading,
    error,
    lastUpdated,
    
    // Actions
    fetchProducts,
    fetchCategories,
    fetchFeaturedProducts,
    fetchDashboardStats,
    searchProducts,
    getProductsByCategory,
    refreshAll,
    clearCache,
    
    // Cache management
    isCacheValid,
    getCachedData
  };

  return (
    <RealTimeContext.Provider value={value}>
      {children}
    </RealTimeContext.Provider>
  );
};
