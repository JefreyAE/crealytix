import { fetchYouTubeChannel, resolveChannelId } from "@/lib/youtube";
import {
  findChannelByExternalId,
  insertYouTubeChannel,
  insertDailyStat,
  updateYouTubeChannel,
} from "@/lib/repositories/youtube.repository";

const TEN_MINUTES = 10 * 60 * 1000;

/* ------------------------------------------ */
/* CONNECT CHANNEL */
/* ------------------------------------------ */

export async function connectYouTubeChannel(
  userId: string,
  channelUrl: string
) {
  const realChannelId = await resolveChannelId(channelUrl);

  const existing = await findChannelByExternalId(
    userId,
    realChannelId
  );

  if (existing) {
    throw new Error("Channel already connected");
  }

  const channel = await fetchYouTubeChannel(realChannelId);

  const insertedChannel = await insertYouTubeChannel({
    user_id: userId,
    channel_id: realChannelId,
    title: channel.title,
    subscriber_count: channel.subscriberCount,
    view_count: channel.viewCount,
    video_count: channel.videoCount,
    last_synced_at: new Date().toISOString(),
  });

  // Snapshot inicial
  await insertDailyStat({
    channel_id: insertedChannel.id,
    subscriber_count: channel.subscriberCount,
    view_count: channel.viewCount,
    video_count: channel.videoCount,
  });

  return insertedChannel;
}

/* ------------------------------------------ */
/* REFRESH CHANNEL */
/* ------------------------------------------ */

export async function refreshChannelIfNeeded(channel: any) {
  const now = Date.now();

  const lastSynced = channel.last_synced_at
    ? new Date(channel.last_synced_at).getTime()
    : 0;

  if (now - lastSynced <= TEN_MINUTES) return false;

  const stats = await fetchYouTubeChannel(channel.channel_id);

  await updateYouTubeChannel(channel.id, {
    subscriber_count: stats.subscriberCount,
    view_count: stats.viewCount,
    video_count: stats.videoCount,
    last_synced_at: new Date().toISOString(),
  });

  await insertDailyStat({
    channel_id: channel.id,
    subscriber_count: stats.subscriberCount,
    view_count: stats.viewCount,
    video_count: stats.videoCount,
  });

  return true;
}
