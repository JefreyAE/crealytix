import { createSupabaseServerClient } from "@/lib/supabase/server";

/* ------------------------------------------ */
/* GET USER CHANNELS */
/* ------------------------------------------ */

export async function getUserYouTubeChannels(userId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("youtube_channels")
    .select(
      "id, channel_id, title, subscriber_count, view_count, video_count, last_synced_at"
    )
    .eq("user_id", userId);

  if (error) throw error;

  return data ?? [];
}

/* ------------------------------------------ */
/* GET CHANNEL STATS */
/* ------------------------------------------ */

export async function getChannelStats(
  channelId: string,
  limit = 14
) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("youtube_channel_stats")
    .select("recorded_at, subscriber_count, view_count")
    .eq("channel_id", channelId)
    .order("recorded_at", { ascending: true })
    .limit(limit);

  if (error) throw error;

  return data ?? [];
}

/* ------------------------------------------ */
/* FIND BY EXTERNAL ID */
/* ------------------------------------------ */

export async function findChannelByExternalId(
  userId: string,
  channelId: string
) {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("youtube_channels")
    .select("id")
    .eq("user_id", userId)
    .eq("channel_id", channelId)
    .maybeSingle();

  return data;
}

/* ------------------------------------------ */
/* INSERT CHANNEL */
/* ------------------------------------------ */

export async function insertYouTubeChannel(payload: any) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("youtube_channels")
    .insert(payload)
    .select()
    .single();

  if (error || !data) {
    throw error;
  }

  return data;
}

/* ------------------------------------------ */
/* UPDATE CHANNEL */
/* ------------------------------------------ */

export async function updateYouTubeChannel(
  channelId: string,
  payload: any
) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("youtube_channels")
    .update(payload)
    .eq("id", channelId)
    .select()
    .single();

  if (error) throw error;

  return data;
}


/* ------------------------------------------ */
/* INSERT DAILY STAT */
/* ------------------------------------------ */

export async function insertDailyStat(payload: any) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("youtube_channel_stats")
    .insert(payload);

  if (error) throw error;
}
