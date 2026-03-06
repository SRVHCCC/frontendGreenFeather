import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import SidebarFilter from "../common/SidebarFilter";

const essentials = [
  {
    id: 1,
    name: "Smart Fitness Watch",
    price: "₹4,999",
    image:
      "https://images.unsplash.com/photo-1524594227085-0f0654e20314?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Noise Cancelling Headphones",
    price: "₹2,999",
    image:
      "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Stylish Running Shoes",
    price: "₹3,499",
    image:
      "https://images.unsplash.com/photo-1600181951920-7e3b1e46b4d8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Premium Leather Wallet",
    price: "₹1,299",
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Sports Yoga Mat",
    price: "₹899",
    image:
      "https://images.unsplash.com/photo-1574689049921-1c9d1a1d7bdf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: "₹1,499",
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2a12dd?auto=format&fit=crop&w=800&q=80",
  },
];

const Essentials = () => {
  const normalized = useMemo(() => essentials.map(d => ({
    ...d,
    price: typeof d.price === "number" ? d.price : Number(String(d.price).replace(/[^0-9.]/g, "")),
    category: "Essentials"
  })), []);
  const [filtered, setFiltered] = useState(normalized);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
          Today's Best Deals
        </h1>

        <div className="flex gap-6">
          <aside className="w-64 flex-shrink-0 hidden md:block">
            <div className="sticky top-20">
              <SidebarFilter products={normalized} onFilter={setFiltered} />
            </div>
          </aside>

          <div className="md:hidden w-full mb-4">
            <SidebarFilter products={normalized} onFilter={setFiltered} />
          </div>

          <main className="flex-1">
            <div className="mb-4 text-sm text-gray-600">
              Showing {filtered.length} of {normalized.length} products
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition p-3 flex flex-col"
            >
              <Link to={`/products/${item.id}`} className="flex flex-col h-full">
                <div className="w-full h-48 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover h-full w-full rounded-md"
                  />
                </div>
                <div className="mt-3 flex-grow">
                  <h3 className="text-sm font-medium text-gray-700 leading-tight line-clamp-2">
                    {item.name}
                  </h3>
                </div>
                <div className="mt-2 text-lg font-semibold text-gray-900">
                  ₹{item.price.toLocaleString('en-IN')}
                </div>
                <button className="mt-2 text-sm bg-yellow-400 text-gray-900 rounded-md py-1 hover:bg-yellow-500 transition">
                  View Details
                </button>
              </Link>
            </div>
          ))}
        </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Essentials;
