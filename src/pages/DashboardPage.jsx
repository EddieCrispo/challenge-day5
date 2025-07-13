import AccountSection from "../components/AccountSection";

export default function DashboardPage() {
  return (
    <div className="space-y-2 ">
      <h1 className="text-2xl font-bold mb-4">Accounts</h1>

      <AccountSection />
    </div>
  );
}
