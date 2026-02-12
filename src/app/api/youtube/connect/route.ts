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

  try {
    // 🔥 AQUÍ VA LO QUE PREGUNTASTE
    const realChannelId = await resolveChannelId(channelUrl);
    const channel = await fetchYouTubeChannel(realChannelId);

    // 🔐 Evitar duplicados
    const { data: existing } = await supabase
      .from("accounts")
      .select("id")
      .eq("external_id", realChannelId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Channel already connected" },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to connect channel" },
      { status: 500 }
    );
  }
}

