import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { productsAPI } from "../lib/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import {
  Heart,
  Star,
  ShoppingCart,
  Truck,
  RotateCcw,
  Shield,
  ChevronLeft,
} from "lucide-react";
import API_URL from "../config/config";

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { addItem } = useCart();
  const { add, remove, has } = useWishlist();

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState(null);

  const [activeImage, setActiveImage] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const [isHovering, setIsHovering] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [lensStyle, setLensStyle] = useState({});
  const imgRef = useRef(null);

  useEffect(() => {
    if (product) return;
    (async () => {
      try {
        setLoading(true);
        const res = await productsAPI.getProduct(id);
        setProduct(res.data.product);
      } catch {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, product]);

  useEffect(() => {
    if (!product) return;
    const item = product.items?.[0];
    setSelectedItem(item);
    setActiveImage(item?.images?.[0]?.url || "");
    setSelectedSize(item?.sizes?.[0] || null);
  }, [product]);

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;

    const { left, top, width, height } = imgRef.current.getBoundingClientRect();

    let x = e.pageX - left - window.scrollX;
    let y = e.pageY - top - window.scrollY;

    x = Math.max(0, Math.min(x, width));
    y = Math.max(0, Math.min(y, height));

    const lensW = 150;
    const lensH = 150;

    const px = (x / width) * 100;
    const py = (y / height) * 100;

    setLensStyle({
      left: `${x - lensW / 2}px`,
      top: `${y - lensH / 2}px`,
      width: `${lensW}px`,
      height: `${lensH}px`,
      display: "block",
    });

    setZoomStyle({
      backgroundImage: `url(${API_URL}/${activeImage})`,
      backgroundPosition: `${px}% ${py}%`,
      backgroundSize: `${width * 2}px ${height * 2}px`,
    });

    setIsHovering(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-32 text-center">Loading product...</div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="py-32 text-center text-red-600">{error}</div>
      </Layout>
    );
  }

  const price = selectedSize?.sellingPrice || 0;
  const mrp = selectedSize?.basePrice || 0;
  const stock = selectedSize?.quantity || 0;
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const handleAddToCart = () => {
    if (!selectedSize) return alert("Please select size");
    addItem(
      {
        id: product._id,
        name: product.name,
        brand: product.brand,
        price,
        image: `${API_URL}/${activeImage}`,
        size: selectedSize.unit,
        color: selectedItem.color,
      },
      1,
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-6">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb - Desktop Only */}
          <nav className="mb-6 text-sm text-gray-600 hidden sm:flex gap-2">
            <Link to="/" className="hover:text-gray-900 font-medium">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-gray-900 font-medium">Products</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>

          {/* Mobile Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="sm:hidden mb-4 flex items-center gap-1.5 text-green-600 hover:text-green-700 font-semibold text-sm"
          >
            <ChevronLeft size={18} /> Back
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-2">
                  {selectedItem?.images?.map((img, i) => (
                    <img
                      key={i}
                      src={`${API_URL}/${img.url}`}
                      alt=""
                      onClick={() => setActiveImage(img.url)}
                      className={`w-16 h-20 object-cover cursor-pointer ${
                        activeImage === img.url ? "ring-2 ring-blue-600" : ""
                      }`}
                    />
                  ))}
                </div>

                <div className="flex-1 relative group overflow-hidden bg-white">
                  <div
                    className="relative cursor-crosshair"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <img
                      ref={imgRef}
                      src={`${API_URL}/${activeImage}`}
                      alt={product.name}
                      className="w-full h-[420px] object-contain"
                    />
                    {isHovering && (
                      <div
                        className="absolute pointer-events-none border-gray-400 bg-blue-400/20"
                        style={lensStyle}
                      ></div>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      has(product._id) ? remove(product._id) : add(product)
                    }
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow z-10"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        has(product._id) ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!stock}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 flex items-center justify-center gap-2 text-lg font-semibold disabled:bg-gray-400"
                >
                  <ShoppingCart /> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!stock}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-semibold disabled:bg-gray-400"
                >
                  Buy Now
                </button>
              </div>
            </div>

            <div className="relative">
              {isHovering && (
                <div
                  className="absolute inset-0 z-20 bg-white border shadow-xl rounded-lg overflow-hidden"
                  style={{
                    ...zoomStyle,
                    backgroundRepeat: "no-repeat",
                  }}
                ></div>
              )}

              <div
                className={`space-y-4 ${
                  isHovering ? "opacity-0" : "opacity-100 transition-opacity"
                }`}
              >
                <h1 className="text-2xl font-semibold">{product.name}</h1>
                <p className="text-sm text-gray-500 uppercase">{product.brand}</p>

                <div className="flex items-center gap-2">
                  <span className="bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1 text-sm">
                    {product.ratings?.average || 0} <Star size={14} />
                  </span>
                  <span className="text-sm text-gray-600">
                    {product.ratings?.count || 0} ratings
                  </span>
                </div>

                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold">₹{price}</span>
                  {mrp > price && (
                    <>
                      <span className="line-through text-gray-500">₹{mrp}</span>
                      <span className="text-green-600 font-semibold">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                {product.items.length > 1 && (
                  <div>
                    <p className="font-medium mb-2">Color</p>
                    <div className="flex gap-2">
                      {product.items.map((item, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSelectedItem(item);
                            setActiveImage(item.images[0]?.url);
                            setSelectedSize(item.sizes[0]);
                          }}
                          className={`px-3 py-1 ${
                            selectedItem === item
                              ? "border-b-2 border-blue-600 font-semibold"
                              : "text-gray-600"
                          }`}
                        >
                          {item.color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="font-medium mb-2">Size</p>
                  <div className="flex gap-2">
                    {selectedItem?.sizes?.map((s, i) => (
                      <button
                        key={i}
                        disabled={s.quantity === 0}
                        onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2 font-semibold ${
                          selectedSize?.unit === s.unit
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100"
                        } ${s.quantity === 0 && "opacity-40 cursor-not-allowed"}`}
                      >
                        {s.unit}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock */}
                <p className={stock ? "text-green-600" : "text-red-600"}>
                  {stock ? `In Stock (${stock})` : "Out of Stock"}
                </p>

                {product.seller && (
                  <div className="bg-white p-4 rounded shadow-sm">
                    <p className="font-semibold">Seller Information</p>
                    <p className="text-sm text-gray-600">{product.seller.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.seller.email}
                    </p>
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <Truck className="w-4" /> Free Delivery
                  </div>
                  <div className="flex gap-2">
                    <RotateCcw className="w-4" />{" "}
                    {product.returnPolicy?.duration || "7 days"} Return
                  </div>
                  <div className="flex gap-2">
                    <Shield className="w-4" /> Secure Payment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {product.highlights?.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 mt-10 bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Highlights</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {product.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        )}

        {product.specifications?.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 mt-6 bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Specifications</h2>
            <div className="space-y-3">
              {product.specifications.map((s, i) => (
                <div key={i} className="flex">
                  <p className="w-1/3 font-medium text-gray-700">{s.title}</p>
                  <p className="w-2/3 text-gray-600">
                    {s.description || s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;