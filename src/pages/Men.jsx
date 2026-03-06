import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import SidebarFilter from "../common/SidebarFilter";

const men = [
  { id: 1, name: "Smartphone X Pro", price: "₹49,999", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80" },
  { id: 2, name: "Wireless Earbuds", price: "₹3,499", image: "https://images.unsplash.com/photo-1580894894513-7e5451f6211d?auto=format&fit=crop&w=800&q=80" },
  { id: 3, name: "Laptop Ultra 15\"", price: "₹79,999", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80" },
  { id: 4, name: "Smartwatch Series 7", price: "₹8,999", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80" },
  { id: 5, name: "Bluetooth Speaker", price: "₹2,499", image: "https://images.unsplash.com/photo-1585386959984-a415522a65f2?auto=format&fit=crop&w=800&q=80" },
  { id: 6, name: "Gaming Console Pro", price: "₹39,999", image: "https://images.unsplash.com/photo-1606813909482-6b10f017d407?auto=format&fit=crop&w=800&q=80" },
];

const Men = () => {
  const normalized = useMemo(
    () =>
      men.map((p) => ({
        ...p,
        price: typeof p.price === "number" ? p.price : Number(String(p.price).replace(/[^0-9.]/g, "")),
        category: "Men",
      })),
    []
  );
  const [filtered, setFiltered] = useState(normalized);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
          Men Collection
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
              {filtered.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition p-3 flex flex-col"
                >
                  <div className="w-full h-48 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover h-full w-full rounded-md"
                    />
                  </div>
                  <div className="mt-3 flex-grow">
                    <h3 className="text-sm font-medium text-gray-700 leading-tight line-clamp-2">
                      {product.name}
                    </h3>
                  </div>
                  <div className="mt-2 text-lg font-semibold text-gray-900">
                    ₹{product.price.toLocaleString("en-IN")}
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Men;
