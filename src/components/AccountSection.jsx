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
            <div className="w-[80px] bg-gradient-to-r from-gray-300 to-gray-200 rounded-lg p-6 border border-gray-200 animate-pulse flex flex-col justify-between"></div>

            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="min-w-[360px] flex-shrink-0">
                <CardAccountSkeleton />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex gap-4 overflow-x-auto mb-6">
          <div className="w-[80px] flex-shrink-0 flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition cursor-pointer rounded-lg p-6 border border-slate-200 overflow-hidden">
            <Plus className="h-8 w-8 text-slate-600" />
          </div>

          {accounts.map((account) => (
            <div key={account.id} className="min-w-[360px] flex-shrink-0">
              <CardAccount
                accountType={account.accountType}
                accountNumber={account.accountNumber}
                balance={account.balance}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
