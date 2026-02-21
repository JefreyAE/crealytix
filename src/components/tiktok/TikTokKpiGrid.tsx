import KpiCard from "@/components/KpiCard";
import { formatNumber } from "@/lib/utils/format";

type Props = {
    followers: number;
    likes: number;
    videos: number;
};

export default function TikTokKpiGrid({
    followers,
    likes,
    videos,
}: Props) {
    return (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard
                title="Followers"
                value={formatNumber(followers)}
            />
            <KpiCard
                title="Total Likes"
                value={formatNumber(likes)}
            />
            <KpiCard
                title="Total Videos"
                value={formatNumber(videos)}
            />
        </section>
    );
}
