import KpiCard from "@/components/KpiCard";
import { formatNumber } from "@/lib/utils/format";

type Props = {
    subscribers: number;
    views: number;
    videos: number;
};

export default function ChannelKpiGrid({
    subscribers,
    views,
    videos,
}: Props) {
    return (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard
                title="Subscribers"
                value={formatNumber(subscribers)}
            />
            <KpiCard
                title="Total Views"
                value={formatNumber(views)}
            />
            <KpiCard
                title="Total Videos"
                value={formatNumber(videos)}
            />
        </section>
    );
}
