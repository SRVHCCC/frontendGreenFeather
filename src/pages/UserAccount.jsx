import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  User,
  Package,
  CreditCard,
  Gift,
  LogOut,
  Edit2,
  Save,
  X,
  CheckCircle,
  Menu,
  ChevronRight,
} from "lucide-react";
import Layout from "../components/layout/Layout";
import { useAuth } from '../context/UnifiedAuthContext';

const UserAccount = () => {
  const { updateProfile } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [user, setUser] = useState(() => {
    try {
      const authRaw = localStorage.getItem('auth') || localStorage.getItem('user');
      if (authRaw) {
        const parsed = JSON.parse(authRaw);
        return {
          name: parsed.name || `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim() || 'Guest User',
          firstName: parsed.firstName || parsed.name?.split(' ')?.[0] || 'Ayodhya',
          lastName: parsed.lastName || parsed.name?.split(' ')?.slice(1).join(' ') || 'Gupta',
          email: parsed.email || 'you@example.com',
          mobile: parsed.phone || parsed.mobile || '',
          gender: parsed.gender || 'male',
          avatar: parsed.avatar || parsed.profileImage || '',
          createdAt: parsed.createdAt || parsed.joined || null
        };
      }
    } catch {
      console.warn('Failed to parse user data from localStorage');
    }
  });

  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    gender: user.gender,
    email: user.email,
    mobile: user.mobile,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const updated = {
      ...user,
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`,
    };
    setUser(updated);
    
    try {
      const authObj = {
        ...JSON.parse(localStorage.getItem('auth') || '{}'),
        ...updated,
        phone: updated.mobile
      };
      localStorage.setItem('auth', JSON.stringify(authObj));
      localStorage.setItem('user', JSON.stringify(authObj));

      if (updateProfile) {
        updateProfile({
          name: updated.name,
          phone: updated.mobile,
          firstName: updated.firstName,
          lastName: updated.lastName
        }).catch(() => {});
      }

      window.dispatchEvent(new Event('authChange'));
    } catch {
      console.warn('Failed to persist user data');
    }
    
    setIsEditing(false);
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };

  const handleLogout = () => {
    alert("Logout functionality");
  };

  const handleViewOrders = () => {
    alert("View Orders");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {showSaveNotification && (
          <div className="fixed top-4 right-4 bg-[#0d5612] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-bounce text-sm">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-base">profile update!</span>
          </div>
        )}

        <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-xl transition-all active:scale-95"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Sidebar - Mobile Overlay & Desktop */}
            <div
              className={`${
                showMobileMenu ? 'fixed inset-0 z-40 bg-black/50 lg:bg-transparent' : 'hidden'
              } lg:block lg:col-span-3`}
              onClick={() => setShowMobileMenu(false)}
            >
              <div
                className={`${
                  showMobileMenu ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 transition-transform duration-300 fixed lg:static inset-y-0 left-0 w-80 lg:w-full bg-white shadow-2xl lg:shadow-xl rounded-none lg:rounded-2xl overflow-y-auto border-0 lg:border border-gray-100 z-50 lg:z-0`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Profile Header */}
                <div className="p-4 sm:p-6 bg-[#0d5612] text-white">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center overflow-hidden ring-4 ring-white/30">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt="profile"
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-gray-100">{t("hello")}</div>
                      <div className="font-bold text-base sm:text-lg truncate">{user.name}</div>
                    </div>
                  </div>
                </div>
                <div className="py-3">
                  {/* My Orders */}
                  <div
                    onClick={() => {
                      setActiveSection("orders");
                      setShowMobileMenu(false);
                    }}
                    className={`mx-3 px-3 py-2.5 flex items-center justify-between cursor-pointer rounded-lg transition-all duration-200 ${
                      activeSection === "orders"
                        ? "bg-blue-50 text-green-800 font-bold"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm font-bold">MY ORDERS</span>
                    </div>
                    <ChevronRight className="w-4 h-4 lg:hidden" />
                  </div>

                  {/* Account Settings */}
                  <div className="border-t mx-3 mt-3 pt-3">
                    <div className="px-4 py-2 flex items-center gap-3 text-gray-700">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      <span className="text-xs font-bold tracking-wide">ACCOUNT SETTINGS</span>
                    </div>

                    <div
                      onClick={() => {
                        setActiveSection("profile");
                        setShowMobileMenu(false);
                      }}
                      className={`mx-3 px-4 py-2.5 pl-8 sm:pl-12 cursor-pointer rounded-lg transition-all duration-200 text-xs sm:text-sm ${
                        activeSection === "profile"
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {t("personal_information")}
                    </div>
                    <div className="mx-3 px-4 py-2.5 pl-8 sm:pl-12 cursor-pointer rounded-lg hover:bg-gray-50 text-xs sm:text-sm text-gray-600 transition-all duration-200">
                      {t("personal_info_subtext")}
                    </div>
                    <div className="mx-3 px-4 py-2.5 pl-8 sm:pl-12 cursor-pointer rounded-lg hover:bg-gray-50 text-xs sm:text-sm text-gray-600 transition-all duration-200">
                      PAN Card Information
                    </div>
                  </div>

                  {/* Payments */}
                  <div className="border-t mx-3 mt-3 pt-3">
                    <div className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-all duration-200">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      <span className="text-xs font-bold tracking-wide">PAYMENTS</span>
                    </div>
                    <div className="mx-3 px-4 py-2.5 pl-8 sm:pl-12 cursor-pointer rounded-lg hover:bg-gray-50 text-xs sm:text-sm text-gray-600 flex items-center justify-between transition-all duration-200">
                      <span>Gift Cards</span>
                      <span className="text-green-600 font-bold">₹0</span>
                    </div>
                    <div className="mx-3 px-4 py-2.5 pl-8 sm:pl-12 cursor-pointer rounded-lg hover:bg-gray-50 text-xs sm:text-sm text-gray-600 transition-all duration-200">
                      Saved UPI
                    </div>
                    <div className="mx-3 px-4 py-2.5 pl-8 sm:pl-12 cursor-pointer rounded-lg hover:bg-gray-50 text-xs sm:text-sm text-gray-600 transition-all duration-200">
                      Saved Cards
                    </div>
                  </div>

                  {/* My Stuff */}
                  <div className="border-t mx-3 mt-3 pt-3">
                    <div className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-all duration-200">
                      <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                      <span className="text-xs font-bold tracking-wide">MY STUFF</span>
                    </div>
                    <div className="mx-3 px-4 py-2.5 pl-8 sm:pl-12 cursor-pointer rounded-lg hover:bg-gray-50 text-xs sm:text-sm text-gray-600 transition-all duration-200">
                      My Coupons
                    </div>
                    <div className="mx-3 px-4 py-2.5 pl-8 sm:pl-12 cursor-pointer rounded-lg hover:bg-gray-50 text-xs sm:text-sm text-gray-600 transition-all duration-200">
                      My Reviews & Ratings
                    </div>
                    <div className="mx-3 px-4 py-2.5 pl-8 sm:pl-12 cursor-pointer rounded-lg hover:bg-gray-50 text-xs sm:text-sm text-gray-600 transition-all duration-200">
                      All Notifications
                    </div>
                    <div className="mx-3 px-4 py-2.5 pl-8 sm:pl-12 cursor-pointer rounded-lg hover:bg-gray-50 text-xs sm:text-sm text-gray-600 transition-all duration-200">
                      My Wishlist
                    </div>
                  </div>

                  {/* Logout */}
                  <div className="border-t mx-3 mt-3 pt-3 mb-3">
                    <div
                      onClick={handleLogout}
                      className="mx-3 px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-red-50 text-red-600 rounded-lg transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm font-semibold">Logout</span>
                    </div>
                  </div>
                </div>

                {/* Footer Links */}
                <div className="border-t p-4 bg-gray-50 text-xs text-gray-600">
                  <div className="mb-2 font-bold text-gray-700">Frequently Visited:</div>
                  <div className="cursor-pointer hover:text-blue-600 transition-colors duration-200 mb-1">
                    Track Order
                  </div>
                  <div className="cursor-pointer hover:text-blue-600 transition-colors duration-200">
                    Help Center
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              {activeSection === "profile" && (
                <div className="bg-white shadow-lg sm:shadow-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-100">
                  {/* Personal Information Section */}
                  <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                          <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                          {t("personal_information")}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {t("personal_info_subtext")}
                        </p>
                      </div>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                          {t("edit_profile")}
                        </button>
                      ) : (
                        <div className="flex gap-2 sm:gap-3">
                          <button
                            onClick={handleSave}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm"
                          >
                            <Save className="w-4 h-4" />
                            {t("save")}
                          </button>
                          <button
                            onClick={() => {
                              setIsEditing(false);
                              setFormData({
                                firstName: user.firstName,
                                lastName: user.lastName,
                                gender: user.gender,
                                email: user.email,
                                mobile: user.mobile,
                              });
                            }}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm"
                          >
                            <X className="w-4 h-4" />
                            {t("cancel")}
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 border-2 rounded-lg sm:rounded-xl transition-all duration-200 text-sm ${
                            isEditing
                              ? "bg-white border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              : "bg-gray-50 border-gray-200"
                          }`}
                          placeholder="First Name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 border-2 rounded-lg sm:rounded-xl transition-all duration-200 text-sm ${
                            isEditing
                              ? "bg-white border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              : "bg-gray-50 border-gray-200"
                          }`}
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-3">
                        Your Gender
                      </div>
                      <div className="flex gap-3 sm:gap-4">
                        <label
                          className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 px-3 py-2 cursor-pointer rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                            formData.gender === "male"
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.gender === "male"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
                          />
                          <span className="text-xs sm:text-sm font-semibold">Male</span>
                        </label>
                        <label
                          className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 px-3 py-2 cursor-pointer rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                            formData.gender === "female"
                              ? "border-pink-500 bg-pink-50 text-pink-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={formData.gender === "female"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600"
                          />
                          <span className="text-xs sm:text-sm font-semibold">Female</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Email Address */}
                    <div className="flex-1">
                      <h2 className="text-sm sm:text-md font-semibold text-gray-800 mb-3 sm:mb-4">
                        Email Address
                      </h2>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border-2 rounded-lg sm:rounded-xl transition-all duration-200 text-sm ${
                          isEditing
                            ? "bg-white border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                        placeholder="Email Address"
                      />
                    </div>

                    {/* Mobile Number */}
                    <div className="flex-1">
                      <h2 className="text-sm sm:text-md font-semibold text-gray-800 mb-3 sm:mb-4">
                        Mobile Number
                      </h2>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border-2 rounded-lg sm:rounded-xl transition-all duration-200 text-sm ${
                          isEditing
                            ? "bg-white border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                        placeholder="Mobile Number"
                      />
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="mb-6 sm:mb-8 border-t-2 border-gray-100 pt-6 sm:pt-8">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">
                      Account Summary
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
                        <div className="text-xs sm:text-sm text-gray-600 mb-1">
                          Full Name
                        </div>
                        <div className="text-sm sm:text-base font-bold text-gray-800">
                          {user.name}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-teal-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-green-100">
                        <div className="text-xs sm:text-sm text-gray-600 mb-1">Email</div>
                        <div className="text-sm sm:text-base font-bold text-gray-800 break-all">
                          {user.email}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-pink-100">
                        <div className="text-xs sm:text-sm text-gray-600 mb-1">Mobile</div>
                        <div className="text-sm sm:text-base font-bold text-gray-800">
                          {user.mobile}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-yellow-100">
                        <div className="text-xs sm:text-sm text-gray-600 mb-1">
                          Member Since
                        </div>
                        <div className="text-sm sm:text-base font-bold text-gray-800">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t-2 border-gray-100 pt-4 sm:pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button className="text-blue-600 hover:text-blue-700 hover:underline text-xs sm:text-sm font-semibold transition-all duration-200">
                      Deactivate Account
                    </button>
                    <button className="text-red-600 hover:text-red-700 hover:underline text-xs sm:text-sm font-semibold transition-all duration-200">
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

              {activeSection === "orders" && (
                <div className="bg-white shadow-lg sm:shadow-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-100">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900">
                    My Orders
                  </h2>
                  <div className="text-center py-12 sm:py-16">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <Package className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                      No orders yet
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 px-4">
                      Start shopping to see your orders here
                    </p>
                    <button
                      onClick={handleViewOrders}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold text-sm sm:text-base"
                    >
                      Start Shopping
                    </button>
                  </div>
                </div>
              )}

              {/* Decorative Footer - Hidden on small mobile */}
              <div className="hidden sm:block relative mt-6 h-24 sm:h-32 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-white/10"></div>
                <div className="absolute bottom-0 left-8">
                  <div className="w-8 h-12 sm:w-12 sm:h-20 bg-white/30 rounded-full backdrop-blur-sm" style={{ marginBottom: "-10px" }}>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full mx-auto mt-2 sm:mt-3"></div>
                  </div>
                </div>
                <div className="absolute bottom-0 right-8">
                  <div className="w-8 h-12 sm:w-12 sm:h-20 bg-white/30 rounded-full backdrop-blur-sm" style={{ marginBottom: "-10px" }}>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full mx-auto mt-2 sm:mt-3"></div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="text-white text-4xl sm:text-7xl animate-pulse">✈</div>
                </div>
                <svg className="absolute bottom-0 w-full" viewBox="0 0 1200 80" preserveAspectRatio="none">
                  <path d="M0,50 Q300,20 600,50 T1200,50 L1200,80 L0,80 Z" fill="white" opacity="0.2" />
                  <path d="M0,60 Q300,30 600,60 T1200,60 L1200,80 L0,80 Z" fill="white" opacity="0.3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserAccount;