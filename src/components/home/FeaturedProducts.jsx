import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useRealTimeData } from "../../context/RealTimeDataContext";
import { useSocket } from "../../context/SocketContext";
import toast from "react-hot-toast";

const FeaturedProducts = () => {
  const { addItem } = useCart();
  const { featuredProducts, loading, fetchFeaturedProducts } = useRealTimeData();
  const { isConnected } = useSocket();
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    // Fetch featured products when component mounts
    fetchFeaturedProducts();
  }, []);

  // Listen for real-time product updates
  useEffect(() => {
    const handleProductUpdate = (event) => {
      const { product, action } = event.detail;
      console.log('FeaturedProducts: Product update received', product, action);
      
      if (action === 'created' || action === 'approved') {
        toast.success(`New product available: ${product.name}`, {
          duration: 5000,
          icon: '🆕'
        });
        setLastUpdate(new Date());
      }
    };

    window.addEventListener('productUpdate', handleProductUpdate);
    return () => window.removeEventListener('productUpdate', handleProductUpdate);
  }, []);

  const handleAddToCart = (product) => {
    addItem(product);
    toast.success(`Added ${product.name} to cart!`, {
      duration: 3000,
      icon: '🛒'
    });
  };

  return (
    <section className="featured-products py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {isConnected && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Updates</span>
              </div>
            )}
            {lastUpdate && (
              <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <span className="ml-2">Loading products...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts && featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div className="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300" key={product._id}>
                  <div className="relative">
                    <img 
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/300x200/2d5016/ffffff?text=No+Image'} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xl font-bold text-green-600">₹{product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 mb-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(product.ratings?.average || 0) ? 'text-yellow-400' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({product.ratings?.count || 0})</span>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors duration-200 font-medium"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No featured products available at the moment.</p>
                <p className="text-sm text-gray-400 mt-2">Check back later for new products!</p>
              </div>
            )}
          </div>
        )}

        {/* Deals & Offers section */}
        <DealsOffers />
      </div>
    </section>
  );
};

const DealsOffers = () => {
  const { items } = useCart(); 

  return (
    <div className="deals-offers mt-12 bg-gray-50 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Deals & Offers</h2>
      <p className="text-gray-600 mb-4">Items currently in your cart: {items.length}</p>
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded border">
              <span className="font-medium">{item.name}</span>
              <span className="text-green-600 font-bold">× {item.quantity} — ₹{item.price}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
