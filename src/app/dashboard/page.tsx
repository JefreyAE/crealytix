import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/services/dashboard.service";
import { getPlanConfig, canAddAccount } from "@/lib/services/plan.service";

import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";
import DashboardClient from "@/components/DashboardClient";

type Plan = "free" | "pro" | "agency";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan: Plan = profile?.plan ?? "free";

  const { channels, statsByChannel } =
    await getDashboardData(user.id);

  const planConfig = getPlanConfig(plan);
  const isLimitReached = !canAddAccount(
    plan,
    channels.length
  );

  if (!channels || channels.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-8">
      <Header plan={plan} isLimitReached={isLimitReached} />

      <DashboardClient
        channels={channels}
        statsByChannel={statsByChannel}
      />
    </div>
  );
}
