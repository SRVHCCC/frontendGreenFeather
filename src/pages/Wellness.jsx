import React, { useState, useMemo, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { Link } from "react-router-dom";
import SidebarFilter from "../common/SidebarFilter";


const Wellness = () => {
  const [activeTab, setActiveTab] = useState("Fashion");

  const categories = [
    {
      name: "Fashion",
      title: "Fashion Wellness You Like",
      items: [
        {
          img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
          label: "Dresses",
        },
        {
          img: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop",
          label: "Knits",
        },
        {
          img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
          label: "Jackets",
        },
        {
          img: "https://images.unsplash.com/photo-1503342217505-b0a15cf70489?q=80&w=800&auto=format&fit=crop",
          label: "Jewelry",
        },
        {
          img: "https://images.unsplash.com/photo-1520975918318-3e73e93d1c8b?q=80&w=800&auto=format&fit=crop",
          label: "Shoes",
        },
      ],
    },
    {
      name: "Home & Living",
      title: "Refresh Your Space",
      items: [
        {
          img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop",
          label: "Dining",
        },
        {
          img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop",
          label: "Home Decor",
        },
        {
          img: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?q=80&w=800&auto=format&fit=crop",
          label: "Kitchen",
        },
        {
          img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
          label: "Health & Beauty",
        },
        {
          img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=800&auto=format&fit=crop",
          label: "Furniture",
        },
      ],
    },
    {
      name: "Electronics",
      title: "Top Electronics",
      items: [
        {
          img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop",
          label: "Smartphones",
        },
        {
          img: "https://images.unsplash.com/photo-1580910051073-d65ac1ee6d9d?q=80&w=800&auto=format&fit=crop",
          label: "Laptops",
        },
        {
          img: "https://images.unsplash.com/photo-1606813902860-1a4a9df6eeb5?q=80&w=800&auto=format&fit=crop",
          label: "Headphones",
        },
        {
          img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b18?q=80&w=800&auto=format&fit=crop",
          label: "Cameras",
        },
        {
          img: "https://images.unsplash.com/photo-1580894908361-967195033215?q=80&w=800&auto=format&fit=crop",
          label: "Smart Watches",
        },
      ],
    },
  ];

  const activeCategory = categories.find((c) => c.name === activeTab);

  const baseProducts = useMemo(() => {
    const keyword = activeCategory ? activeCategory.name : "";
    if (!keyword) return products;
    return products.filter(p => {
      const hay = `${p.name || ''} ${p.brand || ''} ${p.category || ''}`.toLowerCase();
      return hay.includes(keyword.toLowerCase());
    });
  }, [activeCategory]);

  const [filteredProducts, setFilteredProducts] = useState(baseProducts);
  useEffect(() => setFilteredProducts(baseProducts), [baseProducts]);

  return (
    <Layout>
      <div className="bg-gray-100 py-10">

         {/* Active Category Header */}
         {activeCategory && (
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              {activeCategory.title}
            </h2>
          )}
          
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveTab(cat.name)}
                className={`px-6 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                  activeTab === cat.name
                    ? "bg-green-600 text-white border-green-600 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-green-100"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

         

          {/* Sidebar + Product Grid */}
          <div className="flex gap-6">
            <aside className="w-64 flex-shrink-0 hidden md:block">
              <div className="sticky top-20">
                <SidebarFilter products={baseProducts} onFilter={setFilteredProducts} />
              </div>
            </aside>

            {/* Mobile Filter */}
            <div className="md:hidden w-full mb-4">
              <SidebarFilter products={baseProducts} onFilter={setFilteredProducts} />
            </div>

            <main className="flex-1">
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredProducts.length} of {baseProducts.length} products
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300 p-3 flex flex-col"
                    >
                      <Link to={`/products/${p.id}`} className="flex flex-col h-full">
                        <div className="w-full h-48 flex items-center justify-center bg-gray-50 rounded-md overflow-hidden">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="object-cover h-full w-full hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="mt-3 flex-grow">
                          <h3 className="text-sm font-medium text-gray-700 leading-tight line-clamp-2">
                            {p.name}
                          </h3>
                        </div>
                        <div className="mt-2 text-lg font-semibold text-gray-900">
                          ₹{p.price.toLocaleString('en-IN')}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your filters to see more results</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Wellness;
