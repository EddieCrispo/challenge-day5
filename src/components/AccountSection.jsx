import { useEffect, useState } from "react";
import { useAccountStore } from "../stores/accountStore";
import { CardAccount, CardAccountSkeleton } from "./CardAccount";
import { useAuth } from "../contexts/AuthContext";
import { Plus, Trash2 } from "lucide-react";

const cardColorMap = new Map([
  ["Home Loan Account", "from-teal-400 to-teal-500"],
  ["Savings Account", "from-blue-400 to-sky-500"],
  ["Deposit Account", "from-yellow-400 to-amber-500"],
  ["Checking Account", "from-violet-400 to-violet-500"],
  ["Credit Card Account", "from-rose-400 to-rose-500"],
  ["Investment Account", "from-amber-400 to-amber-500"],
  ["Personal Loan Account", "from-fuchsia-400 to-fuchsia-500"],
  ["Money Market Account", "from-emerald-400 to-emerald-500"],
  ["Auto Loan Account", "from-lime-400 to-lime-500"],
]);

export default function AccountSection() {
  const { user } = useAuth();
  const { accounts, loading, error, fetchAccounts, addAccount, deleteAccount } = useAccountStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [agreed, setAgreed] = useState(false);


  useEffect(() => {
    if (user?.id) {
      fetchAccounts(user.id);
    }
  }, [user]);

  const handleAddAccount = () => {
    setShowModal(true);
  }

  const handleSubmit = () => {
    if (!selectedType || !user?.id) return;

    const newAccount = {
      userId: user.id,
      accountType: selectedType,
      accountNumber: Math.floor(10000000 + Math.random() * 90000000).toString(),
      balance: 0,
      createdAt: new Date().toISOString(),
    };

    addAccount(newAccount);
    setShowModal(false);
    setSelectedType("");
    setAgreed(false);
  };

  const handleDeleteAccount = (id) => {
    console.log('ID Delete');
    console.log(id);
    console.log('USER ID');
    console.log(user?.id);


    if (confirm("Are you sure you want to delete this account?")) {
      deleteAccount(user?.id, id);
    }
  };

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
          <div className="w-[80px] flex-shrink-0 flex items-center justify-center bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 transition cursor-pointer rounded-lg p-6 border border-slate-200 dark:border-gray-600 overflow-hidden" onClick={handleAddAccount}>
            <Plus className="h-8 w-8 text-slate-600 dark:text-gray-300" />
          </div>

          {accounts.map((account) => (
            <div key={account.id} className="min-w-[360px] flex-shrink-0 relative">
              <CardAccount
                accountType={account.accountType}
                accountNumber={account.accountNumber}
                balance={account.balance}
              />
              <button
                onClick={() => handleDeleteAccount(account.id)}
                className="absolute top-2 right-2 bg-white text-red-500 hover:text-red-600 rounded-full p-1 shadow"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        //fixed inset-0 bg-white/30 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Account</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Account Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Select account type</option>
                {[...cardColorMap.keys()].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500">Name: <span className="font-medium">{user.name}</span></p>
              <p className="text-sm text-gray-500">Address: <span className="font-medium">{user.address}</span></p>
              <p className="text-sm text-gray-500">Phone: <span className="font-medium">{user.phoneNumber}</span></p>
            </div>

            <div className="mt-4 flex items-start gap-2">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="agree" className="text-sm text-gray-700">
                I agree with the <a href="#" className="text-blue-600 underline">rules & policies</a>.
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
              >Cancel</button>
              <button
                disabled={!agreed || !selectedType}
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >Submit</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}