import { useContext, useEffect } from "react";
import AccountSection from "../components/AccountSection";
import SummarySection from "../components/SummarySection";
import { useAuth } from "../contexts/AuthContext";
import { TransactionContext } from "../contexts/TransactionContext";
import { useAccountStore } from "../stores/accountStore";

export default function DashboardPage() {
  const { user } = useAuth(); // user.id must be available
  const { transactions, loading } = useContext(TransactionContext);
  const { accounts, fetchAccounts } = useAccountStore();

  useEffect(() => {
    if (user?.id) {
      fetchAccounts(user.id);
    }
  }, [user?.id, fetchAccounts]);

  const account = accounts.length > 0 ? accounts[0] : null;

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-4 ">
      <h1 className="text-2xl font-bold mb-4">Accounts</h1>

      <AccountSection />

      <SummarySection />

      {/* Recent Transactions */}
      {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Transactions
          </h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            View All
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.type === "income"
                        ? "bg-green-100"
                        : transaction.type === "expense"
                        ? "bg-red-100"
                        : "bg-blue-100"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    ) : transaction.type === "expense" ? (
                      <ArrowDownRight className="w-5 h-5 text-red-600" />
                    ) : (
                      <Send className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.category} • {transaction.date}
                    </p>
                  </div>
                </div>
                <div
                  className={`font-semibold ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : transaction.type === "expense"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}$
                  {transaction.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div> */}
    </div>
  );
}
