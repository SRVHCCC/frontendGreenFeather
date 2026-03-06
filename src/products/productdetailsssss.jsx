import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { productsAPI } from "../lib/api";
import Layout from "../components/layout/Layout";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { ShoppingCart, Heart, Star, Truck, RotateCcw, Shield, ChevronLeft } from "lucide-react";
import API_URL from "../config/config";

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { addItem } = useCart();
  const { add: addToWishlist, remove: removeFromWishlist, has: isWishlisted } = useWishlist();
  const navigate = useNavigate();
  const [product, setProduct] = useState((location.state && location.state.product) || null);
  const [loadingProduct, setLoadingProduct] = useState(!product);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (product) return;
      setLoadingProduct(true);
      try {
        const res = await productsAPI.getProduct(id);
        console.log('Fetched product:', res);
        if (mounted && res && res.data && res.data.product) {
          setProduct(res.data.product);
        }
      } catch (err) {
        console.error('Failed to load product', err);
        if (mounted) setError('Failed to load product');
      } finally {
        if (mounted) setLoadingProduct(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [wishAnimate, setWishAnimate] = useState(false);

  useEffect(() => {
    if (product) {
      const firstItem = product.items?.[0];
      const color = firstItem?.color || "";
      const sizes = firstItem?.sizes || [];
      
      if (color && !selectedColor) {
        setSelectedColor(color);
      }
      if (sizes.length > 0 && !selectedSize) {
        setSelectedSize(sizes[0].unit); 
      }
    }
  }, [product, selectedColor, selectedSize]);

  if (loadingProduct) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 sm:py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm">Loading product...</p>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 sm:py-20 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Product Not Found!</h2>
          <p className="text-gray-600 text-sm sm:text-base mb-4">{error || 'This product may have been removed or is not available.'}</p>
          <Link to="/products" className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center gap-1 text-sm">
            ← Back to Products
          </Link>
        </div>
      </Layout>
    );
  }

  const productId = product._id || product.id?._id || product.id || '';
  const firstItem = product.items?.[0];
  const sizes = firstItem?.sizes || [];
  const selectedSizeObj = sizes.find(s => s.unit === selectedSize);
  const price = selectedSizeObj?.sellingPrice || sizes[0]?.sellingPrice || 0;
  const mrp = selectedSizeObj?.basePrice || null;
  const stock = selectedSizeObj?.quantity || 0;
  const imageUrl = firstItem?.images?.[0]?.url || '';
  const color = firstItem?.color || '';
  
  let title = 'Product';
  let brand = '';
  let description = '';
  
  if (product.basicInfo && typeof product.basicInfo === 'object') {
    title = product.basicInfo.title || product.name || 'Product';
    brand = product.basicInfo.brand || product.brand || '';
    description = product.basicInfo.description || product.description || '';
  } else {
    title = product.name || 'Product';
    brand = product.brand || '';
    description = product.description || '';
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    const cartItem = {
      id: productId,
      name: title,
      brand: brand,
      price: price,
      image: `${API_URL}/${imageUrl}`,
      color: selectedColor,
      size: selectedSize,
      stock: stock > 0
    };
    
    addItem(cartItem, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    const cartItem = {
      id: productId,
      name: title,
      brand: brand,
      price: price,
      image: `${API_URL}/${imageUrl}`,
      color: selectedColor,
      size: selectedSize,
      stock: stock > 0
    };
    
    addItem(cartItem, quantity);
    navigate("/cart");
  };

  const toggleWishlist = () => {
    if (!product) return;
    setWishAnimate(true);
    setTimeout(() => setWishAnimate(false), 300); 
    if (isWishlisted(productId)) removeFromWishlist(productId);
    else addToWishlist(product);
  };

  const handleQuantityChange = (type) => {
    if (type === "increment" && quantity < stock) setQuantity(prev => prev + 1);
    else if (type === "decrement" && quantity > 1) setQuantity(prev => prev - 1);
  };

  const totalPrice = price * quantity;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6">
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
          <nav className="mb-4 text-xs sm:text-sm text-gray-600 hidden sm:flex">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-gray-900">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 truncate">{title}</span>
          </nav>

          <button
            onClick={() => navigate(-1)}
            className="sm:hidden mb-4 flex items-center gap-1 text-green-600 hover:text-green-700 font-semibold text-sm"
          >
            <ChevronLeft size={18} /> Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
            {/* Product Image Section */}
            <div className="w-full">
              <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 relative sticky top-0 z-10 lg:sticky lg:top-24">
                {!imageError && imageUrl ? (
                  <img
                    src={`${API_URL}/${imageUrl}`}
                    alt={title}
                    className="w-full h-48 sm:h-64 lg:h-96 object-contain rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      setImageError(true);
                    }}
                  />
                ) : (
                  <div className="w-full h-48 sm:h-64 lg:h-96 flex items-center justify-center bg-gray-100 rounded-lg">
                    <span className="text-gray-400 text-xs sm:text-sm">Image not available</span>
                  </div>
                )}
                <button
                  onClick={toggleWishlist}
                  className={`absolute top-3 right-3 w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-full text-white transition-transform transform ${
                    wishAnimate ? "scale-125" : "scale-100"
                  } ${isWishlisted(productId) ? "bg-red-500 hover:bg-red-600" : "bg-gray-300 hover:bg-gray-400"}`}
                >
                  <Heart className="w-4 sm:w-5 h-4 sm:h-5" fill={isWishlisted(productId) ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Mobile Buttons - Sticky at Bottom */}
              <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-50 flex gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={stock === 0}
                  className={`flex-1 ${stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white py-2.5 font-bold transition flex items-center justify-center gap-2 rounded-lg text-sm`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {stock === 0 ? 'Out' : 'Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={stock === 0}
                  className={`flex-1 ${stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2.5 font-bold transition rounded-lg text-sm`}
                >
                  Buy Now
                </button>
              </div>

              {/* Desktop Buttons */}
              <div className="hidden lg:flex gap-3 mt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={stock === 0}
                  className={`flex-1 ${stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white py-3 font-semibold transition flex items-center justify-center gap-2 rounded-lg`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={stock === 0}
                  className={`flex-1 ${stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 font-semibold transition rounded-lg`}
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="space-y-4 pb-24 sm:pb-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{title}</h1>
              {brand && (
                <p className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide">{brand}</p>
              )}

              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(product.rating) ? "fill-current" : ""}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">({product.rating})</span>
                </div>
              )}

              {/* Price Section */}
              <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold text-green-700">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                  {mrp && mrp > price && (
                    <>
                      <span className="text-base sm:text-lg text-gray-500 line-through">
                        ₹{(mrp * quantity).toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs sm:text-sm text-green-600 font-semibold">
                        {Math.round(((mrp - price) / mrp) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">Inclusive of all taxes</p>
              </div>

              {description && (
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{description}</p>
              )}

              {/* Color Selection */}
              {color && (
                <div className="border-t border-gray-200 pt-3 sm:pt-4">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-2">
                    Color: <span className="text-gray-900 capitalize">{color}</span>
                  </label>
                  <div className="flex gap-2">
                    <div
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-green-600 shadow-md flex-shrink-0"
                      style={{
                        backgroundColor:
                          color.toLowerCase() === "black" ? "#000000" :
                          color.toLowerCase() === "white" ? "#FFFFFF" :
                          color.toLowerCase() === "blue" ? "#3B82F6" :
                          color.toLowerCase() === "red" ? "#EF4444" :
                          color.toLowerCase() === "green" ? "#10B981" :
                          color.toLowerCase() === "yellow" ? "#FCD34D" :
                          color.toLowerCase() === "pink" ? "#EC4899" :
                          color.toLowerCase() === "brown" ? "#92400E" :
                          color.toLowerCase() === "gray" || color.toLowerCase() === "grey" ? "#6B7280" :
                          color.toLowerCase() === "purple" ? "#A855F7" :
                          color.toLowerCase() === "orange" ? "#F97316" :
                          color.toLowerCase()
                      }}
                      title={color}
                    >
                      {color.toLowerCase() === "white" && (
                        <span className="absolute inset-0 rounded-full border border-gray-300"></span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {sizes.length > 0 && (
                <div className="border-t border-gray-200 pt-3 sm:pt-4">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-2">
                    Size: <span className="text-gray-900 uppercase">{selectedSize || 'Select'}</span>
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {sizes.map((sizeObj, idx) => (
                      <button
                        key={`size-${idx}-${sizeObj.unit}`}
                        onClick={() => setSelectedSize(sizeObj.unit)}
                        className={`px-3 sm:px-5 py-2 rounded-lg border-2 font-semibold uppercase transition-all text-xs sm:text-sm ${
                          selectedSize === sizeObj.unit
                            ? 'border-green-600 bg-green-50 text-green-700 shadow-md'
                            : 'border-gray-300 hover:border-gray-400 text-gray-700'
                        } ${sizeObj.quantity === 0 ? 'opacity-50 cursor-not-allowed line-through' : ''}`}
                        disabled={sizeObj.quantity === 0}
                      >
                        {sizeObj.unit}
                      </button>
                    ))}
                  </div>
                  {selectedSizeObj && (
                    <p className="text-xs text-gray-600 mt-2">
                      Price: ₹{selectedSizeObj.sellingPrice.toLocaleString('en-IN')} • 
                      {selectedSizeObj.basePrice > selectedSizeObj.sellingPrice && (
                        <span className="text-red-600"> Save ₹{(selectedSizeObj.basePrice - selectedSizeObj.sellingPrice).toLocaleString('en-IN')}</span>
                      )}
                    </p>
                  )}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="border-t border-gray-200 pt-3 sm:pt-4">
                <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange("decrement")}
                      className="px-3 sm:px-4 py-1.5 text-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="px-4 sm:px-5 py-1.5 font-semibold border-x border-gray-300 min-w-[45px] text-center text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange("increment")}
                      className="px-3 sm:px-4 py-1.5 text-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      disabled={quantity >= stock}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Total: <span className="font-bold text-gray-900">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </span>
                </div>
              </div>

              {/* Stock Status */}
              {stock > 0 ? (
                <p className="text-xs sm:text-sm text-green-600 font-semibold">✓ In Stock ({stock} available)</p>
              ) : (
                <p className="text-xs sm:text-sm text-red-600 font-semibold">✗ Out of Stock</p>
              )}

              {/* Highlights */}
              {product.highlights && Array.isArray(product.highlights) && product.highlights.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border-t border-gray-200 pt-4">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">Product Highlights</h3>
                  <ul className="space-y-1.5">
                    {product.highlights.map((highlight, idx) => (
                      <li key={`highlight-${idx}`} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                        <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && Array.isArray(product.specifications) && product.specifications.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border-t border-gray-200 pt-4">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">Specifications</h3>
                  <div className="space-y-2">
                    {product.specifications.map((spec, idx) => (
                      <div key={`spec-${idx}`} className="border-b border-gray-200 pb-2 last:border-b-0 last:pb-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-0.5">{spec.title}</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{spec.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Truck className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Free Delivery on orders above ₹499</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <RotateCcw className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">7 Days Return & Exchange</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Shield className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-700">100% Secure Payment</span>
                </div>
              </div>

              <Link to="/products" className="text-green-600 hover:text-green-700 font-semibold text-xs sm:text-sm inline-flex items-center gap-1 hidden sm:inline-flex border-t border-gray-200 pt-4">
                ← Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;