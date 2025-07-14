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
          <div className="flex gap-4 overflow-x-auto mb-6">
            <div className="w-[80px] bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 animate-pulse flex flex-col justify-between"></div>

            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="min-w-[360px] flex-shrink-0">
                <CardAccountSkeleton />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex gap-4 overflow-x-auto mb-6">
          <div className="w-[80px] flex-shrink-0 flex items-center justify-center bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 transition cursor-pointer rounded-lg p-6 border border-slate-200 dark:border-gray-600 overflow-hidden">
            <Plus className="h-8 w-8 text-slate-600 dark:text-gray-300" />
          </div>

          {accounts.map((account) => (
            <div key={account.id} className="min-w-[360px] flex-shrink-0">
              <CardAccount account={account} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}