export const products = [
  // Electronics
  { id: 1, category: "Electronics", name: "Smartphone X12 5G", brand: "TechOne", price: 18999, originalPrice: 21999, discountPercent: 14, rating: 4.5, reviews: 1245, stock: 45, heroTag: "Best Seller", image: "https://images.unsplash.com/photo-1518442530017-7db35be2d2aa?w=800&auto=format&fit=crop", delivery: "Free Delivery", isTrending: true },
  { id: 2, category: "Electronics", name: "Smartphone A9", brand: "Alpha", price: 15999, originalPrice: 19999, discountPercent: 20, rating: 4.4, reviews: 980, stock: 60, heroTag: "Top Pick", image: "/img/electronics/phone2.jpg", delivery: "Free Delivery", isTrending: true },
  { id: 3, category: "Electronics", name: "Neo 5G Pro", brand: "NeoTech", price: 20999, originalPrice: 24999, discountPercent: 16, rating: 4.6, reviews: 1800, stock: 30, heroTag: "Trending", image: "/img/electronics/phone3.jpg", delivery: "Free Delivery", isTrending: true },
  { id: 4, category: "Electronics", name: "Wireless Earbuds S2", brand: "SoundMax", price: 1999, originalPrice: 3499, discountPercent: 43, rating: 4.3, reviews: 5200, stock: 120, heroTag: "Best Seller", image: "/img/electronics/earbuds1.jpg", delivery: "Free Delivery", isTrending: true },
  { id: 5, category: "Electronics", name: "Smart Watch Pro", brand: "Pulse", price: 2499, originalPrice: 4999, discountPercent: 50, rating: 4.2, reviews: 3100, stock: 90, heroTag: "Top Pick", image: "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=800&q=80", delivery: "Free Delivery", isTrending: false },

  // Fashion
  { id: 6, category: "Fashion", name: "Men Regular Fit T-Shirt", brand: "Roadster", price: 499, originalPrice: 999, discountPercent: 50, rating: 4.1, reviews: 2100, stock: 200, heroTag: "Top Deal", image: "/img/fashion/tee1.jpg", delivery: "Free Delivery", isTrending: true },
  { id: 7, category: "Fashion", name: "Women Floral Kurti", brand: "Biba", price: 899, originalPrice: 1599, discountPercent: 44, rating: 4.4, reviews: 900, stock: 88, heroTag: "Recommended", image: "/img/fashion/kurti1.jpg", delivery: "Free Delivery", isTrending: false },
  { id: 8, category: "Fashion", name: "Nike Revolution Shoes", brand: "Nike", price: 2999, originalPrice: 3995, discountPercent: 25, rating: 4.6, reviews: 4500, stock: 40, heroTag: "Best Quality", image: "/img/fashion/shoes1.jpg", delivery: "Free Delivery", isTrending: true },

  // Home
  { id: 9, category: "Home", name: "LED String Lights", brand: "GlowUp", price: 399, originalPrice: 799, discountPercent: 50, rating: 4.4, reviews: 1900, stock: 150, heroTag: "Top Deal", image: "/img/home/lights1.jpg", delivery: "Free Delivery", isTrending: true },
  { id: 10, category: "Home", name: "Premium Bedsheet Set", brand: "HomeCraft", price: 999, originalPrice: 1799, discountPercent: 44, rating: 4.5, reviews: 1400, stock: 70, heroTag: "Best Quality", image: "/img/home/bedsheet1.jpg", delivery: "Free Delivery", isTrending: false },
  { id: 11, category: "Home", name: "Non-stick Cookware Set", brand: "ChefPro", price: 2499, originalPrice: 4999, discountPercent: 50, rating: 4.7, reviews: 5200, stock: 35, heroTag: "Top Rated", image: "/img/home/cookware1.jpg", delivery: "Free Delivery", isTrending: true },

  // Beauty
  { id: 12, category: "Beauty", name: "Vitamin C Face Serum", brand: "SkinLab", price: 599, originalPrice: 999, discountPercent: 40, rating: 4.6, reviews: 6100, stock: 80, heroTag: "Top Rated", image: "/img/beauty/serum1.jpg", delivery: "Free Delivery", isTrending: true },
  { id: 13, category: "Beauty", name: "Aloe Vera Facewash", brand: "PureCare", price: 199, originalPrice: 299, discountPercent: 33, rating: 4.3, reviews: 2400, stock: 100, heroTag: "Recommended", image: "/img/beauty/facewash1.jpg", delivery: "Free Delivery", isTrending: false },

  // Sports
  { id: 14, category: "Sports", name: "Badminton Racket", brand: "Yonex", price: 1499, originalPrice: 2199, discountPercent: 32, rating: 4.7, reviews: 3300, stock: 25, heroTag: "Best Quality", image: "/img/sports/racket1.jpg", delivery: "Free Delivery", isTrending: false },
  { id: 15, category: "Sports", name: "Football Pro", brand: "Adidas", price: 899, originalPrice: 1499, discountPercent: 40, rating: 4.4, reviews: 1750, stock: 30, heroTag: "Top Deal", image: "/img/sports/football1.jpg", delivery: "Free Delivery", isTrending: true },

  // More products (for 9+ in sections)
  { id: 16, category: "Electronics", name: "Bluetooth Speaker Mini", brand: "BeatBox", price: 1299, originalPrice: 2499, discountPercent: 48, rating: 4.2, reviews: 950, stock: 45, heroTag: "Top Deal", image: "/img/electronics/speaker1.jpg", delivery: "Free Delivery", isTrending: true },
  { id: 17, category: "Fashion", name: "Men Slim Fit Jeans", brand: "Levis", price: 1999, originalPrice: 3499, discountPercent: 43, rating: 4.5, reviews: 2600, stock: 60, heroTag: "Recommended", image: "/img/fashion/jeans1.jpg", delivery: "Free Delivery", isTrending: true },
  { id: 18, category: "Home", name: "Office Chair Ergonomic", brand: "Comfy", price: 4499, originalPrice: 7999, discountPercent: 44, rating: 4.6, reviews: 3200, stock: 15, heroTag: "Top Rated", image: "/img/home/chair1.jpg", delivery: "Free Delivery", isTrending: true },
  { id: 19, category: "Beauty", name: "Matte Lipstick Set", brand: "Glow", price: 499, originalPrice: 999, discountPercent: 50, rating: 4.4, reviews: 1500, stock: 50, heroTag: "Top Deal", image: "/img/beauty/lipstick1.jpg", delivery: "Free Delivery", isTrending: true },
  { id: 20, category: "Sports", name: "Gym Gloves", brand: "PowerFit", price: 399, originalPrice: 699, discountPercent: 43, rating: 4.1, reviews: 800, stock: 100, heroTag: "Recommended", image: "/img/sports/gloves1.jpg", delivery: "Free Delivery", isTrending: false }
];
