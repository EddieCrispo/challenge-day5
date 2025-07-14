import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const formatDate = (isoDate) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(isoDate).toLocaleString(undefined, options);
};

export default function TransactionCard({ transaction, showCategory = true }) {
  const { user } = useAuth();

  const isIncome = transaction.receiverUserId === user.id;
  const amountSign = isIncome ? "+" : "-";
  const amountColor = isIncome ? "text-green-500" : "text-red-500";
  const title = isIncome
    ? `Incoming Money from ${transaction.sourceAccount} to ${transaction.receiverAccount}`
    : `Transfer from ${transaction.sourceAccount} to ${transaction.receiverAccount}`;
  const Icon = isIncome ? ArrowDownCircle : ArrowUpCircle;

  return (
    <li
      key={transaction.id}
      className="border rounded-md border-slate-300 shadow-md min-h-[5rem] flex items-center justify-between p-4 px-6 bg-white dark:bg-gray-700 dark:border-gray-600"
    >
      <div className="flex items-center gap-3">
        <Icon className={`h-10 w-10 pb-1 ${amountColor} flex-shrink-0`} />
        <div className="flex flex-col mb-1">
          <span className="font-semibold dark:text-white">{title}</span>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatDate(transaction.createdAt)}{" "}
            {transaction.categoryName && showCategory
              ? `· ${transaction.categoryName}`
              : showCategory
              ? "Other"
              : ""}
          </p>

          {transaction.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {transaction.description}
            </p>
          )}
        </div>
      </div>

      <span className={`font-semibold text-2xl ${amountColor}`}>
        {amountSign}${transaction.amount}
      </span>
    </li>
  );
}
