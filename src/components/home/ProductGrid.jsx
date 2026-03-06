import React from "react";

const ProductGrid = ({ products, onSelect, cols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" }) => {
  if (!products?.length) return null;

  return (
    <div className={`grid ${cols} gap-4`}>
      {products.map((p) => (
        <div
          key={p.id}
          className="bg-white rounded-2xl border p-3 hover:shadow-md cursor-pointer transition"
          onClick={() => onSelect?.(p)}
        >
          <div className="w-full h-36 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
            <img src={p.image} alt={p.name} className="object-contain h-full" />
          </div>

          <div className="mt-2">
            <p className="text-sm font-semibold text-gray-900 line-clamp-2">{p.name}</p>
            <p className="text-xs text-gray-500 mt-1">{p.brand} • {p.delivery}</p>

            <div className="flex items-center justify-between mt-2">
              <div className="font-bold text-gray-900">₹{p.price?.toLocaleString("en-IN")}</div>
              {p.discountPercent ? (
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full">
                  {p.discountPercent}% OFF
                </span>
              ) : null}
            </div>

            <div className="text-xs text-gray-600 mt-1">
              ⭐ {p.rating} ({p.reviews})
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
