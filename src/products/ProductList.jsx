import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import SidebarFilter from "../common/SidebarFilter";
import { useWishlist } from "../context/WishlistContext";
import { Heart, Eye, X } from "lucide-react";
import axios from "axios";
import API_URL from "../config/config";

const ProductList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const search = (params.get("search") || "").toLowerCase();
  const category = params.get("category");

  const [productsList, setProductsList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [imageError, setImageError] = useState({});
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await axios.get(`${API_URL}/api/products`, {
          params: { category },
        });

        if (!mounted) return;

        if (res?.data?.success) {
          setProductsList(res.data.data?.products || []);
        } else {
          setProductsList([]);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
        setProductsList([]);
      } finally {
        if (mounted) setLoadingProducts(false);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [category]);

  const baseProducts = useMemo(() => {
    let list = Array.isArray(productsList) ? productsList : [];

    if (search) {
      list = list.filter((p) => {
        const title = p?.basicInfo?.title || "";
        const brand = p?.basicInfo?.brand || "";
        return `${title} ${brand}`.toLowerCase().includes(search);
      });
    }

    return list;
  }, [productsList, search]);

  useEffect(() => {
    setFilteredProducts(baseProducts);
  }, [baseProducts]);

  const { add, remove, has } = useWishlist();

  const handleProductClick = (product) => {
    navigate(`/products/${product._id}`, { state: { product } });
  };

  // Assume you store discountPercent & isNew in product data
  // If not, you can calculate discountPercent here
  // Example: const discountPercent = product.originalPrice ? Math.round(((original - selling) / original) * 100) : 0;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="w-full mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 max-w-none">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 py-6 lg:py-8">
            {/* Sidebar – fixed on desktop */}
            <aside className="hidden lg:block lg:w-72 xl:w-80 flex-shrink-0">
              <div className="sticky top-20">
                <SidebarFilter products={baseProducts} onFilter={setFilteredProducts} />
              </div>
            </aside>

            <main className="flex-1 w-full">
              {/* Mobile filter button */}
              <div className="lg:hidden mb-5">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Filters & Sort
                </button>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
                {category ? `${category}` : "All Products"}
                <span className="text-gray-500 text-xl ml-3">
                  ({filteredProducts.length})
                </span>
              </h2>

              {loadingProducts ? (
                <div className="text-center py-20 text-gray-500">
                  <div className="inline-block animate-spin text-4xl">⟳</div>
                  <p className="mt-4">Loading beautiful collection...</p>
                </div>
              ) : filteredProducts.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
                  {filteredProducts.map((product) => {
                    const productId = product._id;
                    const firstItem = product.items?.[0] || {};
                    const firstSize = firstItem.sizes?.[0] || {};
                    const price = firstSize.sellingPrice || 0;
                    const originalPrice = firstSize.originalPrice || price;
                    const imageUrl = firstItem.images?.[0]?.url || "";
                    const discountPercent = originalPrice > price
                      ? Math.round(((originalPrice - price) / originalPrice) * 100)
                      : 0;

                    const isNew = product.isNew || false; 

                    return (
                      <div
                        key={productId}
                        onClick={() => handleProductClick(product)}
                        className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                      >
                        <div className="relative pt-[125%] sm:pt-[133%] bg-gray-50 overflow-hidden">
                          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                            {isNew && (
                              <span className="bg-black text-white text-xs font-bold px-2.5 py-1 rounded">
                                NEW
                              </span>
                            )}
                            {discountPercent > 0 && (
                              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded">
                                -{discountPercent}%
                              </span>
                            )}
                          </div>

                          {/* Wishlist + Quick view */}
                          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                has(productId) ? remove(productId) : add(product);
                              }}
                              className="bg-white p-2.5 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                            >
                              <Heart
                                size={20}
                                className={has(productId) ? "fill-red-500 text-red-500" : "text-gray-700"}
                              />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Quick view logic if you want to add modal later
                              }}
                              className="bg-white p-2.5 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                            >
                              <Eye size={20} className="text-gray-700" />
                            </button>
                          </div>

                          {imageUrl && !imageError[productId] ? (
                            <img
                              src={`${API_URL}/${imageUrl}`}
                              alt={product?.basicInfo?.title}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={() => setImageError((p) => ({ ...p, [productId]: true }))}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                              No Image
                            </div>
                          )}
                        </div>

                        <div className="p-4 flex flex-col flex-1">
                          <p className="text-xs text-gray-500 truncate">
                            {product?.basicInfo?.brand || "Brand"}
                          </p>
                          <h3 className="text-sm font-medium line-clamp-2 mt-1.5 mb-2 group-hover:text-black transition-colors">
                            {product?.basicInfo?.title}
                          </h3>

                          <div className="mt-auto">
                            <div className="flex items-baseline gap-2">
                              <span className="font-bold text-lg text-gray-900">
                                ₹{price.toLocaleString("en-IN")}
                              </span>
                              {originalPrice > price && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{originalPrice.toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>

                            {/* Rating – add real data when available */}
                            <div className="flex items-center gap-1.5 mt-2 text-sm">
                              <span className="text-amber-500 font-semibold">4.8</span>
                              <span className="text-gray-400">★</span>
                              <span className="text-gray-500 text-xs">({Math.floor(Math.random() * 2000 + 300)})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-24 bg-white rounded-xl">
                  <p className="text-gray-600 text-lg">No products found in this collection</p>
                  <p className="text-gray-400 mt-2">Try changing filters or search term</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {isMobileFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div
            className={`fixed inset-y-0 left-0 z-[100] w-4/5 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 lg:hidden ${
              isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="font-bold text-xl">Filters</h3>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <X size={28} className="text-gray-700" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <SidebarFilter products={baseProducts} onFilter={(f) => {
                  setFilteredProducts(f);
                  setIsMobileFilterOpen(false);
                }} />
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default ProductList;