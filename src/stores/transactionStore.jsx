import { create } from "zustand";
import axiosInstance from "../utils/axiosInstance";
import axios from "axios";

const API_URL = "/transactions";

export const useTransactionStore = create((set) => ({
  transactions: [],
  loading: false,
  error: "",

  // GET transactions
  fetchTransactions: async () => {
    set({ loading: true, error: "" });
    try {
      const response = await axiosInstance.get(API_URL);
      set({ transactions: response.data, loading: false });
    } catch (error) {
      set({
        error: "Failed to fetch transactions",
        loading: false,
      });
      console.error(error);
    }
  },

  createTransaction: async (newTransaction, receiverAccount, sourceAccount) => {
    try {
      set({ loading: true, error: "" });
      const payloadTransaction = {
        type: newTransaction.type,
        amount: newTransaction.amount,
        description: newTransaction.description || "",
        categoryId: newTransaction.categoryId || "5",
        sourceAccount: newTransaction.sourceAccount,
        receiverAccount: newTransaction.recipient,
        createdAt: new Date(),
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

      set((state) => ({
        transactions: [...(state?.transactions || []), payloadTransaction],
        loading: false,
      }));
    } catch (error) {
      set({
        error: "Failed to create transaction",
        loading: false,
      });
      throw error;
    }
  },
}));
