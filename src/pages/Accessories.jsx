import React, { useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import SidebarFilter from "../common/SidebarFilter";
import { Link } from "react-router-dom";

const Accessories = () => {
  const normalized = useMemo(() => ([
    { id: 301, name: "Eco Tote Bulk Pack (10)", price: 1999, image: "https://images.unsplash.com/photo-1593030761783-44c58b6c9133?w=800&auto=format&fit=crop", category: "Fashion", brand: "PureWear", rating: 4.0, colors: ["Beige"] },
    { id: 302, name: "Handmade Ceramic Cups (Set of 6)", price: 2499, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&auto=format&fit=crop", category: "Home & Kitchen", brand: "ClayWorks", rating: 4.3, colors: ["White"] },
    { id: 303, name: "Wooden Hangers (Pack of 20)", price: 1499, image: "https://images.unsplash.com/photo-1523380744952-b7f8d72e9c1f?w=800&auto=format&fit=crop", category: "Home & Kitchen", brand: "OakCraft", rating: 4.1, colors: ["Brown"] },
    { id: 304, name: "Retail Display Stands", price: 4999, image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop", category: "Electronics", brand: "DisplayPro", rating: 4.4, colors: ["Black"] },
    { id: 305, name: "Shipping Boxes Assorted (50)", price: 2799, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop", category: "Home & Kitchen", brand: "PackEasy", rating: 4.2, colors: ["Brown"] },
    { id: 306, name: "Barcode Label Printer", price: 6999, image: "https://images.unsplash.com/photo-1564732005956-20420ebdab60?w=800&auto=format&fit=crop", category: "Electronics", brand: "PrintEasy", rating: 4.5, colors: ["Black"] },
  ]), []);
  const [filtered, setFiltered] = useState(normalized);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 ">
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
              <div className="bg-white  rounded-xl p-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Discover Premium Accessories</h2>
                <p className="text-gray-600 text-sm mt-1">Browse through our curated collection of high-quality accessories for every need.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filtered.map((p) => (
                  <Link key={p.id} to={`/products/${p.id}`} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition">
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

export default Accessories;