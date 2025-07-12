import React from "react";
import { useAuthStore } from "../stores/authStore";
import { Navigate } from "react-router";

function PublicLayout({ children }) {
  const { user } = useAuthStore();

  if (!!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

export default PublicLayout;
