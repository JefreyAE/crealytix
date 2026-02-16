import { formatNumber, formatTimeAgo } from "@/lib/utils/format";
import DeleteChannelButton from "./DeleteChannelButton";

type Props = {
    channel: {
        id: string;
        title: string;
        subscriber_count: number;
        view_count: number;
        channel_id: string;
        last_synced_at: string | null;
    };
    now: number;
};

export default function ChannelHero({ channel, now }: Props) {
    return (
        <section className="rounded-2xl border border-gray-800 bg-[#111827] p-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                        {channel.title.charAt(0)}
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold">
                            {channel.title}
                        </h1>

                        <p className="text-xl mt-2 text-indigo-400 font-semibold">
                            {formatNumber(channel.subscriber_count)} Subscribers
                        </p>

                        <p className="text-gray-400 mt-1">
                            {formatNumber(channel.view_count)} total views
                        </p>

                        <p className="text-sm text-gray-500 mt-2">
                            Synced {formatTimeAgo(channel.last_synced_at, now)}
                        </p>
                    </div>
                </div>

                <div>
                    <a
                        href={`https://youtube.com/channel/${channel.channel_id}`}
                        target="_blank"
                        className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition text-sm"
                    >
                        Open in YouTube
                    </a>
                    <DeleteChannelButton channelId={channel.id} channelTitle={channel.title} />
                </div>
            </div>
        </section>
    );
}
