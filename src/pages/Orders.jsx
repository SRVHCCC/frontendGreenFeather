import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/layout/Layout";
import API_URL from "../config/config";
import { Package, XCircle, ArrowLeft, X } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    if (!token) {
      setError("Login required");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.orders || res.data.data || res.data;

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load orders",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Order Placed",
        color: "text-orange-500",
      },
      processing: {
        label: "Preparing for Shipment",
        color: "text-blue-600",
      },
      shipped: {
        label: "Shipped",
        color: "text-purple-600",
      },
      out_for_delivery: {
        label: "Out for Delivery",
        color: "text-indigo-600",
      },
      delivered: {
        label: "Delivered",
        color: "text-green-600",
      },
      cancelled: {
        label: "Cancelled",
        color: "text-red-600",
      },
    };

    return configs[status?.toLowerCase()] || configs.pending;
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDeliveryDate = (dateString, status) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    const deliveryDays = {
      pending: 7,
      processing: 5,
      shipped: 3,
      out_for_delivery: 1,
    };

    date.setDate(date.getDate() + (deliveryDays[status] || 7));

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await axios.patch(
        `${API_URL}/api/orders/${id}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to cancel order");
    }
  };

  if (selectedOrder) {
    const statusConfig = getStatusConfig(selectedOrder.status);

    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-6xl mx-auto p-6">
            <button
              onClick={() => setSelectedOrder(null)}
              className="flex items-center gap-2 mb-6 text-gray-700 hover:text-black"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <div className="bg-white rounded-lg shadow p-8">
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Ordered</span>
                  <span>Shipped</span>
                  <span>Out for Delivery</span>
                  <span>Delivered</span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="bg-green-500 h-2 rounded"
                    style={{
                      width:
                        selectedOrder.status === "pending"
                          ? "25%"
                          : selectedOrder.status === "processing"
                          ? "40%"
                          : selectedOrder.status === "shipped"
                          ? "60%"
                          : selectedOrder.status === "out_for_delivery"
                          ? "80%"
                          : selectedOrder.status === "delivered"
                          ? "100%"
                          : "0%",
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-between border-b pb-4 mb-6">
                <div>
                  <p className="text-gray-700">
                    Order #
                    <span className="text-blue-600 font-bold ml-1">
                      {String(
                        selectedOrder.orderNumber || selectedOrder._id,
                      ).slice(-8)}
                    </span>
                  </p>

                  <p className="text-sm text-gray-500">
                    Order Placed: {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex gap-6 border-b pb-6">
                    <div className="w-28 h-28 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={item.product?.images?.[0] || "/placeholder.png"}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.product?.name || "Product"}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Brand: {item.product?.brand || "Brand"}
                      </p>

                      <div className="flex gap-4 text-sm mt-2">
                        <span>Qty: {item.quantity}</span>

                        <span className="font-bold">₹{item.price}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500">Status</p>

                      <p className={`font-bold ${statusConfig.color}`}>
                        {statusConfig.label}
                      </p>

                      <p className="text-xs mt-2 text-gray-500">Delivery by</p>

                      <p className="text-sm font-semibold">
                        {formatDeliveryDate(
                          selectedOrder.createdAt,
                          selectedOrder.status,
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-6">
                {![
                  "shipped",
                  "out_for_delivery",
                  "delivered",
                  "cancelled",
                ].includes(selectedOrder.status) && (
                  <button
                    onClick={() => cancelOrder(selectedOrder._id)}
                    className="text-red-600 flex items-center gap-1"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                )}

                <p className="text-lg font-bold">
                  ₹
                  {(
                    selectedOrder.pricing?.total ||
                    selectedOrder.total ||
                    0
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">My Orders</h1>

          {loading && <p className="text-gray-600">Loading orders...</p>}

          {error && (
            <div className="flex items-center gap-2 text-red-600">
              <XCircle size={18} />
              {error}
            </div>
          )}

          {!loading && orders.length === 0 && (
            <div className="bg-white p-10 text-center rounded shadow">
              <Package size={50} className="mx-auto text-gray-400" />

              <p className="mt-4 text-gray-600">No orders yet</p>

              <button
                onClick={() => (window.location.href = "/products")}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
              >
                Start Shopping
              </button>
            </div>
          )}

          <div className="space-y-6">
            {orders.map((order) => {
              const config = getStatusConfig(order.status);

              return (
                <div key={order._id} className="bg-white rounded shadow p-6">
                  <div className="flex justify-between border-b pb-4 mb-4">
                    <div>
                      <p className="font-medium">
                        Order #
                        <span className="text-blue-600 ml-1 font-bold">
                          {String(order.orderNumber || order._id).slice(-8)}
                        </span>
                      </p>

                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <p className={`font-semibold ${config.color}`}>
                      {config.label}
                    </p>
                  </div>

                  {order.items?.slice(0, 1).map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={item.product?.images?.[0] || "/placeholder.png"}
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold">{item.product?.name}</p>

                        <p className="text-sm text-gray-500">
                          Qty {item.quantity}
                        </p>

                        <p className="font-bold">₹{item.price}</p>
                      </div>
                    </div>
                  ))}

                  {order.items.length > 1 && (
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 mt-3 font-semibold"
                    >
                      View all {order.items.length} items
                    </button>
                  )}

                  <div className="flex justify-between pt-4 mt-4 border-t">
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="text-red-600 flex items-center gap-1"
                    >
                      <X size={16} />
                      Cancel
                    </button>

                    <p className="font-bold">
                      ₹
                      {(
                        order.pricing?.total ||
                        order.total ||
                        0
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
