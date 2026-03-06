import React, { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { useAuth } from "../context/UnifiedAuthContext";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Edit3,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

const Profile = () => {
  const { user, updateProfile, loading } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India"
    }
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setProfileData(user);
      setEditForm({
        name: user.name || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
          country: user.address?.country || "India"
        }
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: profileData.name || "",
      phone: profileData.phone || "",
      address: {
        street: profileData.address?.street || "",
        city: profileData.address?.city || "",
        state: profileData.address?.state || "",
        zipCode: profileData.address?.zipCode || "",
        country: profileData.address?.country || "India"
      }
    });
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    setUpdateLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await updateProfile(editForm);
      if (result.success) {
        setProfileData(result.user);
        setIsEditing(false);
        setSuccess("Profile updated successfully!");
      } else {
        setError(result.message || "Failed to update profile");
      }
    } catch {
      setError("An error occurred while updating profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatLastLogin = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "Yesterday";
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // If auth check finished and no user found, redirect to login
  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-2xl p-8"
        >
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <img
                src={profileData.profileImage || profileData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=4F46E5&color=fff&size=128`}
                alt={profileData.name}
                className="w-28 h-28 rounded-full border-4 border-indigo-500 shadow-md"
              />
              {profileData.isVerified && (
                <CheckCircle className="absolute -bottom-1 -right-1 w-6 h-6 text-green-500 bg-white rounded-full" />
              )}
            </motion.div>
            
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
              <p className="text-indigo-600 font-medium mt-1 capitalize">{profileData.role}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                  profileData.isActive 
                    ? "bg-green-100 text-green-600" 
                    : "bg-red-100 text-red-600"
                }`}>
                  {profileData.isActive ? "Active" : "Inactive"}
                </span>
                {profileData.isVerified && (
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-600 rounded-full">
                    Verified
                  </span>
                )}
              </div>
            </div>
            
            <div className="ml-auto hidden sm:block">
              {!isEditing ? (
                <button 
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow transition-all"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={handleSave}
                    disabled={updateLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow transition-all disabled:opacity-50"
                  >
                    {updateLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Save
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg shadow transition-all"
                  >
                    <XCircle className="w-4 h-4" /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Profile Information */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors"
            >
              <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-800">{profileData.email}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors"
            >
              <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Phone</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full text-sm font-medium text-gray-800 bg-transparent border-none outline-none"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-800">
                    {profileData.phone || "Not provided"}
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4 bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors"
            >
              <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="text-sm font-medium text-gray-800">
                  {formatDate(profileData.createdAt)}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors"
            >
              <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Last Login</p>
                <p className="text-sm font-medium text-gray-800">
                  {formatLastLogin(profileData.lastLogin)}
                </p>
              </div>
            </motion.div>

            {/* Address Section */}
            {profileData.address && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="sm:col-span-2 flex items-start gap-4 bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors"
              >
                <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Address</p>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editForm.address.street}
                        onChange={(e) => handleInputChange('address.street', e.target.value)}
                        placeholder="Street address"
                        className="w-full text-sm font-medium text-gray-800 bg-transparent border border-gray-300 rounded px-2 py-1"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editForm.address.city}
                          onChange={(e) => handleInputChange('address.city', e.target.value)}
                          placeholder="City"
                          className="w-full text-sm font-medium text-gray-800 bg-transparent border border-gray-300 rounded px-2 py-1"
                        />
                        <input
                          type="text"
                          value={editForm.address.state}
                          onChange={(e) => handleInputChange('address.state', e.target.value)}
                          placeholder="State"
                          className="w-full text-sm font-medium text-gray-800 bg-transparent border border-gray-300 rounded px-2 py-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editForm.address.zipCode}
                          onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                          placeholder="ZIP Code"
                          className="w-full text-sm font-medium text-gray-800 bg-transparent border border-gray-300 rounded px-2 py-1"
                        />
                        <input
                          type="text"
                          value={editForm.address.country}
                          onChange={(e) => handleInputChange('address.country', e.target.value)}
                          placeholder="Country"
                          className="w-full text-sm font-medium text-gray-800 bg-transparent border border-gray-300 rounded px-2 py-1"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-gray-800">
                      {profileData.address.street && profileData.address.city 
                        ? `${profileData.address.street}, ${profileData.address.city}, ${profileData.address.state} ${profileData.address.zipCode}, ${profileData.address.country}`
                        : "Not provided"
                      }
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Mobile Edit Button */}
          <div className="mt-6 sm:hidden text-center">
            {!isEditing ? (
              <button 
                onClick={handleEdit}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow transition-all"
              >
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2 justify-center">
                <button 
                  onClick={handleSave}
                  disabled={updateLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow transition-all disabled:opacity-50"
                >
                  {updateLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Save
                </button>
                <button 
                  onClick={handleCancel}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg shadow transition-all"
                >
                  <XCircle className="w-4 h-4" /> Cancel
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
