import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { refreshChannelIfNeeded } from "@/lib/services/youtube.service";
import { refreshTikTokAccountData } from "@/lib/services/tiktok.service";

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

  // 🔎 Refrescar canales de YouTube
  const { data: channels } = await supabase
    .from("youtube_channels")
    .select("*");

  if (channels?.length) {
    for (const channel of channels) {
      await refreshChannelIfNeeded(channel);
    }
  }

  // 🔎 Refrescar cuentas de TikTok
  const { data: tiktokAccounts } = await supabase
    .from("tiktok_accounts")
    .select("*");

  for (const account of tiktokAccounts ?? []) {
    try {
      await refreshTikTokAccountData(account);
    } catch (err) {
      console.error("TikTok refresh failed:", err);
    }
  }

  return NextResponse.json({ success: true });
}
