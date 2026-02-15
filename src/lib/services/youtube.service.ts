import { fetchYouTubeChannel } from "@/lib/youtube";
import {
  updateYouTubeChannel,
  insertDailyStat,
} from "@/lib/repositories/youtube.repository";

const TEN_MINUTES = 10 * 60 * 1000;

export async function refreshChannelIfNeeded(channel: any) {
  const now = Date.now();

  const lastSynced = channel.last_synced_at
    ? new Date(channel.last_synced_at).getTime()
    : 0;

  if (now - lastSynced <= TEN_MINUTES) {
    return null;
  }

  const stats = await fetchYouTubeChannel(channel.channel_id);

  const updatedChannel = await updateYouTubeChannel(channel.id, {
    subscriber_count: Number(stats.subscriberCount),
    view_count: Number(stats.viewCount),
    video_count: Number(stats.videoCount),
    last_synced_at: new Date().toISOString(),
  });

  await insertDailyStat({
    channel_id: channel.id,
    subscriber_count: Number(stats.subscriberCount),
    view_count: Number(stats.viewCount),
    video_count: Number(stats.videoCount),
  });

  return updatedChannel;
}
