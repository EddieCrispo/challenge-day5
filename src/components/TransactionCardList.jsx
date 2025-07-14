import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTransactionStore } from "../stores/transactionStore";
import TransactionCard from "./TransactionCard";

export default function TransactionCardList({ transactions }) {
  const { loading } = useTransactionStore();

  if (loading) {
    return (
      <ul className="space-y-3">
        {[...Array(3)].map((_, idx) => (
          <li
            key={idx}
            className="rounded-md bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-800 h-[5rem] flex items-center justify-between p-4 px-6 animate-pulse"
          >
            <div className="flex items-center gap-3 flex-grow">
              <div className="h-10 w-10 bg-slate-100 dark:bg-gray-600 rounded-full" />
              <div className="flex flex-col gap-2 w-[20rem]">
                <div className="h-3 bg-slate-100 dark:bg-gray-600 rounded w-2/3"></div>
                <div className="h-3 bg-slate-100 dark:bg-gray-600 rounded w-1/3"></div>
                <div className="h-3 bg-slate-100 dark:bg-gray-600 rounded w-1/4"></div>
              </div>
            </div>
            <div className="h-6 w-16 bg-slate-100 dark:bg-gray-600 rounded"></div>
          </li>
        ))}
      </ul>
    );
  }

  if (!transactions || transactions.length === 0) {
    return <p className="text-slate-500 italic">No transactions.</p>;
  }

  return (
    <ul className="space-y-3">
      {transactions.map((tx) => (
        <TransactionCard key={tx.id} transaction={tx} />
      ))}
    </ul>
  );
}
