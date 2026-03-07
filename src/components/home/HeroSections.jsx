import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import API_URL from "../../config/config";
import { motion } from "framer-motion";

const HeroSections = ({
  heightClass = "h-[55vh] md:h-[60vh] lg:h-[60vh] bg-[#FCF8F3]"
}) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHeroData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/hero/banner/get-hero`);
      console.log("hero response:", res.data);

      const sliderSections = (res.data || []).filter(
        (section) =>
          section.isActive !== false &&
          Array.isArray(section.items) &&
          section.items.length > 0
      );

      setBanners(sliderSections);
    } catch (err) {
      console.error("Error fetching hero data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroData();
  }, []);

  // ✅ image path fix
  const getImageUrl = (url) => {
    if (!url) return "";

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return `${API_URL}/${url.replace(/^\//, "")}`;
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-gray-500 font-medium">
        Loading Banners...
      </div>
    );
  }

  if (!banners.length) return null;

  return (
    <div className="w-full">
      {banners.map((section) => (
        <section key={section._id} className="w-full relative">
          <Swiper
            loop={section.items.length > 1}
            modules={[Autoplay, Pagination]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            speed={900}
            className={`w-full ${heightClass} rounded-2xl`}
          >
            {section.items.map((item, i) => (
              <SwiperSlide key={i}>
                <Link
                  to={
                    item.linkType === "category"
                      ? `/products?category=${item.linkId}`
                      : `/product/${item.linkId}`
                  }
                  className="block w-full h-full"
                >
                  <div className="relative w-full h-full overflow-hidden">

                    <motion.img
                      initial={{ scale: 1.08 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 6 }}
                      src={getImageUrl(item.imageUrl)}
                      alt={section.sectionName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/1920x800?text=Image+Not+Found";
                      }}
                    />

                    <div className="absolute inset-0 bg-black/30" />

                    {item.title && (
                      <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                        <motion.h2
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.8 }}
                          className="text-white text-2xl md:text-4xl lg:text-5xl font-bold drop-shadow-xl"
                        >
                          {item.title}
                        </motion.h2>
                      </div>
                    )}

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