"use client";

import { useState } from "react";
import MetricCard from "@/components/MetricCard";
import AccountMetricChart from "@/components/AccountMetricChart";
import { formatNumber } from "@/lib/utils/format";

type Props = {
    channels: any[];
    statsByChannel: Record<string, any[]>;
};

export default function DashboardClient({
    channels,
    statsByChannel,
}: Props) {
    const [selectedChannelId, setSelectedChannelId] = useState(
        channels[0]?.id
    );

    const selectedChannel = channels.find(
        (c) => c.id === selectedChannelId
    );

    const chartData = statsByChannel[selectedChannelId] ?? [];

    return (
        <div className="space-y-8 animate-fadeUp">
            {/* PLATFORM ACCOUNTS SECTION */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Connected Channels ({channels.length})
                    </h3>
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {channels.map((channel) => {
                        const isTikTok = channel.platform === 'tiktok';
                        const href = isTikTok ? `/dashboard/tiktok/${channel.id}` : `/dashboard/youtube/${channel.id}`;

                        // Format values based on platform
                        const value = isTikTok ? formatNumber(channel.follower_count) : formatNumber(channel.subscriber_count);
                        const description = isTikTok ? `${formatNumber(channel.like_count)} likes` : `${formatNumber(channel.view_count)} views`;
                        const platform = isTikTok ? 'tiktok' : 'youtube';

                        return (
                            <MetricCard
                                key={channel.id}
                                title={channel.title}
                                thumbnail_url={channel.thumbnail_url}
                                value={value}
                                description={description}
                                selected={selectedChannelId === channel.id}
                                onSelect={() => setSelectedChannelId(channel.id)}
                                href={href}
                                platform={platform}
                            />
                        )
                    })}
                </div>
            </div>

            {/* CHART SECTION */}
            {chartData.length > 0 && (
                <div className="space-y-6 pt-2 reveal">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                            Growth Projection — {selectedChannel?.title}
                        </h3>
                    </div>
                    <AccountMetricChart data={chartData} />
                </div>
            )}
        </div>
    );
}
