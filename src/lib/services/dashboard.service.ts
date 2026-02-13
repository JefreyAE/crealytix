import {
  getUserYouTubeChannels,
  getChannelStats,
} from "@/lib/repositories/youtube.repository";
import { refreshChannelIfNeeded } from "./youtube.service";
import { formatChartDate } from "@/lib/utils/format";

export async function getDashboardData(userId: string) {
  const channels = await getUserYouTubeChannels(userId);

  if (channels.length === 0) {
    return {
      channels: [],
      chartData: [],
    };
  }

  for (const channel of channels) {
    await refreshChannelIfNeeded(channel);
  }

  const stats = await getChannelStats(channels[0].id, 14);

  const chartData = stats.map((stat) => ({
    date: formatChartDate(stat.recorded_at),
    subscribers: Number(stat.subscriber_count),
    views: Number(stat.view_count),
  }));

  return {
    channels,
    chartData,
  };
}
