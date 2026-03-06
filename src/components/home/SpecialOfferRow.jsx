import React, { useState, useEffect } from "react";
import { ShoppingBag, Heart, Eye } from "lucide-react";

const SpecialOfferRow = () => {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const handleClick = () => setActiveId(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const staticOffers = [
    { id: 1, title: "Electronics Fest", price: "1,299", oldPrice: "2,999", discount: "54", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop" },
    { id: 2, title: "Fashion Deals", price: "1,299", oldPrice: "2,999", discount: "54", image: "https://images.unsplash.com/photo-1760692557212-35df14cb646c?w=600&auto=format&fit=crop&q=60" },
    { id: 3, title: "Beauty Picks", price: "1,299", oldPrice: "2,999", discount: "54", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1787&auto=format&fit=crop" },
    { id: 4, title: "Home Offers", price: "1,299", oldPrice: "2,999", discount: "54", image: "https://images.unsplash.com/photo-1581209410127-8211e90da024?w=600&auto=format&fit=crop&q=60" },
    { id: 5, title: "Premium Gadgets", price: "1,299", oldPrice: "2,999", discount: "54", image: "https://images.unsplash.com/photo-1760462788182-11198e9a3354?w=600&auto=format&fit=crop&q=60" },
    { id: 6, title: "Exclusive Apparel", price: "1,299", oldPrice: "2,999", discount: "54", image: "https://images.unsplash.com/photo-1600609842388-3e2ed2a1454a?w=600&auto=format&fit=crop&q=60" }
  ];

  const handleCardClick = (e, offer) => {
    e.stopPropagation();
    if (activeId === offer.id) {
      return;
    } else {
      setActiveId(offer.id);
    }
  };

  return (
    <section className="w-full bg-[#efefef]">
      <div className="container mx-auto px-4 md:px-10">

        <div className="flex flex-col items-center mb-10 md:mb-14 text-center rounded-lg p-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#4A2C2A] tracking-[0.2em] uppercase">
            Special Offers
          </h2>
          <div className="h-[2px] w-16 bg-[#C4A484] mt-3"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {staticOffers.map((o) => (
            <div
              key={o.id}
              className="group relative flex flex-col cursor-pointer mb-10"
              onClick={(e) => handleCardClick(e, o)}
            >
              <div className="relative aspect-[3/4] min-h-[220px] overflow-hidden rounded-xl shadow-sm border border-white/50 bg-white">
                <img
                  src={o.image}
                  alt={o.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                  <span className="bg-white text-black text-[10px] font-bold px-3 py-1 rounded-sm shadow-sm">
                    NEW
                  </span>
                  <span className="bg-[#E62E2E] text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-sm shadow-md">
                    -{o.discount}%
                  </span>
                </div>

                <div
                  className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 z-10
                  ${activeId === o.id ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}
                  group-hover:translate-x-0 group-hover:opacity-100`}
                >
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white p-2.5 rounded-full shadow-lg hover:bg-[#4A2C2A] hover:text-white transition-colors"
                  >
                    <Heart size={18} />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white p-2.5 rounded-full shadow-lg hover:bg-[#4A2C2A] hover:text-white transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                </div>

                <div
                  className={`absolute bottom-0 left-0 right-0 h-[64px] p-2 flex items-center
                  transition-transform duration-300 ease-out z-20
                  ${activeId === o.id ? "translate-y-0" : "translate-y-full"}
                  group-hover:translate-y-0`}
                >
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-white/95 backdrop-blur-sm text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-xl hover:bg-[#4A2C2A] hover:text-white transition-all text-[10px] tracking-widest uppercase"
                  >
                    <ShoppingBag size={18} />
                    Add to Cart
                  </button>
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>

              <div className="mt-4 text-center space-y-1">
                <h3 className="text-sm md:text-base font-bold text-gray-800 uppercase tracking-tight line-clamp-1">
                  {o.title}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[#4A2C2A] font-bold text-lg">₹{o.price}</span>
                  <span className="text-gray-400 text-xs line-through font-medium">₹{o.oldPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SpecialOfferRow;