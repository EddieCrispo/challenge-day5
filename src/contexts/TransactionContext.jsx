import React, { createContext, useState, useContext, useEffect } from "react";
import { mockAPI } from "../utils/mockAPI";
import { useAuth } from "./AuthContext";

// Transaction Context
export const TransactionContext = createContext();

// Transaction Provider
export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  const loadTransactions = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userTransactions = await mockAPI.getTransactions(user.id);
      setTransactions(userTransactions);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData) => {
    if (!user) return;
    try {
      const newTransaction = await mockAPI.addTransaction({
        ...transactionData,
        userId: user.id,
      });
      setTransactions((prev) => [newTransaction, ...prev]);
      return newTransaction;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [user]);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter = filter === "all" || transaction.type === filter;
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <TransactionContext.Provider
      value={{
        transactions: filteredTransactions,
        allTransactions: transactions,
        loading,
        filter,
        setFilter,
        searchTerm,
        setSearchTerm,
        loadTransactions,
        addTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
