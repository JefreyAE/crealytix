import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { connectTikTokOAuthAccount } from "@/lib/services/tiktok.service";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // TikTok puede redirigir con un error (ej: user denied access)
  if (error) {
    console.error("TikTok OAuth error:", error, searchParams.get("error_description"));
    return NextResponse.redirect(
      new URL(`/dashboard?error=tiktok&reason=${encodeURIComponent(error)}`, req.url)
    );
  }

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
    const account = await connectTikTokOAuthAccount(user.id, code);

    return NextResponse.redirect(
      new URL(`/dashboard/tiktok/${account.id}`, req.url)
    );
  } catch (err: any) {
    console.error("TikTok callback error:", err);
    return NextResponse.redirect(
      new URL(`/dashboard?error=tiktok&reason=${encodeURIComponent(err.message || "unknown")}`, req.url)
    );
  }
}
