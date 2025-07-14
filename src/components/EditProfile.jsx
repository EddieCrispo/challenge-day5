import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Mail, Phone, MapPin, User, Save, X } from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    address: user?.address || "",
    imageProfile: user?.imageProfile || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!user) return <p className="p-6">No user data found.</p>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageUrlChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      imageProfile: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Send PUT request to update user profile
      const response = await axios.put(
        `https://6871fab176a5723aacd33ea6.mockapi.io/api/v1/accounts/${user.id}`,
        {
          ...user,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          imageProfile: formData.imageProfile,
        }
      );

      // Optionally update local context or state
      updateUser(response.data);

      // Redirect to profile page
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen px-6 py-10 font-sans text-slate-800">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Edit Profile</h1>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative">
              <img
                src={formData.imageProfile || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
              />
            </div>
            <div className="mt-4 w-full max-w-md">
              <label className="text-sm text-gray-400 block mb-1">
                Profile Picture URL
              </label>
              <input
                type="url"
                value={formData.imageProfile}
                onChange={handleImageUrlChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter image URL"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name Field */}
            <div className="bg-gray-100 rounded-2xl shadow-sm p-5">
              <div className="flex items-center space-x-4">
                <User className="text-blue-500 w-6 h-6" />
                <div className="flex-1">
                  <label className="text-sm text-gray-400 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full text-lg font-semibold bg-transparent border-none outline-none ${
                      errors.name ? "text-red-500" : ""
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Email Field - Read Only */}
            <div className="bg-gray-50 rounded-2xl shadow-sm p-5 opacity-75">
              <div className="flex items-center space-x-4">
                <Mail className="text-gray-400 w-6 h-6" />
                <div className="flex-1">
                  <label className="text-sm text-gray-400 block mb-1">
                    Email (Cannot be changed)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="w-full text-lg font-semibold bg-transparent border-none outline-none cursor-not-allowed text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Phone Field */}
            <div className="bg-gray-100 rounded-2xl shadow-sm p-5">
              <div className="flex items-center space-x-4">
                <Phone className="text-blue-500 w-6 h-6" />
                <div className="flex-1">
                  <label className="text-sm text-gray-400 block mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`w-full text-lg font-semibold bg-transparent border-none outline-none ${
                      errors.phoneNumber ? "text-red-500" : ""
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Field */}
            <div className="bg-gray-100 rounded-2xl shadow-sm p-5">
              <div className="flex items-center space-x-4">
                <MapPin className="text-blue-500 w-6 h-6" />
                <div className="flex-1">
                  <label className="text-sm text-gray-400 block mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full text-lg font-semibold bg-transparent border-none outline-none resize-none ${
                      errors.address ? "text-red-500" : ""
                    }`}
                    placeholder="Enter your address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
