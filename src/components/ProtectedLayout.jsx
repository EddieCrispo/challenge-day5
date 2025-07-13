import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "./Sidebar";

function ProtectedLayout({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="w-screen h-screen flex justify-center">
      <Sidebar />

      <div className="w-[calc(100vw-300px)] p-12">{children}</div>
    </div>
  );
}

export default ProtectedLayout;
