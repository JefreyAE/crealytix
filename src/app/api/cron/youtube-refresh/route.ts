import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { refreshChannelIfNeeded } from "@/lib/services/youtube.service";

export async function GET(req: Request) {
  const isLocal = process.env.NODE_ENV === "development";
  // 🔐 Seguridad básica
  if (!isLocal) {
    const authHeader = req.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  const supabase = await createSupabaseServerClient();

  // 🔎 Traer todos los canales
  const { data: channels } = await supabase
    .from("youtube_channels")
    .select("*");

  if (!channels?.length) {
    return NextResponse.json({ success: true });
  }

  for (const channel of channels) {
    await refreshChannelIfNeeded(channel);
  }

  return NextResponse.json({ success: true });
}
