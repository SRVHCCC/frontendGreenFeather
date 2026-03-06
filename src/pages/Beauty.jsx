import React, { useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import SidebarFilter from "../common/SidebarFilter";
import { Link } from "react-router-dom";

const Beauty = () => {
  const sorted = useMemo(() => {
    const list = [
      { id: 401, name: "Noise Cancelling Over-Ear Headphones", price: 5999, image: "https://images.unsplash.com/photo-1518442530017-7db35be2d2aa?w=800&auto=format&fit=crop", category: "Electronics", brand: "SoundBox", rating: 4.8 },
      { id: 402, name: "Premium Stainless Steel Bottle", price: 1299, image: "https://images.unsplash.com/photo-1526404804178-8df90110d3aa?w=800&auto=format&fit=crop", category: "Home & Kitchen", brand: "AquaPure", rating: 4.7 },
      { id: 403, name: "Classic Canvas Sneakers", price: 1999, image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop", category: "Fashion", brand: "UrbanLeaf", rating: 4.6 },
      { id: 404, name: "4K Action Camera", price: 8999, image: "https://images.unsplash.com/photo-1519181245277-cffeb31da2a5?w=800&auto=format&fit=crop", category: "Electronics", brand: "PhotoPro", rating: 4.6 },
      { id: 405, name: "Smart Fitness Band Pro", price: 2499, image: "https://images.unsplash.com/photo-1599058917212-d4f3d0f9df1a?w=800&auto=format&fit=crop", category: "Electronics", brand: "FitTrack", rating: 4.5 },
      { id: 406, name: "Ergonomic Office Chair", price: 10999, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop", category: "Home & Kitchen", brand: "ComfortCo", rating: 4.5 },
      { id: 407, name: "Wireless Bluetooth Speaker Mini", price: 1599, image: "https://images.unsplash.com/photo-1605648916319-cf082f7524a1?w=800&auto=format&fit=crop", category: "Electronics", brand: "BeatGo", rating: 4.4 },
      { id: 408, name: "Everyday Slim Laptop Sleeve", price: 1499, image: "https://images.unsplash.com/photo-1587613865768-3b2a8b1f3a35?w=800&auto=format&fit=crop", category: "Electronics", brand: "CarryPro", rating: 4.4 },
    ];
    return list.sort((a, b) => (b.rating || 0) - (a.rating || 0) || b.price - a.price);
  }, []);

  const [filtered, setFiltered] = useState(sorted);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 md:px-10 py-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Bestsellers</h1>
          <div className="flex gap-6">
            <aside className="w-72 flex-shrink-0 hidden md:block">
              <div className="sticky top-24">
                <SidebarFilter products={sorted} onFilter={setFiltered} />
              </div>
            </aside>

            <div className="md:hidden w-full mb-4">
              <SidebarFilter products={sorted} onFilter={setFiltered} />
            </div>

            <main className="flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filtered.map((p, idx) => (
                  <Link key={p.id} to={`/products/${p.id}`} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition relative">
                    <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">#{idx + 1}</span>
                    <div className="w-full h-44 bg-gray-50 flex items-center justify-center overflow-hidden">
                      <img src={p.image} alt={p.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{p.name}</h3>
                      <div className="mt-2 text-lg font-semibold text-gray-900">₹{Number(p.price).toLocaleString('en-IN')}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Beauty;


