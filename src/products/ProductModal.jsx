import React, { useState } from 'react';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductModal = ({ product, onClose }) => {
  const { addItem } = useCart();
  const { add: addToWishlist, remove: removeFromWishlist, has: isWishlisted } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const toggleWishlist = () => {
    if (isWishlisted(product._id)) removeFromWishlist(product._id);
    else addToWishlist(product);
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    onClose && onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-start justify-center p-4 md:p-8">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-auto z-70">
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b">
          <div className="text-lg font-semibold">{product.name}</div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Image */}
          <div className="flex items-center justify-center bg-gray-50 rounded-md p-4">
            <img
              src={product.image || '/placeholder.jpg'}
              alt={product.name}
              className="max-h-96 object-contain"
            />
          </div>

          {/* Right: Details */}
          <div className="space-y-4">
            <div className="text-2xl font-bold">₹{product.price?.toLocaleString('en-IN')}</div>

            {product.rating && (
              <div className="text-sm text-yellow-400">
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
                <span className="text-gray-500 text-xs ml-1">({product.rating})</span>
              </div>
            )}

            {product.description && (
              <p className="text-sm text-gray-700">{product.description}</p>
            )}

            {/* Add to Cart & Wishlist */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                <ShoppingCart className="w-4 h-4" /> Add to cart
              </button>

              <button
                onClick={toggleWishlist}
                className={`px-3 py-2 rounded-md border ${
                  isWishlisted(product._id)
                    ? 'bg-red-100 border-red-300'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Heart className="w-4 h-4 inline-block mr-1" />
                {isWishlisted(product._id) ? 'Wishlisted' : 'Wishlist'}
              </button>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="text-sm text-gray-600">Quantity</label>
              <div className="mt-2 inline-flex items-center border rounded-md overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1"
                >
                  -
                </button>
                <div className="px-4 py-1 font-semibold">{quantity}</div>
                <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-1">
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
