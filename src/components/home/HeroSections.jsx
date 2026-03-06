import React, { useState } from "react";
// import axios from "axios"; // Commented out for static mode
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
// import API_URL from "../../config/config"; // Commented out
import { motion } from "framer-motion";

// --- STATIC DATA WITH YOUR LINKS ---
const STATIC_BANNERS = [
  {
    _id: "1",
    items: [
      {
        imageUrl: "https://image2url.com/r2/default/images/1772789146940-c5d9a8e8-cb44-432e-a834-c17f7f4b8eac.jpeg",
        linkId: "category-1", 
      },
      {
        imageUrl: "https://image2url.com/r2/default/images/1772789126156-ae25718e-7ae4-4bf2-ad49-7126ac77d5df.jpeg",
        linkId: "category-2",
      },
      {
        imageUrl: "https://image2url.com/r2/default/images/1772789073056-75642f1a-2fff-40af-80ec-91f79fb65e8b.jpeg",
        linkId: "category-3",
      }
    ]
  }
];

const HeroSections = ({ heightClass = "h-[55vh] md:h-[60vh] lg:h-[60vh]" }) => {
  // Direct use of static data
  const [banners] = useState(STATIC_BANNERS);

  /* // DYNAMIC FETCHING DISABLED
  useEffect(() => {
    fetchHeroData();
  }, []); 
  */

  if (!banners.length) return null;

  return (
    <div className="w-full">
      {banners.map((section) => (
        <section key={section._id} className="w-full relative px-4 md:px-6">
          <Swiper
            loop={section.items.length > 1}
            modules={[Autoplay, Pagination, Navigation]}
            pagination={{ clickable: true }}
            navigation={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            speed={1000}
            className={`w-full ${heightClass} rounded-2xl overflow-hidden shadow-lg`}
          >
            {section.items.map((item, i) => (
              <SwiperSlide key={i}>
                <Link
                  to={`/products?category=${item.linkId}`}
                  className="block w-full h-full"
                >
                  <div className="relative w-full h-full">
                    <motion.img
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 5, ease: "easeOut" }}
                      src={item.imageUrl}
                      alt={`Slide ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/1920x800?text=Banner+Image";
                      }}
                    />
                    
                    {/* Dark Overlay removed so images look clean, adding very subtle one if needed */}
                    {/* <div className="absolute inset-0 bg-black/5" /> */}
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      ))}
    </div>
  );
};

export default HeroSections;