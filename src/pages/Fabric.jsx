import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";

const Fabric = () => {
  const { topic = "watch" } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `/api/products?search=${encodeURIComponent(topic)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, 
            },
          }
        );
        setProducts(res.data.data);
      } catch (err) {
        console.error("Error fetching products:", err.response?.data || err);
      }
    };

    fetchProducts();
  }, [topic]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Products related to “{topic}”
          </h1>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden"
                >
                  <img
                    src={p.image || "https://via.placeholder.com/300"}
                    alt={p.name}
                    className="w-full h-56 object-contain bg-gray-50"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {p.name}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No products found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Fabric;
