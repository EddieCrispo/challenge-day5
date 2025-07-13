// components/TransactionList.jsx
import { useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTransactionStore } from "../stores/transactionStore";
import { useCategoryStore } from "../stores/categoryStore";

const formatDate = (isoDate) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(isoDate).toLocaleDateString(undefined, options);
};

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

      {loading ? (
        <ul className="space-y-3">
          {[...Array(3)].map((_, idx) => (
            <li
              key={idx}
              className="rounded-md bg-gradient-to-r from-gray-300 to-gray-200 h-[5rem] flex items-center justify-between p-4 px-6 animate-pulse"
            >
              <div className="flex flex-col gap-2 flex-grow">
                <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                <div className="h-3 bg-slate-100 rounded w-1/4"></div>
              </div>
              <div className="h-6 w-16 bg-slate-100 rounded"></div>
            </li>
          ))}
        </ul>
      ) : filteredTransactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul className="space-y-3">
          {filteredTransactions.map((tx) => {
            const isIncome = tx.receiverUserId === user.id;
            const amountSign = isIncome ? "+" : "-";
            const amountColor = isIncome ? "text-green-500" : "text-red-500";
            const title = isIncome
              ? `Incoming Money from ${tx.sourceAccount}`
              : `Transfer to ${tx.receiverAccount}`;

            return (
              <li
                key={tx.id}
                className="border rounded-md border-slate-300 shadow-md min-h-[5rem] flex items-center justify-between p-4 px-6 bg-white"
              >
                <div className="flex flex-col mb-1">
                  <span className="font-semibold">{title}</span>
                  {tx.description && (
                    <p className="text-sm text-gray-600">{tx.description}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    {formatDate(tx.createdAt)}{" "}
                    {tx.categoryName ? `· ${tx.categoryName}` : ""}
                  </p>
                </div>

                <span className={`font-semibold text-2xl ${amountColor}`}>
                  {amountSign}${tx.amount}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;
