import { resolveChannelId, fetchYouTubeChannel } from "@/lib/youtube";
import {
  findChannelByExternalId,
  insertYouTubeChannel,
  insertDailyStat,
  updateYouTubeChannel,
  deleteYouTubeChannel,
} from "@/lib/repositories/youtube.repository";

const TEN_MINUTES = 10 * 60 * 1000;

/* ------------------------------------------------ */
/* CONNECT YOUTUBE CHANNEL */
/* ------------------------------------------------ */

export async function connectYouTubeChannel(
  userId: string,
  channelUrl: string
) {
  // 🔹 Resolver ID real
  const realChannelId = await resolveChannelId(channelUrl);

  // 🔹 Verificar duplicado
  const existing = await findChannelByExternalId(
    userId,
    realChannelId
  );

  if (existing) {
    throw new Error("Channel already connected");
  }

  // 🔹 Obtener datos reales del canal
  const channelData = await fetchYouTubeChannel(realChannelId);

  // 🔹 Insertar canal
  const insertedChannel = await insertYouTubeChannel({
    user_id: userId,
    channel_id: realChannelId,
    title: channelData.title,
    subscriber_count: channelData.subscriberCount,
    view_count: channelData.viewCount,
    video_count: channelData.videoCount,
    thumbnail_url: channelData.thumbnail, // 🔥 A
    last_synced_at: new Date().toISOString(),
  });

  // 🔹 Insertar snapshot inicial
  await insertDailyStat({
    channel_id: insertedChannel.id,
    subscriber_count: channelData.subscriberCount,
    view_count: channelData.viewCount,
    video_count: channelData.videoCount,
  });

  return insertedChannel;
}

/* ------------------------------------------------ */
/* SMART REFRESH */
/* ------------------------------------------------ */

export async function refreshChannelIfNeeded(channel: any) {
  const now = Date.now();

  const lastSynced = channel.last_synced_at
    ? new Date(channel.last_synced_at).getTime()
    : 0;

  //if (now - lastSynced <= TEN_MINUTES) return false;

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

export async function removeYouTubeChannel(
  userId: string,
  channelId: string
) {
  await deleteYouTubeChannel(userId, channelId);
}

export async function forceRefreshChannel(channel: any) {
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
}
