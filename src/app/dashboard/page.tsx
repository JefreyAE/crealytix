import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/services/dashboard.service";
import { getPlanConfig, canAddAccount } from "@/lib/services/plan.service";

import MetricCard from "@/components/MetricCard";
import AccountMetricChart from "@/components/AccountMetricChart";
import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";

import { formatNumber, formatTimeAgo } from "@/lib/utils/format";

type Plan = "free" | "pro" | "agency";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  /* -------------------------------- AUTH -------------------------------- */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  /* -------------------------------- PLAN -------------------------------- */

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan: Plan = profile?.plan ?? "free";

  /* ------------------------- DASHBOARD SERVICE -------------------------- */

  const { channels, chartData } = await getDashboardData(user.id);

  /* --------------------------- PLAN LOGIC -------------------------------- */

  const planConfig = getPlanConfig(plan);

  const isLimitReached = !canAddAccount(
    plan,
    channels.length
  );

  /* --------------------------- EMPTY STATE ------------------------------- */

  if (!channels || channels.length === 0) {
    return <EmptyState />;
  }

  const now = Date.now();

  /* ------------------------------ RENDER -------------------------------- */

  return (
    <div className="space-y-8">

      <Header
        plan={plan}
        isLimitReached={isLimitReached}
      />

      {/* METRICS GRID */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {channels.map((channel) => (
          <MetricCard
            key={channel.id}
            title={channel.title}
            value={formatNumber(channel.subscriber_count)}
            description={`${formatNumber(
              channel.view_count
            )} views • Updated ${formatTimeAgo(
              channel.last_synced_at,
              now
            )}`}
          />
        ))}
      </div>

      {/* CHART SECTION */}
      {chartData.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">
            Subscriber Growth (Last 14 Days)
          </h2>

          <AccountMetricChart data={chartData} />
        </div>
      )}
    </div>
  );
}
