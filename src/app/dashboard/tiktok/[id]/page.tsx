import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTikTokDetailData } from "@/lib/services/tiktok-detail.service";
import { timeNow } from "@/lib/utils/format";

import TikTokBreadcrumb from "@/components/tiktok/TikTokBreadcrumb";
import TikTokHero from "@/components/tiktok/TikTokHero";
import TikTokKpiGrid from "@/components/tiktok/TikTokKpiGrid";
import TikTokAnalyticsSection from "@/components/tiktok/TikTokAnalyticsSection";

import ReconnectTikTokButton from "@/components/tiktok/ReconnectTikTokButton";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function TikTokDetailPage({ params }: Props) {
    const { id } = await params;

    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { account, chartData, isTokenInvalid } = await getTikTokDetailData(user.id, id);

    const now = timeNow();

    return (
        <div className="space-y-12">
            <TikTokBreadcrumb title={account.display_name} />

            {isTokenInvalid && (
                <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-xl flex items-center justify-between">
                    <div className="text-red-200">
                        <p className="font-bold">Connection Expired</p>
                        <p className="text-sm">Please reconnect your TikTok account to continue updating stats.</p>
                    </div>
                    <ReconnectTikTokButton />
                </div>
            )}

            <TikTokHero account={account} now={now} />

            <TikTokKpiGrid
                followers={account.follower_count}
                likes={account.like_count}
                videos={account.video_count}
            />

            <TikTokAnalyticsSection chartData={chartData} />
        </div>
    );
}
