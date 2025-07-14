import axios from "axios";
import { create } from "zustand";
import { useSelectedAccountStore } from "./selectedAccountStore";

export const useTransactionStore = create((set) => ({
  transactions: [],
  loading: false,
  error: "",
  filter: "",
  searchTerm: "",
  sortBy: "createdAt", // new state for sorting
  sortOrder: "desc", // new state for sort order (desc = newest first)

  setFilter: (newFilter) => set({ filter: newFilter }),
  setSearchTerm: (newSearchTerm) => set({ searchTerm: newSearchTerm }),
  setSortBy: (field) => set({ sortBy: field }),
  setSortOrder: (order) => set({ sortOrder: order }),

  // GET transactions with sorting
  fetchTransactions: async (userId) => {
    set({ loading: true, error: "" });
    try {
      const response = await axios.get(
        "https://6873a41cc75558e27354cd24.mockapi.io/api/v1/transactions"
      );

      const selectedAccount =
        useSelectedAccountStore.getState().selectedAccount;
      const accountNumber = selectedAccount?.accountNumber;

      const filteredTransactions = response.data?.filter(
        (item) =>
          item.receiverAccount === accountNumber ||
          item.sourceAccount === accountNumber
      );

      // Sort transactions by createdAt (newest first) by default
      const sortedTransactions = filteredTransactions.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA; // desc order (newest first)
      });

      set({
        transactions: sortedTransactions,
        loading: false,
      });
    } catch (error) {
      set({
        error: "Failed to fetch transactions",
        loading: false,
      });
    }
  },

  // Computed getter for sorted transactions
  get sortedTransactions() {
    return (state) => {
      const { transactions, sortBy, sortOrder } = state;

      return [...transactions].sort((a, b) => {
        let valueA = a[sortBy];
        let valueB = b[sortBy];

        // Handle date sorting
        if (sortBy === "createdAt") {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
        }

        // Handle numeric sorting
        if (sortBy === "amount") {
          valueA = parseFloat(valueA) || 0;
          valueB = parseFloat(valueB) || 0;
        }

        // Handle string sorting
        if (typeof valueA === "string" && typeof valueB === "string") {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }

        if (sortOrder === "asc") {
          return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        } else {
          return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
      });
    };
  },

  createTransaction: async (newTransaction, receiverAccount, sourceAccount) => {
    try {
      set({ loading: true, error: "" });
      const payloadTransaction = {
        type: newTransaction.type,
        amount: newTransaction.amount,
        description: newTransaction.description || "",
        categoryId: newTransaction.category || "5",
        sourceAccount: newTransaction.sourceAccount,
        receiverAccount: newTransaction.recipient,
        createdAt: new Date(),
        userId: newTransaction.userId,
        categoryName: newTransaction.categoryName || "",
        receiverUserId: newTransaction.receiverUserId,
      };

      await axios.post(
        "https://6873a41cc75558e27354cd24.mockapi.io/api/v1/transactions",
        payloadTransaction
      );

      const receiverBalance =
        parseFloat(receiverAccount.balance) +
        parseFloat(payloadTransaction.amount);

      const updatedReceiver = {
        ...receiverAccount,
        balance: parseFloat(receiverBalance.toFixed(2)),
      };

      await axios.put(
        `https://6871fab176a5723aacd33ea6.mockapi.io/api/v1/accounts/${receiverAccount.id}`,
        updatedReceiver
      );

      const sourceBalance =
        parseFloat(sourceAccount.balance) -
        parseFloat(payloadTransaction.amount);

      const updatedSourceAccount = {
        ...sourceAccount,
        balance: parseFloat(sourceBalance.toFixed(2)),
      };

      await axios.put(
        `https://6871fab176a5723aacd33ea6.mockapi.io/api/v1/accounts/${sourceAccount.id}`,
        updatedSourceAccount
      );

      set((state) => {
        const updatedTransactions = [
          ...(state?.transactions || []),
          payloadTransaction,
        ];

        // Sort the updated transactions by createdAt (newest first)
        const sortedTransactions = updatedTransactions.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });

        return {
          transactions: sortedTransactions,
          loading: false,
        };
      });
    } catch (error) {
      set({
        error: "Failed to create transaction",
        loading: false,
      });
      throw error;
    }
  },
}));
