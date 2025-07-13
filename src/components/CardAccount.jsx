import cx from "classnames";

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

export function CardAccount({ accountType, accountNumber, balance }) {
  const gradientColor =
    cardColorMap.get(accountType) || "from-gray-400 to-gray-500";

  return (
    <div
      className={cx(
        `bg-gradient-to-r ${gradientColor}`,
        "relative h-[12rem] rounded-lg shadow-md p-6 border border-gray-200 flex flex-col justify-between overflow-hidden"
      )}
    >
      {/* Vignette ornaments */}
      <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div>
        <p className="text-sm text-white mb-1">{accountType}</p>
        <h2 className="text-xl font-semibold text-white mb-2">
          {accountNumber}
        </h2>
      </div>

      <div>
        <p className="text-sm text-white mb-1">Balance</p>
        <p className="text-2xl font-semibold text-white">
          $ {Number(balance).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export function CardAccountSkeleton() {
  return (
    <div className="h-[12rem] bg-gradient-to-r from-gray-300 to-gray-200 rounded-lg p-6 border border-gray-200 animate-pulse flex flex-col justify-between">
      <div>
        <div className="h-4 w-24 bg-white/50 rounded mb-2" />
        <div className="h-6 w-40 bg-white/60 rounded mb-4" />
      </div>
      <div>
        <div className="h-4 w-20 bg-white/50 rounded mb-1" />
        <div className="h-6 w-32 bg-white/70 rounded" />
      </div>
    </div>
  );
}
