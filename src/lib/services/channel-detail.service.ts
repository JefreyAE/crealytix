import { createSupabaseServerClient } from "@/lib/supabase/server";
import { refreshChannelIfNeeded } from "./youtube.service";
import { getChannelStats } from "@/lib/repositories/youtube.repository";

export async function getChannelDetailData(
  userId: string,
  channelId: string
) {
  const supabase = await createSupabaseServerClient();

  // 🔹 Obtener canal (seguro por usuario)
  const { data: channel, error } = await supabase
    .from("youtube_channels")
    .select("*")
    .eq("id", channelId)
    .eq("user_id", userId)
    .single();

  if (error || !channel) {
    throw new Error("Channel not found");
  }

  // 🔥 Refresh inteligente
  await refreshChannelIfNeeded(channel);

  // 🔁 Re-fetch actualizado
  const { data: updatedChannel } = await supabase
    .from("youtube_channels")
    .select("*")
    .eq("id", channelId)
    .eq("user_id", userId)
    .single();

  const finalChannel = updatedChannel ?? channel;

  // 📊 Histórico
  const stats = await getChannelStats(channelId, 30);

  const chartData =
    stats?.map((stat) => ({
      date: new Date(stat.recorded_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      subscribers: Number(stat.subscriber_count),
      views: Number(stat.view_count),
    })) ?? [];

  return {
    channel: finalChannel,
    chartData,
  };
}
