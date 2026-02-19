import {
  findTikTokAccountByExternalId,
  insertTikTokAccount,
  insertTikTokDailyStat,
} from "@/lib/repositories/tiktok.repository";

/* ------------------------------------------ */
/* EXCHANGE CODE FOR TOKEN */
/* ------------------------------------------ */

async function exchangeCodeForToken(code: string) {
  const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.TIKTOK_REDIRECT_URI!,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("TikTok token error:", data);
    throw new Error("Failed to exchange code");
  }

  return data;
}

/* ------------------------------------------ */
/* FETCH USER INFO */
/* ------------------------------------------ */

async function fetchTikTokUserInfo(accessToken: string) {
  const res = await fetch(
    "https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url,follower_count,following_count,likes_count,video_count",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("TikTok user info error:", data);
    throw new Error("Failed to fetch user info");
  }

  return data.data.user;
}

/* ------------------------------------------ */
/* CONNECT ACCOUNT */
/* ------------------------------------------ */

export async function connectTikTokOAuthAccount(
  userId: string,
  code: string
) {
  const tokenData = await exchangeCodeForToken(code);

  const accessToken = tokenData.access_token;

  const userInfo = await fetchTikTokUserInfo(accessToken);

  const existing = await findTikTokAccountByExternalId(
    userId,
    userInfo.open_id
  );

  if (existing) {
    throw new Error("Account already connected");
  }

  const inserted = await insertTikTokAccount({
    user_id: userId,
    tiktok_user_id: userInfo.open_id,
    username: userInfo.display_name,
    display_name: userInfo.display_name,
    avatar_url: userInfo.avatar_url,
    follower_count: userInfo.follower_count ?? 0,
    following_count: userInfo.following_count ?? 0,
    like_count: userInfo.likes_count ?? 0,
    video_count: userInfo.video_count ?? 0,
    last_synced_at: new Date().toISOString(),
  });

  await insertTikTokDailyStat({
    account_id: inserted.id,
    follower_count: userInfo.follower_count ?? 0,
    following_count: userInfo.following_count ?? 0,
    like_count: userInfo.likes_count ?? 0,
    video_count: userInfo.video_count ?? 0,
  });

  return inserted;
}
