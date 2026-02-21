import {
  findTikTokAccountByExternalId,
  insertTikTokAccount,
  insertTikTokDailyStat,
} from "@/lib/repositories/tiktok.repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

  if (!res.ok || data.error) {
    console.error("TikTok user info error:", JSON.stringify(data, null, 2));
    throw new Error(`Failed to fetch user info: ${data.error?.message || "Unknown error"}`);
  }

  if (!data.data || !data.data.user) {
    console.error("TikTok user info unexpected format:", JSON.stringify(data, null, 2));
    throw new Error("Failed to fetch user info: Unexpected response format");
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

  const expiresAt = new Date(
    Date.now() + tokenData.expires_in * 1000
  ).toISOString();

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
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    token_expires_at: expiresAt,
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

async function refreshTikTokToken(refreshToken: string) {
  const res = await fetch(
    "https://open.tiktokapis.com/v2/oauth/token/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY!,
        client_secret: process.env.TIKTOK_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok || data.error || !data.expires_in) {
    console.error("TikTok refresh error:", JSON.stringify(data, null, 2));
    throw new Error(`Failed to refresh token: ${data.error_description || data.message || "Unknown error"}`);
  }

  return data;
}


export async function ensureValidTikTokToken(account: any, forceRefresh = false) {
  if (!account.token_expires_at && !forceRefresh) {
    return account.access_token;
  }

  const isExpired =
    new Date(account.token_expires_at).getTime() <= Date.now();

  if (!isExpired && !forceRefresh) {
    return account.access_token;
  }

  console.log("Refreshing TikTok token for account:", account.id, forceRefresh ? "(FORCED)" : "(EXPIRED)");

  const newTokenData = await refreshTikTokToken(
    account.refresh_token
  );

  const newExpiresAt = new Date(
    Date.now() + newTokenData.expires_in * 1000
  ).toISOString();

  const supabase = await createSupabaseServerClient();

  await supabase
    .from("tiktok_accounts")
    .update({
      access_token: newTokenData.access_token,
      refresh_token: newTokenData.refresh_token,
      token_expires_at: newExpiresAt,
    })
    .eq("id", account.id);

  return newTokenData.access_token;
}

export async function refreshTikTokAccountData(account: any) {
  let validToken = await ensureValidTikTokToken(account);

  let userInfo;
  try {
    userInfo = await fetchTikTokUserInfo(validToken);
  } catch (error) {
    console.error("Failed to fetch TikTok user info, trying to refresh token...", error);
    validToken = await ensureValidTikTokToken(account, true);
    userInfo = await fetchTikTokUserInfo(validToken);
  }

  const supabase = await createSupabaseServerClient();

  await supabase
    .from("tiktok_accounts")
    .update({
      follower_count: userInfo.follower_count ?? 0,
      following_count: userInfo.following_count ?? 0,
      like_count: userInfo.likes_count ?? 0,
      video_count: userInfo.video_count ?? 0,
      last_synced_at: new Date().toISOString(),
    })
    .eq("id", account.id);

  await insertTikTokDailyStat({
    account_id: account.id,
    follower_count: userInfo.follower_count ?? 0,
    following_count: userInfo.following_count ?? 0,
    like_count: userInfo.likes_count ?? 0,
    video_count: userInfo.video_count ?? 0,
  });
}
