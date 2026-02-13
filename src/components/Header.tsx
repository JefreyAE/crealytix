import PlanBadge from "./PlanBadge";

export default function Header({
  plan,
  isLimitReached,
}: {
  plan: "free" | "pro" | "agency";
  isLimitReached: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Manage your connected accounts
        </p>
      </div>

      <div className="flex items-center gap-4">
        <PlanBadge plan={plan} />

        {!isLimitReached && (
          <a
            href="/dashboard/connect"
            className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800 transition"
          >
            + Add Account
          </a>
        )}

        <a
          href="/pricing"
          className="rounded-lg border px-4 py-2 font-medium hover:bg-gray-100 transition"
        >
          Manage Plan
        </a>
      </div>
    </div>
  );
}
