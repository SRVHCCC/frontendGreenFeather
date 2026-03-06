import React, { useMemo, useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import HeroSections from "../components/home/HeroSections";
import TopDealsScroll from "../components/home/TopDealsScroll";
import SpecialOfferRow from "../components/home/SpecialOfferRow";
import RecommendedSection from "../components/home/RecommendedSection";
import HeroProductGrid from "../components/home/HeroProductGrid";
import api from "../lib/api";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState({
    topDeals: [],
    recommended: [],
    bestQuality: [],
    topRated: [],
    newArrivals: []
  });

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const [topDeals, recommended, bestQuality, topRated, allProducts] = await Promise.all([
        api.get('/hero/top/top-deals').catch(() => ({ data: { products: [] } })),
        api.get('/hero/top/trending').catch(() => ({ data: { products: [] } })),
        api.get('/hero/top/best-quality').catch(() => ({ data: { products: [] } })),
        api.get('/hero/top/top-rated').catch(() => ({ data: { products: [] } })),
        api.get('/products?limit=20').catch(() => ({ data: { data: { products: [] } } }))
      ]);

      setProducts({
        topDeals: topDeals.data?.products || [],
        recommended: recommended.data?.products || [],
        bestQuality: bestQuality.data?.products || [],
        topRated: topRated.data?.products || [],
        newArrivals: allProducts.data?.data?.products || []
      });
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatProduct = (p) => ({
    id: p._id || p.id,
    name: p.productName || p.name,
    image: p.image || p.images?.[0] || '/placeholder.png',
    price: p.price || 0,
    oldPrice: p.oldPrice,
    category: p.category?.name || p.category || 'PRODUCT',
    rating: p.rating || p.ratings?.average || 0,
    reviews: p.reviews || 0,
    discountPercent: p.discountPercent || 0,
  });

  const formatProducts = (items) => 
    Array.isArray(items) ? items.map(formatProduct) : [];

  const formattedProducts = useMemo(() => ({
    topDeals: formatProducts(products.topDeals),
    recommended: formatProducts(products.recommended),
    bestQuality: formatProducts(products.bestQuality),
    topRated: formatProducts(products.topRated),
    newArrivals: formatProducts(products.newArrivals)
  }), [products]);

  const handleProductSelect = (product) => {
    console.log('Product selected:', product);
  };

  if (error && loading) {
    return (
      <Layout>
        <div className="w-full min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10a4 4 0 018 0m-7 2h6m-3-9V3m0 0H9m3 0h3" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">{error}</p>
            <button 
              onClick={fetchAllProducts}
              className="mt-6 px-6 py-2.5 bg-[#0f6416] text-white font-bold rounded-lg hover:bg-[#0d5612] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white">
        <div className="pt-3 md:pt-6 pb-4 md:pb-6">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <HeroSections heightClass="h-[260px] md:h-[480px]" />
          </div>
        </div>

        {formattedProducts.topDeals.length > 0 && !loading && (
          <div className="border-b border-gray-100">
            <TopDealsScroll
              items={formattedProducts.topDeals}
              autoScroll={true}
              onItemClick={handleProductSelect}
            />
          </div>
        )}

        {formattedProducts.recommended.length > 0 && !loading && (
          <div className="border-b border-gray-100">
            <RecommendedSection 
              products={formattedProducts.recommended} 
              onSelect={handleProductSelect}
            />
          </div>
        )}

        <div className=" border-b border-gray-100">
          <SpecialOfferRow />
        </div>
        {formattedProducts.newArrivals.length > 0 && !loading && (
          <div className=" border-b border-gray-100">
            <HeroProductGrid
              title="New Arrivals"
              products={formattedProducts.newArrivals}
              onSelect={handleProductSelect}
            />
          </div>
        )}
      </div>

      {loading && (
        <div className="w-full bg-white">
          <LoadingSkeleton />
        </div>
      )}
    </Layout>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-12 pt-8">
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <div className="h-12 bg-gray-200 rounded-lg w-1/4 animate-pulse mb-8"></div>
      <div className="flex gap-6 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-48 space-y-3">
            <div className="w-48 h-48 bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default HomePage;