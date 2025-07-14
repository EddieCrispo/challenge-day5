import { create } from "zustand";

const STORAGE_KEY = "selected_account";

const getInitialAccount = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to parse selectedAccount from sessionStorage", error);
    return null;
  }
};

export const useSelectedAccountStore = create((set) => ({
  selectedAccount: getInitialAccount(),

  setSelectedAccount: (account) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    } catch (error) {
      console.error("Failed to save selectedAccount to sessionStorage", error);
    }
    set({ selectedAccount: account });
  },

  clearselectedAccount: () => {
    sessionStorage.removeItem(STORAGE_KEY);
    set({ selectedAccount: null });
  },
}));
