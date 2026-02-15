import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { connectYouTubeChannel } from "@/lib/services/youtube.service";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { channelUrl } = await req.json();

  if (!channelUrl) {
    return NextResponse.json(
      { error: "Channel URL is required" },
      { status: 400 }
    );
  }

  try {
    await connectYouTubeChannel(user.id, channelUrl);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to connect channel" },
      { status: 400 }
    );
  }
}

