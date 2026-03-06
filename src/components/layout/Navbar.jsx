import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import navlogo from "../../assets/navlogo.jpeg";
import {User,Package, Heart,Bell,LogOut,Search,ShoppingCart,MapPin,ChevronDown,Store,Menu,X,Settings,} from "lucide-react";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(
    t("delivering_to_india") || "Delivering to India",
  );
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const hasMaps = Boolean(mapsApiKey);

  const topMenu = [
    { name: t("accessories"), slug: "Accessories" },
    { name: t("beauty"), slug: "Beauty" },
    { name: t("essentials"), slug: "Essentials" },
    { name: t("fabric"), slug: "Fabric" },
    { name: t("men"), slug: "Men" },
    { name: t("wellness"), slug: "Wellness" },
    { name: t("women"), slug: "Women" },
    { name: t("sustainable_choices"), slug: "Fashion" },
    { name: t("gift_boxes"), slug: "Home Kitchen", badge: t("new") },
  ];

  useEffect(() => {
    const checkAuth = () => {
      const authData = localStorage.getItem("auth");
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          setUser(parsed);
        } catch {
          localStorage.removeItem("auth");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("authChange", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  useEffect(() => {
    if (!hasMaps) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${mapsApiKey}`,
            );
            const data = await res.json();
            if (data.status === "OK" && data.results?.[0]) {
              setLocation(data.results[0].formatted_address);
            }
          } catch (err) {
            console.warn("Geocode failed:", err);
          }
        },
        (err) => console.warn("Geolocation denied:", err),
        { timeout: 10000 },
      );
    }
  }, [hasMaps, mapsApiKey]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    navigate(`/products?search=${searchTerm.trim()}`);
    setSearchTerm("");
    setMobileSearchOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    localStorage.removeItem("user_token");
    setUser(null);
    window.dispatchEvent(new Event("authChange"));
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const getUserName = () => {
    const name = user?.name || user?.user?.name || "User";
    return name.length > 12 ? name.slice(0, 12) + "..." : name;
  };

  const getUserInitial = () =>
    (user?.name || user?.user?.name || "U").charAt(0).toUpperCase();

  const profileMenuItems = [
    {
      icon: <User className="w-5 h-5 text-gray-800" />,
      label: t("my_profile"),
      link: "/account",
    },
    {
      icon: <Package className="w-5 h-5 text-gray-800" />,
      label: t("my_orders"),
      link: "/orders",
    },
    {
      icon: <Heart className="w-5 h-5 text-gray-800" />,
      label: t("wishlist"),
      link: "/wishlist",
    },
    {
      icon: <Bell className="w-5 h-5 text-gray-800" />,
      label: t("notifications"),
      link: "/notifications",
    },
  ];

  return (
    <div className="w-full">
      <nav className="bg-[#2a5d2e] text-white px-3 sm:px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between fixed top-0 left-0 right-0 z-[60] shadow-sm">
        <div
          onClick={() => navigate("/")}
          className="flex-shrink-0 cursor-pointer flex items-center"
        >
          <img
            src={navlogo}
            alt="GreenFeather"
            className="h-10 sm:h-11 md:h-12 w-auto rounded-lg object-contain"
          />
        </div>

        <div className="hidden lg:flex items-center gap-2 flex-shrink-0 rounded-lg px-3 py-2 max-w-[180px]">
          <MapPin size={16} className="flex-shrink-0 text-white" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-transparent text-white text-xs font-medium w-full outline-none placeholder-gray-300"
            placeholder={t("enter_location") || "Enter location"}
          />
        </div>

        <form
          onSubmit={handleSearch}
          className="hidden sm:flex flex-1 mx-4 max-w-3xl h-12 items-center 
          rounded-full px-2
          bg-white/20 backdrop-blur-md
          border border-white/30
          shadow-md hover:shadow-xl
          transition-all duration-300"
        >
          <div className="flex items-center justify-center w-10 flex-shrink-0">
            <Search className="w-5 h-5 text-gray-700" />
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for category..."
            className="flex-1 px-2 text-gray-800 placeholder-gray-600 
            text-sm outline-none bg-transparent font-medium"
          />

          <div className="flex items-center gap-1 mr-1 flex-shrink-0">
            <button
              type="button"
              className="p-2 hover:bg-white/30 rounded-full transition-all duration-200"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </form>

        <div className="hidden md:flex items-center gap-2 lg:gap-4 flex-shrink-0">
          <div
            className="relative"
            onMouseEnter={() => setLanguageDropdownOpen(true)}
            onMouseLeave={() => setLanguageDropdownOpen(false)}
          >
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer">
              <img
                src="https://flagcdn.com/w20/in.png"
                alt="India"
                className="h-4 w-5"
              />
              <span className="text-xs font-semibold text-white">
                {selectedLanguage === "EN" ? "EN" : "HI"}
              </span>
              <ChevronDown size={14} className="text-white" />
            </div>

            {languageDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white text-black w-40 shadow-lg rounded-lg z-50 border border-gray-300">
                <ul className="py-1">
                  <li
                    onClick={() => {
                      setSelectedLanguage("EN");
                      i18n.changeLanguage("en");
                      localStorage.setItem("language", "en");
                      setLanguageDropdownOpen(false);
                    }}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm ${
                      selectedLanguage === "EN" ? "bg-gray-200" : ""
                    }`}
                  >
                    English
                  </li>
                  <li
                    onClick={() => {
                      setSelectedLanguage("HI");
                      i18n.changeLanguage("hi");
                      localStorage.setItem("language", "hi");
                      setLanguageDropdownOpen(false);
                    }}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm ${
                      selectedLanguage === "HI" ? "bg-gray-200" : ""
                    }`}
                  >
                    हिन्दी
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            {user ? (
              <div className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                  {getUserInitial()}
                </div>
                <span className="font-semibold text-sm hidden lg:inline text-white">
                  {getUserName()}
                </span>
                <ChevronDown size={16} className="text-white" />
              </div>
            ) : (
              <button
                onClick={() => navigate("/user/login")}
                className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white font-bold text-sm"
              >
                {t("login")}
              </button>
            )}

            {dropdownOpen && user && (
              <div className="absolute top-full right-0 mt-1 bg-white text-black w-72 shadow-lg rounded-lg z-50 border border-gray-300">
                <div className="px-5 py-4 bg-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-700 text-white flex items-center justify-center font-bold text-lg">
                      {getUserInitial()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate text-gray-900">
                        {user.name || user.user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {user.email || user.user?.email}
                      </p>
                    </div>
                  </div>
                </div>
                <ul className="py-1">
                  {profileMenuItems.map((item) => (
                    <li key={item.label} className="hover:bg-gray-100">
                      <a
                        href={item.link}
                        className="flex items-center gap-3 px-5 py-3 text-sm text-gray-800"
                      >
                        {item.icon} <span>{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="p-3 border-t">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut className="w-5 h-5" /> {t("logout")}
                  </button>
                </div>
              </div>
            )}
          </div>

          <a href="/orders" className="flex flex-col px-2 py-1 rounded-lg">
            <span className="text-[10px] text-white">{t("returns")}</span>
            <span className="font-bold text-sm text-white">
              & {t("orders")}
            </span>
          </a>
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="sm:hidden p-2 hover:bg-green-700 rounded-lg text-white"
          >
            <Search size={22} />
          </button>

          <div
            onClick={() => navigate("/cart")}
            className="relative flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg cursor-pointer text-white"
          >
            <div className="relative">
              <ShoppingCart size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-bold text-sm">
              {t("cart")}
            </span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-green-700 rounded-lg text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileSearchOpen && (
        <div className="bg-[#2A5D2E] sm:hidden fixed top-16 left-0 right-0 z-50 px-3 py-3 shadow-sm border-b border-gray-300">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div
              className="flex-1 flex items-center rounded-full 
            bg-white/20 backdrop-blur-md 
            border border-white/30
            shadow-md h-11 
            focus-within:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-center w-10 ml-1 flex-shrink-0">
                <Search size={16} className="text-gray-700" />
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for category..."
                className="flex-1 px-2 text-gray-700 text-xs outline-none bg-transparent placeholder-gray-600 font-medium"
              />

              <button
                type="submit"
                className="px-3 text-gray-700 h-full rounded-r-full hover:bg-white/30 transition"
              >
                <Search size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bottom-0 z-50 bg-white overflow-y-auto">
          {user ? (
            <div className="p-5 border-b">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {getUserInitial()}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg truncate text-gray-900">
                    {user.name || user.user?.name || "User"}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {user.email || user.user?.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {profileMenuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.link}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col items-center gap-2 p-3 bg-white border border-gray-300 rounded-lg text-center text-[11px] font-semibold text-gray-800"
                  >
                    {item.icon}
                    {item.label}
                  </a>
                ))}
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-red-700"
              >
                <LogOut size={18} /> {t("logout")}
              </button>
            </div>
          ) : (
            <div
              style={{ backgroundColor: "#F5E6D3" }}
              className="p-5 border-b"
            >
              <button
                onClick={() => {
                  navigate("/user/login");
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-green-700 text-white font-bold py-3 rounded-lg hover:bg-green-800"
              >
                {t("login")} / {t("sign_up")}
              </button>
            </div>
          )}

          <div className="px-4 py-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase px-4 mb-2 tracking-wider">
              Categories
            </h3>
            <div className="space-y-1">
              {topMenu.map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    navigate(`/products?category=${item.slug}`);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between py-3 px-4 hover:bg-gray-100 rounded-lg cursor-pointer text-gray-800 font-medium"
                >
                  {item.name}
                  {item.badge && (
                    <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4">
            <button
              onClick={() => {
                window.location.href = "http://localhost:5173/signup";
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-3 bg-green-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-800"
            >
              <Store size={20} />
              {t("become_seller")}
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#357b3a] hidden md:flex text-white px-6 lg:px-8 py-2.5 items-center gap-6 lg:gap-8 text-sm overflow-x-auto fixed top-16 left-0 right-0 z-40 shadow-sm scrollbar-hide border-b border-gray-300">
        {topMenu.map((item, i) => (
          <span
            key={i}
            onClick={() => navigate(`/products?category=${item.slug}`)}
            className="cursor-pointer hover:text-yellow-950 font-medium whitespace-nowrap relative flex items-center gap-1.5"
          >
            {item.name}
            {item.badge && (
              <span className="text-[9px] font-bold text-red-600 absolute -top-2 -right-4">
                {item.badge}
              </span>
            )}
          </span>
        ))}

        <button
          onClick={() =>
            (window.location.href = "http://localhost:5173/signup")
          }
          className="ml-auto flex items-center gap-2 px-4 py-1.5 bg-green-900 hover:bg-green-950 text-white rounded-lg font-bold whitespace-nowrap"
        >
          <Store size={16} />
          {t("become_seller")}
        </button>
      </div>

      <div className="h-16 md:h-[104px]" />
    </div>
  );
};

export default Navbar;
