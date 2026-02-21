import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function findTikTokAccountByExternalId(
  userId: string,
  tiktokUserId: string
) {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("tiktok_accounts")
    .select("id")
    .eq("user_id", userId)
    .eq("tiktok_user_id", tiktokUserId)
    .maybeSingle();

  return data;
}

export async function insertTikTokAccount(payload: any) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("tiktok_accounts")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function insertTikTokDailyStat(payload: any) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("tiktok_account_stats")
    .insert(payload);

  if (error) throw error;
}

export async function getUserTikTokAccounts(userId: string) {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("tiktok_accounts")
    .select("*")
    .eq("user_id", userId);

  return data ?? [];
}

export async function getTikTokAccountStats(
  accountId: string,
  limit = 14
) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("tiktok_account_stats")
    .select("recorded_at, follower_count, like_count, video_count")
    .eq("account_id", accountId)
    .order("recorded_at", { ascending: true })
    .limit(limit);

  if (error) throw error;

  return data ?? [];
}
