import PlanBadge from "./PlanBadge";
import Link from "next/link";

export default function Header({
  plan,
  isLimitReached,
}: {
  plan: "free" | "pro" | "agency";
  isLimitReached: boolean;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200/60 dark:border-slate-800/60">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
          Overview
        </h2>
        <div className="flex items-center gap-3">
          <PlanBadge plan={plan} />
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
            You are managing <span className="text-indigo-600 dark:text-indigo-400 font-bold">your social reach</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!isLimitReached && (
          <Link
            href="/dashboard/connect"
            className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold transition-all duration-300 hover:scale-[1.05] hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98] text-center"
          >
            + Add New Account
          </Link>
        )}

        <Link
          href="/pricing"
          className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-center"
        >
          View Plans
        </Link>
      </div>
    </div>
  );
}
