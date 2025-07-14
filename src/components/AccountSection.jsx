import { useEffect } from "react";
import { useAccountStore } from "../stores/accountStore";
import { CardAccount, CardAccountSkeleton } from "./CardAccount";
import { useAuth } from "../contexts/AuthContext";
import { Plus } from "lucide-react";

export default function AccountSection() {
  const { user } = useAuth();
  const { accounts, loading, error, fetchAccounts } = useAccountStore();

  useEffect(() => {
    if (user?.id) {
      fetchAccounts(user.id);
    }
  }, [user]);

  return (
    <>
      {loading ? (
        <>
          <div className={`
            flex gap-4 overflow-x-auto mb-6 
            /* 📱 Mobile (0-767px) */
            pb-2 
            /* 📊 Tablet (768-1023px) */
            md:pb-3 
            /* 💻 Desktop (1024px+) */
            lg:pb-4
          `}>
            {/* Add Button Skeleton */}
            <div className={`
              bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 animate-pulse flex flex-col justify-between flex-shrink-0
              /* 📱 Mobile (0-767px) */
              w-[60px] h-[60px] p-3
              /* 📊 Tablet (768-1023px) */
              md:w-[70px] md:h-[70px] md:p-4
              /* 💻 Desktop (1024px+) */
              lg:w-[80px] lg:h-[80px] lg:p-6
            `}></div>

            {/* Account Cards Skeleton */}
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className={`
                flex-shrink-0
                /* 📱📊 Mobile & Tablet (0-1023px) */
                min-w-[280px] max-w-[280px]
                /* 💻 Desktop (1024px+) */
                lg:min-w-[360px] lg:max-w-[360px]
              `}>
                <CardAccountSkeleton />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={`
          flex gap-4 overflow-x-auto mb-6
          /* 📱 Mobile (0-767px) */
          pb-2 
          /* 📊 Tablet (768-1023px) */
          md:pb-3 
          /* 💻 Desktop (1024px+) */
          lg:pb-4
        `}>
          
          {/* Add New Account Button */}
          <div className={`
            flex-shrink-0 flex items-center justify-center bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 transition cursor-pointer rounded-lg border border-slate-200 dark:border-gray-600 overflow-hidden
            /* 📱 Mobile (0-767px) */
            w-[60px] h-[60px] p-3
            /* 📊 Tablet (768-1023px) */
            md:w-[70px] md:h-[70px] md:p-4
            /* 💻 Desktop (1024px+) */
            lg:w-[80px] lg:h-[80px] lg:p-6
          `}>
            <Plus className={`
              text-slate-600 dark:text-gray-300
              /* 📱 Mobile (0-767px) */
              h-6 w-6
              /* 📊 Tablet (768-1023px) */
              md:h-7 md:w-7
              /* 💻 Desktop (1024px+) */
              lg:h-8 lg:w-8
            `} />
          </div>

          {/* Account Cards */}
          {accounts.map((account) => (
            <div key={account.id} className={`
              flex-shrink-0
              /* 📱📊 Mobile & Tablet (0-1023px) */
              min-w-[280px] max-w-[280px]
              /* 💻 Desktop (1024px+) */
              lg:min-w-[360px] lg:max-w-[360px]
            `}>
              <CardAccount account={account} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}