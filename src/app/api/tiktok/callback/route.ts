import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { connectTikTokOAuthAccount } from "@/lib/services/tiktok.service";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await connectTikTokOAuthAccount(user.id, code);

    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (error: any) {
    console.error("TikTok OAuth Error:", error);
    return NextResponse.json(
      { error: error.message || "TikTok failed" },
      { status: 500 }
    );
  }

}
