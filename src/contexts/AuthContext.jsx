import Cookies from "js-cookie";
import { createContext, useContext, useState } from "react";
import axios from "../utils/axiosInstance";

const TOKEN_KEY = "auth_token";

const getUserFromCookie = () => {
  const token = Cookies.get(TOKEN_KEY);
  if (!token) return null;

  try {
    return JSON.parse(atob(token));
  } catch (e) {
    console.error("Invalid token format");
    return null;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromCookie());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (email, password) => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get("/users", {
        params: { email, password },
      });

      const user = res.data[0];

      if (!user) throw new Error("Invalid email or password");

      // Simulate token creation (base64)
      const token = btoa(JSON.stringify(user));
      Cookies.set(TOKEN_KEY, token, { expires: 7 });

      setUser(user);
      return user;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
