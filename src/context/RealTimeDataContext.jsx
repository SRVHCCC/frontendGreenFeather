import React, { createContext, useContext, useEffect, useState } from 'react';
import { productsAPI } from '../lib/api';
import { useSocket } from './SocketContext';

const RealTimeDataContext = createContext();

export const useRealTimeData = () => {
  const context = useContext(RealTimeDataContext);
  if (!context) {
    throw new Error('useRealTimeData must be used within a RealTimeDataProvider');
  }
  return context;
};

export const RealTimeDataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { socket, isConnected } = useSocket();

  // Cache duration (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;
  const [cache, setCache] = useState({
    products: { data: null, timestamp: null },
    featuredProducts: { data: null, timestamp: null },
    categories: { data: null, timestamp: null }
  });

  // Check if cache is valid
  const isCacheValid = (cacheKey) => {
    const cached = cache[cacheKey];
    if (!cached || !cached.timestamp) return false;
    return Date.now() - cached.timestamp < CACHE_DURATION;
  };

  // Fetch products with caching
  const fetchProducts = async (params = {}, forceRefresh = false) => {
    const cacheKey = 'products';
    
    if (!forceRefresh && isCacheValid(cacheKey)) {
      setProducts(cache[cacheKey].data);
      return cache[cacheKey].data;
    }

    setLoading(true);
    try {
      const data = await productsAPI.getProducts(params);
      setProducts(data.data);
      
      // Update cache
      setCache(prev => ({
        
        ...prev,
        [cacheKey]: {
          data: data.data,
          timestamp: Date.now()
        }
      }));
      
      setLastUpdated(new Date());
      return data.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch featured products with caching
  const fetchFeaturedProducts = async (forceRefresh = false) => {
    const cacheKey = 'featuredProducts';
    
    if (!forceRefresh && isCacheValid(cacheKey)) {
      setFeaturedProducts(cache[cacheKey].data);
      return cache[cacheKey].data;
    }

    try {
      const data = await productsAPI.getFeaturedProducts();
      setFeaturedProducts(data.products);
      
      // Update cache
      setCache(prev => ({
        ...prev,
        [cacheKey]: {
          data: data.products,
          timestamp: Date.now()
        }
      }));
      
      return data.products;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  };

  // Fetch categories with caching
  const fetchCategories = async (forceRefresh = false) => {
    const cacheKey = 'categories';
    
    if (!forceRefresh && isCacheValid(cacheKey)) {
      setCategories(cache[cacheKey].data);
      return cache[cacheKey].data;
    }

    try {
      const data = await productsAPI.getCategories();
      setCategories(data.categories);
      
      // Update cache
      setCache(prev => ({
        ...prev,
        [cacheKey]: {
          data: data.categories,
          timestamp: Date.now()
        }
      }));
      
      return data.categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  };

  // Handle real-time product updates
  useEffect(() => {
    if (!socket) return;

    const handleProductUpdate = (event) => {
      const { product, action } = event.detail;
      console.log('Product update received:', product, action);

      // Update products list based on action
      setProducts(prevProducts => {
        switch (action) {
          case 'created':
            // Add new product to the beginning
            return [product, ...prevProducts];
          
          case 'approved':
            // Update product status
            return prevProducts.map(p => 
              p._id === product._id ? { ...p, status: 'active', isActive: true } : p
            );
          
          case 'rejected':
            // Update product status
            return prevProducts.map(p => 
              p._id === product._id ? { ...p, status: 'rejected' } : p
            );
          
          case 'updated':
            // Update product details
            return prevProducts.map(p => 
              p._id === product._id ? { ...p, ...product } : p
            );
          
          case 'deleted':
            // Remove product
            return prevProducts.filter(p => p._id !== product._id);
          
          default:
            return prevProducts;
        }
      });

      // Update featured products if this product is featured
      if (product.isFeatured) {
        setFeaturedProducts(prevFeatured => {
          switch (action) {
            case 'created':
            case 'approved':
              // Add to featured if not already there
              if (!prevFeatured.find(p => p._id === product._id)) {
                return [product, ...prevFeatured];
              }
              break;
            
            case 'rejected':
            case 'deleted':
              // Remove from featured
              return prevFeatured.filter(p => p._id !== product._id);
            
            case 'updated':
              // Update featured product
              return prevFeatured.map(p => 
                p._id === product._id ? { ...p, ...product } : p
              );
          }
          return prevFeatured;
        });
      }

      // Update cache timestamp to force refresh on next fetch
      setCache(prev => ({
        ...prev,
        products: { ...prev.products, timestamp: null },
        featuredProducts: { ...prev.featuredProducts, timestamp: null }
      }));

      setLastUpdated(new Date());
    };

    // Listen for product update events
    window.addEventListener('productUpdate', handleProductUpdate);

    return () => {
      window.removeEventListener('productUpdate', handleProductUpdate);
    };
  }, [socket]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      console.log('Auto-refreshing data...');
      fetchProducts({}, true);
      fetchFeaturedProducts(true);
      fetchCategories(true);
    }, CACHE_DURATION);

    return () => clearInterval(interval);
  }, [isConnected]);

  // Initial data fetch
  useEffect(() => {
    if (isConnected) {
      fetchProducts();
      fetchFeaturedProducts();
      fetchCategories();
    }
  }, [isConnected]);

  // Search products
  const searchProducts = async (query, filters = {}) => {
    setLoading(true);
    try {
      const data = await productsAPI.searchProducts(query, filters);
      return data.products;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get products by category
  const getProductsByCategory = async (categoryId, params = {}) => {
    setLoading(true);
    try {
      const data = await productsAPI.getProductsByCategory(categoryId, params);
      return data.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get single product
  const getProduct = async (id) => {
    try {
      const data = await productsAPI.getProduct(id);
      return data.product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  };

  // Clear cache
  const clearCache = () => {
    setCache({
      products: { data: null, timestamp: null },
      featuredProducts: { data: null, timestamp: null },
      categories: { data: null, timestamp: null }
    });
  };

  // Refresh all data
  const refreshAll = async () => {
    await Promise.all([
      fetchProducts({}, true),
      fetchFeaturedProducts(true),
      fetchCategories(true)
    ]);
  };

  const value = {
    // Data
    products,
    featuredProducts,
    categories,
    loading,
    lastUpdated,
    
    // Methods
    fetchProducts,
    fetchFeaturedProducts,
    fetchCategories,
    searchProducts,
    getProductsByCategory,
    getProduct,
    clearCache,
    refreshAll,
    
    // Cache info
    isCacheValid,
    cache
  };

  return (
    <RealTimeDataContext.Provider value={value}>
      {children}
    </RealTimeDataContext.Provider>
  );
};
