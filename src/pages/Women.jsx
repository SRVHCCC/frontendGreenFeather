import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import SidebarFilter from "../common/SidebarFilter";
import { ShoppingBag, Gem, Shirt, Footprints, Package, Sparkles, Filter, Star } from "lucide-react";

const categories = [
  {
    title: "Ethnic Wear",
    description: "Explore sarees, salwar suits, lehengas, and traditional Indian attire.",
    icon: <Package className="text-indigo-500 w-6 h-6" />,
    products: 1250,
  },
  {
    title: "Western Wear",
    description: "Shop dresses, tops, jeans, and trendy western outfits.",
    icon: <Shirt className="text-green-500 w-6 h-6" />,
    products: 2340,
  },
  {
    title: "Jewelry & Accessories",
    description: "Find beautiful jewelry, bags, belts, and fashion accessories.",
    icon: <Gem className="text-red-500 w-6 h-6" />,
    products: 3450,
  },
  {
    title: "Footwear",
    description: "Browse heels, flats, sandals, and comfortable everyday shoes.",
    icon: <Footprints className="text-yellow-500 w-6 h-6" />,
    products: 890,
  },
  {
    title: "Handbags & Clutches",
    description: "Designer handbags, clutches, tote bags, backpacks, and wallets.",
    icon: <ShoppingBag className="text-purple-500 w-6 h-6" />,
    products: 1120,
  },
  {
    title: "Beauty & Cosmetics",
    description: "Discover makeup, skincare, fragrances, and beauty essentials.",
    icon: <Sparkles className="text-pink-500 w-6 h-6" />,
    products: 2780,
  },
];

const featuredProducts = [
  {
    id: 1,
    name: "Elegant Silk Saree",
    price: 2499,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400",
    rating: 4.5,
    vendor: "Ethnic Paradise",
    discount: 50,
  },
  {
    id: 2,
    name: "Designer Kurti Set",
    price: 1299,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=400",
    rating: 4.3,
    vendor: "Fashion Hub",
    discount: 48,
  },
  {
    id: 3,
    name: "Floral Maxi Dress",
    price: 1599,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
    rating: 4.7,
    vendor: "Style Studio",
    discount: 47,
  },
  {
    id: 4,
    name: "Gold Plated Necklace",
    price: 899,
    originalPrice: 1799,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
    rating: 4.6,
    vendor: "Jewel Cart",
    discount: 50,
  },
];

const Women = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 text-white py-24">
        <div className="container mx-auto px-4 md:px-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-center">
            Women's Fashion
          </h1>
          <p className="text-lg md:text-xl text-center text-white/90 max-w-2xl mx-auto">
            Discover the latest trends from top vendors. Exclusive deals on ethnic wear, western outfits, jewelry & more!
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300 shadow-lg">
              Shop Now
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300">
              View Deals
            </button>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 md:px-10 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Shop by Category
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-purple-500 hover:text-purple-600 transition-all duration-300">
            <Filter className="w-4 h-4" />
            <span className="hidden md:inline">Filter</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => setSelectedCategory(category.title)}
              className="group bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-md hover:shadow-2xl hover:scale-105 hover:border-purple-400 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center mb-4 space-x-3">
                <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-500">{category.products}+ Products</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {category.description}
              </p>
              <button className="mt-4 text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                Explore →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="container mx-auto px-4 md:px-10 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Trending Now
            </h2>
            <p className="text-gray-600">Handpicked favorites from our top vendors</p>
          </div>
          <button className="text-purple-600 font-semibold hover:text-purple-700">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {product.discount}% OFF
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-purple-600 font-semibold mb-1">
                  {product.vendor}
                </p>
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="text-yellow-400 w-4 h-4 fill-yellow-400" />
                  <span className="text-sm font-semibold text-gray-700">
                    {product.rating}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">(234)</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </span>
                </div>
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2.5 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Offers Banner */}
      <div className="container mx-auto px-4 md:px-10 py-12">
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 rounded-3xl p-8 md:p-12 text-white">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              Weekend Special Sale! 🎉
            </h2>
            <p className="text-lg mb-6 text-white/90">
              Up to 70% OFF on selected items from verified vendors. Limited time offer!
            </p>
            <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-orange-50 transition-all duration-300 shadow-lg">
              Shop Sale Items
            </button>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Women;