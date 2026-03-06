import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const WishlistContext = createContext({
  items: [],
  add: () => {},
  remove: () => {},
  has: () => false,
  clear: () => {},
  getCount: () => 0,
});

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("wishlist");
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items));
  }, [items]);

  const has = (id) => items.some((i) => i.id === id);

  const add = (product) => {
    setItems((prev) => (prev.some((i) => i.id === product.id) ? prev : [...prev, product]));
  };

  const remove = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clear = () => setItems([]);

  const getCount = () => items.length;

  const value = useMemo(
    () => ({ items, add, remove, has, clear, getCount }),
    [items]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);


