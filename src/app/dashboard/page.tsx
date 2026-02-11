import { createSupabaseServerClient } from "@/lib/supabase/server";
import MetricCard from "@/components/MetricCard";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  // 🔐 Obtener usuario autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // 📦 Obtener plan del usuario
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan = profile?.plan || "free";

  // 📊 Obtener métricas del usuario
  const { data: metrics, error } = await supabase
    .from("metrics")
    .select("*")
    .eq("user_id", user.id);

  if (error) console.error(error);

  // 🧠 Lógica de límites por plan
  const getAccountLimit = (plan: string) => {
    switch (plan) {
      case "free":
        return 1;
      case "pro":
        return 5;
      case "agency":
        return Infinity;
      default:
        return 1;
    }
  };

  const accountLimit = getAccountLimit(plan);
  const isLimitReached = metrics && metrics.length >= accountLimit;

  const instagram = metrics?.find((m) => m.platform === "instagram");
  const youtube = metrics?.find((m) => m.platform === "youtube");

  // -----------------------------
  // EMPTY STATE
  // -----------------------------
  if (!metrics || metrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold mb-2">
          No accounts connected yet
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Connect your Instagram or YouTube account to start tracking metrics.
        </p>

        {plan === "free" ? (
          <a
            href="/dashboard/connect"
            className="rounded-xl bg-black px-5 py-2.5 text-white transition hover:bg-gray-800"
          >
            + Add Account
          </a>
        ) : (
          <a
            href="/dashboard/connect"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white transition hover:bg-indigo-700"
          >
            + Add Account
          </a>
        )}
      </div>
    );
  }

  // -----------------------------
  // MAIN DASHBOARD
  // -----------------------------
  return (
    <div className="space-y-8">
      {/* HEADER */}
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your connected accounts
          </p>
        </div>

        <div className="flex items-center gap-4">

          {/* PLAN BADGE */}
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${plan === "agency"
                ? "bg-purple-600 text-white"
                : plan === "pro"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-gray-300"
              }`}
          >
            {plan === "agency"
              ? "Agency Plan"
              : plan === "pro"
                ? "Pro Plan"
                : "Free Plan"}
          </span>

          {/* ADD ACCOUNT */}
          {!isLimitReached && (
            <a
              href="/dashboard/connect"
              className="rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800"
            >
              + Add Account
            </a>
          )}

          {/* MANAGE PLAN (SIEMPRE VISIBLE) */}
          <a
            href="/pricing"
            className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
          >
            Manage Plan
          </a>
        </div>
      </div>
      {/* GRID */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Instagram Followers"
          value={instagram?.followers?.toLocaleString() || "0"}
          description={`+${instagram?.growth || 0} this week`}
        />

        <MetricCard
          title="YouTube Subscribers"
          value={youtube?.followers?.toLocaleString() || "0"}
          description={`+${youtube?.growth || 0} this week`}
        />
      </div>

      {/* PRO LOCK SECTION */}
      {plan === "free" && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-white shadow-lg">
          <div className="relative z-10">
            <h3 className="text-xl font-semibold mb-2">
              Unlock Advanced Analytics
            </h3>

            <p className="text-indigo-100 mb-6">
              Get growth insights, AI recommendations and manage multiple
              accounts.
            </p>

            <a
              href="/pricing"
              className="inline-block rounded-xl bg-white px-6 py-2.5 text-indigo-700 font-medium transition hover:scale-105"
            >
              Upgrade to Pro
            </a>
          </div>

          {/* Decorative blur */}
          <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
        </div>
      )}
    </div>
  );
}
