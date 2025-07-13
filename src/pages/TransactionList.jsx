// components/TransactionList.jsx
import { useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTransactionStore } from "../stores/transactionStore";
import { useCategoryStore } from "../stores/categoryStore";
import TransactionCardList from "../components/TransactionCardList";

const TransactionList = () => {
  const {
    transactions,
    fetchTransactions,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    loading,
  } = useTransactionStore();

  const { user } = useAuth();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    if (user?.id) {
      fetchTransactions(user.id);
      fetchCategories();
    }
  }, [user]);

  // Memoized filtered & searched transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.categoryName?.toLowerCase().includes(searchTerm.toLowerCase());

      const isFilterCategory = categories.find((item) => item.id === filter);

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "income"
          ? tx.receiverUserId === user.id
          : filter === "expense"
          ? tx.receiverUserId !== user.id
          : filter === "internal"
          ? tx.type === "internal"
          : filter === "external"
          ? tx.type === "external"
          : isFilterCategory
          ? tx.categoryId === filter
          : true;

      return matchesSearch && matchesFilter;
    });
  }, [transactions, searchTerm, filter, user.id]);

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search description or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full px-4 py-3 border border-slate-300 rounded-lg transition-all focus:ring-2 focus:border-transparent`}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`w-[20rem] px-4 py-3 border border-slate-300 rounded-lg transition-all focus:ring-2 focus:border-transparent`}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="internal">Internal</option>
          <option value="external">External</option>
          {categories.map((option) => (
            <option key={option.name} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      {filteredTransactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <TransactionCardList transactions={filteredTransactions} />
      )}
    </div>
  );
};

export default TransactionList;
