import { createSupabaseServerClient } from "@/lib/supabase/server";
import { refreshTikTokAccountData } from "./tiktok.service";
import { getTikTokAccountStats } from "@/lib/repositories/tiktok.repository";

export async function getTikTokDetailData(
    userId: string,
    accountId: string
) {
    const supabase = await createSupabaseServerClient();

    // 🔹 Get account (safe by user)
    const { data: account, error } = await supabase
        .from("tiktok_accounts")
        .select("*")
        .eq("id", accountId)
        .eq("user_id", userId)
        .single();

    if (error || !account) {
        throw new Error("Account not found");
    }

    // 🔥 Smart Refresh
    // You might want to add a check here if it was updated recently to avoid too many API calls
    // For now, let's assume we want to ensure fresh data on load or conditionally
    // checking last_synced_at is a good idea.
    // Let's do a simple check: if synced > 1 hour ago, refresh.

    const lastSynced = account.last_synced_at ? new Date(account.last_synced_at).getTime() : 0;
    const oneHour = 60 * 60 * 1000;
    const shouldRefresh = Date.now() - lastSynced > oneHour;

    let isTokenInvalid = false;

    if (shouldRefresh) {
        try {
            await refreshTikTokAccountData(account);
        } catch (e: any) {
            console.error("Failed to refresh TikTok data", e);
            const msg = e.message?.toLowerCase() ?? "";
            if (
                msg.includes("invalid_grant") ||
                msg.includes("access_token_invalid") ||
                msg.includes("expired") ||
                msg.includes("failed to refresh token")
            ) {
                isTokenInvalid = true;
            }
        }
    }

    // 🔁 Re-fetch updated (only if we refreshed, but safe to just get it or use the updated object if we returned it)
    // Since refreshTikTokAccountData updates the DB, we fetch again to get the latest state.
    const { data: updatedAccount } = await supabase
        .from("tiktok_accounts")
        .select("*")
        .eq("id", accountId)
        .eq("user_id", userId)
        .single();

    const finalAccount = updatedAccount ?? account;

    // 📊 History
    const stats = await getTikTokAccountStats(accountId, 30);

    const chartData =
        stats?.map((stat) => ({
            date: stat.recorded_at,
            subscribers: Number(stat.follower_count),
            views: Number(stat.like_count),
        })) ?? [];

    return {
        account: finalAccount,
        chartData,
        isTokenInvalid,
    };
}
