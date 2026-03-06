import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQty: () => {},
  clear: () => {},
  getTotal: () => 0,
  getTotalItems: () => 0,
});

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Generate unique key per product + variation
  const getUniqueId = (product) => {
    return `${product.id}-${product.color || "default"}-${product.size || "default"}`;
  };

  // Add item to cart
  const addItem = (product, quantity = 1) => {
    const uniqueId = getUniqueId(product);

    setItems((prev) => {
      const existing = prev.find((i) => i.uniqueId === uniqueId);
      if (existing) {
        return prev.map((i) =>
          i.uniqueId === uniqueId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...product, quantity, uniqueId }];
    });
  };

  // Remove item from cart
  const removeItem = (uniqueId) => {
    setItems((prev) => prev.filter((i) => i.uniqueId !== uniqueId));
  };

  // Update quantity of specific item
  const updateQty = (uniqueId, quantity) => {
    if (quantity <= 0) {
      removeItem(uniqueId);
      return;
    }
    setItems((prev) => prev.map((i) => (i.uniqueId === uniqueId ? { ...i, quantity } : i)));
  };

  // Clear entire cart
  const clear = () => {
    setItems([]);
  };

  // Get total price
  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Get total number of items
  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQty, clear, getTotal, getTotalItems }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
