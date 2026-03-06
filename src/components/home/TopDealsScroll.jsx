import React, { useRef, useEffect, useState } from "react";

const CategoryAutoScroll = () => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const categories = [
    { name: "Accessories", image: "https://images.unsplash.com/photo-1506169894395-36397e4aaee4?w=600&auto=format&fit=crop&q=60" },
    { name: "Beauty", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&auto=format&fit=crop&q=60" },
    { name: "Essentials", image: "https://images.unsplash.com/photo-1597865927834-dfa12950143c?w=600&auto=format&fit=crop&q=60" },
    { name: "Fabric", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=60" },
    { name: "Men", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=60" },
    { name: "Wellness", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=60" },
    { name: "Women", image: "https://plus.unsplash.com/premium_photo-1663013422122-0464b0924dc0?w=600&auto=format&fit=crop&q=60" },
    { name: "Sustainable Choices", image: "https://plus.unsplash.com/premium_photo-1682089079211-80a6965c117e?w=600&auto=format&fit=crop&q=60" },
    { name: "Gift Boxes", image: "https://images.unsplash.com/photo-1674620213535-9b2a2553ef40?w=600&auto=format&fit=crop&q=60" },
  ];

  const displayItems = [...categories, ...categories];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId;
    let scrollPos = 0;

    const scroll = () => {
      if (!isPaused) {
        scrollPos += 0.8;

        if (scrollPos >= scrollContainer.scrollWidth / 2) {
          scrollPos = 0;
        }
        
        scrollContainer.scrollLeft = scrollPos;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  return (
    <section className="w-full bg-[#efefef] py-12 overflow-hidden">
      <div className="max-w-8xl mx-auto px-4">
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex overflow-x-hidden gap-8 md:gap-14 py-4 cursor-grab active:cursor-grabbing"
        >
          {displayItems.map((cat, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-5 flex-shrink-0 group w-28 md:w-36 lg:w-44"
            >
              <div className="relative p-[2px] rounded-full border border-[#D4C1A8] transition-all duration-500 group-hover:border-[#0f6416] group-hover:shadow-lg">
                <div className="rounded-full border-[3px] border-white p-[1px] shadow-sm">
                  <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center px-2">
                <span className="text-[10px] md:text-xs font-bold text-[#4A3F35] tracking-[0.2em] uppercase leading-tight block transition-colors group-hover:text-[#0f6416]">
                  {cat.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryAutoScroll;