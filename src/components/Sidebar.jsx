// Sidebar.jsx
import cx from "classnames";
import { ArrowRightLeft, Home, LogOut, Send } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <Home className="w-5 h-5" />,
      path: "/dashboard",
    },
    {
      name: "Transactions",
      icon: <ArrowRightLeft className="w-5 h-5" />,
      path: "/transaction",
    },
    {
      name: "Transfer",
      icon: <Send className="w-5 h-5" />,
      path: "/transfer",
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col border-r border-slate-200 w-[300px] bg-slate-100  text-gray-900">
      <h1 className="text-2xl font-bold p-8">Menu</h1>

      <nav className="flex flex-col space-y-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={cx(
                {
                  "border-blue-500 bg-slate-200": isActive,
                  "border-transparent": !isActive,
                },
                "box-border border-l-6 flex items-center gap-3 px-8 py-4 hover:bg-slate-300 transition"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-8">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-md transition w-full hover:text-red-500 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
