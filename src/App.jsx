import React from "react";
import { Routes, Route } from "react-router-dom";
import './i18n'; 
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./components/routing/ProtectedRoute";
import HomePage from "./pages/HomePage";
import About from "./pages/AboutPage";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Wishlist from "./pages/WishList";
import Cart from "./pages/Cart";
import ProductDetail from "./products/ProductDetail";
import ProductList from "./products/ProductList";
import OrderSummary from "./pages/OrderSummary";
import AddressPage from "./pages/AddressPage";
import Fabric from "./pages/Fabric";
import Wellness from "./pages/Wellness";
import Essentials from "./pages/Essentials";
import Fashion from "./pages/Fashion";
import Men from "./pages/Men";
import HomeKitchen from "./pages/HomeKitchen";
import Accessories from "./pages/Accessories";
import Beauty from "./pages/Beauty";
import Women from "./pages/Women";
import UserAccount from "./pages/UserAccount";
import PaymentPage from "./pages/PaymentPage";
import OTPLogin from "./components/Auth/OTPLogin";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Button from "./components/Button";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <>
      <Button className="fixed bottom-5 right-5 z-50">Support</Button>

      <Routes>
        {/* Main pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected */}
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><UserAccount /></ProtectedRoute>} />
        <Route path="/order-summary" element={<ProtectedRoute><OrderSummary /></ProtectedRoute>} />
        <Route path="/address" element={<ProtectedRoute><AddressPage /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Public */}
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/cart" element={<Cart />} />

        {/* Category */}
        <Route path="/wellness" element={<Wellness />} />
        <Route path="/essentials" element={<Essentials />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/beauty" element={<Beauty />} />
        <Route path="/women" element={<Women />} />
        <Route path="/fashion" element={<Fashion />} />
        <Route path="/men" element={<Men />} />
        <Route path="/home-kitchen" element={<HomeKitchen />} />

        {/* Products */}
        <Route path="/fabric/:topic" element={<Fabric />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp-login" element={<OTPLogin />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#363636', color: '#fff' },
        }}
      />
    </>
  );
}

export default App;