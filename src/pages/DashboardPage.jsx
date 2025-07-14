import { useContext, useEffect } from "react";
import AccountSection from "../components/AccountSection";
import SummarySection from "../components/SummarySection";
import { useAuth } from "../contexts/AuthContext";
import { TransactionContext } from "../contexts/TransactionContext";
import { useAccountStore } from "../stores/accountStore";
import TransactionCardList from "../components/TransactionCardList";
import { useTransactionStore } from "../stores/transactionStore";
import { useSelectedAccountStore } from "../stores/selectedAccountStore";

export default function DashboardPage() {
  const { user } = useAuth();
  const { transactions } = useTransactionStore();
  const { accounts, fetchAccounts } = useAccountStore();
  const { selectedAccount, setSelectedAccount } = useSelectedAccountStore();

  useEffect(() => {
    if (user?.id) {
      fetchAccounts(user.id);
    }
  }, [user?.id, fetchAccounts]);

  useEffect(() => {
    if (accounts?.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0]);
    }
  }, [accounts]);

  return (
    <div className={`
      space-y-4 
      /* 📱 Mobile (0-767px) */
      px-4 py-4 
      /* 📊 Tablet (768-1023px) */
      md:px-6 md:py-6 
      /* 💻 Desktop (1024px+) */
      lg:px-8 lg:py-8 
      /* 🖥️ Large Desktop (1280px+) */
      xl:px-12 xl:py-12
    `}>
      
      {/* Dashboard Title */}
      <h1 className={`
        font-bold mb-4 text-gray-900 dark:text-white
        /* 📱 Mobile (0-767px) */
        text-xl 
        /* 📊 Tablet (768-1023px) */
        md:text-2xl 
        /* 💻 Desktop (1024px+) */
        lg:text-3xl
      `}>
        Accounts
      </h1>

      {/* Account Section */}
      <div className={`
        /* 📱 Mobile (0-767px) */
        mb-4 
        /* 📊 Tablet (768-1023px) */
        md:mb-6 
        /* 💻 Desktop (1024px+) */
        lg:mb-8
      `}>
        <AccountSection />
      </div>

      {/* Summary Section */}
      <div className={`
        /* 📱 Mobile (0-767px) */
        mb-4 
        /* 📊 Tablet (768-1023px) */
        md:mb-6 
        /* 💻 Desktop (1024px+) */
        lg:mb-8
      `}>
        <SummarySection />
      </div>

      {/* Recent Transactions Section */}
      <div className={`
        bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700
        /* 📱 Mobile (0-767px) */
        p-4 
        /* 📊 Tablet (768-1023px) */
        md:p-6 
        /* 💻 Desktop (1024px+) */
        lg:p-8
      `}>
        <h1 className={`
          font-bold mb-4 text-gray-900 dark:text-white
          /* 📱 Mobile (0-767px) */
          text-base 
          /* 📊 Tablet (768-1023px) */
          md:text-lg 
          /* 💻 Desktop (1024px+) */
          lg:text-xl
        `}>
          Recent Transactions
        </h1>

        <div className={`
          /* 📱📊 Mobile & Tablet (0-1023px) - Stack vertically */
          space-y-3 
          /* 💻 Desktop (1024px+) - Better spacing */
          lg:space-y-4
        `}>
          <TransactionCardList 
            transactions={transactions.slice(0, 5)} 
            className={`
              /* 📱 Mobile (0-767px) */
              grid grid-cols-1 gap-3 
              /* 📊 Tablet (768-1023px) */
              md:grid-cols-1 md:gap-4 
              /* 💻 Desktop (1024px+) */
              lg:grid-cols-1 lg:gap-6
            `}
          />
        </div>
      </div>
    </div>
  );
}