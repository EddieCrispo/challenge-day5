import { create } from "zustand";
import Cookies from "js-cookie";
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

export const useAuthStore = create((set) => ({
  user: getUserFromCookie(),
  loading: false,
  error: "",

  login: async (email, password) => {
    set({ loading: true, error: "" });

    try {
      const res = await axios.get("/users", {
        params: { email, password },
      });

      const user = res.data[0];

      if (!user) throw new Error("Invalid email or password");

      // 🔐 Hash user object into a base64 "token"
      const token = btoa(JSON.stringify(user));
      Cookies.set(TOKEN_KEY, token, { expires: 7 });

      set({ user });
      return user;
    } catch (err) {
      set({ error: err.message || "Login failed" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    Cookies.remove(TOKEN_KEY);
    set({ user: null });
  },
}));
