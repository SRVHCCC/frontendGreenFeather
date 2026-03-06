import React from "react";
import { ChevronRight } from "lucide-react";

const ProductCard = ({ image, title, offer, offerColor }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-white">
      <div className="w-full aspect-square mb-3 flex items-center justify-center">
        <img 
          src={image} 
          alt={title}
          className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
      </div>
      <div className="text-sm font-medium text-gray-800 mb-1">{title}</div>
      <div className={`text-sm font-semibold ${offerColor}`}>{offer}</div> 
    </div>
  );
};

const DiscoveryCard = ({ title, products }) => {
  return (
    <div className="bg-white rounded shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <button className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors">
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-px bg-gray-100">
        {products.map((product, idx) => (
          <ProductCard key={idx} {...product} />
        ))}
      </div>
    </div>
  );
};

const DiscoverySection = () => {
  const sections = [
    {
      title: "Make your home stylish",
      products: [
        { 
          image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop",
          title: "Inflatable Sofas", 
          offer: "Min. 50% Off",
          offerColor: "text-green-600"
        },
        { 
          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop",
          title: "Shoe Rack", 
          offer: "Min. 50% Off",
          offerColor: "text-green-600"
        },
        { 
          image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300&h=300&fit=crop",
          title: "Collapsible Wardrobes", 
          offer: "Min. 50% Off",
          offerColor: "text-green-600"
        },
        { 
          image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=300&h=300&fit=crop",
          title: "Kitchen Trolleys", 
          offer: "Min. 50% Off",
          offerColor: "text-green-600"
        },
      ],
    },
    {
      title: "Top Rated",
      products: [
        { 
          image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop",
          title: "Study Lamps", 
          offer: "Grab Now",
          offerColor: "text-green-600"
        },
        { 
          image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
          title: "Mobiles", 
          offer: "Bestsellers",
          offerColor: "text-green-600"
        },
        { 
          image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&h=300&fit=crop",
          title: "Plain Cases & Covers", 
          offer: "Grab Now",
          offerColor: "text-green-600"
        },
        { 
          image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop",
          title: "Screen Guards", 
          offer: "Big Savings",
          offerColor: "text-green-600"
        },
      ],
    },
    {
      title: "Top picks of the sale",
      products: [
        { 
          image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop",
          title: "Face Wash", 
          offer: "Min. 50% Off",
          offerColor: "text-green-600"
        },
        { 
          image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=300&fit=crop",
          title: "Moisturizer", 
          offer: "Min. 50% Off",
          offerColor: "text-green-600"
        },
        { 
          image: "https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=300&h=300&fit=crop",
          title: "Deodorants", 
          offer: "Min. 50% Off",
          offerColor: "text-green-600"
        },
        { 
          image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop",
          title: "Deodorant Roll-ons", 
          offer: "Min. 50% Off",
          offerColor: "text-green-600"
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1440px]  mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, idx) => (
          <DiscoveryCard key={idx} {...section} />
        ))}
      </div>
    </div>
  );
};

export default DiscoverySection;