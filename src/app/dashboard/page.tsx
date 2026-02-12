import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fetchYouTubeChannel } from "@/lib/youtube";

import MetricCard from "@/components/MetricCard";
import AccountMetricChart from "@/components/AccountMetricChart";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type Plan = "free" | "pro" | "agency";

type YouTubeChannel = {
  id: string;
  channel_id: string;
  title: string;
  subscriber_count: number;
  view_count: number;
  video_count: number;
  last_synced_at: string | null;
};

/* -------------------------------------------------------------------------- */
/*                                 CONSTANTS                                  */
/* -------------------------------------------------------------------------- */

const TEN_MINUTES = 10 * 60 * 1000;

/* -------------------------------------------------------------------------- */
/*                               HELPER FUNCTIONS                             */
/* -------------------------------------------------------------------------- */

function getAccountLimit(plan: Plan) {
  const limits: Record<Plan, number> = {
    free: 1,
    pro: 5,
    agency: Infinity,
  };

  return limits[plan];
}

function timeAgo(dateString: string | null, now: number) {
  if (!dateString) return "Never";

  const diff = now - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
}

async function refreshChannelIfNeeded(
  supabase: any,
  channel: YouTubeChannel,
  now: number
) {
  const lastSynced = channel.last_synced_at
    ? new Date(channel.last_synced_at).getTime()
    : 0;

  if (now - lastSynced <= TEN_MINUTES) return false;

  try {
    const stats = await fetchYouTubeChannel(channel.channel_id);

    await supabase
      .from("youtube_channels")
      .update({
        subscriber_count: stats.subscriberCount,
        view_count: stats.viewCount,
        video_count: stats.videoCount,
        last_synced_at: new Date().toISOString(),
      })
      .eq("id", channel.id);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { data: existing } = await supabase
      .from("youtube_channel_stats")
      .select("id")
      .eq("channel_id", channel.id)
      .gte("recorded_at", todayStart.toISOString())
      .maybeSingle();

    if (!existing) {
      await supabase.from("youtube_channel_stats").insert({
        channel_id: channel.id,
        subscriber_count: stats.subscriberCount,
        view_count: stats.viewCount,
        video_count: stats.videoCount,
      });
    }

    return true;
  } catch (error) {
    console.error("Refresh failed:", error);
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/*                              DASHBOARD PAGE                                */
/* -------------------------------------------------------------------------- */

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const now = Date.now();

  /* ----------------------------- AUTH USER -------------------------------- */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  /* ------------------------------ USER PLAN -------------------------------- */

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan: Plan = profile?.plan ?? "free";

  /* --------------------------- YOUTUBE CHANNELS ---------------------------- */

  const { data: channels } = await supabase
    .from("youtube_channels")
    .select(
      "id, channel_id, title, subscriber_count, view_count, video_count, last_synced_at"
    )
    .eq("user_id", user.id);

  if (!channels || channels.length === 0) {
    return <EmptyState />;
  }

  let youtubeChannels: YouTubeChannel[] = channels;

  /* -------------------------- SMART REFRESH -------------------------------- */

  let didRefresh = false;

  for (const channel of youtubeChannels) {
    const refreshed = await refreshChannelIfNeeded(
      supabase,
      channel,
      now
    );
    if (refreshed) didRefresh = true;
  }

  if (didRefresh) {
    const { data: updated } = await supabase
      .from("youtube_channels")
      .select(
        "id, channel_id, title, subscriber_count, view_count, video_count, last_synced_at"
      )
      .eq("user_id", user.id);

    youtubeChannels = updated ?? [];
  }

  /* -------------------------- CHANNEL STATS -------------------------------- */

  const { data: stats } = await supabase
    .from("youtube_channel_stats")
    .select("recorded_at, subscriber_count, view_count")
    .eq("channel_id", youtubeChannels[0].id)
    .order("recorded_at", { ascending: true })
    .limit(14);

  const chartData =
    stats?.map((stat) => ({
      date: new Date(stat.recorded_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      subscribers: Number(stat.subscriber_count),
      views: Number(stat.view_count),
    })) ?? [];

  /* --------------------------- PLAN LIMIT LOGIC ---------------------------- */

  const accountLimit = getAccountLimit(plan);
  const isLimitReached = youtubeChannels.length >= accountLimit;

  /* ------------------------------ RENDER ----------------------------------- */

  return (
    <div className="space-y-8">

      <Header plan={plan} isLimitReached={isLimitReached} />

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {youtubeChannels.map((channel) => (
          <MetricCard
            key={channel.id}
            title={channel.title}
            value={channel.subscriber_count.toLocaleString()}
            description={`${channel.view_count.toLocaleString()} views • Updated ${timeAgo(
              channel.last_synced_at,
              now
            )}`}
          />
        ))}
      </div>

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

/* -------------------------------------------------------------------------- */
/*                             AUX COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

function Header({
  plan,
  isLimitReached,
}: {
  plan: Plan;
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

function PlanBadge({ plan }: { plan: Plan }) {
  const styles: Record<Plan, string> = {
    agency: "bg-purple-600 text-white",
    pro: "bg-indigo-600 text-white",
    free: "bg-gray-200 text-gray-800",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${styles[plan]}`}
    >
      {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-xl font-semibold mb-2">
        No accounts connected yet
      </h2>
      <p className="text-gray-500 mb-6">
        Connect your YouTube account to start tracking real metrics.
      </p>
      <a
        href="/dashboard/connect"
        className="rounded-xl bg-black px-5 py-2.5 text-white hover:bg-gray-800 transition"
      >
        + Add Account
      </a>
    </div>
  );
}
