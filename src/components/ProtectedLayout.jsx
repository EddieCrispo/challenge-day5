import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "./Sidebar";

function ProtectedLayout({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="max-w-screen max-h-screen flex justify-center overflow-hidden bg-white dark:bg-gray-900">
      <Sidebar />
      <div className="w-[calc(100vw-300px)] p-12 bg-white dark:bg-gray-900 max-h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export default ProtectedLayout;