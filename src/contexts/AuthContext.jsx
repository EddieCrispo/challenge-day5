import axios from "axios";
import { faker } from "@faker-js/faker";
import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

const TOKEN_KEY = "auth_token";

const getUserFromSessionStorage = () => {
  const token = sessionStorage.getItem(TOKEN_KEY);
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
  const [user, setUser] = useState(getUserFromSessionStorage());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (email, password) => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        "https://6871fab176a5723aacd33ea6.mockapi.io/api/v1/users",
        {
          params: { email, password },
        }
      );

      const user = res.data[0];
      if (!user) throw new Error("Invalid email or password");

      // Simulate token creation (base64)
      const token = btoa(JSON.stringify(user));
      sessionStorage.setItem(TOKEN_KEY, token);

      setUser(user);
      toast.success("Login successful!");
      return user;
    } catch (err) {
      const message = err.message || "Login failed.";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const register = async (newUser) => {
    setLoading(true);
    setError("");

    try {
      const { accountType, agreeToPolicies, ...payloadUser } = newUser;
      const resUser = await axios.post(
        "https://6871fab176a5723aacd33ea6.mockapi.io/api/v1/users",
        payloadUser
      );
      const createdUser = resUser.data;

      const accountPayload = {
        userId: createdUser.id,
        accountType: accountType,
        accountNumber: faker.finance.accountNumber(),
        createdAt: newUser.createdAt,
        balance: 0,
      };

      await axios.post(
        "https://6871fab176a5723aacd33ea6.mockapi.io/api/v1/accounts",
        accountPayload
      );

      const token = btoa(JSON.stringify(createdUser));
      sessionStorage.setItem(TOKEN_KEY, token);
      setUser(createdUser);
      toast.success("Registration successful!");
      return createdUser;
    } catch (err) {
      const message = err.message || "Registration failed.";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData) => {
    setLoading(true);
    setError("");

    try {
      if (!user || !user.id) {
        throw new Error("No user logged in");
      }

      // Update user data via MockAPI
      const response = await axios.put(
        `https://6871fab176a5723aacd33ea6.mockapi.io/api/v1/users/${user.id}`,
        userData
      );

      const updatedUser = response.data;

      // Update the token in cookies with new user data
      const token = btoa(JSON.stringify(updatedUser));
      Cookies.set(TOKEN_KEY, token, { expires: 7 });

      // Update local state
      setUser(updatedUser);

      toast.success("Profile updated successfully!");
      return updatedUser;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, register, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
