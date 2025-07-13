// Sidebar.jsx
import cx from "classnames";
import { ArrowRightLeft, Home, LogOut, Send, UsersIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useAccountStore } from "../stores/accountStore";
import { useEffect } from "react";
import Profile from "./Profile";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { accounts, fetchAccounts } = useAccountStore();

  useEffect(() => {
    if (user?.id) fetchAccounts(user.id);
  }, [user?.id, fetchAccounts]);

  const account = accounts[0];

  const menuItems = [
    {
      name: "Dashboard",
      icon: <Home className="w-5 h-5" />,
      path: "/dashboard",
    },
    {
      name: "Profile",
      icon: <UsersIcon className="w-5 h-5" />,
      path: "/Profile",
    },
    {
      name: "Transactions",
      icon: <ArrowRightLeft className="w-5 h-5" />,
      path: "/transaction",
    },
    { name: "Transfer", icon: <Send className="w-5 h-5" />, path: "/transfer" },
  ];

  const handleLogout = () => logout();

  return (
    <div className="flex flex-col border-r border-slate-200 w-[300px] bg-slate-100 text-gray-900">
      <div className="px-8 py-4 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <img
            src={user.imageProfile || "https://via.placeholder.com/150"}
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-bold">Hi! {user.name.split(" ")[0]}</p>
          </div>
        </div>
      </div>

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
        {/* {user && (
          <div className="px-8 py-4 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <img
                src={user.imageProfile || "https://via.placeholder.com/150"}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        )} */}

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
