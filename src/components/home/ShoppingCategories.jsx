import React from "react";

const SectionCard = ({ title, items }) => {
  return (
    <div className="bg-white p-4 shadow-sm flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col space-y-2 cursor-pointer">
            <div className="bg-gray-100  overflow-hidden aspect-square">
              <img
                src={item.image}
                alt={item.label}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{item.label}</p>
              {item.subtitle && (
                <p className="text-sm font-bold text-green-600">{item.subtitle}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ShoppingSections = () => {
  const sections = [
    {
      title: "Best quality",
      items: [
        {
          image:
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
          label: "White Men's Casual Shoes",
          subtitle: "Specials",
        },
        {
          image:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
          label: "WROGN Duffel Bags",
          subtitle: "In Focus Now",
        },
        {
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
          label: "Wireless Headphones",
          subtitle: "Popular",
        },
        {
          image:
            "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=400&h=400&fit=crop",
          label: "Men's Kurtas",
          subtitle: "Grab Or Gone",
        },
      ],
    },
    {
      title: "Top Selection",
      items: [
        {
          image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
          label: "AUSK Men's T-shirts",
          subtitle: "Specials",
        },
        {
          image:
            "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&h=400&fit=crop",
          label: "Shirts",
          subtitle: "Special offer",
        },
        {
          image:
            "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=400&h=400&fit=crop",
          label: "Washing Machines",
          subtitle: "New Range",
        },
        {
          image:
            "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
          label: "WANTED Men's Jeans",
          subtitle: "Grab Or Gone",
        },
      ],
    },
    {
      title: "Men's Casual Shoes For You",
      items: [
        {
          image:
            "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop",
          label: "White color",
          subtitle: "4 Stars and Above",
        },
        {
          image:
            "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400&h=400&fit=crop",
          label: "Best Discounts",
          subtitle: "Min. 70% Off",
        },
        {
          image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
          label: "Best Brands",
          subtitle: "Top Collection",
        },
        {
          image:
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
          label: "Sneakers",
          subtitle: "Best Selling Products",
        },
      ],
    },
  ];

  return (
    <section className="py-6 bg-gray-50 w-full">
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Grid layout instead of flex to remove scroll */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((section, idx) => (
            <SectionCard key={idx} title={section.title} items={section.items} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShoppingSections;
