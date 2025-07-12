import React from "react";
import { useAuthStore } from "../stores/authStore";
import { Navigate } from "react-router";

function ProtectedLayout({ children }) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default ProtectedLayout;
