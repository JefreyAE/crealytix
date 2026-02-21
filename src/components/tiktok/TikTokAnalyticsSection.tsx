import AccountMetricChart from "@/components/AccountMetricChart";

type Props = {
    chartData: any[];
};

export default function TikTokAnalyticsSection({ chartData }: Props) {
    if (!chartData.length) return null;

    return (
        <section className="space-y-8 animate-fadeUp">
            <div className="flex items-center gap-4">
                <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                        Performance Insights
                    </h2>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 italic">
                        Last 30 days growth and reach trajectory
                    </p>
                </div>
            </div>

            <AccountMetricChart data={chartData} />
        </section>
    );
}
