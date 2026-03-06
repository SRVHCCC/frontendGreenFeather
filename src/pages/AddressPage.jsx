import React, { useState, useEffect, useRef, useCallback } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Plus,
  Trash2,
  Check,
  Navigation,
  Home,
  Briefcase,
  AlertCircle,
  X,
} from "lucide-react";
import Layout from "../components/layout/Layout";
import { TokenHelper } from "../../utils/tokenHelper";
import API_URL from "../config/config";

const AddressPage = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedShippingId, setSelectedShippingId] = useState(null);
  const [selectedBillingId, setSelectedBillingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [formErrors, setFormErrors] = useState({});

  const autocompleteRef = useRef(null);
  const hasFetchedRef = useRef(false);

  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const hasMapsApi = Boolean(mapsApiKey);
  const [mapsReady, setMapsReady] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    addressType: "home",
    isDefault: false,
  });

  const loadAddresses = useCallback(async () => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    try {
      setLoading(true);
      setError("");

      if (!TokenHelper.isAuthenticated()) {
        setError("Please login to view addresses");
        navigate("/user/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/users/addresses`, {
        headers: TokenHelper.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          TokenHelper.removeToken();
          navigate("/user/login");
          return;
        }
        throw new Error(data.message || "Failed to load addresses");
      }

      const addressList = data.data?.addresses || data.addresses || [];
      setAddresses(addressList);

      const defaultAddress = addressList.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedShippingId(defaultAddress._id);
        setSelectedBillingId(defaultAddress._id);
      } else if (addressList.length > 0) {
        setSelectedShippingId(addressList[0]._id);
        setSelectedBillingId(addressList[0]._id);
      }
    } catch (err) {
      setError(err.message || "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  useEffect(() => {
    if (!hasMapsApi) return;

    let mounted = true;
    const check = () => {
      if (window?.google?.maps?.places) {
        if (mounted) setMapsReady(true);
        return true;
      }
      return false;
    };

    check();
    const intervalId = setInterval(() => {
      if (check()) clearInterval(intervalId);
    }, 300);
    const timeoutId = setTimeout(() => clearInterval(intervalId), 3000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [hasMapsApi]);

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
      errors.phoneNumber = "Phone number must be 10 digits";
    }
    if (!formData.addressLine1.trim())
      errors.addressLine1 = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.postalCode.trim()) {
      errors.postalCode = "PIN code is required";
    } else if (!/^[0-9]{6}$/.test(formData.postalCode.replace(/\D/g, ""))) {
      errors.postalCode = "PIN code must be 6 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const useMyLocation = () => {
    if (!hasMapsApi || !mapsReady) {
      alert("Google Maps not loaded yet. Please try again.");
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${mapsApiKey}`,
          );
          const data = await response.json();

          if (data.status === "OK" && data.results.length > 0) {
            const place = data.results[0];

            let street = "";
            let city = "";
            let state = "";
            let postalCode = "";

            place.address_components.forEach((component) => {
              const types = component.types;
              if (types.includes("street_number") || types.includes("route")) {
                street += component.long_name + " ";
              }
              if (types.includes("locality")) city = component.long_name;
              if (types.includes("administrative_area_level_1"))
                state = component.long_name;
              if (types.includes("postal_code"))
                postalCode = component.long_name;
            });

            setFormData((prev) => ({
              ...prev,
              addressLine1: street.trim() || place.formatted_address,
              city: city,
              state: state,
              postalCode: postalCode,
            }));
          }
        } catch {
          setError("Something went wrong");
        } finally {
          setGettingLocation(false);
        }
      },
      () => {
        alert("Unable to get your location. Please enter manually.");
        setGettingLocation(false);
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(`${API_URL}/api/users/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...TokenHelper.getAuthHeaders(),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data && Array.isArray(data.errors) && data.errors.length > 0) {
          const errorMessages = data.errors
            .map(
              (err) =>
                err.message || err.msg || `${err.field}: ${err.message || ""}`,
            )
            .join(", ");
          throw new Error(errorMessages || data.message || "Validation failed");
        }
        throw new Error(
          (data && (data.message || data.error)) || "Failed to add address",
        );
      }

      setFormData({
        fullName: "",
        phoneNumber: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        addressType: "home",
        isDefault: false,
      });
      setFormErrors({});
      setShowAddForm(null);

      hasFetchedRef.current = false;
      loadAddresses();
    } catch (err) {
      setError(err.message || "Failed to add address");
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    try {
      const response = await fetch(
        `${API_URL}/api/users/addresses/${addressId}`,
        {
          method: "DELETE",
          headers: TokenHelper.getAuthHeaders(),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete address");
      }

      hasFetchedRef.current = false;
      loadAddresses();
    } catch (err) {
      setError(err.message || "Failed to delete address");
    }
  };

  const handleContinue = () => {
    if (!selectedShippingId) {
      setError("Please select a shipping address");
      return;
    }

    if (!sameAsShipping && !selectedBillingId) {
      setError("Please select a billing address");
      return;
    }

    const selectedShipping = addresses.find(
      (addr) => addr._id === selectedShippingId,
    );
    const selectedBilling = sameAsShipping
      ? selectedShipping
      : addresses.find((addr) => addr._id === selectedBillingId);

    localStorage.setItem(
      "selectedShippingAddress",
      JSON.stringify(selectedShipping),
    );
    localStorage.setItem(
      "selectedBillingAddress",
      JSON.stringify(selectedBilling),
    );
    navigate("/payment");
  };

  const AddressCard = ({ address, isSelected, onSelect, onDelete }) => (
    <div
      onClick={onSelect}
      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-emerald-600 bg-emerald-50/40"
          : "border-gray-200 hover:border-emerald-300"
      }`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 pt-1">
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              isSelected
                ? "border-emerald-600 bg-emerald-600"
                : "border-gray-300"
            }`}
          >
            {isSelected && <Check size={12} className="text-white" />}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h4 className="font-semibold text-gray-900">{address.fullName}</h4>
            {address.isDefault && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                Default
              </span>
            )}
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                address.addressType === "home"
                  ? "bg-emerald-100 text-emerald-700"
                  : address.addressType === "work"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {address.addressType === "home" ? (
                <Home size={12} />
              ) : address.addressType === "work" ? (
                <Briefcase size={12} />
              ) : (
                <MapPin size={12} />
              )}
              <span className="capitalize">{address.addressType}</span>
            </span>
          </div>

          <p className="text-sm text-gray-700 leading-snug">
            {address.addressLine1}
          </p>
          {address.addressLine2 && (
            <p className="text-sm text-gray-600 leading-snug">
              {address.addressLine2}
            </p>
          )}
          <p className="text-sm text-gray-700 font-medium mt-1.5">
            {address.city}, {address.state} - {address.postalCode}
          </p>
          <p className="text-sm text-gray-600 mt-1">📞 {address.phoneNumber}</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(address._id);
          }}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-emerald-600 border-t-transparent mb-3"></div>
            <p className="text-gray-600 font-medium">Loading addresses...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-6 md:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  <Check size={16} />
                </div>
                <span className="text-sm font-semibold text-gray-700 hidden sm:inline">
                  Cart
                </span>
              </div>
              <div className="w-10 sm:w-24 h-0.5 bg-emerald-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  Address
                </span>
              </div>
              <div className="w-10 sm:w-24 h-0.5 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <span className="text-sm font-semibold text-gray-500 hidden sm:inline">
                  Payment
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle
                    size={20}
                    className="text-red-600 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Shipping Address
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Select delivery location
                    </p>
                  </div>
                  {showAddForm !== "shipping" && (
                    <button
                      onClick={() => setShowAddForm("shipping")}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm"
                    >
                      <Plus size={16} />
                      Add New
                    </button>
                  )}
                </div>

                {showAddForm === "shipping" && (
                  <div className="mb-6 border-2 border-emerald-100 rounded-xl p-5 sm:p-6 bg-emerald-50/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        Add New Address
                      </h3>
                      <button
                        onClick={() => setShowAddForm(null)}
                        className="text-gray-500 hover:text-gray-700 p-1"
                      >
                        <X size={22} />
                      </button>
                    </div>

                    {hasMapsApi && mapsReady && (
                      <button
                        type="button"
                        onClick={useMyLocation}
                        disabled={gettingLocation}
                        className={`w-full mb-5 py-2.5 px-4 bg-white border-2 border-emerald-400 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-60 ${
                          gettingLocation ? "animate-pulse" : ""
                        }`}
                      >
                        <Navigation size={16} />
                        {gettingLocation
                          ? "Fetching location..."
                          : "Use Current Location"}
                      </button>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition ${
                              formErrors.fullName
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                          {formErrors.fullName && (
                            <p className="text-red-600 text-xs mt-1">
                              {formErrors.fullName}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="10-digit number"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition ${
                              formErrors.phoneNumber
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                          {formErrors.phoneNumber && (
                            <p className="text-red-600 text-xs mt-1">
                              {formErrors.phoneNumber}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address *
                        </label>
                        {hasMapsApi ? (
                          <Autocomplete
                            onLoad={(ac) => {
                              autocompleteRef.current = ac;
                            }}
                            onPlaceChanged={() => {
                              const place = autocompleteRef.current.getPlace();
                              if (!place?.address_components) return;

                              let street = "";
                              let city = "";
                              let state = "";
                              let postalCode = "";

                              place.address_components.forEach((component) => {
                                const types = component.types;
                                if (
                                  types.includes("street_number") ||
                                  types.includes("route")
                                ) {
                                  street += component.long_name + " ";
                                }
                                if (types.includes("locality"))
                                  city = component.long_name;
                                if (
                                  types.includes("administrative_area_level_1")
                                )
                                  state = component.long_name;
                                if (types.includes("postal_code"))
                                  postalCode = component.long_name;
                              });

                              setFormData((prev) => ({
                                ...prev,
                                addressLine1:
                                  street.trim() ||
                                  place.formatted_address ||
                                  prev.addressLine1,
                                city: city || prev.city,
                                state: state || prev.state,
                                postalCode: postalCode || prev.postalCode,
                              }));
                              setFormErrors((prev) => ({
                                ...prev,
                                addressLine1: "",
                              }));
                            }}
                          >
                            <input
                              type="text"
                              name="addressLine1"
                              value={formData.addressLine1}
                              onChange={handleInputChange}
                              placeholder="House No., Building, Street"
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition ${
                                formErrors.addressLine1
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-300"
                              }`}
                            />
                          </Autocomplete>
                        ) : (
                          <input
                            type="text"
                            name="addressLine1"
                            value={formData.addressLine1}
                            onChange={handleInputChange}
                            placeholder="House No., Building, Street"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition ${
                              formErrors.addressLine1
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                        )}
                        {formErrors.addressLine1 && (
                          <p className="text-red-600 text-xs mt-1">
                            {formErrors.addressLine1}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Landmark (Optional)
                        </label>
                        <input
                          type="text"
                          name="addressLine2"
                          value={formData.addressLine2}
                          onChange={handleInputChange}
                          placeholder="Nearby landmark"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition ${
                              formErrors.city
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                          {formErrors.city && (
                            <p className="text-red-600 text-xs mt-1">
                              {formErrors.city}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="State"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition ${
                              formErrors.state
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                          {formErrors.state && (
                            <p className="text-red-600 text-xs mt-1">
                              {formErrors.state}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            PIN Code *
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            placeholder="6 digits"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition ${
                              formErrors.postalCode
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                          {formErrors.postalCode && (
                            <p className="text-red-600 text-xs mt-1">
                              {formErrors.postalCode}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Type
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {["home", "work", "other"].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  addressType: type,
                                }))
                              }
                              className={`py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                                formData.addressType === type
                                  ? "bg-emerald-600 text-white border-emerald-600"
                                  : "border-gray-300 text-gray-700 hover:border-emerald-400 hover:bg-emerald-50/30"
                              }`}
                            >
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={formData.isDefault}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700">
                          Set as default address
                        </span>
                      </label>

                      <div className="flex gap-3 pt-3">
                        <button
                          type="submit"
                          className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm shadow-sm"
                        >
                          Save Address
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddForm(null);
                            setFormErrors({});
                          }}
                          className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm border border-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">
                      No saved addresses yet
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Add one to continue
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <AddressCard
                        key={address._id}
                        address={address}
                        isSelected={selectedShippingId === address._id}
                        onSelect={() => {
                          setSelectedShippingId(address._id);
                          if (sameAsShipping) setSelectedBillingId(address._id);
                          setError("");
                        }}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </div>

              {addresses.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Billing Address
                  </h2>

                  <label className="flex items-center gap-2.5 cursor-pointer p-4 bg-gray-50 rounded-xl border border-gray-200 mb-5">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => {
                        setSameAsShipping(e.target.checked);
                        if (e.target.checked)
                          setSelectedBillingId(selectedShippingId);
                      }}
                      className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Same as shipping address
                    </span>
                  </label>

                  {!sameAsShipping && (
                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <AddressCard
                          key={address._id}
                          address={address}
                          isSelected={selectedBillingId === address._id}
                          onSelect={() => {
                            setSelectedBillingId(address._id);
                            setError("");
                          }}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-5">
                  Order Summary
                </h3>

                <div className="mb-5 pb-5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Shipping To
                  </p>
                  {selectedShippingId &&
                  addresses.find((addr) => addr._id === selectedShippingId) ? (
                    <div className="text-sm space-y-1">
                      <p className="font-semibold text-gray-900">
                        {
                          addresses.find(
                            (addr) => addr._id === selectedShippingId,
                          )?.fullName
                        }
                      </p>
                      <p className="text-gray-700">
                        {
                          addresses.find(
                            (addr) => addr._id === selectedShippingId,
                          )?.addressLine1
                        }
                      </p>
                      <p className="text-gray-600">
                        {
                          addresses.find(
                            (addr) => addr._id === selectedShippingId,
                          )?.city
                        }
                        ,{" "}
                        {
                          addresses.find(
                            (addr) => addr._id === selectedShippingId,
                          )?.state
                        }{" "}
                        -{" "}
                        {
                          addresses.find(
                            (addr) => addr._id === selectedShippingId,
                          )?.postalCode
                        }
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Select shipping address
                    </p>
                  )}
                </div>

                {!sameAsShipping && (
                  <div className="mb-5 pb-5 border-b border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                      Billing To
                    </p>
                    {selectedBillingId &&
                    addresses.find((addr) => addr._id === selectedBillingId) ? (
                      <div className="text-sm space-y-1">
                        <p className="font-semibold text-gray-900">
                          {
                            addresses.find(
                              (addr) => addr._id === selectedBillingId,
                            )?.fullName
                          }
                        </p>
                        <p className="text-gray-700">
                          {
                            addresses.find(
                              (addr) => addr._id === selectedBillingId,
                            )?.addressLine1
                          }
                        </p>
                        <p className="text-gray-600">
                          {
                            addresses.find(
                              (addr) => addr._id === selectedBillingId,
                            )?.city
                          }
                          ,{" "}
                          {
                            addresses.find(
                              (addr) => addr._id === selectedBillingId,
                            )?.state
                          }{" "}
                          -{" "}
                          {
                            addresses.find(
                              (addr) => addr._id === selectedBillingId,
                            )?.postalCode
                          }
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Select billing address
                      </p>
                    )}
                  </div>
                )}

                <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">
                    Delivery
                  </p>
                  <p className="text-sm font-medium text-emerald-800">
                    Standard Shipping
                  </p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    3-5 business days
                  </p>
                </div>

                <button
                  onClick={handleContinue}
                  disabled={
                    !selectedShippingId ||
                    (!sameAsShipping && !selectedBillingId)
                  }
                  className={`w-full py-3 rounded-lg font-medium text-sm transition-all shadow-sm ${
                    selectedShippingId && (sameAsShipping || selectedBillingId)
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Continue to Payment
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By continuing, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddressPage;
