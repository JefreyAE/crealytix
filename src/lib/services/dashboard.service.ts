import {
  getUserYouTubeChannels,
  getChannelStats,
} from "@/lib/repositories/youtube.repository";
import { refreshChannelIfNeeded } from "./youtube.service";
import { formatChartDate } from "@/lib/utils/format";
import { getUserTikTokAccounts, getTikTokAccountStats } from "../repositories/tiktok.repository";
import { refreshTikTokAccountData } from "./tiktok.service";

export async function getDashboardData(userId: string) {
  const channels = await getUserYouTubeChannels(userId);
  const tiktokAccounts = await getUserTikTokAccounts(userId);

  // Refresh YouTube
  for (const channel of channels) {
    await refreshChannelIfNeeded(channel);
  }

  // Refresh TikTok (Simple refresh logic for now, similar to detail page)
  for (const account of tiktokAccounts) {
    // Only refresh if synced > 1 hour ago (or logic inside refreshTikTokAccountData/service)
    // For now, let's keep it simple and try to refresh if needed or just fetch latest
    // Implementation in tiktok.service usually handles logic, but here we might want to be careful not to spam
    // Let's assume we want fresh data on dashboard load
    // await refreshTikTokAccountData(account); // Uncomment to auto-refresh on dashboard load
  }

  const statsByChannel: Record<string, any[]> = {};

  // Process YouTube Stats
  for (const channel of channels) {
    const stats = await getChannelStats(channel.id, 30);

    statsByChannel[channel.id] = stats.map((stat) => ({
      date: formatChartDate(stat.recorded_at),
      subscribers: Number(stat.subscriber_count),
      views: Number(stat.view_count),
    }));
  }

  // Process TikTok Stats
  for (const account of tiktokAccounts) {
    const stats = await getTikTokAccountStats(account.id, 30);

    statsByChannel[account.id] = stats.map((stat) => ({
      date: formatChartDate(stat.recorded_at),
      followers: Number(stat.follower_count),
      likes: Number(stat.like_count),
      videos: Number(stat.video_count),
    }));
  }

  // Normalize structure for frontend
  const combinedChannels = [
    ...channels.map(c => ({ ...c, platform: 'youtube', type: 'channel' })),
    ...tiktokAccounts.map(a => ({
      id: a.id,
      title: a.display_name, // Map display_name to title for generic card
      thumbnail_url: a.avatar_url,
      subscriber_count: a.follower_count, // Map follower_count to subscriber_count generic prop
      view_count: a.like_count + a.video_count, // Just an example, or map specific fields
      // platform specific fields
      platform: 'tiktok',
      username: a.username,
      video_count: a.video_count,
      like_count: a.like_count,
      follower_count: a.follower_count
    }))
  ];

  return {
    channels: combinedChannels,
    statsByChannel,
  };
}
