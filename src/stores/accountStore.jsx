import { create } from "zustand";
import axios from "axios";

export const useAccountStore = create((set, get) => ({
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

  addAccount: async (newAccount) => {
    // optimistically tambah ke state
    set({ accounts: [...get().accounts, newAccount] });

    try {
      const { data } = await axios.post(
        'https://6871fab176a5723aacd33ea6.mockapi.io/api/v1/accounts',
        newAccount
      );

      set({
        accounts: get().accounts.map((acc) =>
          acc === newAccount ? data : acc
        ),
      });
    } catch (err) {
      // rollback jika gagal
      set({
        accounts: get().accounts.filter((acc) => acc !== newAccount),
        error: err.message || 'Failed to create account.',
      });
    }
  },

  deleteAccount: async (userId, id) => {

    const previousAccounts = get().accounts;
    set({ accounts: previousAccounts.filter((acc) => acc.id !== id) });

    try {
      await axios.delete(`https://6871fab176a5723aacd33ea6.mockapi.io/api/v1/users/${userId}/accounts/${id}`);
    } catch (err) {
      set({
        accounts: previousAccounts, // rollback
        error: err.message || "Failed to delete account.",
      });
      console.log('ini kalau ada err di accountStore');
      console.log(err.message);
    }
  }
}));
