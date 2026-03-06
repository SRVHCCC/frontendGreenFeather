import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CategorySection = () => {
  const categories = [
    { name: 'Electronics', image: 'https://tse4.mm.bing.net/th/id/OIP.6NHdfr6OW9wU3z1FkunkNwAAAA?pid=Api&P=0&h=220' },
    { name: 'Fashion', image: 'https://tse4.mm.bing.net/th/id/OIP.-sklPa0-5_R4tuf-M-uktgHaDt?pid=Api&P=0&h=220' },
    { name: 'Home & Kitchen', image: 'https://tse3.mm.bing.net/th/id/OIP.cBGraDJg8GOdq8TsXm8ReAHaDb?pid=Api&P=0&h=220' },
  ];

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Shop by <span className="text-green-600">Category</span>
          </h2>
          <p className="mt-3 text-gray-500 text-lg">
            Explore our wide range of categories and find what suits you best
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link to={`/products?category=${encodeURIComponent(category.name)}`} key={index}>
              <motion.div
                className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Image with Gradient Overlay */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

                {/* Category Name */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center text-white">
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <p className="text-sm text-gray-200 mt-1 opacity-90">
                    Discover now
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
