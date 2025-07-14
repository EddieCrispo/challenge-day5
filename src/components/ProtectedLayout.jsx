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
      
      <div className={`
        bg-white dark:bg-gray-900 max-h-screen overflow-y-auto
        /* 📱📊 Mobile & Tablet (0-1023px) - Full width with top padding for toggle button */
        w-full pt-16 px-4 pb-4
        /* 💻 Desktop (1024px+) - Account for sidebar width */
        lg:w-[calc(100vw-288px)] lg:pt-12 lg:px-12 lg:pb-12
      `}>
        {children}
      </div>
    </div>
  );
}

export default ProtectedLayout;