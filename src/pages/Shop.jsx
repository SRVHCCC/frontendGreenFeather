import React, { useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import SidebarFilter from "../common/SidebarFilter";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";


const Shop = () => {
  const { addItem } = useCart();
  const normalized = useMemo(() => ([
    { id: 201, name: "EcoSmart Bamboo Desk Organizer", price: 1499, image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&auto=format&fit=crop", category: "Home & Kitchen", brand: "EcoSmart", rating: 4.5, colors: ["Brown"] },
    { id: 202, name: "Minimalist Wireless Headphones", price: 3999, image: "https://images.unsplash.com/photo-1518442530017-7db35be2d2aa?w=800&auto=format&fit=crop", category: "Electronics", brand: "SoundBox", rating: 4.6, colors: ["Black", "White"] },
    { id: 203, name: "Sustainable Canvas Backpack", price: 2299, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop", category: "Fashion", brand: "GreenTrail", rating: 4.2, colors: ["Green", "Blue"] },
    { id: 204, name: "Recycled Glass Water Bottle 1L", price: 799, image: "https://images.unsplash.com/photo-1622484212331-7b6a0e2b2fc3?w=800&auto=format&fit=crop", category: "Home & Kitchen", brand: "AquaPure", rating: 4.1, colors: ["Clear"] },
    { id: 205, name: "Organic Cotton T-Shirt", price: 999, image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&auto=format&fit=crop", category: "Fashion", brand: "PureWear", rating: 4.4, colors: ["White", "Black"] },
    { id: 206, name: "Portable Bluetooth Speaker", price: 2499, image: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&auto=format&fit=crop", category: "Electronics", brand: "BeatGo", rating: 4.3, colors: ["Black"] },
    { id: 207, name: "Wooden Serving Board", price: 1299, image: "https://images.unsplash.com/photo-1589994965851-d6d0888d7a52?w=800&auto=format&fit=crop", category: "Home & Kitchen", brand: "OakCraft", rating: 4.0, colors: ["Brown"] },
    { id: 208, name: "Stainless Travel Mug", price: 899, image: "https://images.unsplash.com/photo-1542996966-2e31c00bae30?w=800&auto=format&fit=crop", category: "Home & Kitchen", brand: "ThermoFlow", rating: 4.2, colors: ["Silver"] },
    { id: 209, name: "Slim Laptop Sleeve 15\"", price: 1399, image: "https://images.unsplash.com/photo-1587613865768-3b2a8b1f3a35?w=800&auto=format&fit=crop", category: "Electronics", brand: "CarryPro", rating: 4.5, colors: ["Gray", "Black"] },
    { id: 210, name: "Vegan Leather Wallet", price: 1199, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop", category: "Fashion", brand: "UrbanLeaf", rating: 4.3, colors: ["Brown", "Black"] },
    { id: 211, name: "Ceramic Planter Pot Set (3)", price: 999, image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop", category: "Home & Kitchen", brand: "GrowJoy", rating: 4.2, colors: ["White"] },
    { id: 212, name: "Smartwatch Lite", price: 3499, image: "https://images.unsplash.com/photo-1617043983671-adaadcaa2460?w=800&auto=format&fit=crop", category: "Electronics", brand: "WristTech", rating: 4.1, colors: ["Black"] },
  ]), []);
  const [filtered, setFiltered] = useState(normalized);

  const addToCart = (product) => {
    addItem(product, 1);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="relative  overflow-hidden">
          <div className="container mx-auto px-4 py-10">
            <div className="flex items-center justify-between">
              <div className="mx-12">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">Shop</h1>
                <p className="text-gray-700 mt-1">Discover curated picks and bestsellers</p>
              </div>
              <Link to="/products" className="hidden md:inline-block bg-white text-green-700 border border-green-600 px-5 py-2 rounded-full hover:bg-green-600 hover:text-white transition">
                View All Products
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-10 py-8">
          <div className="flex gap-6">
            <aside className="w-72 flex-shrink-0 hidden md:block">
              <div className="sticky top-24">
                <SidebarFilter products={normalized} onFilter={setFiltered} />
              </div>
            </aside>

            <div className="md:hidden w-full mb-4">
              <SidebarFilter products={normalized} onFilter={setFiltered} />
            </div>

            <main className="flex-1">
              <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
                <span>Showing {filtered.length} of {normalized.length} products</span>
                <div className="hidden sm:flex gap-2">
                  <button className="px-3 py-1 rounded border bg-white">Popular</button>
                  <button className="px-3 py-1 rounded border bg-white">Newest</button>
                  <button className="px-3 py-1 rounded border bg-white">Price</button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filtered.map((p) => (
                  <div key={p.id} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition flex flex-col">
                    <Link to={`/products/${p.id}`} className="block">
                      <div className="w-full h-44 bg-gray-50 flex items-center justify-center overflow-hidden">
                        <img src={p.image} alt={p.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    </Link>
                    <div className="p-3 flex-1 flex flex-col">
                      <Link to={`/products/${p.id}`} className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-green-700">
                        {p.name}
                      </Link>
                      <div className="mt-2 text-lg font-semibold text-gray-900">₹{Number(p.price).toLocaleString('en-IN')}</div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button onClick={() => addToCart(p)} className="inline-flex items-center justify-center gap-2 text-sm bg-green-600 text-white py-1 rounded-lg hover:bg-green-700 transition">
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 text-sm border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition">
                          <Heart className="w-4 h-4" />
                          Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
