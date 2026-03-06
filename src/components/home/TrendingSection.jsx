import React, { useEffect, useState } from "react";
import { productsAPI } from "../../lib/daynamicHero";
import HeroProductGrid from "./HeroProductGrid";

const TrendingSection = ({ onSelect }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await productsAPI.getTrending(12);
        if (mounted) setProducts(res.products || []);
      } catch (e) {
        console.error("Trending fetch failed", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return <HeroProductGrid title=" Trending Now" products={products} onSelect={onSelect} />;
};

export default TrendingSection;
