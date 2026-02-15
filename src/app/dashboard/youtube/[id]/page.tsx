import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getChannelDetailData } from "@/lib/services/channel-detail.service";
import { timeNow } from "@/lib/utils/format";

import ChannelBreadcrumb from "@/components/youtube/ChannelBreadcrumb"; 
import ChannelHero from "@/components/youtube/ChannelHero"; 
import ChannelKpiGrid from "@/components/youtube/ChannelKpiGrid";
import ChannelAnalyticsSection from "@/components/youtube/ChannelAnalyticsSection"; 


type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ChannelDetailPage({ params }: Props) {
    const { id } = await params;

    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { channel, chartData } = await getChannelDetailData(
        user.id,
        id
    );

    const now = timeNow()

    return (
  <div className="space-y-12">

    <ChannelBreadcrumb title={channel.title} />

    <ChannelHero
      channel={channel}
      now={now}
    />

    <ChannelKpiGrid
      subscribers={channel.subscriber_count}
      views={channel.view_count}
      videos={channel.video_count}
    />

    <ChannelAnalyticsSection
      chartData={chartData}
    />

  </div>
);

}

