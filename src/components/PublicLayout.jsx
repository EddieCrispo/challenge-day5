import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function PublicLayout({ children }) {
  const { user } = useAuth();

  if (!!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-900 flex items-center justify-center p-4 ">
      <div className="bg-white rounded-2xl shadow-xl dark:border dark:border-blue-300 dark:shadow-blue-500/20 dark:shadow-2xl p-8 w-full max-w-md dark:bg-gray-800">
        {children}
      </div>
    </div>
  );
}

export default PublicLayout;
