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
        <div className="space-y-8">

            {/* CARDS */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {channels.map((channel) => {
                    const platform = "youtube"
                    return(
                    <div key={channel.id} className="space-y-3">
                        {/* Card clickable SOLO para seleccionar */}
                        <div
                            onClick={() => setSelectedChannelId(channel.id)}
                            className="cursor-pointer"
                        >
                            <MetricCard
                                key={channel.id}
                                title={channel.title}
                                value={formatNumber(channel.subscriber_count)}
                                description={`${formatNumber(channel.view_count)} views`}
                                selected={selectedChannelId === channel.id}
                                onSelect={() => setSelectedChannelId(channel.id)}
                                href={`/dashboard/youtube/${channel.id}`}
                                platform={platform}
                            />
                        </div>
                    </div>
                )})}
            </div>

            {/* CHART */}
            {chartData.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-lg font-semibold mb-4">
                        Growth — {selectedChannel?.title}
                    </h2>
                    <AccountMetricChart data={chartData} />
                </div>
            )}
        </div>
    );
}
