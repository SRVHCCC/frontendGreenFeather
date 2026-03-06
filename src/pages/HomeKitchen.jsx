import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import SidebarFilter from "../common/SidebarFilter";

const products = [
  {
    id: 1,
    name: "Stainless Steel Cookware Set",
    price: "₹4,999",
    image: "https://images.unsplash.com/photo-1600181951920-7e3b1e46b4d8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Non-stick Frying Pan",
    price: "₹1,299",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e1ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Electric Kettle",
    price: "₹899",
    image: "https://images.unsplash.com/photo-1580734073657-7c4d9b9c5b22?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Wooden Cutting Board",
    price: "₹499",
    image: "https://images.unsplash.com/photo-1600185366320-f8578d2a58c8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Wooden Cutting Board",
    price: "₹499",
    image: "https://images.unsplash.com/photo-1600185366320-f8578d2a58c8?auto=format&fit=crop&w=800&q=80",
  },
];

const HomeKitchen = () => {
  const normalized = useMemo(
    () =>
      products.map((p) => ({
        ...p,
        price:
          typeof p.price === "number"
            ? p.price
            : Number(String(p.price).replace(/[^0-9.]/g, "")),
        category: "Home & Kitchen",
      })),
    []
  );

  const [filtered, setFiltered] = useState(normalized);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">
          Home & Kitchen Collection
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filtered.map((product) => (
                <Link
                  to={`/products/${product.id}`}
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition flex flex-col h-72 w-full"
                >
                  <div className="w-full h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <h3 className="text-sm font-medium text-gray-700 leading-tight line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="mt-2 text-lg font-semibold text-gray-900">
                      ₹{product.price.toLocaleString("en-IN")}
                    </div>
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

export default HomeKitchen;
