import { create } from "zustand";
import axios from "axios";

export const useAccountStore = create((set) => ({
  accounts: [],
  loading: false,
  error: "",

  fetchAccounts: async (userId) => {
    set({ loading: true, error: "" });
    try {
      const response = await axios.get(
        "https://6871fab176a5723aacd33ea6.mockapi.io/api/v1/accounts",
        {
          params: { userId },
        }
      );
      set({ accounts: response.data.filter((item) => item.userId === userId) });
    } catch (err) {
      set({ error: err.message || "Failed to fetch accounts." });
    } finally {
      set({ loading: false });
    }
  },
}));
