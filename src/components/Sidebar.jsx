import cx from "classnames";
import {
  ArrowRightLeft,
  Brain,
  Home,
  LogOut,
  Send,
  UsersIcon,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useAccountStore } from "../stores/accountStore";
import React, { useEffect, useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { accounts, fetchAccounts } = useAccountStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { 
      name: "Transfer", 
      icon: <Send className="w-5 h-5" />, 
      path: "/transfer" 
    },
    { 
      name: "Insight", 
      icon: <Brain className="w-5 h-5" />, 
      path: "/insight" 
    },
  ];

  const handleLogout = () => {
    const result = confirm("Are you sure you want to logout?");

    if (result) {
      logout();
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile & Tablet Menu Toggle Button - Visible on mobile and tablet */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-100 dark:bg-gray-800 rounded-md border border-slate-200 dark:border-gray-700"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-900 dark:text-gray-100" />
        ) : (
          <Menu className="w-6 h-6 text-gray-900 dark:text-gray-100" />
        )}
      </button>

      {/* Mobile & Tablet Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={cx(
        "flex flex-col border-r border-slate-200 dark:border-gray-700 bg-slate-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-transform duration-300 z-50",
        // Mobile & Tablet styles (0-1023px) - Hidden by default, shown when toggled
        "fixed top-0 left-0 h-full w-64 transform",
        {
          "translate-x-0": isMobileMenuOpen,
          "-translate-x-full": !isMobileMenuOpen,
        },
        // Desktop styles (1024px+) - Always visible, full width sidebar
        "lg:translate-x-0 lg:static lg:w-72 lg:h-screen"
      )}>
        
        {/* User Profile Section */}
        <div className="px-8 py-4 border-t border-slate-200 dark:border-gray-700 mb-2">
          <div className="flex items-center gap-3">
            <img
              src={user.imageProfile || "https://via.placeholder.com/150"}
              alt="User"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
            />
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                Hi! {user.name.split(" ")[0]}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col space-y-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeMobileMenu}
                className={cx(
                  {
                    "border-blue-500 bg-slate-200 dark:bg-gray-700": isActive,
                    "border-transparent": !isActive,
                  },
                  "box-border border-l-6 flex items-center gap-3 px-8 py-4 hover:bg-slate-300 dark:hover:bg-gray-700 transition text-gray-900 dark:text-gray-100"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto p-4 lg:p-2 xl:p-8">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 lg:px-2 lg:justify-center xl:px-4 xl:justify-start py-2 rounded-md transition w-full hover:text-red-500 dark:hover:text-red-400 cursor-pointer text-gray-900 dark:text-gray-100"
            title="Logout" // Tooltip for tablet view
          >
            <LogOut className="w-5 h-5" />
            <span className="lg:hidden xl:block">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
