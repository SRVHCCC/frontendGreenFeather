import React, { useState, useEffect } from "react";
import { ShoppingBag, Heart, Eye } from "lucide-react";

const HeroProductGrid = ({ title, onSelect }) => {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const handleClick = () => setActiveId(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const products = [
    { id: 1, name: "Electronics Fest", price: 1299, oldPrice: 2999, discountPercent: 54, rating: 4.8, reviews: 1250, image: "https://images.unsplash.com/photo-1621173425590-b906095b9e4e?w=600&auto=format&fit=crop&q=60" },
    { id: 2, name: "Fashion Deals", price: 1299, oldPrice: 2999, discountPercent: 54, rating: 4.7, reviews: 850, image: "https://plus.unsplash.com/premium_photo-1700762895704-022af5486edf?w=600&auto=format&fit=crop&q=60" },
    { id: 3, name: "Beauty Picks", price: 1299, oldPrice: 2999, discountPercent: 54, rating: 4.9, reviews: 2100, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1787&auto=format&fit=crop" },
    { id: 4, name: "Home Offers", price: 1299, oldPrice: 2999, discountPercent: 54, rating: 4.6, reviews: 430, image: "https://images.unsplash.com/photo-1581209410127-8211e90da024?w=600&auto=format&fit=crop&q=60" },
    { id: 5, name: "Sustainable Choices", price: 1299, oldPrice: 2999, discountPercent: 54, rating: 4.8, reviews: 3200, image: "https://plus.unsplash.com/premium_photo-1664303597346-9b8144bd3c7e?w=600&auto=format&fit=crop&q=60" },
    { id: 6, name: "Wellness", price: 1299, oldPrice: 2999, discountPercent: 54, rating: 4.7, reviews: 1800, image: "https://plus.unsplash.com/premium_photo-1675195905377-e78fccd629c9?w=600&auto=format&fit=crop&q=60" }
  ];

  const handleCardClick = (e, product) => {
    e.stopPropagation();
    if (activeId === product.id) {
      onSelect?.(product);
    } else {
      setActiveId(product.id);
    }
  };

  return (
    <section className="w-full bg-[#efefef] py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-10">

        <div className="flex flex-col items-center mb-10 md:mb-14 text-center mt-5 bg-[#FCF8F3] rounded-lg shadow-sm p-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#4A2C2A] tracking-[0.2em] uppercase">
            {title || "Trending Now"}
          </h2>
          <div className="h-[2px] w-16 bg-[#C4A484] mt-3"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="group relative flex flex-col cursor-pointer transition-all duration-500"
              onClick={(e) => handleCardClick(e, p)}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl  bg-white shadow-sm">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                  <span className="bg-white text-black text-[9px] font-bold px-2 py-1 rounded-sm shadow-sm uppercase">
                    NEW
                  </span>
                  <span className="bg-[#E62E2E] text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-md">
                    -{p.discountPercent}%
                  </span>
                </div>

                <div
                  className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 z-10
                  ${activeId === p.id ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"}
                  group-hover:translate-x-0 group-hover:opacity-100`}
                >
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white p-2.5 rounded-full shadow-lg text-gray-700 hover:bg-[#4A2C2A] hover:text-white transition-all"
                  >
                    <Heart size={18} />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white p-2.5 rounded-full shadow-lg text-gray-700 hover:bg-[#4A2C2A] hover:text-white transition-all"
                  >
                    <Eye size={18} />
                  </button>
                </div>

                <div
                  className={`absolute bottom-0 left-0 right-0 p-3 transition-transform duration-300 ease-out z-20
                  ${activeId === p.id ? "translate-y-0" : "translate-y-full"}
                  group-hover:translate-y-0`}
                >
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-white/95 backdrop-blur-sm text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-xl hover:bg-[#4A2C2A] hover:text-white transition-all text-[10px] tracking-widest uppercase"
                  >
                    <ShoppingBag size={16} />
                    Add to Cart
                  </button>
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>

              <div className="py-4 text-center space-y-1">
                <h3 className="text-xs md:text-sm font-bold text-gray-800 uppercase tracking-tight line-clamp-1 group-hover:text-[#4A2C2A]">
                  {p.name}
                </h3>

                <div className="flex items-center justify-center gap-2">
                  <div className="flex items-center text-[#C4A484] text-[10px] font-bold">
                    <span>{p.rating}</span>
                    <span className="ml-0.5">★</span>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    ({p.reviews.toLocaleString()})
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-base font-bold text-[#4A2C2A]">
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] md:text-xs text-gray-400 line-through font-medium">
                    ₹{p.oldPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button className="px-10 py-3 border-2 border-[#4A2C2A] text-[#4A2C2A] font-bold text-[11px] tracking-[0.2em] uppercase hover:bg-[#4A2C2A] hover:text-white transition-all rounded-md duration-300">
            View All Collection
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroProductGrid;