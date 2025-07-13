import { useContext, useEffect } from "react";
import AccountSection from "../components/AccountSection";
import SummarySection from "../components/SummarySection";
import { useAuth } from "../contexts/AuthContext";
import { TransactionContext } from "../contexts/TransactionContext";
import { useAccountStore } from "../stores/accountStore";
import TransactionCardList from "../components/TransactionCardList";
import { useTransactionStore } from "../stores/transactionStore";

export default function DashboardPage() {
  const { user } = useAuth();
  const { transactions } = useTransactionStore();
  const { accounts, fetchAccounts } = useAccountStore();

  useEffect(() => {
    if (user?.id) {
      fetchAccounts(user.id);
    }
  }, [user?.id, fetchAccounts]);

  return (
    <div className="space-y-4 ">
      <h1 className="text-2xl font-bold mb-4">Accounts</h1>

      <AccountSection />

      <SummarySection />

      <div className="bg-slate-100 rounded-xl p-6 border border-slate-200">
        <h1 className="text-lg font-bold mb-4">Recent Transactions</h1>

        <TransactionCardList transactions={transactions.slice(0, 5)} />
      </div>
    </div>
  );
}
