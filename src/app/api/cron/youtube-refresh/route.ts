import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { refreshChannelIfNeeded } from "@/lib/services/youtube.service";
import { refreshTikTokAccountData } from "@/lib/services/tiktok.service";

const supabase = await createSupabaseServerClient();

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
