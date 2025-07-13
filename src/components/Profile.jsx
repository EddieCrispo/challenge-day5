import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Mail, Phone, MapPin, User } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();

  if (!user) return <p className="p-6">No user data found.</p>;

  return (
    <div className="min-h-screen bg-[#f5f7fa] px-6 py-10 font-sans text-slate-800">
      <div className="flex flex-col items-center text-center mb-10">
        <img
          src={user.imageProfile || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md mb-4"
        />
        <h2 className="text-2xl font-semibold tracking-wide">
          Welcome, {user.name?.split(" ")[0]} 👋
        </h2>
      </div>

      {/* Profile Details */}
      <div className="max-w-2xl mx-auto grid gap-6">
        {/* Card Component */}
        <div className="bg-white rounded-2xl shadow-sm flex items-center p-5 space-x-4">
          <User className="text-blue-500 w-6 h-6" />
          <div>
            <p className="text-sm text-gray-400">Full Name</p>
            <p className="text-lg font-semibold">{user.name}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm flex items-center p-5 space-x-4">
          <Mail className="text-blue-500 w-6 h-6" />
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-lg font-semibold break-all">{user.email}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm flex items-center p-5 space-x-4">
          <Phone className="text-blue-500 w-6 h-6" />
          <div>
            <p className="text-sm text-gray-400">Phone</p>
            <p className="text-lg font-semibold">{user.phoneNumber}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm flex items-center p-5 space-x-4">
          <MapPin className="text-blue-500 w-6 h-6" />
          <div>
            <p className="text-sm text-gray-400">Address</p>
            <p className="text-lg font-semibold">{user.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
