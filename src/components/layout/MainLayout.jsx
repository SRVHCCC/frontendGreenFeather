import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/UnifiedAuthContext';
import { categoriesAPI } from '../../lib/api';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import SidebarFilter from '../../common/SidebarFilter';

const MainLayout = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, checkAuthStatus } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoriesAPI.getCategories();
        setCategories(response.data?.categories || []);
      } catch (error) {
        console.error('Failed to load categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await checkAuthStatus();
      } catch (error) {
        console.error('Auth check failed:', error);
        if (!location.pathname.includes('/login') && 
            !location.pathname.includes('/register') && 
            !location.pathname.includes('/otp-login')) {
          // Don't redirect immediately, let the user stay on the page
          // They can still browse products without login
        }
      }
    };

    checkAuth();
  }, [location.pathname, checkAuthStatus]);

  // Handle category navigation
  const handleCategoryClick = (categoryId, categoryName) => {
    navigate(`/products?category=${categoryId}&name=${encodeURIComponent(categoryName)}`);
    setSidebarOpen(false);
  };

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest('.sidebar-container')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        onMenuClick={toggleSidebar}
        isAuthenticated={isAuthenticated}
        user={user}
      />

      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`sidebar-container fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Categories List */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => handleCategoryClick(category._id, category.name)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between group"
                    >
                      <span className="text-gray-700 group-hover:text-gray-900">
                        {category.name}
                      </span>
                      {category.productCount > 0 && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {category.productCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t bg-gray-50">
              <div className="text-sm text-gray-600">
                <p className="font-medium">Quick Links</p>
                <div className="mt-2 space-y-1">
                  <button
                    onClick={() => {
                      navigate('/deals');
                      setSidebarOpen(false);
                    }}
                    className="block w-full text-left text-blue-600 hover:text-blue-800"
                  >
                    Special Deals
                  </button>
                  <button
                    onClick={() => {
                      navigate('/trends');
                      setSidebarOpen(false);
                    }}
                    className="block w-full text-left text-blue-600 hover:text-blue-800"
                  >
                    Trending Now
                  </button>
                  <button
                    onClick={() => {
                      navigate('/bestsellers');
                      setSidebarOpen(false);
                    }}
                    className="block w-full text-left text-blue-600 hover:text-blue-800"
                  >
                    Best Sellers
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="min-h-screen">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
