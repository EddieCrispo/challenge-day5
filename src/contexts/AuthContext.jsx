import React, { createContext, useState } from "react";
import { useMemoryStorage, clearSessionData } from "../hooks/useMemoryStorage";
import { mockAPI } from "../utils/mockAPI";
import { useNavigate } from "react-router";

// Auth Context
export const AuthContext = createContext();

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useMemoryStorage("banktech_user", null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const userData = await mockAPI.authenticate(email, password);
      setUser(userData);
      navigate("/transfer");
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError("");
    try {
      const newUser = await mockAPI.register(userData);
      setUser(newUser);
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    clearSessionData();
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
