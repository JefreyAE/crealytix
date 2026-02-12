import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fetchYouTubeChannel, resolveChannelId } from "@/lib/youtube";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { channelUrl } = await req.json();

  if (!channelUrl) {
    return NextResponse.json(
      { error: "Channel URL is required" },
      { status: 400 }
    );
  }

  try {
    const realChannelId = await resolveChannelId(channelUrl);

    // 🔐 Evitar duplicados
    const { data: existing } = await supabase
      .from("youtube_channels")
      .select("id")
      .eq("channel_id", realChannelId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Channel already connected" },
        { status: 400 }
      );
    }

    // 📡 Obtener datos reales
    const channel = await fetchYouTubeChannel(realChannelId);

    // 📝 Insertar canal
    const { data: insertedChannel, error: insertError } = await supabase
      .from("youtube_channels")
      .insert({
        user_id: user.id,
        channel_id: realChannelId,
        title: channel.title,
        subscriber_count: channel.subscriberCount,
        view_count: channel.viewCount,
        video_count: channel.videoCount,
        last_synced_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError || !insertedChannel) {
      throw insertError;
    }

    // 📊 Snapshot histórico inicial
    await supabase.from("youtube_channel_stats").insert({
      channel_id: insertedChannel.id,
      subscriber_count: channel.subscriberCount,
      view_count: channel.viewCount,
      video_count: channel.videoCount,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to connect channel" },
      { status: 500 }
    );
  }
}

