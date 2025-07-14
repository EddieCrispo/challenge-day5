import { ArrowDownRight, DollarSign, TrendingUp } from "lucide-react";
import { useAccountStore } from "../stores/accountStore";
import { useEffect, useMemo } from "react";
import { useTransactionStore } from "../stores/transactionStore";
import { useAuth } from "../contexts/AuthContext";

export default function SummarySection({}) {
  const { user } = useAuth();
  const { accounts, loading } = useAccountStore();
  const { transactions, fetchTransactions } = useTransactionStore();

  const totalBalance = useMemo(() => {
    return accounts.reduce((acc, curr) => acc + Number(curr.balance || 0), 0);
  }, [accounts]);

  const totalIncome = useMemo(() => {
    return transactions
      .filter((item) => item.receiverUserId === user.id)
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((item) => item.userId === user.id)
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  }, [transactions]);

  useEffect(() => {
    if (user.id) {
      fetchTransactions(user.id);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-slate-100 dark:bg-gray-800 rounded-xl p-6 border border-slate-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Balance</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${totalBalance.toFixed(2)}
            </p>
          </div>
          <div className="bg-blue-200 dark:bg-blue-900/30 p-3 rounded-lg">
            <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div className="bg-slate-100 dark:bg-gray-800 rounded-xl p-6 border border-slate-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Income</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${totalIncome.toFixed(2)}
            </p>
          </div>
          <div className="bg-green-200 dark:bg-green-900/30 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      <div className="bg-slate-100 dark:bg-gray-800 rounded-xl p-6 border border-slate-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Expenses</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              ${totalExpense.toFixed(2)}
            </p>
          </div>
          <div className="bg-red-200 dark:bg-red-900/30 p-3 rounded-lg">
            <ArrowDownRight className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

const SkeletonCard = () => (
  <div className="bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-slate-200 dark:border-gray-700 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-4 w-24 bg-slate-100 dark:bg-gray-600 rounded mb-2" />
        <div className="h-6 w-32 bg-slate-100 dark:bg-gray-600 rounded" />
      </div>
      <div className="bg-slate-100 dark:bg-gray-600 p-3 rounded-lg">
        <div className="w-6 h-6 bg-slate-200 dark:bg-gray-500 rounded" />
      </div>
    </div>
  </div>
);