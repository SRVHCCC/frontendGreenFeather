import React, { useState } from "react";
import {
  Lock,
  ChevronLeft,
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
  Gift,
} from "lucide-react";
import { useCart } from "../context/CartContext";
// import { ordersAPI } from "../lib/api";
import API_URL from "../config/config";
import { useAuth } from "../context/UnifiedAuthContext";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const [upiId, setUpiId] = useState("");
  const { items, getTotal, clear } = useCart();
  const navigate = useNavigate();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  return (
    <div className="min-h-screen bg-gray-200 sm:p-4 md:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto bg-white shadow-lg overflow-hidden sm:rounded-lg">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <ChevronLeft
              className="w-5 h-5 text-blue-600 cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <h1 className="text-base sm:text-lg font-semibold text-gray-900">
              Complete Payment
            </h1>
          </div>
          <div className="flex items-center gap-1 text-gray-700 text-xs sm:text-sm">
            <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
            <span className="font-medium hidden sm:inline">Secure Payment</span>
            <span className="font-medium sm:hidden">Secure</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
          {/* Left - Payment Methods */}
          <div className="flex-1 lg:max-w-md">
            <h2 className="text-sm font-semibold text-gray-900 mb-3 sm:hidden">
              Payment Methods
            </h2>

            {/* UPI Option */}
            <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-2 sm:mb-3 cursor-pointer hover:border-blue-500 hover:shadow-md transition">
              <div className="flex items-center gap-2 sm:gap-3 mb-1">
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  UPI
                </span>
              </div>
              <p className="text-xs text-gray-600 ml-6 sm:ml-8">
                Pay by any UPI app
              </p>
            </div>

            {/* Card Option */}
            <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-2 sm:mb-3 cursor-pointer hover:border-blue-500 hover:shadow-md transition">
              <div className="flex items-center gap-2 sm:gap-3 mb-1">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  Credit / Debit / ATM Card
                </span>
              </div>
              <p className="text-xs text-gray-600 ml-6 sm:ml-8">
                Add and secure cards as per RBI guidelines
              </p>
              <p className="text-xs text-green-600 ml-6 sm:ml-8 mt-1">
                Save up to ₹750 • 3 offers available
              </p>
            </div>

            {/* EMI Option */}
            <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-2 sm:mb-3 cursor-pointer hover:border-blue-500 hover:shadow-md transition">
              <div className="flex items-center gap-2 sm:gap-3 mb-1">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="3"
                    y="6"
                    width="18"
                    height="12"
                    rx="2"
                    strokeWidth="2"
                  />
                  <path
                    d="M3 10h18M7 14h.01M11 14h.01"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  EMI
                </span>
              </div>
              <p className="text-xs text-gray-600 ml-6 sm:ml-8">
                Get Debit and Cardless EMIs on HDFC Bank
              </p>
            </div>

            {/* Net Banking Option */}
            <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-2 sm:mb-3 cursor-pointer hover:border-blue-500 hover:shadow-md transition">
              <div className="flex items-center gap-2 sm:gap-3">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  Net Banking
                </span>
              </div>
            </div>

            {/* Cash on Delivery Option */}
            <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-2 sm:mb-3 cursor-pointer hover:border-blue-500 hover:shadow-md transition">
              <div className="flex items-center gap-2 sm:gap-3 mb-1">
                <Banknote className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  Cash on Delivery
                </span>
              </div>
              <p className="text-xs text-gray-600 ml-6 sm:ml-8">
                Pay advance and rest on delivery
              </p>
            </div>

            {/* Gift Card Option */}
            <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 cursor-pointer hover:border-blue-500 hover:shadow-md transition">
              <div className="flex items-center gap-2 sm:gap-3">
                <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  Have a Gift Card?
                </span>
              </div>
            </div>
          </div>

          {/* Center - UPI Form */}
          <div className="flex-1 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 relative shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-600"></div>
              </div>
              <span className="text-xs sm:text-sm text-gray-900 flex-1 font-medium">
                Add new UPI ID
              </span>
              <a href="#" className="text-xs text-blue-600 hover:underline">
                How to find?
              </a>
            </div>

            {/* UPI Input */}
            <div className="mb-4 sm:mb-5">
              <label className="block text-xs sm:text-sm text-gray-800 mb-2">
                UPI ID
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Enter your UPI ID"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:border-blue-600"
                />
                <button className="px-4 sm:px-6 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded hover:bg-blue-700 shadow-md">
                  Verify
                </button>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={async () => {
                if (!items || !items.length) {
                  setMessage({ type: "error", text: "Your cart is empty" });
                  return;
                }

                setLoading(true);
                setMessage(null);

                try {
                  if (!auth?.isAuthenticated?.()) {
                    window.location.href = `/user/login?next=${encodeURIComponent(
                      window.location.pathname,
                    )}`;
                    return;
                  }

                  const token =
                    localStorage.getItem("token") ||
                    localStorage.getItem("user_token");

                  if (!token) {
                    throw new Error(
                      "Authentication token missing. Please login again.",
                    );
                  }

                  const orderPayload = {
                    items: items.map((i) => ({
                      productId: i.id,
                      quantity: i.quantity,
                      price: i.price,
                      variant: { color: i.color, size: i.size },
                    })),
                    paymentMethod: "COD",
                    amount: getTotal() + 7,
                    shipping: {
                      name: auth?.user?.name || "Customer",
                      addressLine1: "Not provided",
                      city: "Not provided",
                      state: "Not provided",
                      postalCode: "000000",
                      country: "India",
                      phone: auth?.user?.phone || "",
                    },
                  };

                  const response = await fetch(`${API_URL}/api/orders`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(orderPayload),
                  });

                  const data = await response.json();

                  if (!response.ok) {
                    throw new Error(data?.message || "Failed to place order");
                  }

                  clear();
                  setMessage({
                    type: "success",
                    text: "Order placed successfully",
                  });

                  const orderId =
                    data?.orderId || data?.order?._id || data?._id;

                  if (orderId) {
                    navigate(`/order/${orderId}`);
                  } else {
                    navigate("/orders");
                  }
                } catch (err) {
                  setMessage({
                    type: "error",
                    text: err?.message || "Failed to place order",
                  });
                } finally {
                  setLoading(false);
                }
              }}
              className={`w-full py-2.5 sm:py-3 text-white rounded text-xs sm:text-sm font-medium ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={loading}
            >
              {loading
                ? "Placing order..."
                : `Place Order (COD) • ₹${getTotal().toLocaleString("en-IN")}`}
            </button>

            {message && (
              <div
                className={`mt-3 text-xs sm:text-sm p-2 rounded ${
                  message.type === "error"
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>

          {/* Right Side - Price Details */}
          <div className="w-full lg:w-72">
            <div className="border border-gray-200 rounded-lg sm:rounded-xl p-4 bg-gray-50 shadow-sm sticky top-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Price Details
              </h3>

              <div className="mb-4">
                <div className="flex justify-between text-xs sm:text-sm mb-2">
                  <span>Price ({items?.length || 0} items)</span>
                  <span>₹{getTotal().toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm mb-2">
                  <span>Platform Fee</span>
                  <span>₹7</span>
                </div>
                <div className="border-t border-gray-200 my-3"></div>
                <div className="flex justify-between font-medium text-sm sm:text-base text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-blue-600 font-semibold">
                    ₹{(getTotal() + 7).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Discount Section */}
              <div className="bg-green-50 border border-green-100 rounded p-3">
                <p className="text-xs text-green-700 font-medium mb-1">
                  10% instant discount
                </p>
                <p className="text-xs text-green-600">Claim now with offers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
