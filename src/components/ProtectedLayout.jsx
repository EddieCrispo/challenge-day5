import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function ProtectedLayout({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default ProtectedLayout;
