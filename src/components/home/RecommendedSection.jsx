import React, { useRef, useState, useEffect } from "react";
import { ShoppingBag, Heart, Eye } from "lucide-react";

const RecommendedSection = () => {
  const scrollRef = useRef(null);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const handleClick = () => setActiveId(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const staticProducts = [
    { id: 1, name: "Premium Silk Saree", price: "4,299", oldPrice: "8,999", discount: "54", rating: 4.8, reviews: 1250, image: "https://images.unsplash.com/photo-1609748341905-080e077af4ca?w=600&auto=format&fit=crop&q=60" },
    { id: 2, name: "Designer Lehanga Choli", price: "12,499", oldPrice: "18,000", discount: "30", rating: 4.7, reviews: 850, image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1974&auto=format&fit=crop" },
    { id: 3, name: "Banarasi Silk", price: "6,999", oldPrice: "12,999", discount: "46", rating: 4.9, reviews: 2100, image: "https://images.unsplash.com/photo-1767955694884-d4bf352c23c2?w=600&auto=format&fit=crop&q=60" },
    { id: 4, name: "Embroidered Kurta Set", price: "2,199", oldPrice: "4,500", discount: "51", rating: 4.6, reviews: 430, image: "https://plus.unsplash.com/premium_photo-1756053419285-5bcb65ac6583?w=600&auto=format&fit=crop&q=60" },
    { id: 5, name: "Handwoven Cotton Saree", price: "3,499", oldPrice: "6,999", discount: "50", rating: 4.8, reviews: 3200, image: "https://images.unsplash.com/photo-1633052036653-699d4920a323?w=600&auto=format&fit=crop&q=60" },
    { id: 6, name: "Royal Ethnic Wear", price: "5,499", oldPrice: "9,999", discount: "45", rating: 4.7, reviews: 150, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1974&auto=format&fit=crop" }
  ];

  const handleCardClick = (e, product) => {
    e.stopPropagation();
    if (activeId === product.id) return;
    setActiveId(product.id);
  };

  return (
    <section className="w-full bg-[#efefef] py-5 md:py-5">
      <div className="container mx-auto px-4 md:px-10">

        <div className="flex flex-col items-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-[#4A2C2A] tracking-[0.2em] uppercase text-center">
            Trending Now
          </h2>
          <div className="h-[2px] w-16 bg-[#C4A484] mt-3"></div>
        </div>

        <div className="relative group">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-30 bg-white shadow-xl rounded-full p-3 text-[#4A2C2A] hover:bg-[#4A2C2A] hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden lg:flex items-center justify-center border border-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-30 bg-white shadow-xl rounded-full p-3 text-[#4A2C2A] hover:bg-[#4A2C2A] hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden lg:flex items-center justify-center border border-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {staticProducts.map((p) => (
              <div
                key={p.id}
                onClick={(e) => handleCardClick(e, p)}
                className="flex-none w-[260px] md:w-[280px] lg:w-[300px] xl:w-[320px] snap-start group/card cursor-pointer"
              >
                <div className="relative aspect-[3/4] min-h-[260px] overflow-hidden rounded-xl border border-gray-100 bg-[#F9F9F9] shadow-sm">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                  />

                  <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    <span className="bg-white text-black text-[9px] font-bold px-2 py-1 rounded-sm shadow-sm uppercase">
                      NEW
                    </span>
                    <span className="bg-[#E62E2E] text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-md">
                      -{p.discount}%
                    </span>
                  </div>

                  <div
                    className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 z-10
                    ${activeId === p.id ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"}
                    group-hover/card:translate-x-0 group-hover/card:opacity-100`}
                  >
                    <button onClick={(e) => e.stopPropagation()} className="bg-white p-2 rounded-full shadow-lg hover:bg-[#4A2C2A] hover:text-white transition-colors">
                      <Heart size={16} />
                    </button>
                    <button onClick={(e) => e.stopPropagation()} className="bg-white p-2 rounded-full shadow-lg hover:bg-[#4A2C2A] hover:text-white transition-colors">
                      <Eye size={16} />
                    </button>
                  </div>

                  <div
                    className={`absolute bottom-0 left-0 right-0 h-[64px] p-2 flex items-center
                    transition-transform duration-300 ease-out z-20
                    ${activeId === p.id ? "translate-y-0" : "translate-y-full"}
                    group-hover/card:translate-y-0`}
                  >
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="w-full h-full bg-white text-black font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg hover:bg-[#4A2C2A] hover:text-white transition-all text-[11px] tracking-widest uppercase"
                    >
                      <ShoppingBag size={14} />
                      Add to Cart
                    </button>
                  </div>

                  <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/5 transition-colors duration-300" />
                </div>

                <div className="mt-4 text-center space-y-1">
                  <h3 className="text-xs md:text-sm font-bold text-gray-800 uppercase tracking-tight line-clamp-1 group-hover/card:text-[#4A2C2A]">
                    {p.name}
                  </h3>

                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center text-[#C4A484] text-[10px] font-bold">
                      <span>{p.rating}</span>
                      <span className="ml-0.5">★</span>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      ({p.reviews?.toLocaleString() || "1k+"})
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-base font-bold text-[#4A2C2A]">₹{p.price}</span>
                    <span className="text-[10px] md:text-xs text-gray-400 line-through">₹{p.oldPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default RecommendedSection;