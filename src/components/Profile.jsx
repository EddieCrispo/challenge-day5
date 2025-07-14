import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { Mail, Phone, MapPin, User, Edit } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user)
    return (
      <p className="p-6 text-gray-900 dark:text-white">No user data found.</p>
    );

  const handleEditProfile = () => {
    navigate("/profile-edit");
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 px-6 py-10 font-sans text-slate-800 dark:text-gray-200">
      <div className="flex flex-col items-center text-center mb-10">
        <img
          src={user.imageProfile || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-600 shadow-md mb-4"
        />
        <h2 className="text-2xl font-semibold tracking-wide text-gray-900 dark:text-white">
          Welcome, {user.name?.split(" ")[0]} 👋
        </h2>

        {/* Edit Profile Button */}
        <button
          onClick={handleEditProfile}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Profile*/}
      <div className="max-w-2xl mx-auto grid gap-6">
        {/* Card*/}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-lg border border-gray-100 dark:border-gray-700 flex items-center p-5 space-x-4">
          <User className="text-blue-500 dark:text-blue-400 w-6 h-6" />
          <div>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Full Name
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.name}
            </p>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-lg border border-gray-100 dark:border-gray-700 flex items-center p-5 space-x-4">
          <Mail className="text-blue-500 dark:text-blue-400 w-6 h-6" />
          <div>
            <p className="text-sm text-gray-400 dark:text-gray-500">Email</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white break-all">
              {user.email}
            </p>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-lg border border-gray-100 dark:border-gray-700 flex items-center p-5 space-x-4">
          <Phone className="text-blue-500 dark:text-blue-400 w-6 h-6" />
          <div>
            <p className="text-sm text-gray-400 dark:text-gray-500">Phone</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.phoneNumber}
            </p>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-lg border border-gray-100 dark:border-gray-700 flex items-center p-5 space-x-4">
          <MapPin className="text-blue-500 dark:text-blue-400 w-6 h-6" />
          <div>
            <p className="text-sm text-gray-400 dark:text-gray-500">Address</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
