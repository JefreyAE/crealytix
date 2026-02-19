import {
  getUserYouTubeChannels,
  getChannelStats,
} from "@/lib/repositories/youtube.repository";
import { refreshChannelIfNeeded } from "./youtube.service";
import { formatChartDate } from "@/lib/utils/format";
import { getUserTikTokAccounts } from "../repositories/tiktok.repository";

export async function getDashboardData(userId: string) {
  const channels = await getUserYouTubeChannels(userId);
  const tiktokAccounts = await getUserTikTokAccounts(userId);

  for (const channel of channels) {
    await refreshChannelIfNeeded(channel);
  }

  const statsByChannel: Record<string, any[]> = {};

  for (const channel of channels) {
    const stats = await getChannelStats(channel.id, 30);

    statsByChannel[channel.id] = stats.map((stat) => ({
      date: formatChartDate(stat.recorded_at),
      subscribers: Number(stat.subscriber_count),
      views: Number(stat.view_count),
    }));
  }

  return {
    channels,
    statsByChannel,
  };
}
