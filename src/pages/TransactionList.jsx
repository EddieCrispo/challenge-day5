// components/TransactionList.jsx
import { useContext } from "react";
import { TransactionContext } from "../contexts/TransactionContext";

const TransactionList = () => {
  const {
    transactions,
    loading,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
  } = useContext(TransactionContext);

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search description or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/2"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/4"
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="transfer">Transfer</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul className="space-y-3">
          {transactions.map((tx) => (
            <li key={tx.id} className="border rounded p-3 shadow-sm">
              <div className="flex justify-between">
                <span className="font-semibold">{tx.description}</span>
                <span
                  className={`font-semibold ${
                    tx.type === "income" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}${tx.amount}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {tx.date} · {tx.category}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;
