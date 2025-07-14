import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTransactionStore } from "../stores/transactionStore";

const formatDate = (isoDate) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(isoDate).toLocaleDateString(undefined, options);
};

export default function TransactionCardList({ transactions }) {
  const { user } = useAuth();
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

  return (
    <ul className="space-y-3">
      {transactions.map((tx) => {
        const isIncome = tx.receiverUserId === user.id;
        const amountSign = isIncome ? "+" : "-";
        const amountColor = isIncome ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400";
        const title = isIncome
          ? `Incoming Money from ${tx.sourceAccount} to ${tx.receiverAccount}`
          : `Transfer from ${tx.sourceAccount} to ${tx.receiverAccount}`;
        const Icon = isIncome ? ArrowDownCircle : ArrowUpCircle;

        return (
          <li
            key={tx.id}
            className="border rounded-md border-slate-300 dark:border-gray-600 shadow-md dark:shadow-lg min-h-[5rem] flex items-center justify-between p-4 px-6 bg-white dark:bg-gray-800"
          >
            <div className="flex items-center gap-3">
              <Icon className={`h-10 w-10 pb-1 ${amountColor} flex-shrink-0`} />
              <div className="flex flex-col mb-1">
                <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
                {tx.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{tx.description}</p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(tx.createdAt)}{" "}
                  {tx.categoryName ? `· ${tx.categoryName}` : ""}
                </p>

                {tx.description && (
                  <p className="text-sm text-gray-600">{tx.description}</p>
                )}
              </div>
            </div>

            <span className={`font-semibold text-2xl ${amountColor}`}>
              {amountSign}${tx.amount}
            </span>
          </li>
        );
      })}
    </ul>
  );
}