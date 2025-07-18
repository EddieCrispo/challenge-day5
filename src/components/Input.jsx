import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const Input = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`w-full px-4 py-3 border rounded-lg transition-all focus:ring-2 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
          error
            ? "border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400"
            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
        }`}
      />

      {error && <p className="text-sm text-red-500 dark:text-red-400 mt-1">{error}</p>}
    </div>
  );
};

export const InputPassword = ({ label, error, ...props }) => {
  const [show, setShow] = useState(false);

  const toggle = () => {
    setShow((prev) => !prev);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...props}
          type={show ? "text" : "password"}
          className={`w-full border rounded-lg px-4 py-3 pr-10 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400"
              : "border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          }`}
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {error && <p className="text-sm text-red-500 dark:text-red-400 mt-1">{error}</p>}
    </div>
  );
};