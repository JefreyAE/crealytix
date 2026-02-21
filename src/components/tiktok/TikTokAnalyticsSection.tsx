import AccountMetricChart from "@/components/AccountMetricChart";

type Props = {
    chartData: any[];
};

export default function TikTokAnalyticsSection({ chartData }: Props) {
    if (!chartData.length) return null;

    return (
        <section className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">
                    Performance Analytics
                </h2>
                <p className="text-sm text-gray-500">
                    Last 30 days performance
                </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-[#0f172a] p-6">
                <AccountMetricChart data={chartData} />
            </div>
        </section>
    );
}
