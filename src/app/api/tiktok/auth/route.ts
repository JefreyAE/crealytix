import { NextResponse } from "next/server";

export async function GET() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY!;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI!;

  const scope = "user.info.basic,user.info.stats";

  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&response_type=code&scope=${scope}&redirect_uri=${redirectUri}`;

  return NextResponse.redirect(authUrl);
}
