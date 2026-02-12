import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fetchYouTubeChannel } from "@/lib/youtube";

import MetricCard from "@/components/MetricCard";
import YoutubeSubscribersChart from "@/components/YoutubeSubscribersChart";

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

type ChannelStat = {
  recorded_at: string;
  subscriber_count: number;
  view_count: number;
};

/* -------------------------------------------------------------------------- */
/*                                 CONSTANTS                                  */
/* -------------------------------------------------------------------------- */

const TEN_MINUTES = 10 * 60 * 1000;

/* -------------------------------------------------------------------------- */
/*                               HELPER FUNCTIONS                             */
/* -------------------------------------------------------------------------- */

function getAccountLimit(plan: Plan) {
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
}

function timeAgo(dateString: string | null, now: number) {
  if (!dateString) return "Never";

  const diff = now - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "1 hour ago";

  return `${hours} hours ago`;
}

async function refreshChannelIfNeeded(
  supabase: any,
  channel: YouTubeChannel
) {
  const lastSynced = channel.last_synced_at
    ? new Date(channel.last_synced_at).getTime()
    : 0;

  const shouldRefresh = Date.now() - lastSynced > TEN_MINUTES;
  if (!shouldRefresh) return;

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
  } catch (error) {
    console.error("Failed to refresh channel:", error);
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

  /* ---------------------------- INSTAGRAM ---------------------------------- */

  const { data: metrics } = await supabase
    .from("metrics")
    .select("*")
    .eq("user_id", user.id);

  const instagram = metrics?.find((m) => m.platform === "instagram");

  /* --------------------------- YOUTUBE CHANNELS ---------------------------- */

  const { data: initialChannels } = await supabase
    .from("youtube_channels")
    .select("*")
    .eq("user_id", user.id);

  let youtubeChannels: YouTubeChannel[] = initialChannels ?? [];

  /* -------------------------- SMART REFRESH -------------------------------- */

  for (const channel of youtubeChannels) {
    await refreshChannelIfNeeded(supabase, channel);
  }

  const { data: refreshed } = await supabase
    .from("youtube_channels")
    .select("*")
    .eq("user_id", user.id);

  youtubeChannels = refreshed ?? [];

  /* -------------------------- CHANNEL STATS -------------------------------- */

  let channelStats: ChannelStat[] = [];

  if (youtubeChannels.length > 0) {
    const { data: stats } = await supabase
      .from("youtube_channel_stats")
      .select("*")
      .eq("channel_id", youtubeChannels[0].id)
      .order("recorded_at", { ascending: true })
      .limit(14);

    channelStats = stats ?? [];
  }

  const chartData = channelStats.map((stat) => ({
    date: new Date(stat.recorded_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    subscribers: Number(stat.subscriber_count),
    views: Number(stat.view_count),
  }));

  /* --------------------------- PLAN LIMIT LOGIC ---------------------------- */

  const accountLimit = getAccountLimit(plan);
  const isLimitReached = youtubeChannels.length >= accountLimit;

  /* -------------------------------------------------------------------------- */
  /*                                EMPTY STATE                                */
  /* -------------------------------------------------------------------------- */

  if (youtubeChannels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold mb-2">
          No accounts connected yet
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
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

  /* -------------------------------------------------------------------------- */
  /*                               MAIN DASHBOARD                              */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your connected accounts
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              plan === "agency"
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
            className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
          >
            Manage Plan
          </a>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {instagram && (
          <MetricCard
            title="Instagram Followers"
            value={instagram.followers?.toLocaleString() ?? "0"}
            description={`+${instagram.growth ?? 0} this week`}
          />
        )}

        {youtubeChannels.map((channel) => (
          <MetricCard
            key={channel.id}
            title={channel.title}
            value={Number(channel.subscriber_count).toLocaleString()}
            description={`${Number(
              channel.view_count
            ).toLocaleString()} views • Updated ${timeAgo(
              channel.last_synced_at,
              now
            )}`}
          />
        ))}
      </div>

      {/* CHART */}
      {chartData.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">
            Subscriber Growth (Last 14 Days)
          </h2>
          <YoutubeSubscribersChart data={chartData} />
        </div>
      )}
    </div>
  );
}
